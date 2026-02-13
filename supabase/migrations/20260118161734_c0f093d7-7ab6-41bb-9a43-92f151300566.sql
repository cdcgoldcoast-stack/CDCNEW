-- Create chat_inquiries table to store leads from chat widget
CREATE TABLE public.chat_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  additional_notes TEXT,
  conversation_summary TEXT,
  conversation_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access (admins can view all)
CREATE POLICY "Admins can view all chat inquiries"
ON public.chat_inquiries
FOR SELECT
USING (public.is_admin());

-- Create policy for admin update
CREATE POLICY "Admins can update chat inquiries"
ON public.chat_inquiries
FOR UPDATE
USING (public.is_admin());

-- Create policy for public insert (anyone can submit an inquiry)
CREATE POLICY "Anyone can insert chat inquiries"
ON public.chat_inquiries
FOR INSERT
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chat_inquiries_updated_at
BEFORE UPDATE ON public.chat_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();