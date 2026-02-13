-- Create gallery_items table for managing gallery content
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('image', 'text')),
  -- Image fields
  image_url TEXT,
  alt_text TEXT,
  size TEXT DEFAULT 'large' CHECK (size IN ('large', 'small')),
  ratio TEXT DEFAULT 'square' CHECK (ratio IN ('tall', 'wide', 'square')),
  -- Text fields  
  content TEXT,
  -- Position fields (shared)
  left_position NUMERIC NOT NULL DEFAULT 10,
  top_position NUMERIC NOT NULL DEFAULT 200,
  z_index INTEGER NOT NULL DEFAULT 10,
  parallax_speed NUMERIC NOT NULL DEFAULT 0,
  width_percent NUMERIC DEFAULT 30,
  -- Meta
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view active gallery items
CREATE POLICY "Anyone can view active gallery items"
ON public.gallery_items
FOR SELECT
USING (is_active = true);

-- Admins can manage all gallery items
CREATE POLICY "Admins can manage gallery items"
ON public.gallery_items
FOR ALL
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();