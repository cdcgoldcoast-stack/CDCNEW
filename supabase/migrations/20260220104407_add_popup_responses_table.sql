-- Create popup_responses table for promotional popup lead capture
CREATE TABLE IF NOT EXISTS public.popup_responses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    phone text NOT NULL,
    source text DEFAULT 'promo_popup',
    page_url text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.popup_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anonymous users (for the popup form)
CREATE POLICY "Allow anonymous inserts" ON public.popup_responses
    FOR INSERT TO anon
    WITH CHECK (true);

-- Create policy to allow admins to view all responses
CREATE POLICY "Allow admin full access" ON public.popup_responses
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER popup_responses_updated_at
    BEFORE UPDATE ON public.popup_responses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add index for common queries
CREATE INDEX IF NOT EXISTS idx_popup_responses_created_at 
    ON public.popup_responses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_popup_responses_source 
    ON public.popup_responses(source);
