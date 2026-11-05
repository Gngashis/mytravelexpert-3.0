/**
 * ============================================================================
 * MY TRAVEL EXPERT 3.0 — SECURE SERVERLESS ENQUIRY & BOOKING API
 * Endpoint: POST /api/enquiry | GET /api/enquiry?health=1
 *
 * Capabilities:
 * 1. Input normalization & strict field-level validation
 * 2. Multi-layer spam protection (honeypot, timing guard, IP rate limiting,
 *    URL/HTML injection heuristics, 5-minute idempotency deduplication)
 * 3. Multi-adapter persistent storage (Vercel KV / Upstash Redis, Supabase
 *    PostgreSQL REST, signed Webhook/CRM, and local/tmp JSONL journal +
 *    structured Vercel Runtime log emission)
 * 4. Multi-provider email notification (Resend, SendGrid, Web3Forms, Formspree)
 * 5. Zero credential exposure
 * ============================================================================
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const MAX_BODY_BYTES = 16 * 1024; // 16 KB max payload
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_RATE_LIMIT_MAX = 8; // max 8 requests per 10 min per IP
const DEDUPE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes idempotency window

/** @type {Map<string, number[]>} */
const ipRateMap = new Map();

/** @type {Map<string, { timestamp: number; responsePayload: Record<string, unknown> }>} */
const dedupeMap = new Map();

/** @type {Array<Record<string, unknown>>} */
const memoryJournal = [];

const ALLOWED_HOST_PATTERNS = [
  /^localhost(:\d+)?$/i,
  /^127\.0\.0\.1(:\d+)?$/i,
  /^(www\.)?mytravelexpert\.tech$/i,
  /^(www\.)?mytravelexpert\.co\.in$/i,
  /\.vercel\.app$/i,
];

function stripControlAndHtml(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim();
}

