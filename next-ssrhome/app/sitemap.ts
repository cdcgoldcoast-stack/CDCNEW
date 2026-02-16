import type { MetadataRoute } from "next";
import projectSlugData from "@/generated/project-slugs.json";

const BASE_URL = "https://www.cdconstruct.com.au";

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.8 },
  { path: "/renovation-projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/life-stages", changeFrequency: "monthly", priority: 0.7 },
  { path: "/get-quote", changeFrequency: "monthly", priority: 0.9 },
  { path: "/project-gallery", changeFrequency: "weekly", priority: 0.7 },
  { path: "/renovation-design-tools", changeFrequency: "monthly", priority: 0.6 },
  {
    path: "/renovation-design-tools/ai-generator/intro",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/renovation-design-tools/ai-generator",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/renovation-design-tools/moodboard",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-conditions", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const projectSlugs = Array.isArray(projectSlugData?.slugs) ? projectSlugData.slugs : [];

  const baseEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const projectEntries: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${BASE_URL}/renovation-projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...baseEntries, ...projectEntries];
}
