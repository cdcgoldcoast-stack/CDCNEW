import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { AIDesignIntroClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "AI Design Generator | Gold Coast Renovation Preview";
const pageDescription =
  "Preview Gold Coast renovation concepts in minutes. Upload room photos, test finishes, and generate visual directions before your project planning phase.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/renovation-design-tools/ai-generator/intro",
  keywords: [
    "AI renovation design Gold Coast",
    "Gold Coast renovation visual preview",
    "AI room renovation concept",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/renovation-design-tools/ai-generator/intro",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Renovation Design Tools", url: "/renovation-design-tools" },
    { name: "AI Generator Intro", url: "/renovation-design-tools/ai-generator/intro" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <AIDesignIntroClient />
    </>
  );
}
