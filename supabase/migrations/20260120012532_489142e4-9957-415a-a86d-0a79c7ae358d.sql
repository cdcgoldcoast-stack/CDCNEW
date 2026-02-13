-- Add SEO fields and source URLs to design_covers table
ALTER TABLE public.design_covers
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[],
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS trend_sources JSONB DEFAULT '[]'::jsonb;

-- Add comment for clarity
COMMENT ON COLUMN public.design_covers.meta_description IS 'SEO meta description for search engines';
COMMENT ON COLUMN public.design_covers.meta_keywords IS 'SEO keywords for the edition';
COMMENT ON COLUMN public.design_covers.og_image_url IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN public.design_covers.trend_sources IS 'Array of source URLs and attributions for trend research';
COMMENT ON COLUMN public.design_covers.reading_time_minutes IS 'Estimated reading time in minutes';