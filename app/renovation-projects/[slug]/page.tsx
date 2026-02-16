import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ProjectDetailClient } from "@/components/route-clients";
import projectSlugData from "@/generated/project-slugs.json";
import { projects } from "@/data/projects";
import { generateBreadcrumbSchema, generateProjectSchema } from "@/lib/structured-data";
import { buildMetadata, titleFromSlug, DEFAULT_OG_IMAGE } from "@/lib/seo";

type PageProps = {
  params: {
    slug: string;
  };
};

const fallbackDescription = (slug: string) =>
  `${titleFromSlug(
    slug,
  )} renovation project on the Gold Coast by Concept Design Construct, including planning outcomes, layout improvements, and finish direction.`;

const findStaticProject = (slug: string) =>
  projects.find((project) => project.slug === slug || project.name.toLowerCase().replace(/\s+/g, "-") === slug);

export function generateMetadata({ params }: PageProps): Metadata {
  const project = findStaticProject(params.slug);
  const categoryLabel = project ? project.category.replace("-", " ") : "home";
  const location = project?.location || "Gold Coast";
  const title = project
    ? `${project.name} | ${categoryLabel} Renovation ${location}`
    : `${titleFromSlug(params.slug)} | Gold Coast Renovation Project`;
  const description = project?.description || fallbackDescription(params.slug);

  return buildMetadata({
    title,
    description,
    path: `/renovation-projects/${project?.slug || params.slug}`,
    image: project?.image,
    type: "article",
    keywords: [
      "Gold Coast renovation project",
      `${location} renovation`,
      `${categoryLabel} renovation Gold Coast`,
      project?.name || titleFromSlug(params.slug),
    ],
  });
}

export function generateStaticParams() {
  const slugs = Array.isArray(projectSlugData?.slugs) ? projectSlugData.slugs : [];
  return slugs.map((slug) => ({ slug }));
}

export default function Page({ params }: PageProps) {
  const project = findStaticProject(params.slug);
  const projectName = project?.name || titleFromSlug(params.slug);
  const projectDescription = project?.description || fallbackDescription(params.slug);
  const projectImage = project?.image || DEFAULT_OG_IMAGE;
  const projectLocation = project?.location || "Gold Coast";
  const projectCategory = project?.category || "whole-home";
  const projectYear = project?.year || "";
  const projectSlug = project?.slug || params.slug;

  const projectSchema = generateProjectSchema({
    name: projectName,
    description: projectDescription,
    year: projectYear,
    location: projectLocation,
    image: projectImage,
    category: projectCategory,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Renovation Projects", url: "/renovation-projects" },
    { name: projectName, url: `/renovation-projects/${projectSlug}` },
  ]);

  return (
    <>
      <JsonLd data={[projectSchema, breadcrumbSchema]} />
      <ProjectDetailClient />
    </>
  );
}
