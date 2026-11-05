#!/usr/bin/env node
/**
 * ============================================================================
 * MyTravelExpert 3.0 — Customer Enquiry Disaster Recovery & Restore Utility
 * Restores enquiry records from a local JSON backup into Vercel Blob cloud storage.
 * ============================================================================
 * Usage:
 *   BLOB_READ_WRITE_TOKEN="your_token" node scripts/restore-enquiries.mjs --in ./backups/enquiries-backup-xxx.json
 *   node scripts/restore-enquiries.mjs --in ./backup.json --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';

const token =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

const args = process.argv.slice(2);
let inputPath = null;
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--in' && args[i + 1]) {
    inputPath = path.resolve(process.cwd(), args[i + 1]);
    i++;
  } else if (args[i] === '--dry-run') {
    dryRun = true;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
MyTravelExpert 3.0 — Enquiry Disaster Recovery Utility
Options:
  --in <path>    Path to the JSON backup file to restore (required)
  --dry-run      Validate and parse backup without uploading
  --help, -h     Display this documentation
    `);
    process.exit(0);
  }
}

if (!inputPath) {
  console.error('[RESTORE ERROR] Missing --in <backup-file.json> argument.');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error(`[RESTORE ERROR] Backup file not found: ${inputPath}`);
  process.exit(1);
}

if (!dryRun && !token) {
  console.error('[RESTORE ERROR] Missing BLOB_READ_WRITE_TOKEN environment variable.');
  console.error('Run with: BLOB_READ_WRITE_TOKEN="<token>" node scripts/restore-enquiries.mjs --in <file>');
  process.exit(1);
}

async function runRestore() {
  console.log(`📖 Reading backup archive: ${inputPath}`);
  const raw = fs.readFileSync(inputPath, 'utf8');
  const parsed = JSON.parse(raw);
  const records = Array.isArray(parsed) ? parsed : parsed.enquiries || [];

  console.log(`📦 Loaded ${records.length} records from archive.`);
  if (records.length === 0) {
    console.log('No records to restore.');
    return;
  }

  let restoredCount = 0;
  for (const record of records) {
    if (!record.referenceCode) {
      console.warn('⚠️ Skipping invalid record (missing referenceCode):', record);
      continue;
    }

    const pathname = `enquiries/${record.referenceCode}.json`;
    if (dryRun) {
      console.log(`[DRY RUN] Would restore: ${pathname} (${record.fullName || 'Anonymous'})`);
      restoredCount++;
      continue;
    }

    try {
      const uploadUrl = `https://blob.vercel-storage.com/${pathname}`;
      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-vercel-blob-access': 'private',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record, null, 2),
      });

      if (!res.ok) {
        console.error(`❌ Failed to restore ${pathname}: HTTP ${res.status}`);
      } else {
        restoredCount++;
        console.log(`✓ Restored: ${pathname} (#${record.referenceCode})`);
      }
    } catch (err) {
      console.error(`❌ Error restoring ${pathname}:`, err.message);
    }
  }

  console.log(`\n🎉 Restore complete: ${restoredCount} of ${records.length} records processed.`);
}

runRestore().catch((err) => {
  console.error('[FATAL RESTORE ERROR]', err.message);
  process.exit(1);
});
