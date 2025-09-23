-- Add timing and pricing validity columns to public.packages
-- These align with fields used in CompactPackageWizard mainInsert

BEGIN;

ALTER TABLE IF EXISTS public.packages
  ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS departure_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS return_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS booking_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pricing_valid_from TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pricing_valid_to TIMESTAMPTZ;

-- Optional indexes to speed up queries filtering by dates
CREATE INDEX IF NOT EXISTS idx_packages_start_time ON public.packages(start_time);
CREATE INDEX IF NOT EXISTS idx_packages_end_time ON public.packages(end_time);
CREATE INDEX IF NOT EXISTS idx_packages_departure_date ON public.packages(departure_date);
CREATE INDEX IF NOT EXISTS idx_packages_return_date ON public.packages(return_date);
CREATE INDEX IF NOT EXISTS idx_packages_booking_deadline ON public.packages(booking_deadline);
CREATE INDEX IF NOT EXISTS idx_packages_pricing_validity ON public.packages(pricing_valid_from, pricing_valid_to);

COMMIT;


