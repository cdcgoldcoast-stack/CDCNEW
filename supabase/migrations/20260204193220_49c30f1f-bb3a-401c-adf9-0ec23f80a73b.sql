-- Create table to track viewed projects by IP
CREATE TABLE public.viewed_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  project_id TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX idx_viewed_projects_ip ON public.viewed_projects (ip_address);
CREATE INDEX idx_viewed_projects_project ON public.viewed_projects (project_id);

-- Create unique constraint to prevent duplicates
CREATE UNIQUE INDEX idx_viewed_projects_unique ON public.viewed_projects (ip_address, project_id);

-- Enable RLS but allow public access for this tracking table
ALTER TABLE public.viewed_projects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (track views)
CREATE POLICY "Anyone can track viewed projects"
ON public.viewed_projects
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read (to filter suggestions)
CREATE POLICY "Anyone can read viewed projects"
ON public.viewed_projects
FOR SELECT
USING (true);