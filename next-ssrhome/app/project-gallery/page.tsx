import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ProjectGalleryClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema, absoluteUrl } from "@/lib/seo";

const pageTitle = "Gallery | Gold Coast Home Renovation Inspiration";
const pageDescription =
  "Get inspired by our Gold Coast renovation gallery with kitchen, bathroom, and living space design examples by Concept Design Construct.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/project-gallery",
  keywords: [
    "Gold Coast renovation gallery",
    "Gold Coast kitchen renovation inspiration",
    "Gold Coast bathroom renovation inspiration",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/project-gallery",
    name: pageTitle,
    description: pageDescription,
  });
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gold Coast Renovation Gallery",
    description: pageDescription,
    url: absoluteUrl("/project-gallery"),
    about: [
      { "@type": "Thing", name: "Gold Coast kitchen renovations" },
      { "@type": "Thing", name: "Gold Coast bathroom renovations" },
      { "@type": "Thing", name: "Gold Coast whole-home renovations" },
    ],
  };
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Project Gallery", url: "/project-gallery" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, collectionSchema, breadcrumbSchema]} />
      <ProjectGalleryClient />
    </>
  );
}
