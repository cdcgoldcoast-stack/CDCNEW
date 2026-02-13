-- Create table to track design generation usage by IP
CREATE TABLE public.design_generation_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  generation_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ip_address, usage_date)
);

-- Enable RLS
ALTER TABLE public.design_generation_usage ENABLE ROW LEVEL SECURITY;

-- Allow edge functions to manage usage (using service role)
-- No public access needed since this is only accessed by edge functions

-- Create index for fast lookups
CREATE INDEX idx_design_usage_ip_date ON public.design_generation_usage(ip_address, usage_date);

-- Add trigger for updated_at
CREATE TRIGGER update_design_generation_usage_updated_at
  BEFORE UPDATE ON public.design_generation_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();