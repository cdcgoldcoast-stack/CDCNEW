-- Add is_published field to projects table
ALTER TABLE public.projects 
ADD COLUMN is_published boolean NOT NULL DEFAULT false;