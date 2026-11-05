import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import handler, {
  validateAndSanitizeEnquiry,
  resetRateLimitAndDedupeForTests
} from '../api/enquiry.js';

test('validateAndSanitizeEnquiry - accepts valid Himalayan tour booking input', () => {
  const result = validateAndSanitizeEnquiry({
    fullName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul@example.com',
    subject: 'Complete Sikkim & Darjeeling Grandeur',
    travelMonth: 'November 2026',
    guests: 4,
    cabUpgrade: 'Toyota Innova Crysta',
    vipDiscount: true,
    finalTotal: 72000,
    message: 'Pickup from Bagdogra Airport IXB at 11 AM.'
  });

  assert.equal(result.valid, true);
  assert.equal(result.statusCode, 200);
  assert.ok(result.sanitized);
  assert.equal(result.sanitized.fullName, 'Rahul Sharma');
  assert.equal(result.sanitized.phone, '+91 98765 43210');
  assert.equal(result.sanitized.normalizedPhone, '9876543210');
  assert.equal(result.sanitized.guests, 4);
  assert.equal(result.sanitized.finalTotal, 72000);
});

test('validateAndSanitizeEnquiry - rejects missing or single-character full name', () => {
  const result = validateAndSanitizeEnquiry({
    fullName: 'R',
    phone: '+91 98765 43210'
  });

  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 400);
  assert.equal(result.code, 'VALIDATION_ERROR');
  assert.ok(result.errors);
  assert.ok(result.errors.fullName);
});

test('validateAndSanitizeEnquiry - rejects invalid phone numbers', () => {
  const result = validateAndSanitizeEnquiry({
    fullName: 'Rahul Sharma',
    phone: '12345'
  });

  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 400);
  assert.ok(result.errors);
  assert.ok(result.errors.phone);
});

test('validateAndSanitizeEnquiry - catches honeypot bot trap', () => {
  const result = validateAndSanitizeEnquiry({
    fullName: 'Bot User',
    phone: '+91 98765 43210',
    website: 'https://spam-domain.xyz'
  });

  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 422);
  assert.equal(result.code, 'SPAM_DETECTED');
});

test('validateAndSanitizeEnquiry - catches rapid automated submissions (< 600ms)', () => {
  process.env.MTE_DISABLE_TIMING_GUARD = '0';
  const result = validateAndSanitizeEnquiry({
    fullName: 'Speedy Submitter',
    phone: '+91 98765 43210',
    formLoadedAt: Date.now() - 100 // 100ms ago
  });

  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 422);
  assert.equal(result.code, 'SPAM_FAST_SUBMIT');
});

test('enquiry HTTP handler - end-to-end GET healthcheck and POST submission', async () => {
  resetRateLimitAndDedupeForTests();
  const server = http.createServer((req, res) => {
    void handler(req, res);
  });

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Healthcheck
    const healthRes = await fetch(`${baseUrl}/api/enquiry`);
    assert.equal(healthRes.status, 200);
    const healthData = await healthRes.json();
    assert.equal(healthData.ok, true);
    assert.equal(healthData.status, 'operational');

    // 2. Valid POST
    const postRes = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Anita Sen',
        phone: '+91 98301 23456',
        email: 'anita@example.com',
        subject: 'Offbeat Kalimpong & Silk Route Discovery',
        travelMonth: 'December 2026',
        guests: 2,
        finalTotal: 34500
      })
    });

    assert.equal(postRes.status, 201);
    const postData = await postRes.json();
    assert.equal(postData.ok, true);
    assert.equal(postData.deduplicated, false);
    assert.match(postData.referenceCode, /^MTE-\d{6}-\d{4}$/);
    assert.equal(postData.storage.persisted, true);
    assert.ok(postData.notification.whatsappUrl.includes('wa.me/918001247778'));

    // 3. Deduplication check (exact duplicate within window returns HTTP 200 with deduplicated=true)
    const dupRes = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Anita Sen',
        phone: '+91 98301 23456',
        email: 'anita@example.com',
        subject: 'Offbeat Kalimpong & Silk Route Discovery',
        travelMonth: 'December 2026',
        guests: 2,
        finalTotal: 34500
      })
    });

    assert.equal(dupRes.status, 200);
    const dupData = await dupRes.json();
    assert.equal(dupData.ok, true);
    assert.equal(dupData.deduplicated, true);
    assert.equal(dupData.referenceCode, postData.referenceCode);
  } finally {
    server.close();
  }
});
