import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import readingTime from "reading-time";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const BLOG_FILE_EXTENSION = ".mdx";

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

const toTimestamp = (value: string) => {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const toIsoDateOrUndefined = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const timestamp = toTimestamp(value);
  if (!timestamp) return undefined;
  return new Date(timestamp).toISOString();
};

const toTagList = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((tag) => `${tag}`.trim())
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeSlug = (absoluteFilePath: string) =>
  path
    .relative(BLOG_CONTENT_DIR, absoluteFilePath)
    .replace(/\\/g, "/")
    .replace(/\.mdx$/i, "")
    .trim()
    .toLowerCase();

const walkMdxFiles = async (directoryPath: string): Promise<string[]> => {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absoluteEntryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      const nestedFiles = await walkMdxFiles(absoluteEntryPath);
      files.push(...nestedFiles);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(BLOG_FILE_EXTENSION)) {
      files.push(absoluteEntryPath);
    }
  }

  return files;
};

const readBlogPostFromFile = async (absoluteFilePath: string): Promise<BlogPost | null> => {
  const source = await fs.readFile(absoluteFilePath, "utf8");
  const { data, content } = matter(source);
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description = typeof data.description === "string" ? data.description.trim() : "";
  const publishedAt = toIsoDateOrUndefined(data.publishedAt);

  if (!title || !description || !publishedAt) {
    return null;
  }

  const slug = normalizeSlug(absoluteFilePath);
  const stats = readingTime(content);

  return {
    slug,
    url: `/blog/${slug}`,
    title,
    description,
    publishedAt,
    updatedAt: toIsoDateOrUndefined(data.updatedAt),
    author: typeof data.author === "string" ? data.author.trim() : undefined,
    image: typeof data.image === "string" ? data.image.trim() : undefined,
    tags: toTagList(data.tags),
    draft: data.draft === true,
    readingTime: stats.text,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    body: content,
  };
};

const isPublishedPost = (post: BlogPost) => {
  if (post.draft) return false;
  return toTimestamp(post.publishedAt) <= Date.now();
};

export const getAllBlogPosts = cache(async () => {
  try {
    const files = await walkMdxFiles(BLOG_CONTENT_DIR);
    const posts = await Promise.all(files.map((filePath) => readBlogPostFromFile(filePath)));
    return posts
      .filter((post): post is BlogPost => Boolean(post))
      .sort((a, b) => toTimestamp(b.publishedAt) - toTimestamp(a.publishedAt));
  } catch {
    return [];
  }
});

export const getAllPublishedPosts = cache(async () => {
  const posts = await getAllBlogPosts();
  return posts.filter(isPublishedPost);
});

export const getPostBySlug = async (slug: string) => {
  const posts = await getAllPublishedPosts();
  return posts.find((post) => post.slug === slug);
};

export const getAllBlogSlugs = async () => {
  const posts = await getAllPublishedPosts();
  return posts.map((post) => post.slug);
};

export const formatBlogDate = (value: string) =>
  new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
