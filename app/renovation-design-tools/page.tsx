import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { RenovationDesignToolsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Renovations | Design Tools to Visualise Before You Build";
const pageDescription =
  "Use our design tools to preview Gold Coast renovations, compare style directions, and plan decisions before construction.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/renovation-design-tools",
  keywords: [
    "Gold Coast renovation design tools",
    "Gold Coast renovation visualiser",
    "renovation moodboard Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/renovation-design-tools",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovations Design Tools", url: "/renovation-design-tools" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <RenovationDesignToolsClient />
    </>
  );
}
