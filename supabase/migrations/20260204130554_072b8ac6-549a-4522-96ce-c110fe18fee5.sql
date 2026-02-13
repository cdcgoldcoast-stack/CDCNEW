-- Create table to store image asset overrides
CREATE TABLE public.image_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_path TEXT NOT NULL UNIQUE,
  override_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.image_overrides ENABLE ROW LEVEL SECURITY;

-- Anyone can read overrides (needed to display images on public pages)
CREATE POLICY "Anyone can view image overrides"
ON public.image_overrides
FOR SELECT
USING (true);

-- Only admins can manage overrides
CREATE POLICY "Admins can manage image overrides"
ON public.image_overrides
FOR ALL
USING (is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_image_overrides_updated_at
BEFORE UPDATE ON public.image_overrides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();