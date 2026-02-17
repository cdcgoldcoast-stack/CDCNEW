import type { MetadataRoute } from "next";
import { fetchProjects } from "@/data/projects";

const BASE_URL = "https://www.cdconstruct.com.au";

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.8 },
  { path: "/renovation-projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/renovation-services", changeFrequency: "monthly", priority: 0.8 },
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

  const baseEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/renovation-projects/${project.slug}`,
    lastModified: resolveProjectDate(project),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...baseEntries, ...projectEntries];
}
