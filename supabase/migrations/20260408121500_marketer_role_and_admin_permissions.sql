-- Add marketer role and align admin-side permissions with role-based access.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'app_role' AND e.enumlabel = 'marketer'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'marketer';
  END IF;
END $$;

-- Keep exactly one role row per user to match app behavior.
WITH ranked_roles AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id
      ORDER BY
        CASE role
          WHEN 'admin' THEN 1
          WHEN 'marketer' THEN 2
          ELSE 3
        END,
        created_at ASC,
        id ASC
    ) AS rn
  FROM public.user_roles
)
DELETE FROM public.user_roles ur
USING ranked_roles rr
WHERE ur.id = rr.id
  AND rr.rn > 1;

ALTER TABLE public.user_roles
DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_roles_user_id_key'
      AND conrelid = 'public.user_roles'::regclass
  ) THEN
    ALTER TABLE public.user_roles
    ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.has_role(required_role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = required_role
  );
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(required_roles public.app_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = ANY(required_roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role('admin'::public.app_role);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_marketing()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_any_role(ARRAY['admin', 'marketer']::public.app_role[]);
$$;

CREATE OR REPLACE FUNCTION public.can_access_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.can_manage_marketing();
$$;

DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins can update enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins can delete enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins and marketers can view all enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins and marketers can update enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins and marketers can delete enquiries" ON public.enquiries;

CREATE POLICY "Admins and marketers can view all enquiries"
ON public.enquiries
FOR SELECT
TO authenticated
USING (public.can_manage_marketing());

CREATE POLICY "Admins and marketers can update enquiries"
ON public.enquiries
FOR UPDATE
TO authenticated
USING (public.can_manage_marketing())
WITH CHECK (public.can_manage_marketing());

CREATE POLICY "Admins and marketers can delete enquiries"
ON public.enquiries
FOR DELETE
TO authenticated
USING (public.can_manage_marketing());

DROP POLICY IF EXISTS "Admins can view all chat inquiries" ON public.chat_inquiries;
DROP POLICY IF EXISTS "Admins can update chat inquiries" ON public.chat_inquiries;
DROP POLICY IF EXISTS "Admins can delete chat inquiries" ON public.chat_inquiries;
DROP POLICY IF EXISTS "Admins and marketers can view all chat inquiries" ON public.chat_inquiries;
DROP POLICY IF EXISTS "Admins and marketers can update chat inquiries" ON public.chat_inquiries;
DROP POLICY IF EXISTS "Admins and marketers can delete chat inquiries" ON public.chat_inquiries;

CREATE POLICY "Admins and marketers can view all chat inquiries"
ON public.chat_inquiries
FOR SELECT
TO authenticated
USING (public.can_manage_marketing());

CREATE POLICY "Admins and marketers can update chat inquiries"
ON public.chat_inquiries
FOR UPDATE
TO authenticated
USING (public.can_manage_marketing())
WITH CHECK (public.can_manage_marketing());

CREATE POLICY "Admins and marketers can delete chat inquiries"
ON public.chat_inquiries
FOR DELETE
TO authenticated
USING (public.can_manage_marketing());

DROP POLICY IF EXISTS "Admins can view all popup responses" ON public.popup_responses;
DROP POLICY IF EXISTS "Admins can update popup responses" ON public.popup_responses;
DROP POLICY IF EXISTS "Admins can delete popup responses" ON public.popup_responses;
DROP POLICY IF EXISTS "Admins and marketers can view all popup responses" ON public.popup_responses;
DROP POLICY IF EXISTS "Admins and marketers can update popup responses" ON public.popup_responses;
DROP POLICY IF EXISTS "Admins and marketers can delete popup responses" ON public.popup_responses;

CREATE POLICY "Admins and marketers can view all popup responses"
ON public.popup_responses
FOR SELECT
TO authenticated
USING (public.can_manage_marketing());

CREATE POLICY "Admins and marketers can update popup responses"
ON public.popup_responses
FOR UPDATE
TO authenticated
USING (public.can_manage_marketing())
WITH CHECK (public.can_manage_marketing());

CREATE POLICY "Admins and marketers can delete popup responses"
ON public.popup_responses
FOR DELETE
TO authenticated
USING (public.can_manage_marketing());

DROP POLICY IF EXISTS "Admins can create projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Admins and marketers can create projects" ON public.projects;
DROP POLICY IF EXISTS "Admins and marketers can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins and marketers can delete projects" ON public.projects;

CREATE POLICY "Admins and marketers can create projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_marketing());

CREATE POLICY "Admins and marketers can update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (public.can_manage_marketing())
WITH CHECK (public.can_manage_marketing());

CREATE POLICY "Admins and marketers can delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (public.can_manage_marketing());

DROP POLICY IF EXISTS "Admins can create project images" ON public.project_images;
DROP POLICY IF EXISTS "Admins can update project images" ON public.project_images;
DROP POLICY IF EXISTS "Admins can delete project images" ON public.project_images;
DROP POLICY IF EXISTS "Admins and marketers can create project images" ON public.project_images;
DROP POLICY IF EXISTS "Admins and marketers can update project images" ON public.project_images;
DROP POLICY IF EXISTS "Admins and marketers can delete project images" ON public.project_images;

CREATE POLICY "Admins and marketers can create project images"
ON public.project_images
FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_marketing());

CREATE POLICY "Admins and marketers can update project images"
ON public.project_images
FOR UPDATE
TO authenticated
USING (public.can_manage_marketing())
WITH CHECK (public.can_manage_marketing());

CREATE POLICY "Admins and marketers can delete project images"
ON public.project_images
FOR DELETE
TO authenticated
USING (public.can_manage_marketing());

DROP POLICY IF EXISTS "Admins can manage gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins and marketers can manage gallery items" ON public.gallery_items;

CREATE POLICY "Admins and marketers can manage gallery items"
ON public.gallery_items
FOR ALL
TO authenticated
USING (public.can_manage_marketing())
WITH CHECK (public.can_manage_marketing());

DROP POLICY IF EXISTS "Admins can manage image overrides" ON public.image_overrides;
DROP POLICY IF EXISTS "Admins and marketers can manage image overrides" ON public.image_overrides;

CREATE POLICY "Admins and marketers can manage image overrides"
ON public.image_overrides
FOR ALL
TO authenticated
USING (public.can_manage_marketing())
WITH CHECK (public.can_manage_marketing());

DROP POLICY IF EXISTS "auth_select_notification_settings" ON public.notification_settings;
DROP POLICY IF EXISTS "auth_update_notification_settings" ON public.notification_settings;
DROP POLICY IF EXISTS "auth_insert_notification_settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Marketing can read notification settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Marketing can update notification settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Marketing can insert notification settings" ON public.notification_settings;

CREATE POLICY "Marketing can read notification settings"
ON public.notification_settings
FOR SELECT
TO authenticated
USING (public.can_manage_marketing());

CREATE POLICY "Marketing can update notification settings"
ON public.notification_settings
FOR UPDATE
TO authenticated
USING (public.can_manage_marketing())
WITH CHECK (public.can_manage_marketing());

CREATE POLICY "Marketing can insert notification settings"
ON public.notification_settings
FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_marketing());

DROP POLICY IF EXISTS "Admins can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project images" ON storage.objects;
DROP POLICY IF EXISTS "Marketing can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Marketing can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Marketing can delete project images" ON storage.objects;

CREATE POLICY "Marketing can upload project images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images' AND public.can_manage_marketing());

CREATE POLICY "Marketing can update project images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images' AND public.can_manage_marketing())
WITH CHECK (bucket_id = 'project-images' AND public.can_manage_marketing());

CREATE POLICY "Marketing can delete project images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project-images' AND public.can_manage_marketing());

DROP POLICY IF EXISTS "Admins can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Marketing can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Marketing can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Marketing can delete gallery images" ON storage.objects;

CREATE POLICY "Marketing can upload gallery images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images' AND public.can_manage_marketing());

CREATE POLICY "Marketing can update gallery images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images' AND public.can_manage_marketing())
WITH CHECK (bucket_id = 'gallery-images' AND public.can_manage_marketing());

CREATE POLICY "Marketing can delete gallery images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images' AND public.can_manage_marketing());
