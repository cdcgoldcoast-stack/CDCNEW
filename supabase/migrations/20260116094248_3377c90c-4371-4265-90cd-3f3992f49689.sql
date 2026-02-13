-- Create enquiries table to store quote requests
CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  suburb TEXT,
  state TEXT,
  postcode TEXT,
  renovations TEXT[] DEFAULT '{}',
  budget TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an enquiry (public form)
CREATE POLICY "Anyone can create enquiries"
ON public.enquiries
FOR INSERT
WITH CHECK (true);

-- Only admins can view enquiries
CREATE POLICY "Admins can view all enquiries"
ON public.enquiries
FOR SELECT
USING (is_admin());

-- Only admins can update enquiries
CREATE POLICY "Admins can update enquiries"
ON public.enquiries
FOR UPDATE
USING (is_admin());

-- Only admins can delete enquiries
CREATE POLICY "Admins can delete enquiries"
ON public.enquiries
FOR DELETE
USING (is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_enquiries_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();