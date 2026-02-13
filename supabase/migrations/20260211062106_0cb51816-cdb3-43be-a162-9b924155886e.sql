
-- Create rate_limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  client_hash TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON public.rate_limits (endpoint, client_hash, window_start);

-- Enable RLS but allow service role access only
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Drop the old enforce_rate_limit function (return type changed from TABLE to JSON)
DROP FUNCTION IF EXISTS public.enforce_rate_limit(TEXT, TEXT, INTEGER, INTEGER);

-- Create the enforce_rate_limit function
CREATE OR REPLACE FUNCTION public.enforce_rate_limit(
  p_endpoint TEXT,
  p_client_hash TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_count INTEGER;
  v_allowed BOOLEAN;
  v_remaining INTEGER;
  v_reset_at TIMESTAMP WITH TIME ZONE;
BEGIN
  v_window_start := now() - (p_window_seconds || ' seconds')::INTERVAL;
  v_reset_at := now() + (p_window_seconds || ' seconds')::INTERVAL;

  -- Count requests in current window
  SELECT COALESCE(SUM(request_count), 0) INTO v_count
  FROM public.rate_limits
  WHERE endpoint = p_endpoint
    AND client_hash = p_client_hash
    AND window_start > v_window_start;

  IF v_count < p_limit THEN
    v_allowed := TRUE;
    v_remaining := p_limit - v_count - 1;

    -- Upsert the rate limit record
    INSERT INTO public.rate_limits (endpoint, client_hash, request_count, window_start)
    VALUES (p_endpoint, p_client_hash, 1, now())
    ON CONFLICT DO NOTHING;
  ELSE
    v_allowed := FALSE;
    v_remaining := 0;
  END IF;

  -- Clean up old entries occasionally (1% chance)
  IF random() < 0.01 THEN
    DELETE FROM public.rate_limits WHERE window_start < now() - INTERVAL '1 hour';
  END IF;

  RETURN json_build_object(
    'allowed', v_allowed,
    'remaining', v_remaining,
    'reset_at', v_reset_at
  );
END;
$$;
