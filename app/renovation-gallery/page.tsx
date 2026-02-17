import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ProjectGalleryClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema, absoluteUrl } from "@/lib/seo";

const pageTitle = "Gold Coast Renovations Gallery | Kitchen, Bathroom & Home Inspiration";
const pageDescription =
  "Explore Gold Coast renovations inspiration with kitchen, bathroom, and living space design examples by Concept Design Construct.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/renovation-gallery",
  keywords: [
    "Gold Coast renovation gallery",
    "Gold Coast kitchen renovation inspiration",
    "Gold Coast bathroom renovation inspiration",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/renovation-gallery",
    name: pageTitle,
    description: pageDescription,
  });
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gold Coast Renovations Gallery",
    description: pageDescription,
    url: absoluteUrl("/renovation-gallery"),
    about: [
      { "@type": "Thing", name: "Gold Coast kitchen renovations" },
      { "@type": "Thing", name: "Gold Coast bathroom renovations" },
      { "@type": "Thing", name: "Gold Coast whole-home renovations" },
    ],
  };
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovations Gallery", url: "/renovation-gallery" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, collectionSchema, breadcrumbSchema]} />
      <section className="sr-only" aria-label="Gallery route summary for search crawlers">
        <p>Gold Coast Renovation Inspiration Gallery.</p>
        <p>
          This gallery page is for visual inspiration across kitchens, bathrooms, living rooms, and whole-home design
          direction.
        </p>
        <p>
          Looking for complete project breakdowns and outcomes? Visit{" "}
          <a href="/renovation-projects">Gold Coast renovation projects</a>.
        </p>
      </section>
      <ProjectGalleryClient />
    </>
  );
}
