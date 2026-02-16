import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { RenovationProjectsClient } from "@/components/route-clients";
import projectSlugData from "@/generated/project-slugs.json";
import { generateBreadcrumbSchema, generateItemListSchema } from "@/lib/structured-data";
import { buildMetadata, titleFromSlug, DEFAULT_OG_IMAGE, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Projects | Gold Coast Renovation Projects & Portfolio";
const pageDescription =
  "Browse our Gold Coast renovation portfolio with completed kitchen, bathroom, and whole-home transformations across key Gold Coast suburbs.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/renovation-projects",
  keywords: [
    "Gold Coast renovation projects",
    "Gold Coast renovation portfolio",
    "kitchen renovation examples Gold Coast",
    "bathroom renovation examples Gold Coast",
  ],
});

export default function Page() {
  const slugs = Array.isArray(projectSlugData?.slugs) ? projectSlugData.slugs : [];
  const itemListSchema = generateItemListSchema(
    slugs.map((slug, index) => ({
      name: titleFromSlug(slug),
      url: `/renovation-projects/${slug}`,
      image: DEFAULT_OG_IMAGE,
      position: index + 1,
    })),
  );
  const webPageSchema = generateWebPageSchema({
    path: "/renovation-projects",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Renovation Projects", url: "/renovation-projects" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, itemListSchema, breadcrumbSchema]} />
      <RenovationProjectsClient />
    </>
  );
}
