# MyTravelExpert 3.0 — Enquiry Data Backup & Disaster Recovery Guide

## 1. Storage Security & Access Architecture

All customer enquiries submitted through MyTravelExpert 3.0 (Catalogue Drawer, Consultation Modal, and Webflow CTA Modal) are permanently captured in **Vercel Blob Private Cloud Object Storage** (`mte-enquiries-blob`).

### Security Posture & Privacy Controls
- **Private Access Control**: All records are written with `x-vercel-blob-access: private`. Blobs cannot be accessed or downloaded via public web URLs without an authenticated `Bearer` token or time-limited download URL.
- **Credential Protection**: Serverless functions access the blob store using the internal `BLOB_READ_WRITE_TOKEN`. No write or read tokens are ever bundled or exposed in client-side code (never prefixed with `VITE_`).
- **IP Privacy Compliance**: Traveler IP addresses are hashed using SHA-256 (`clientIpHash: d65ef6cf...`) for fraud detection and spam prevention without persisting raw, identifiable IP addresses.
- **Deduplication Safeguards**: Submissions from the same traveler for the same package within 5 minutes reuse the initial booking reference (`MTE-XXXXXX-XXXX`), preventing database duplication and quota consumption.

---

## 2. Automated & Manual Backup Procedure

We provide a self-contained Node.js export utility to download all active enquiry records to an encrypted JSON backup file.

### Prerequisites
Obtain the `BLOB_READ_WRITE_TOKEN` from Vercel Project Settings $\rightarrow$ Storage $\rightarrow$ `mte-enquiries-blob`.

### Running an Export
```bash
# Export all enquiries to ./backups/enquiries-backup-<timestamp>.json
BLOB_READ_WRITE_TOKEN="your_blob_token" node scripts/backup-enquiries.mjs

# Or specify a custom destination path:
BLOB_READ_WRITE_TOKEN="your_blob_token" node scripts/backup-enquiries.mjs --out ./secure-backups/latest.json
```

The backup file is saved in JSON format with full metadata and sorted by submission timestamp:
```json
{
  "metadata": {
    "exportedAt": "2026-11-06T01:25:00.000Z",
    "totalRecords": 42,
    "platform": "MyTravelExpert 3.0",
    "source": "Vercel Blob Private Store"
  },
  "enquiries": [
    {
      "id": "inq_1793907525433_6474f0",
      "referenceCode": "MTE-261105-7041",
      "source": "catalogue_drawer",
      "fullName": "Sunil Sharma",
      "phone": "+91 98765 43210",
      "email": "sunil@example.com",
      "subject": "Darjeeling Luxury Himalayan Holiday",
      "travelMonth": "December 2026",
      "guests": 2,
      "cabUpgrade": "Innova Crysta SUV",
      "vipDiscount": true,
      "finalTotal": 34500,
      "message": "Pickup needed at Bagdogra Airport (IXB)",
      "createdAt": "2026-11-05T19:38:45.434Z",
      "clientIpHash": "d65ef6cf9ffa7ff4"
    }
  ]
}
```

> **Security Note**: The `backups/` directory is registered in `.gitignore` to prevent confidential customer contact details from ever being committed to version control.

---

## 3. Disaster Recovery & Restoration Procedure

If the primary Vercel Blob store is accidentally modified, purged, or needs to be restored to a previous state:

### Step 1: Dry-Run Inspection
Verify the backup archive integrity before touching cloud storage:
```bash
node scripts/restore-enquiries.mjs --in ./backups/enquiries-backup-xxx.json --dry-run
```

### Step 2: Cloud Storage Restoration
Execute the restore against Vercel Blob:
```bash
BLOB_READ_WRITE_TOKEN="your_blob_token" node scripts/restore-enquiries.mjs --in ./backups/enquiries-backup-xxx.json
```
The utility validates each record, recreates `enquiries/${referenceCode}.json` with private access, and preserves historical reference codes and customer details.

---

## 4. Alternative Storage Migration (PostgreSQL / Supabase)

If the business decides to replicate or migrate enquiries to a relational database:
1. Execute the DDL in [`supabase/schema.sql`](file:///Volumes/AI_WORKSPACE/AppData/Antigravity/mytravelexpert-3.0/supabase/schema.sql) in your Supabase SQL editor.
2. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel Environment Variables.
3. The serverless function [`api/enquiry.js`](file:///Volumes/AI_WORKSPACE/AppData/Antigravity/mytravelexpert-3.0/api/enquiry.js) automatically detects the Supabase configuration and writes to both Vercel Blob and Supabase in dual-write mode.
