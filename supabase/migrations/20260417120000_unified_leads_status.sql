-- Support for unified leads inbox: give popup_responses a status so all
-- three lead sources (enquiries, chat_inquiries, popup_responses) can be
-- tracked through the same new -> contacted -> qualified -> closed pipeline.

ALTER TABLE public.popup_responses
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';

-- Add notes column across all three sources for lightweight CRM logging.
ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE public.chat_inquiries
  ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE public.popup_responses
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Index status columns so filtering in the admin is fast.
CREATE INDEX IF NOT EXISTS enquiries_status_created_idx
  ON public.enquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS chat_inquiries_status_created_idx
  ON public.chat_inquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS popup_responses_status_created_idx
  ON public.popup_responses (status, created_at DESC);
