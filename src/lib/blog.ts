import fs from "node:fs/promises";
import path from "node:path";
import { supabase } from "@/integrations/supabase/client";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostSource = "mdx" | "db";

export type BlogPost = {
  slug: string;
  url: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  image?: string;
  tags: string[];
  draft: boolean;
  readingTime: string;
  readingMinutes: number;
  body: string;
  source: BlogPostSource;
};

function calculateReadingTime(text: string): { text: string; minutes: number } {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return { text: `${minutes} min read`, minutes };
}

type FrontmatterValue = string | string[];

function parseFrontmatter(content: string): { data: Record<string, FrontmatterValue>; body: string } {
  const lines = content.split('\n');
  const data: Record<string, FrontmatterValue> = {};
  let bodyStart = 0;

  if (lines[0] === '---') {
    let i = 1;
    while (i < lines.length && lines[i] !== '---') {
      const line = lines[i];
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        let value: FrontmatterValue = line.slice(colonIndex + 1).trim();

        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }

        // Handle comma-separated values (tags)
        if (key === 'tags' && typeof value === 'string' && value.includes(',')) {
          value = value.split(',').map((v: string) => v.trim()).filter(Boolean);
        }

        data[key] = value;
      }
      i++;
    }
    bodyStart = i + 1;
  }

  const body = lines.slice(bodyStart).join('\n').trim();
  return { data, body };
}

function asString(value: FrontmatterValue | undefined): string {
  return typeof value === "string" ? value : "";
}

async function readBlogPostFromFile(filePath: string): Promise<BlogPost | null> {
  const source = await fs.readFile(filePath, "utf8");
  const { data, body } = parseFrontmatter(source);

  const title = asString(data.title);
  const description = asString(data.description);
  const publishedAt = asString(data.publishedAt);

  if (!title || !description || !publishedAt) {
    return null;
  }

  const slug = path.basename(filePath, ".mdx");
  const stats = calculateReadingTime(body);
  const updatedAt = asString(data.updatedAt);
  const author = asString(data.author) || "Mark Mayne";
  const image = asString(data.image) || undefined;

  return {
    slug,
    url: `/blog/${slug}`,
    title,
    description,
    publishedAt: new Date(publishedAt).toISOString(),
    updatedAt: updatedAt ? new Date(updatedAt).toISOString() : undefined,
    author,
    image,
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: asString(data.draft) === "true",
    readingTime: stats.text,
    readingMinutes: stats.minutes,
    body,
    source: "mdx",
  };
}

async function walkMdxFiles(directoryPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);
      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        files.push(fullPath);
      }
    }

    return files;
  } catch {
    return [];
  }
}

interface DbBlogPostRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  author: string | null;
  image: string | null;
  tags: string[] | null;
  published_at: string;
  updated_at: string | null;
  draft: boolean;
}

function rowToBlogPost(row: DbBlogPostRow): BlogPost {
  const body = row.body || "";
  const stats = calculateReadingTime(body);
  return {
    slug: row.slug,
    url: `/blog/${row.slug}`,
    title: row.title,
    description: row.description,
    publishedAt: new Date(row.published_at).toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    author: row.author || "Mark Mayne",
    image: row.image || undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
    draft: Boolean(row.draft),
    readingTime: stats.text,
    readingMinutes: stats.minutes,
    body,
    source: "db",
  };
}

async function getDbBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, description, body, author, image, tags, published_at, updated_at, draft")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Failed to load DB blog posts:", error.message);
      return [];
    }

    return (data ?? []).map((row) => rowToBlogPost(row as DbBlogPostRow));
  } catch (err) {
    // Never fail the build/page if the DB is briefly unavailable.
    console.error("Unexpected error loading DB blog posts:", err);
    return [];
  }
}

export async function getMdxOnlyBlogPosts(): Promise<BlogPost[]> {
  const files = await walkMdxFiles(BLOG_CONTENT_DIR);
  const posts = await Promise.all(files.map(readBlogPostFromFile));
  return posts
    .filter((post): post is BlogPost => Boolean(post))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const [mdxFiles, dbPosts] = await Promise.all([
    walkMdxFiles(BLOG_CONTENT_DIR),
    getDbBlogPosts(),
  ]);

  const mdxPosts = await Promise.all(mdxFiles.map(readBlogPostFromFile));
  const mdxValid = mdxPosts.filter((post): post is BlogPost => Boolean(post));

  // DB posts win on slug collision — this lets an admin override an MDX post
  // by creating a DB post with the same slug.
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const merged = [
    ...dbPosts,
    ...mdxValid.filter((p) => !dbSlugs.has(p.slug)),
  ];

  return merged.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((post) => !post.draft && new Date(post.publishedAt) <= new Date());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllPublishedPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getAllPublishedPosts();
  return posts.map((post) => post.slug);
}

export function formatBlogDate(value: string): string {
  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
