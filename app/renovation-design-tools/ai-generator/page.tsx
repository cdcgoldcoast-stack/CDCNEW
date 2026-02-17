import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { AIDesignGeneratorClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Renovations AI Visualiser | Design Preview";
const pageDescription =
  "Upload your room and preview Gold Coast renovations concepts while keeping your existing layout. Compare finishes and design direction before final selections.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/renovation-design-tools/ai-generator",
  keywords: [
    "Gold Coast AI renovation visualiser",
    "AI kitchen renovation preview Gold Coast",
    "AI bathroom renovation preview Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/renovation-design-tools/ai-generator",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovations Design Tools", url: "/renovation-design-tools" },
    { name: "Gold Coast Renovations AI Visualiser", url: "/renovation-design-tools/ai-generator" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <AIDesignGeneratorClient />
    </>
  );
}
