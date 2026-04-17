-- Persist referral program submissions + make public review stats editable.

-- 1. Referrals table (save-referral was previously email-only, no DB record)
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_name TEXT NOT NULL,
  affiliate_email TEXT NOT NULL,
  affiliate_phone TEXT NOT NULL,
  referral_name TEXT NOT NULL,
  referral_phone TEXT NOT NULL,
  referral_email TEXT,
  referral_suburb TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS referrals_status_created_idx
  ON public.referrals (status, created_at DESC);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Admins and marketers can see/manage all referrals (same pattern as enquiries).
DROP POLICY IF EXISTS "Admins and marketers can view referrals" ON public.referrals;
CREATE POLICY "Admins and marketers can view referrals"
  ON public.referrals
  FOR SELECT
  TO authenticated
  USING (public.can_manage_marketing());

DROP POLICY IF EXISTS "Admins and marketers can update referrals" ON public.referrals;
CREATE POLICY "Admins and marketers can update referrals"
  ON public.referrals
  FOR UPDATE
  TO authenticated
  USING (public.can_manage_marketing())
  WITH CHECK (public.can_manage_marketing());

DROP POLICY IF EXISTS "Admins and marketers can delete referrals" ON public.referrals;
CREATE POLICY "Admins and marketers can delete referrals"
  ON public.referrals
  FOR DELETE
  TO authenticated
  USING (public.can_manage_marketing());

-- No INSERT policy: the save-referral edge function uses the service role key
-- (which bypasses RLS) so anonymous form submissions don't need an RLS grant.

-- Keep updated_at fresh on updates.
CREATE OR REPLACE FUNCTION public.referrals_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS referrals_set_updated_at ON public.referrals;
CREATE TRIGGER referrals_set_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.referrals_set_updated_at();

-- 2. Review stats editable from admin settings (notification_settings is the
-- existing "single row of global settings" table — extending it avoids creating
-- yet another one-row table).
ALTER TABLE public.notification_settings
  ADD COLUMN IF NOT EXISTS review_rating TEXT NOT NULL DEFAULT '4.9',
  ADD COLUMN IF NOT EXISTS review_count TEXT NOT NULL DEFAULT '50';
