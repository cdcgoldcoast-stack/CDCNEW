-- Lock down sensitive tables flagged by security checks:
-- 1) chat_inquiries should not accept direct public inserts
-- 2) moodboards should not rely on session_id-based access at all

-- ------------------------------------------------------------
-- chat_inquiries hardening
-- ------------------------------------------------------------
ALTER TABLE public.chat_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_inquiries FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all chat inquiries" ON public.chat_inquiries;
DROP POLICY IF EXISTS "Admins can update chat inquiries" ON public.chat_inquiries;
DROP POLICY IF EXISTS "Admins can delete chat inquiries" ON public.chat_inquiries;
DROP POLICY IF EXISTS "Anyone can insert chat inquiries" ON public.chat_inquiries;
DROP POLICY IF EXISTS "Service role can insert chat inquiries" ON public.chat_inquiries;

CREATE POLICY "Admins can view all chat inquiries"
ON public.chat_inquiries
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update chat inquiries"
ON public.chat_inquiries
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete chat inquiries"
ON public.chat_inquiries
FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Service role can insert chat inquiries"
ON public.chat_inquiries
FOR INSERT
TO service_role
WITH CHECK (true);

-- Table grants: keep anon away from sensitive lead data and direct writes.
REVOKE ALL ON TABLE public.chat_inquiries FROM anon;
REVOKE INSERT ON TABLE public.chat_inquiries FROM authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.chat_inquiries TO authenticated;
GRANT INSERT ON TABLE public.chat_inquiries TO service_role;

-- ------------------------------------------------------------
-- moodboards hardening
-- ------------------------------------------------------------
ALTER TABLE public.moodboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moodboards FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own moodboards" ON public.moodboards;
DROP POLICY IF EXISTS "Users can create moodboards" ON public.moodboards;
DROP POLICY IF EXISTS "Users can update their own moodboards" ON public.moodboards;
DROP POLICY IF EXISTS "Users can delete their own moodboards" ON public.moodboards;
DROP POLICY IF EXISTS "Authenticated users can view their own moodboards" ON public.moodboards;
DROP POLICY IF EXISTS "Authenticated users can create their own moodboards" ON public.moodboards;
DROP POLICY IF EXISTS "Authenticated users can update their own moodboards" ON public.moodboards;
DROP POLICY IF EXISTS "Authenticated users can delete their own moodboards" ON public.moodboards;

-- Remove anonymous/session-id based rows and schema surface.
DELETE FROM public.moodboards WHERE user_id IS NULL;
ALTER TABLE public.moodboards ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.moodboards DROP COLUMN IF EXISTS session_id;

CREATE POLICY "Authenticated users can view their own moodboards"
ON public.moodboards
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own moodboards"
ON public.moodboards
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own moodboards"
ON public.moodboards
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own moodboards"
ON public.moodboards
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Table grants: anon cannot read/write moodboards.
REVOKE ALL ON TABLE public.moodboards FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.moodboards TO authenticated;
