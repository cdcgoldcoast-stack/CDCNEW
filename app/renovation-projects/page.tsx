import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { RenovationProjectsClient } from "@/components/route-clients";
import projectSlugData from "@/generated/project-slugs.json";
import { generateBreadcrumbSchema, generateItemListSchema } from "@/lib/structured-data";
import { buildMetadata, titleFromSlug, DEFAULT_OG_IMAGE, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Renovation Projects | Kitchen, Bathroom & Full Home Renovations";
const pageDescription =
  "Browse Gold Coast renovations case studies with completed kitchen, bathroom, and whole-home transformations across key Gold Coast suburbs.";

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
    { name: "Gold Coast Renovation Projects", url: "/renovation-projects" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, itemListSchema, breadcrumbSchema]} />
      <section className="sr-only" aria-label="Project route index for search crawlers">
        <p>Gold Coast Renovation Case Studies.</p>
        <p>
          This page is a case-study index of completed Concept Design Construct renovations with real project outcomes,
          suburb context, and detailed project pages.
        </p>
        <p>
          Looking for visual inspiration only? Browse the{" "}
          <a href="/renovation-gallery">Gold Coast renovation gallery</a> for room-by-room ideas.
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
