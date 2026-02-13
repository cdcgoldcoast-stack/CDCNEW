-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT,
  year SMALLINT,
  duration TEXT,
  overview TEXT,
  challenge TEXT,
  solution TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create project_images table
CREATE TABLE public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on project_images
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles (only admins can see roles)
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin());

-- RLS Policies for projects
-- Public can read projects (for the website)
CREATE POLICY "Anyone can view projects"
  ON public.projects FOR SELECT
  USING (true);

-- Only admins can insert projects
CREATE POLICY "Admins can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (public.is_admin());

-- Only admins can update projects
CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  USING (public.is_admin());

-- Only admins can delete projects
CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  USING (public.is_admin());

-- RLS Policies for project_images
-- Public can read project images (for the website)
CREATE POLICY "Anyone can view project images"
  ON public.project_images FOR SELECT
  USING (true);

-- Only admins can insert project images
CREATE POLICY "Admins can create project images"
  ON public.project_images FOR INSERT
  WITH CHECK (public.is_admin());

-- Only admins can update project images
CREATE POLICY "Admins can update project images"
  ON public.project_images FOR UPDATE
  USING (public.is_admin());

-- Only admins can delete project images
CREATE POLICY "Admins can delete project images"
  ON public.project_images FOR DELETE
  USING (public.is_admin());

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Storage policies for project-images bucket
CREATE POLICY "Anyone can view project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND public.is_admin());

CREATE POLICY "Admins can update project images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-images' AND public.is_admin());

CREATE POLICY "Admins can delete project images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND public.is_admin());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();