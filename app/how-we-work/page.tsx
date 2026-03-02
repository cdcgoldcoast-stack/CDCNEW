import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { HowWeWorkClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "How We Work | Our 7-Step Renovation Process";
const pageDescription =
  "Discover our structured 7-step renovation process — from understanding your home to handover. Clear timelines, fixed-price contracts, and a single point of contact throughout.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/how-we-work",
  keywords: [
    "renovation process Gold Coast",
    "how home renovation works",
    "renovation steps",
    "Gold Coast builder process",
    "renovation timeline",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/how-we-work",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "How We Work", url: "/how-we-work" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <HowWeWorkClient />
    </>
  );
}
