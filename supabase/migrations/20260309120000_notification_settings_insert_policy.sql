-- Add missing INSERT policy so authenticated users can create a notification_settings row
-- if the seed row was deleted or never inserted.

CREATE POLICY "auth_insert_notification_settings"
  ON public.notification_settings FOR INSERT
  TO authenticated WITH CHECK (true);
