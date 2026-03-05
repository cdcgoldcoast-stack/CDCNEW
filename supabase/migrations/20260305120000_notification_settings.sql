-- Stores the email sending config and team notification recipients.
-- A single row is maintained (upserted by the admin UI).

CREATE TABLE IF NOT EXISTS public.notification_settings (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_emails TEXT[]   NOT NULL DEFAULT '{}',
  from_email       TEXT        NOT NULL DEFAULT 'hello@cdconstruct.com.au',
  from_name        TEXT        NOT NULL DEFAULT 'Concept Design Construct',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed one default row so the admin UI always has something to update
INSERT INTO public.notification_settings (notification_emails, from_email, from_name)
VALUES ('{}', 'hello@cdconstruct.com.au', 'Concept Design Construct')
ON CONFLICT DO NOTHING;

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Authenticated admins can read and update
CREATE POLICY "auth_select_notification_settings"
  ON public.notification_settings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "auth_update_notification_settings"
  ON public.notification_settings FOR UPDATE
  TO authenticated USING (true);

-- Anon has no access
REVOKE ALL ON public.notification_settings FROM anon;
