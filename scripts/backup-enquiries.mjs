#!/usr/bin/env node
/**
 * ============================================================================
 * MyTravelExpert 3.0 — Customer Enquiry Cloud Backup & Export Utility
 * Exports private Vercel Blob enquiry records to a secure local JSON archive.
 * ============================================================================
 * Usage:
 *   BLOB_READ_WRITE_TOKEN="your_token" node scripts/backup-enquiries.mjs
 *   node scripts/backup-enquiries.mjs --out ./my-backup.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
let customOutPath = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out' && args[i + 1]) {
    customOutPath = path.resolve(process.cwd(), args[i + 1]);
    i++;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
MyTravelExpert 3.0 — Enquiry Backup Utility
Options:
  --out <path>    Custom destination path for the JSON export file
  --help, -h      Display this documentation
    `);
    process.exit(0);
  }
}

const token =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

if (!token) {
  console.error('[BACKUP ERROR] Missing BLOB_READ_WRITE_TOKEN environment variable.');
  console.error('Run with: BLOB_READ_WRITE_TOKEN="<token>" node scripts/backup-enquiries.mjs');
  process.exit(1);
}

async function fetchAllEnquiryBlobs() {
  const allBlobs = [];
  let cursor = null;
  let hasMore = true;

  while (hasMore) {
    const url = new URL('https://blob.vercel-storage.com');
    url.searchParams.set('prefix', 'enquiries/');
    url.searchParams.set('limit', '100');
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error(`Vercel Blob API error: HTTP ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const blobs = data.blobs || [];
    allBlobs.push(...blobs);

    hasMore = Boolean(data.hasMore && data.cursor);
    cursor = data.cursor || null;
  }

  return allBlobs;
}

async function runBackup() {
  console.log('🔄 Connecting to Vercel Blob storage (prefix: enquiries/)...');
  const blobs = await fetchAllEnquiryBlobs();
  console.log(`📦 Found ${blobs.length} enquiry records in cloud storage.`);

  const records = [];
  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i];
    try {
      const recRes = await fetch(b.url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (recRes.ok) {
        const record = await recRes.json();
        records.push(record);
      }
    } catch (err) {
      console.warn(`[WARN] Failed to download record ${b.pathname}:`, err.message);
    }
  }

  records.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const backupDir = path.join(rootDir, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const destPath = customOutPath || path.join(backupDir, `enquiries-backup-${timestamp}.json`);

  const payload = {
    metadata: {
      exportedAt: new Date().toISOString(),
      totalRecords: records.length,
      platform: 'MyTravelExpert 3.0',
      source: 'Vercel Blob Private Store'
    },
    enquiries: records
  };

  fs.writeFileSync(destPath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`✅ Successfully exported ${records.length} enquiry records to:`);
  console.log(`   ${destPath}`);
}

runBackup().catch((err) => {
  console.error('[FATAL BACKUP ERROR]', err.message);
  process.exit(1);
});
