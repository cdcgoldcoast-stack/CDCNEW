-- Admin-authored blog posts. Coexists with the existing MDX posts in
-- content/blog/*.mdx — src/lib/blog.ts merges both sources at read time.

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  body TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Mark Mayne',
  image TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  draft BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx
  ON public.blog_posts (published_at DESC)
  WHERE draft = false;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public reads of published non-draft posts (anon + authenticated).
-- The blog detail/index pages are SSG so this runs at build time via the anon key.
DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
CREATE POLICY "Public can read published posts"
  ON public.blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (draft = false AND published_at <= now());

-- Admins and marketers can see everything (including drafts and future-scheduled).
DROP POLICY IF EXISTS "Marketing can read all posts" ON public.blog_posts;
CREATE POLICY "Marketing can read all posts"
  ON public.blog_posts
  FOR SELECT
  TO authenticated
  USING (public.can_manage_marketing());

DROP POLICY IF EXISTS "Marketing can create posts" ON public.blog_posts;
CREATE POLICY "Marketing can create posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (public.can_manage_marketing());

DROP POLICY IF EXISTS "Marketing can update posts" ON public.blog_posts;
CREATE POLICY "Marketing can update posts"
  ON public.blog_posts
  FOR UPDATE
  TO authenticated
  USING (public.can_manage_marketing())
  WITH CHECK (public.can_manage_marketing());

DROP POLICY IF EXISTS "Marketing can delete posts" ON public.blog_posts;
CREATE POLICY "Marketing can delete posts"
  ON public.blog_posts
  FOR DELETE
  TO authenticated
  USING (public.can_manage_marketing());

-- Auto-bump updated_at on modifications.
CREATE OR REPLACE FUNCTION public.blog_posts_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS blog_posts_set_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_set_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.blog_posts_set_updated_at();