function getClientIp(req) {
  const xff = req.headers?.['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0].trim();
  }
  const realIp = req.headers?.['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

function hashIp(ip) {
  return crypto.createHash('sha256').update(`mte-salt:${ip}`).digest('hex').slice(0, 16);
}

function isOriginAllowed(req) {
  const originHeader = req.headers?.origin;
  if (!originHeader) return true; // Same-origin or server-to-server requests without Origin header
  try {
    const url = new URL(originHeader);
    const customAllowed = process.env.MTE_ALLOWED_ORIGIN;
    if (customAllowed && url.host.toLowerCase() === customAllowed.toLowerCase()) {
      return true;
    }
    return ALLOWED_HOST_PATTERNS.some((re) => re.test(url.host));
  } catch {
    return false;
  }
}

function checkRateLimit(ip) {
  const now = Date.now();
  const maxReqs = Number(process.env.MTE_RATE_LIMIT_MAX) || DEFAULT_RATE_LIMIT_MAX;
  const timestamps = (ipRateMap.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= maxReqs) {
    ipRateMap.set(ip, timestamps);
    return { allowed: false, retryAfterSeconds: 60 };
  }
  timestamps.push(now);
  ipRateMap.set(ip, timestamps);
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetRateLimitAndDedupeForTests() {
  ipRateMap.clear();
  dedupeMap.clear();
}

function generateReferenceCode() {
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const suffix = crypto.randomInt(1000, 9999);
  return `MTE-${yy}${mm}${dd}-${suffix}`;
}

export function validateAndSanitizeEnquiry(raw) {
  const body = raw && typeof raw === 'object' ? raw : {};

  // 1. Honeypot check
  const honeypot =
    body.website || body._gotcha || body.companyUrl || body.bot_field || '';
  if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
    return {
      valid: false,
      statusCode: 422,
      code: 'SPAM_DETECTED',
      error: 'Automated spam submission rejected.',
      errors: {},
    };
  }

  // 2. Timing guard check (if client provides formLoadedAt)
  if (
    body.formLoadedAt !== undefined &&
    process.env.MTE_DISABLE_TIMING_GUARD !== '1'
  ) {
    const loadedAt = Number(body.formLoadedAt);
    if (!Number.isNaN(loadedAt) && loadedAt > 0) {
      const elapsed = Date.now() - loadedAt;
      if (elapsed >= 0 && elapsed < 600) {
        return {
          valid: false,
          statusCode: 422,
          code: 'SPAM_FAST_SUBMIT',
          error: 'Submission was too rapid. Please review your details and submit again.',
          errors: {},
        };
      }
    }
  }

  const source = stripControlAndHtml(String(body.source || 'booking_modal')).slice(0, 40);
  const fullName = stripControlAndHtml(String(body.fullName ?? body.name ?? '')).slice(0, 100);
  const phone = stripControlAndHtml(String(body.phone ?? '')).slice(0, 24);
  const email = stripControlAndHtml(String(body.email ?? '')).slice(0, 150);
  const subject = stripControlAndHtml(
    String(
      body.subject ??
        body.destination ??
        body.pkg ??
        'Custom Himalayan Expedition Consultation'
    )
  ).slice(0, 160);
  const travelMonth = stripControlAndHtml(
    String(body.travelMonth ?? body.travelDate ?? 'Flexible 2026/2027')
  ).slice(0, 60);
  const cabUpgrade = stripControlAndHtml(String(body.cabUpgrade ?? 'Standard Package Vehicle')).slice(
    0,
    120
  );
  const message = stripControlAndHtml(
    String(body.message ?? body.notes ?? 'Standard itinerary & callback request')
  ).slice(0, 1200);

  const guestsRaw = body.guests !== undefined ? Number(body.guests) : 2;
  const guests = Number.isFinite(guestsRaw) ? Math.round(guestsRaw) : 0;

  const finalTotalRaw = Number(body.finalTotal ?? body.estimatedTotal ?? body.total ?? 0);
  const finalTotal =
    Number.isFinite(finalTotalRaw) && finalTotalRaw >= 0 ? Math.round(finalTotalRaw) : 0;
  const vipDiscount = Boolean(body.vipDiscount ?? true);

  /** @type {Record<string, string>} */
  const errors = {};

  // Name validation
  if (!fullName || fullName.length < 2) {
    errors.fullName = 'Please enter your full name (minimum 2 characters).';
  } else if (/https?:\/\/|www\./i.test(fullName)) {
    errors.fullName = 'Links are not permitted in the name field.';
  }

  // Phone validation (10 to 15 digits, Indian 10-digit numbers must start with 6-9)
  const digitsOnly = phone.replace(/\D/g, '');
  if (!phone || digitsOnly.length < 10 || digitsOnly.length > 15) {
    errors.phone = 'Please enter a valid 10–15 digit mobile or WhatsApp number.';
  } else if (digitsOnly.length === 10 && !/^[6-9]\d{9}$/.test(digitsOnly)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number starting with 6–9.';
  } else if (
    digitsOnly.length === 12 &&
    digitsOnly.startsWith('91') &&
    !/^91[6-9]\d{9}$/.test(digitsOnly)
  ) {
    errors.phone = 'Please enter a valid +91 Indian mobile number.';
  }

  // Optional email validation
  if (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address or leave it blank.';
  }

  // Guests validation
  if (guests < 1 || guests > 50) {
    errors.guests = 'Traveler count must be between 1 and 50.';
  }

  // Travel date validation if ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(travelMonth)) {
    if (travelMonth < '2026-01-01') {
      errors.travelMonth = 'Please select a valid upcoming travel date.';
    }
  }

  // Content spam check in message
  const urlMatches = message.match(/https?:\/\/|www\./gi) || [];
  if (urlMatches.length > 1 || /<script|javascript:|onerror=|onload=/i.test(String(body.message || ''))) {
    return {
      valid: false,
      statusCode: 422,
      code: 'SPAM_CONTENT',
      error: 'Suspicious links or scripts are not allowed in enquiry notes.',
      errors: { message: 'Please remove external links from your message.' },
    };
  }

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      error: Object.values(errors)[0],
      errors,
    };
  }

  return {
    valid: true,
    statusCode: 200,
    sanitized: {
      source,
      fullName,
      phone,
      normalizedPhone: digitsOnly.slice(-10),
      email,
      subject,
      travelMonth,
      guests,
      cabUpgrade,
      vipDiscount,
      finalTotal,
      message,
    },
  };
}

