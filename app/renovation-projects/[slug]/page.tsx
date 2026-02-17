import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ProjectDetailClient } from "@/components/route-clients";
import projectSlugData from "@/generated/project-slugs.json";
import { projects, fetchProjects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { generateBreadcrumbSchema, generateProjectSchema } from "@/lib/structured-data";
import { buildMetadata, titleFromSlug, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { SITE_NAME } from "@/config/seo";

type PageProps = {
  params: {
    slug: string;
  };
};

const fallbackDescription = (slug: string) =>
  `${titleFromSlug(
    slug,
  )} renovations case study on the Gold Coast by Concept Design Construct, including planning outcomes, layout improvements, and finish direction.`;

const findStaticProject = (slug: string) =>
  projects.find((project) => project.slug === slug || project.name.toLowerCase().replace(/\s+/g, "-") === slug);
const DEFAULT_PROJECT_TIMESTAMP = "2024-01-15T00:00:00.000Z";

const normalizeIsoDate = (value?: string | null) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const publishedTimeFromYear = (year?: string | null) => {
  if (!year || !/^\d{4}$/.test(year)) return undefined;
  return `${year}-01-15T00:00:00.000Z`;
};

export function generateMetadata({ params }: PageProps): Metadata {
  const project = findStaticProject(params.slug);
  const categoryLabel = project ? project.category.replace("-", " ") : "home";
  const location = project?.location || "Gold Coast";
  const title = project
    ? `${project.name} | ${categoryLabel} Renovations in ${location}`
    : `${titleFromSlug(params.slug)} | Gold Coast Renovations Case Study`;
  const description = project?.description || fallbackDescription(params.slug);
  const projectPublishedTime =
    normalizeIsoDate(project?.publishedAt) ||
    publishedTimeFromYear(project?.year) ||
    DEFAULT_PROJECT_TIMESTAMP;
  const projectModifiedTime = normalizeIsoDate(project?.modifiedAt) || projectPublishedTime;
  const projectAuthor = project?.authorName || SITE_NAME;
  const projectTags = project?.tags?.length
    ? project.tags
    : [
        "Gold Coast renovations project",
        `${location} renovations`,
        `${categoryLabel} renovations Gold Coast`,
        project?.name || titleFromSlug(params.slug),
      ];

  return buildMetadata({
    title,
    description,
    path: `/renovation-projects/${project?.slug || params.slug}`,
    image: project?.image,
    type: "article",
    keywords: projectTags,
    author: projectAuthor,
    articlePublishedTime: projectPublishedTime,
    articleModifiedTime: projectModifiedTime,
    articleTags: projectTags,
  });
}

export function generateStaticParams() {
  const slugs = Array.isArray(projectSlugData?.slugs) ? projectSlugData.slugs : [];
  return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: PageProps) {
  const allProjects = await fetchProjects();
  const project =
    allProjects.find((p) => p.slug === params.slug || p.name.toLowerCase().replace(/\s+/g, "-") === params.slug) ||
    findStaticProject(params.slug);
  const projectName = project?.name || titleFromSlug(params.slug);
  const projectDescription = project?.description || fallbackDescription(params.slug);
  const projectImage = project?.image || DEFAULT_OG_IMAGE;
  const projectLocation = project?.location || "Gold Coast";
  const projectCategory = project?.category || "whole-home";
  const projectYear = project?.year || "";
  const projectSlug = project?.slug || params.slug;
  const projectPublishedTime =
    normalizeIsoDate(project?.publishedAt) ||
    publishedTimeFromYear(project?.year) ||
    DEFAULT_PROJECT_TIMESTAMP;
  const projectModifiedTime = normalizeIsoDate(project?.modifiedAt) || projectPublishedTime;

  const projectSchema = generateProjectSchema({
    name: projectName,
    description: projectDescription,
    year: projectYear,
    location: projectLocation,
    image: projectImage,
    category: projectCategory,
    path: `/renovation-projects/${projectSlug}`,
    publishedAt: projectPublishedTime,
    modifiedAt: projectModifiedTime,
    authorName: project?.authorName || SITE_NAME,
    tags: project?.tags,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovation Projects", url: "/renovation-projects" },
    { name: projectName, url: `/renovation-projects/${projectSlug}` },
  ]);

  return (
    <>
      <JsonLd data={[projectSchema, breadcrumbSchema]} />
      <section className="sr-only">
        <h1>{`${projectName} Gold Coast Renovations Case Study`}</h1>
        <h2>{`${projectCategory.replace("-", " ")} renovations in ${projectLocation}`}</h2>
        <p>{projectDescription}</p>
      </section>
      <ProjectDetailClient initialProject={project ?? undefined} initialProjects={allProjects} />
    </>
  );
}
