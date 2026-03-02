import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BeforeAfterClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Before & After | Gold Coast Renovation Transformations";
const pageDescription =
  "See real before and after renovation transformations from Gold Coast homes. Drag the slider to compare kitchens, bathrooms, and whole-home renovations by Concept Design Construct.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/before-after",
  keywords: [
    "before after renovation Gold Coast",
    "renovation transformation",
    "kitchen before after",
    "bathroom before after",
    "home renovation results",
    "Gold Coast renovation gallery",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/before-after",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Before & After", url: "/before-after" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <BeforeAfterClient />
    </>
  );
}
