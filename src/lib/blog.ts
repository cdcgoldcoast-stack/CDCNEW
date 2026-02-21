import fs from "node:fs/promises";
import path from "node:path";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");

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
};

function calculateReadingTime(text: string): { text: string; minutes: number } {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return { text: `${minutes} min read`, minutes };
}

function parseFrontmatter(content: string): { data: Record<string, any>; body: string } {
  const lines = content.split('\n');
  const data: Record<string, any> = {};
  let bodyStart = 0;
  
  if (lines[0] === '---') {
    let i = 1;
    while (i < lines.length && lines[i] !== '---') {
      const line = lines[i];
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        let value: any = line.slice(colonIndex + 1).trim();
        
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

async function readBlogPostFromFile(filePath: string): Promise<BlogPost | null> {
  const source = await fs.readFile(filePath, "utf8");
  const { data, body } = parseFrontmatter(source);
  
  const title = data.title || "";
  const description = data.description || "";
  const publishedAt = data.publishedAt || "";
  
  if (!title || !description || !publishedAt) {
    return null;
  }
  
  const slug = path.basename(filePath, ".mdx");
  const stats = calculateReadingTime(body);
  
  return {
    slug,
    url: `/blog/${slug}`,
    title,
    description,
    publishedAt: new Date(publishedAt).toISOString(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : undefined,
    author: data.author,
    image: data.image,
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: data.draft === "true",
    readingTime: stats.text,
    readingMinutes: stats.minutes,
    body,
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

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const files = await walkMdxFiles(BLOG_CONTENT_DIR);
  const posts = await Promise.all(files.map(readBlogPostFromFile));
  return posts
    .filter((post): post is BlogPost => Boolean(post))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
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
