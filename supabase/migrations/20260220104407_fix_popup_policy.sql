-- Fix: Allow both anon and authenticated users to submit popup responses
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.popup_responses;

-- Create policy to allow inserts from anyone (anon or authenticated)
CREATE POLICY "Allow all inserts" ON public.popup_responses
    FOR INSERT
    WITH CHECK (true);

-- Also ensure authenticated users can insert
CREATE POLICY "Allow authenticated inserts" ON public.popup_responses
    FOR INSERT TO authenticated
    WITH CHECK (true);
