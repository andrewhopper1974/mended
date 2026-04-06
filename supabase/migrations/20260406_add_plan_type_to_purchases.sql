-- Add plan_type column to purchases table
-- Run this in the Supabase SQL editor before deploying the updated webhook

ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS plan_type text;
