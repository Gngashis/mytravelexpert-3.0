-- ============================================================================
-- MY TRAVEL EXPERT 3.0 — PERMANENT ENQUIRY STORAGE SCHEMA (SUPABASE POSTGRES)
-- File: supabase/schema.sql
-- ============================================================================

-- Create table for storing expedition and cab inquiries
CREATE TABLE IF NOT EXISTS public.mte_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code VARCHAR(32) NOT NULL UNIQUE,
  source VARCHAR(40) NOT NULL DEFAULT 'booking_modal',
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(24) NOT NULL,
  normalized_phone VARCHAR(15) NOT NULL,
  email VARCHAR(160),
  subject VARCHAR(180) NOT NULL,
  travel_month VARCHAR(80) NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  cab_upgrade VARCHAR(140) DEFAULT 'Standard Package Vehicle',
  vip_discount BOOLEAN DEFAULT TRUE,
  final_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  message TEXT,
  client_ip_hash VARCHAR(64),
  status VARCHAR(24) NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Optimize queries by reference code and phone number lookup
CREATE INDEX IF NOT EXISTS idx_mte_enquiries_ref ON public.mte_enquiries (reference_code);
CREATE INDEX IF NOT EXISTS idx_mte_enquiries_phone ON public.mte_enquiries (normalized_phone);
CREATE INDEX IF NOT EXISTS idx_mte_enquiries_created ON public.mte_enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mte_enquiries_status ON public.mte_enquiries (status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mte_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow service role full access for backend API operations
CREATE POLICY "Service Role Full Access" ON public.mte_enquiries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated concierge staff to read enquiries
CREATE POLICY "Authenticated Staff Read Access" ON public.mte_enquiries
  FOR SELECT
  TO authenticated
  USING (true);
