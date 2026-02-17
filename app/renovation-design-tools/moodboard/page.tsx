import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { MoodboardClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Renovations Moodboard Creator | Plan Your Style";
const pageDescription =
  "Collect inspiration, curate palettes, and organise references for your Gold Coast renovations using our online moodboard creator.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/renovation-design-tools/moodboard",
  keywords: [
    "Gold Coast renovation moodboard",
    "renovation style planner Gold Coast",
    "interior renovation inspiration Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/renovation-design-tools/moodboard",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovations Design Tools", url: "/renovation-design-tools" },
    { name: "Gold Coast Renovations Moodboard Creator", url: "/renovation-design-tools/moodboard" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <MoodboardClient />
    </>
  );
}
