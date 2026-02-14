-- Add source tracking for lead origin and harden public write access.
ALTER TABLE public.enquiries
ADD COLUMN IF NOT EXISTS source text;

UPDATE public.enquiries
SET source = 'website'
WHERE source IS NULL;

ALTER TABLE public.enquiries
ALTER COLUMN source SET DEFAULT 'website',
ALTER COLUMN source SET NOT NULL;

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Service role can insert enquiries" ON public.enquiries;

CREATE POLICY "Service role can insert enquiries"
ON public.enquiries
FOR INSERT
TO service_role
WITH CHECK (true);

REVOKE ALL ON TABLE public.enquiries FROM anon;
REVOKE INSERT ON TABLE public.enquiries FROM authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.enquiries TO authenticated;
GRANT INSERT ON TABLE public.enquiries TO service_role;
