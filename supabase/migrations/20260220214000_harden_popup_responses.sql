-- Harden popup_responses so only service-role backend code can insert.
ALTER TABLE public.popup_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popup_responses FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.popup_responses;
DROP POLICY IF EXISTS "Allow all inserts" ON public.popup_responses;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON public.popup_responses;
DROP POLICY IF EXISTS "Allow admin full access" ON public.popup_responses;
DROP POLICY IF EXISTS "Admins can view all popup responses" ON public.popup_responses;
DROP POLICY IF EXISTS "Admins can update popup responses" ON public.popup_responses;
DROP POLICY IF EXISTS "Admins can delete popup responses" ON public.popup_responses;
DROP POLICY IF EXISTS "Service role can insert popup responses" ON public.popup_responses;

CREATE POLICY "Admins can view all popup responses"
ON public.popup_responses
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update popup responses"
ON public.popup_responses
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete popup responses"
ON public.popup_responses
FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Service role can insert popup responses"
ON public.popup_responses
FOR INSERT
TO service_role
WITH CHECK (true);

REVOKE ALL ON TABLE public.popup_responses FROM anon;
REVOKE INSERT ON TABLE public.popup_responses FROM authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.popup_responses TO authenticated;
GRANT INSERT ON TABLE public.popup_responses TO service_role;
