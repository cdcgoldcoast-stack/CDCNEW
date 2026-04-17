-- Split from 20260408121500 so Postgres can commit the new enum value
-- before it is used in subsequent statements (avoids "unsafe use of new value" error).

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