async function persistEnquiryRecord(record) {
  /** @type {string[]} */
  const adapters = [];
  /** @type {string[]} */
  const warnings = [];

  // 1. In-memory runtime journal
  memoryJournal.unshift(record);
  if (memoryJournal.length > 250) {
    memoryJournal.length = 250;
  }
  adapters.push('runtime_memory');

  // 2. Persistent JSONL file journal (/tmp on Vercel serverless or custom path)
  const storageFile =
    process.env.MTE_STORAGE_FILE || path.join(os.tmpdir(), 'mte-enquiries.jsonl');
  try {
    const dir = path.dirname(storageFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.appendFileSync(storageFile, `${JSON.stringify(record)}\n`, {
      encoding: 'utf8',
      mode: 0o600,
    });
    adapters.push('jsonl_file');
  } catch (err) {
    warnings.push(`file_journal_error:${err instanceof Error ? err.message : 'unknown'}`);
  }

  // 3. Vercel KV / Upstash Redis REST API (if configured)
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (kvUrl && kvToken) {
    try {
      const kvRes = await fetch(`${kvUrl.replace(/\/$/, '')}/lpush/mte:enquiries`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      if (kvRes.ok) {
        adapters.push('vercel_kv_redis');
      } else {
        warnings.push(`vercel_kv_http_${kvRes.status}`);
      }
    } catch {
      warnings.push('vercel_kv_network_error');
    }
  }

  // 4. Supabase PostgreSQL REST API (if configured)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && supabaseKey) {
    const table = process.env.SUPABASE_ENQUIRIES_TABLE || 'mte_enquiries';
    try {
      const sbRes = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          reference_code: record.referenceCode,
          full_name: record.fullName,
          phone: record.phone,
          email: record.email || null,
          subject: record.subject,
          travel_month: record.travelMonth,
          guests: record.guests,
          cab_upgrade: record.cabUpgrade,
          vip_discount: record.vipDiscount,
          final_total: record.finalTotal,
          message: record.message,
          source: record.source,
          created_at: record.createdAt,
        }),
      });
      if (sbRes.ok) {
        adapters.push('supabase_postgres');
      } else {
        warnings.push(`supabase_http_${sbRes.status}`);
      }
    } catch {
      warnings.push('supabase_network_error');
    }
  }

  // 5. Custom Webhook / CRM / Google Sheets Apps Script Webhook (if configured)
  const webhookUrl = process.env.MTE_ENQUIRY_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const bodyStr = JSON.stringify(record);
      /** @type {Record<string, string>} */
      const headers = { 'Content-Type': 'application/json' };
      if (process.env.MTE_WEBHOOK_SECRET) {
        const sig = crypto
          .createHmac('sha256', process.env.MTE_WEBHOOK_SECRET)
          .update(bodyStr)
          .digest('hex');
        headers['X-MTE-Signature'] = sig;
      }
      const whRes = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: bodyStr,
      });
      if (whRes.ok) {
        adapters.push('custom_webhook');
      } else {
        warnings.push(`webhook_http_${whRes.status}`);
      }
    } catch {
      warnings.push('webhook_network_error');
    }
  }

  // 6. Structured cloud runtime audit log (captured by Vercel Logs / Log Drains)
  console.info('[MTE_ENQUIRY_PERSISTED]', JSON.stringify(record));
  adapters.push('cloud_audit_log');

  return {
    persisted: adapters.length > 0,
    adapters,
    warnings,
  };
}

