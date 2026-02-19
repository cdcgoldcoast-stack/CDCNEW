import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { ProjectDetailClient } from "@/components/route-clients";
import projectSlugData from "@/generated/project-slugs.json";
import { projects, fetchProjects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { generateBreadcrumbSchema, generateProjectSchema } from "@/lib/structured-data";
import { buildMetadata, titleFromSlug, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { buildProjectMetaDescription, SITE_NAME } from "@/config/seo";

export const revalidate = 900;

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
const REMOVED_PROJECT_SLUGS = new Set([
  "coastal-modern",
  "heritage-revival",
  "retreat-house",
  "sunshine-retreat",
  "urban-oasis",
]);

const findProject = (allProjects: Project[], slug: string) =>
  allProjects.find((project) => project.slug === slug || project.name.toLowerCase().replace(/\s+/g, "-") === slug) ||
  findStaticProject(slug);

const normalizeIsoDate = (value?: string | null) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (REMOVED_PROJECT_SLUGS.has(params.slug)) {
    return buildMetadata({
      title: "Project Not Found",
      description: "This renovation project is no longer available.",
      path: "/_not-found",
      noIndex: true,
    });
  }

  const allProjects = await fetchProjects();
  const project = findProject(allProjects, params.slug);
  if (!project) {
    return buildMetadata({
      title: "Project Not Found",
      description: "This renovation project could not be found.",
      path: "/_not-found",
      noIndex: true,
    });
  }

  const categoryLabel = project.category.replace("-", " ");
  const location = project.location || "Gold Coast";
  const title = `${project.name} | ${categoryLabel} Renovations in ${location}`;
  const description = buildProjectMetaDescription({
    projectName: project.name,
    category: project.category,
    location: project.location,
    summary: project.description || fallbackDescription(params.slug),
  });
  const projectPublishedTime =
    normalizeIsoDate(project.publishedAt) || DEFAULT_PROJECT_TIMESTAMP;
  const projectModifiedTime = normalizeIsoDate(project.modifiedAt) || projectPublishedTime;
  const projectAuthor = project.authorName || SITE_NAME;
  const projectTags = project.tags?.length
    ? project.tags
    : [
        "Gold Coast renovations project",
        `${location} renovations`,
        `${categoryLabel} renovations Gold Coast`,
        project.name || titleFromSlug(params.slug),
      ];

  return buildMetadata({
    title,
    description,
    path: `/renovation-projects/${project.slug}`,
    image: project.image,
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
  const project = findProject(allProjects, params.slug);

  if (!project) {
    if (REMOVED_PROJECT_SLUGS.has(params.slug)) {
      redirect("/renovation-projects");
    }
    notFound();
  }

  const projectName = project.name;
  const projectDescription = project.description || fallbackDescription(params.slug);
  const projectImage = project.image || DEFAULT_OG_IMAGE;
  const projectLocation = project.location || "Gold Coast";
  const projectCategory = project.category || "whole-home";
  const projectSlug = project.slug;
  const projectPublishedTime =
    normalizeIsoDate(project.publishedAt) || DEFAULT_PROJECT_TIMESTAMP;
  const projectModifiedTime = normalizeIsoDate(project.modifiedAt) || projectPublishedTime;

  const projectSchema = generateProjectSchema({
    name: projectName,
    description: projectDescription,
    location: projectLocation,
    image: projectImage,
    category: projectCategory,
    path: `/renovation-projects/${projectSlug}`,
    publishedAt: projectPublishedTime,
    modifiedAt: projectModifiedTime,
    authorName: project.authorName || SITE_NAME,
    tags: project.tags,
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
        <p>{`${projectName} Gold Coast Renovations Case Study`}</p>
        <p>{`${projectCategory.replace("-", " ")} renovations in ${projectLocation}`}</p>
        <p>{projectDescription}</p>
      </section>
      <ProjectDetailClient initialProject={project} initialProjects={allProjects} />
    </>
  );
}
