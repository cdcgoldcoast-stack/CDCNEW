import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { AIDesignIntroClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Renovations AI Design Generator | Preview";
const pageDescription =
  "Preview Gold Coast renovations concepts in minutes. Upload room photos, test finishes, and generate visual directions before your project planning phase.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/renovation-ai-generator/intro",
  keywords: [
    "AI renovation design Gold Coast",
    "Gold Coast renovation visual preview",
    "AI room renovation concept",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/renovation-ai-generator/intro",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovations Design Tools", url: "/renovation-design-tools" },
    { name: "Gold Coast Renovations AI Preview", url: "/renovation-ai-generator/intro" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <AIDesignIntroClient />
    </>
  );
}
