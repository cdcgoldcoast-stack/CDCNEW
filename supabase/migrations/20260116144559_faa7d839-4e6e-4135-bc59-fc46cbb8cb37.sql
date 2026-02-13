-- Fix security warnings by removing the overly permissive policy and keeping only SELECT for public
DROP POLICY IF EXISTS "Service role can manage cache" ON public.image_search_cache;

-- Note: Edge functions with service role key will bypass RLS anyway, so we don't need INSERT/UPDATE/DELETE policies