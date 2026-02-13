-- Security hardening: lock down anonymous data paths, remove public IP exposure,
-- and add persistent rate-limiting primitives for edge functions.

-- 1) Moodboards: authenticated ownership only
DROP POLICY IF EXISTS "Users can view their own moodboards" ON public.moodboards;
DROP POLICY IF EXISTS "Users can create moodboards" ON public.moodboards;
DROP POLICY IF EXISTS "Users can update their own moodboards" ON public.moodboards;
DROP POLICY IF EXISTS "Users can delete their own moodboards" ON public.moodboards;

CREATE POLICY "Authenticated users can view their own moodboards"
ON public.moodboards
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own moodboards"
ON public.moodboards
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own moodboards"
ON public.moodboards
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own moodboards"
ON public.moodboards
FOR DELETE
USING (auth.uid() = user_id);

-- 2) Image cache table: remove permissive write access
DROP POLICY IF EXISTS "Service role can manage cache" ON public.image_search_cache;

CREATE POLICY "Service role can manage cache writes"
ON public.image_search_cache
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3) Viewed projects: de-identify and remove public read/write
ALTER TABLE public.viewed_projects
ADD COLUMN IF NOT EXISTS visitor_hash TEXT;

UPDATE public.viewed_projects
SET visitor_hash = md5(ip_address)
WHERE visitor_hash IS NULL
  AND ip_address IS NOT NULL;

ALTER TABLE public.viewed_projects
ALTER COLUMN visitor_hash SET NOT NULL;

DROP INDEX IF EXISTS idx_viewed_projects_ip;
DROP INDEX IF EXISTS idx_viewed_projects_unique;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'viewed_projects'
      AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE public.viewed_projects DROP COLUMN ip_address;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_viewed_projects_visitor ON public.viewed_projects (visitor_hash);
CREATE UNIQUE INDEX IF NOT EXISTS idx_viewed_projects_unique ON public.viewed_projects (visitor_hash, project_id);

DROP POLICY IF EXISTS "Anyone can track viewed projects" ON public.viewed_projects;
DROP POLICY IF EXISTS "Anyone can read viewed projects" ON public.viewed_projects;

CREATE POLICY "Service role can manage viewed projects"
ON public.viewed_projects
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4) Persistent edge function rate-limit store
CREATE TABLE IF NOT EXISTS public.edge_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  client_hash TEXT NOT NULL,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(endpoint, client_hash, window_start)
);

ALTER TABLE public.edge_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_edge_rate_limits_lookup
ON public.edge_rate_limits(endpoint, client_hash, window_start);

DROP POLICY IF EXISTS "Service role can manage edge rate limits" ON public.edge_rate_limits;

CREATE POLICY "Service role can manage edge rate limits"
ON public.edge_rate_limits
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

DROP TRIGGER IF EXISTS update_edge_rate_limits_updated_at ON public.edge_rate_limits;
CREATE TRIGGER update_edge_rate_limits_updated_at
BEFORE UPDATE ON public.edge_rate_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Atomic rate-limit function for edge functions
CREATE OR REPLACE FUNCTION public.enforce_rate_limit(
  p_endpoint TEXT,
  p_client_hash TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
)
RETURNS TABLE(
  allowed BOOLEAN,
  remaining INTEGER,
  reset_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_count INTEGER;
BEGIN
  IF p_limit <= 0 OR p_window_seconds <= 0 THEN
    RAISE EXCEPTION 'Invalid rate-limit arguments';
  END IF;

  v_window_start := to_timestamp(
    floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds
  );

  INSERT INTO public.edge_rate_limits(endpoint, client_hash, window_start, request_count)
  VALUES (p_endpoint, p_client_hash, v_window_start, 1)
  ON CONFLICT (endpoint, client_hash, window_start)
  DO UPDATE SET
    request_count = public.edge_rate_limits.request_count + 1,
    updated_at = now()
  RETURNING request_count INTO v_count;

  allowed := v_count <= p_limit;
  remaining := GREATEST(p_limit - v_count, 0);
  reset_at := v_window_start + make_interval(secs => p_window_seconds);

  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_rate_limit(TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.enforce_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO service_role;
