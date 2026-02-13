-- Create design_covers table for storing AI-generated editorial content
CREATE TABLE public.design_covers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  editorial_summary TEXT NOT NULL,
  design_patterns JSONB NOT NULL DEFAULT '[]',
  design_examples JSONB NOT NULL DEFAULT '[]',
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  week_of DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.design_covers ENABLE ROW LEVEL SECURITY;

-- Public can view published covers
CREATE POLICY "Anyone can view published design covers" 
ON public.design_covers 
FOR SELECT 
USING (status = 'published');

-- Admins can do everything
CREATE POLICY "Admins can manage all design covers" 
ON public.design_covers 
FOR ALL 
USING (public.is_admin());

-- Create index for faster queries
CREATE INDEX idx_design_covers_status ON public.design_covers(status);
CREATE INDEX idx_design_covers_published_at ON public.design_covers(published_at DESC);
CREATE INDEX idx_design_covers_week_of ON public.design_covers(week_of DESC);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_design_covers_updated_at
BEFORE UPDATE ON public.design_covers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();