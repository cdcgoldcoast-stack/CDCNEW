import type { MetadataRoute } from "next";
import { fetchProjects } from "@/data/projects";
import { getAllPublishedPosts } from "@/lib/blog";

const BASE_URL = "https://www.cdconstruct.com.au";
export const revalidate = 900;

const toAbsoluteCanonicalUrl = (pathname: string) => {
  if (pathname === "/") return BASE_URL;
  return `${BASE_URL}${pathname}`;
};

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.9 },
  { path: "/renovation-projects", changeFrequency: "weekly", priority: 0.8 },
  { path: "/renovation-services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/kitchen-renovations-gold-coast", changeFrequency: "weekly", priority: 0.9 },
  { path: "/bathroom-renovations-gold-coast", changeFrequency: "weekly", priority: 0.9 },
  { path: "/whole-home-renovations-gold-coast", changeFrequency: "weekly", priority: 0.9 },
  { path: "/laundry-renovations-gold-coast", changeFrequency: "weekly", priority: 0.8 },
  { path: "/outdoor-renovations-gold-coast", changeFrequency: "weekly", priority: 0.8 },
  { path: "/apartment-renovations-gold-coast", changeFrequency: "weekly", priority: 0.8 },
  { path: "/home-extensions-gold-coast", changeFrequency: "weekly", priority: 0.8 },
  // Service + location hybrid pages — noIndex (95% duplicate of parent service pages, only FAQs differ)
  // Location pages
  // /gold-coast-renovations moved to /lp/gold-coast-renovations (noindex, excluded from sitemap)
  { path: "/broadbeach-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/mermaid-beach-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/palm-beach-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/robina-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/southport-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/burleigh-heads-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/surfers-paradise-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/bundall-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/runaway-bay-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/coomera-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/upper-coomera-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/nerang-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/mudgeeraba-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/varsity-lakes-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/coolangatta-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/currumbin-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/miami-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/hope-island-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/sanctuary-cove-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/helensvale-renovations", changeFrequency: "weekly", priority: 0.7 },
  { path: "/renovation-life-stages", changeFrequency: "monthly", priority: 0.7 },
  { path: "/book-renovation-consultation", changeFrequency: "monthly", priority: 0.9 },
  { path: "/renovation-gallery", changeFrequency: "weekly", priority: 0.7 },
  { path: "/renovation-design-tools", changeFrequency: "monthly", priority: 0.6 },
  {
    path: "/renovation-ai-generator/intro",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/renovation-ai-generator",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/renovation-design-tools/moodboard",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  { path: "/how-we-work", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/why-cdc", changeFrequency: "monthly", priority: 0.7 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.6 },
  { path: "/before-after", changeFrequency: "monthly", priority: 0.6 },
  { path: "/referral-program", changeFrequency: "monthly", priority: 0.5 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.75 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-conditions", changeFrequency: "yearly", priority: 0.3 },
];

const resolveProjectDate = (project: {
  modifiedAt?: string;
  publishedAt?: string;
}): Date => {
  if (project.modifiedAt) {
    const d = new Date(project.modifiedAt);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (project.publishedAt) {
    const d = new Date(project.publishedAt);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const projects = await fetchProjects();
  const blogPosts = await getAllPublishedPosts();

  const baseEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: toAbsoluteCanonicalUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: toAbsoluteCanonicalUrl(`/renovation-projects/${project.slug}`),
    lastModified: resolveProjectDate(project),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: toAbsoluteCanonicalUrl(post.url),
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...baseEntries, ...projectEntries, ...blogEntries];
}
