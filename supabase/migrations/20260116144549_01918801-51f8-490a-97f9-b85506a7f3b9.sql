-- Create moodboards table to store user moodboard state
CREATE TABLE public.moodboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For anonymous users
  name TEXT NOT NULL DEFAULT 'Untitled Moodboard',
  canvas_data JSONB NOT NULL DEFAULT '{}',
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.moodboards ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage their own moodboards
CREATE POLICY "Users can view their own moodboards" 
ON public.moodboards 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND session_id IS NOT NULL)
);

CREATE POLICY "Users can create moodboards" 
ON public.moodboards 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND session_id IS NOT NULL)
);

CREATE POLICY "Users can update their own moodboards" 
ON public.moodboards 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND session_id IS NOT NULL)
);

CREATE POLICY "Users can delete their own moodboards" 
ON public.moodboards 
FOR DELETE 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND session_id IS NOT NULL)
);

-- Create image_search_cache table to cache API results
CREATE TABLE public.image_search_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL, -- 'pexels', 'openverse'
  query TEXT NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  UNIQUE(provider, query)
);

-- Enable RLS on cache table
ALTER TABLE public.image_search_cache ENABLE ROW LEVEL SECURITY;

-- Everyone can read cache
CREATE POLICY "Anyone can read cache" 
ON public.image_search_cache 
FOR SELECT 
USING (true);

-- Only backend can insert/update cache (via service role)
CREATE POLICY "Service role can manage cache" 
ON public.image_search_cache 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates on moodboards
CREATE TRIGGER update_moodboards_updated_at
BEFORE UPDATE ON public.moodboards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();