async function sendEmailNotification(record) {
  const notifyTo = process.env.MTE_NOTIFY_TO_EMAIL || 'mtejalpaiguri@gmail.com';
  const notifyFrom =
    process.env.MTE_NOTIFY_FROM_EMAIL || 'MyTravelExpert Concierge <onboarding@resend.dev>';

  const subjectLine = `[MyTravelExpert] New Enquiry ${record.referenceCode} — ${record.fullName} (${record.subject})`;
  const textBody = [
    `MYTRAVELEXPERT BAGDOGRA DESK — NEW TOUR / CAB ENQUIRY`,
    `======================================================`,
    `Reference ID: ${record.referenceCode}`,
    `Submitted At: ${record.createdAt}`,
    `Source Form:  ${record.source}`,
    ``,
    `TRAVELLER DETAILS`,
    `- Full Name:  ${record.fullName}`,
    `- Phone/WA:   ${record.phone}`,
    `- Email:      ${record.email || 'Not provided'}`,
    ``,
    `EXPEDITION CONFIGURATION`,
    `- Package:    ${record.subject}`,
    `- Travel Date:${record.travelMonth}`,
    `- Travellers: ${record.guests}`,
    `- Vehicle:    ${record.cabUpgrade}`,
    `- VIP 10%:    ${record.vipDiscount ? 'Applied' : 'No'}`,
    `- Est. Total: ${record.finalTotal > 0 ? `INR ${record.finalTotal.toLocaleString('en-IN')}` : 'Custom Quote Requested'}`,
    `- Notes:      ${record.message}`,
    ``,
    `Quick WhatsApp Reply: https://wa.me/${record.phone.replace(/\D/g, '')}`,
  ].join('\n');

  const htmlBody = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#1F261F;color:#F6F4EF;border:1px solid #333D33;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#FF4929;margin-bottom:6px;">
        MyTravelExpert Bagdogra Operations Desk
      </div>
      <h2 style="margin:0 0 16px;color:#FFFFFF;">New Expedition Enquiry: ${record.referenceCode}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;">
        <tr><td style="padding:6px 0;color:#B6BEB6;">Traveller Name:</td><td style="padding:6px 0;font-weight:600;color:#FFFFFF;">${record.fullName}</td></tr>
        <tr><td style="padding:6px 0;color:#B6BEB6;">Phone / WhatsApp:</td><td style="padding:6px 0;font-weight:600;color:#25D366;">${record.phone}</td></tr>
        <tr><td style="padding:6px 0;color:#B6BEB6;">Email:</td><td style="padding:6px 0;color:#FFFFFF;">${record.email || 'Not provided'}</td></tr>
        <tr><td style="padding:6px 0;color:#B6BEB6;">Package / Service:</td><td style="padding:6px 0;font-weight:600;color:#FF4929;">${record.subject}</td></tr>
        <tr><td style="padding:6px 0;color:#B6BEB6;">Travel Date / Period:</td><td style="padding:6px 0;color:#FFFFFF;">${record.travelMonth}</td></tr>
        <tr><td style="padding:6px 0;color:#B6BEB6;">Travellers:</td><td style="padding:6px 0;color:#FFFFFF;">${record.guests} Pax</td></tr>
        <tr><td style="padding:6px 0;color:#B6BEB6;">Vehicle Selection:</td><td style="padding:6px 0;color:#FFFFFF;">${record.cabUpgrade}</td></tr>
        <tr><td style="padding:6px 0;color:#B6BEB6;">Estimated Tariff:</td><td style="padding:6px 0;font-weight:700;color:#FFFFFF;">${
          record.finalTotal > 0 ? `₹${record.finalTotal.toLocaleString('en-IN')}` : 'Custom Quote'
        }</td></tr>
        <tr><td style="padding:6px 0;color:#B6BEB6;">Notes:</td><td style="padding:6px 0;color:#FFFFFF;">${record.message}</td></tr>
      </table>
    </div>
  `;

  // Provider 1: Resend API (RESEND_API_KEY)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: notifyFrom,
          to: [notifyTo],
          reply_to: record.email || undefined,
          subject: subjectLine,
          text: textBody,
          html: htmlBody,
        }),
      });
      if (res.ok) {
        return { emailConfigured: true, emailSent: true, provider: 'resend' };
      }
    } catch {
      // Fall through to next provider if configured
    }
    return { emailConfigured: true, emailSent: false, provider: 'resend' };
  }

  // Provider 2: SendGrid API (SENDGRID_API_KEY)
  if (process.env.SENDGRID_API_KEY) {
    try {
      const fromAddress = (notifyFrom.match(/<([^>]+)>/) || [null, notifyFrom])[1];
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: notifyTo }], subject: subjectLine }],
          from: { email: fromAddress, name: 'MyTravelExpert Concierge' },
          reply_to: record.email ? { email: record.email } : undefined,
          content: [
            { type: 'text/plain', value: textBody },
            { type: 'text/html', value: htmlBody },
          ],
        }),
      });
      if (res.ok || res.status === 202) {
        return { emailConfigured: true, emailSent: true, provider: 'sendgrid' };
      }
    } catch {
      // Fall through
    }
    return { emailConfigured: true, emailSent: false, provider: 'sendgrid' };
  }

  // Provider 3: Web3Forms (WEB3FORMS_ACCESS_KEY)
  if (process.env.WEB3FORMS_ACCESS_KEY) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY,
          subject: subjectLine,
          from_name: record.fullName,
          phone: record.phone,
          email: record.email || notifyTo,
          message: textBody,
        }),
      });
      if (res.ok) {
        return { emailConfigured: true, emailSent: true, provider: 'web3forms' };
      }
    } catch {
      // Fall through
    }
    return { emailConfigured: true, emailSent: false, provider: 'web3forms' };
  }

  // Provider 4: Formspree (FORMSPREE_ENDPOINT)
  if (process.env.FORMSPREE_ENDPOINT) {
    try {
      const res = await fetch(process.env.FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          referenceCode: record.referenceCode,
          name: record.fullName,
          phone: record.phone,
          email: record.email || undefined,
          subject: subjectLine,
          message: textBody,
        }),
      });
      if (res.ok) {
        return { emailConfigured: true, emailSent: true, provider: 'formspree' };
      }
    } catch {
      // Fall through
    }
    return { emailConfigured: true, emailSent: false, provider: 'formspree' };
  }

  return {
    emailConfigured: false,
    emailSent: false,
    provider: null,
  };
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.trim().length > 0) {
    return JSON.parse(req.body);
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    let bytes = 0;
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        return;
      }
      raw += chunk.toString('utf8');
    });
    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('INVALID_JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [k, v] of Object.entries(extraHeaders)) {
    res.setHeader(k, v);
  }
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  // Handle CORS preflight safely for same-site / allowed origins
  if (!isOriginAllowed(req)) {
    return sendJson(res, 403, {
      ok: false,
      code: 'FORBIDDEN_ORIGIN',
      error: 'Cross-origin requests from unauthorized domains are not permitted.',
    });
  }

  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {}, { Allow: 'POST, GET, OPTIONS' });
  }

  if (req.method === 'GET') {
    return sendJson(res, 200, {
      ok: true,
      service: 'MyTravelExpert 3.0 Enquiry & Booking API',
      status: 'operational',
      capabilities: {
        validation: true,
        spamProtection: true,
        persistentStorage: true,
        externalDbConfigured: Boolean(
          process.env.KV_REST_API_URL ||
            process.env.UPSTASH_REDIS_REST_URL ||
            process.env.SUPABASE_URL ||
            process.env.MTE_ENQUIRY_WEBHOOK_URL
        ),
        emailNotificationConfigured: Boolean(
          process.env.RESEND_API_KEY ||
            process.env.SENDGRID_API_KEY ||
            process.env.WEB3FORMS_ACCESS_KEY ||
            process.env.FORMSPREE_ENDPOINT
        ),
      },
    });
  }

  if (req.method !== 'POST') {
    return sendJson(
      res,
      405,
      {
        ok: false,
        code: 'METHOD_NOT_ALLOWED',
        error: 'Only POST requests are accepted for submitting enquiries.',
      },
      { Allow: 'POST, GET, OPTIONS' }
    );
  }

  // IP Rate Limiting
  const clientIp = getClientIp(req);
  const rateStatus = checkRateLimit(clientIp);
  if (!rateStatus.allowed) {
    return sendJson(
      res,
      429,
      {
        ok: false,
        code: 'RATE_LIMITED',
        error:
          'Too many enquiry requests from this connection. Please wait a minute or message our Bagdogra desk directly on WhatsApp (+91 8001247778).',
      },
      { 'Retry-After': String(rateStatus.retryAfterSeconds) }
    );
  }

  // Parse JSON Body
  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    const code = err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE' ? 413 : 400;
    return sendJson(res, code, {
      ok: false,
      code: code === 413 ? 'PAYLOAD_TOO_LARGE' : 'INVALID_JSON',
      error:
        code === 413
          ? 'Enquiry payload exceeds maximum allowed size.'
          : 'Invalid JSON request body.',
    });
  }

  // Validate & Sanitize
  const validation = validateAndSanitizeEnquiry(body);
  if (!validation.valid || !validation.sanitized) {
    return sendJson(res, validation.statusCode, {
      ok: false,
      code: validation.code,
      error: validation.error,
      errors: validation.errors,
    });
  }

  const sanitized = validation.sanitized;

  // Idempotency / Deduplication check (5-minute window)
  const dedupeKey = `${sanitized.fullName.toLowerCase()}|${sanitized.normalizedPhone}|${sanitized.subject.toLowerCase()}|${sanitized.travelMonth.toLowerCase()}`;
  const now = Date.now();
  const existingEntry = dedupeMap.get(dedupeKey);
  if (existingEntry && now - existingEntry.timestamp < DEDUPE_WINDOW_MS) {
    return sendJson(res, 200, {
      ...existingEntry.responsePayload,
      deduplicated: true,
    });
  }

  const referenceCode = generateReferenceCode();
  const createdAt = new Date().toISOString();
  const record = {
    id: `inq_${now}_${crypto.randomBytes(3).toString('hex')}`,
    referenceCode,
    ...sanitized,
    createdAt,
    clientIpHash: hashIp(clientIp),
  };

  // Persist + Send Email Notification
  const [storageResult, emailResult] = await Promise.all([
    persistEnquiryRecord(record),
    sendEmailNotification(record),
  ]);

  const responsePayload = {
    ok: true,
    deduplicated: false,
    referenceCode,
    createdAt,
    enquiry: {
      referenceCode,
      fullName: record.fullName,
      phone: record.phone,
      email: record.email,
      subject: record.subject,
      travelMonth: record.travelMonth,
      guests: record.guests,
      cabUpgrade: record.cabUpgrade,
      vipDiscount: record.vipDiscount,
      finalTotal: record.finalTotal,
      source: record.source,
    },
    storage: {
      persisted: storageResult.persisted,
      adapters: storageResult.adapters,
    },
    notification: {
      emailConfigured: emailResult.emailConfigured,
      emailSent: emailResult.emailSent,
      provider: emailResult.provider,
      whatsappUrl: `https://wa.me/918001247778?text=${encodeURIComponent(
        `Hello MyTravelExpert! Reference ${referenceCode} for ${record.subject} (${record.guests} travellers, ${record.travelMonth}). Name: ${record.fullName}, Phone: ${record.phone}.${
          record.finalTotal > 0 ? ` Estimated Total: ₹${record.finalTotal.toLocaleString('en-IN')}` : ''
        }`
      )}`,
    },
  };

  dedupeMap.set(dedupeKey, {
    timestamp: now,
    responsePayload,
  });

  return sendJson(res, 201, responsePayload);
}
