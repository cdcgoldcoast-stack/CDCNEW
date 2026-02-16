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
      <section className="sr-only" aria-label="Project route index for search crawlers">
        <p>Gold Coast renovation project directory.</p>
        <p>
          Browse completed Concept Design Construct projects across kitchen, bathroom, and whole-home renovations on
          the Gold Coast.
        </p>
        <ul>
          {slugs.map((slug) => (
            <li key={slug}>
              <a href={`/renovation-projects/${slug}`}>{titleFromSlug(slug)} renovation project</a>
            </li>
          ))}
        </ul>
      </section>
      <RenovationProjectsClient />
    </>
  );
}
