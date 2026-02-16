import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { TermsConditionsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Terms & Conditions";
const pageDescription =
  "Review terms and conditions for using Concept Design Construct resources related to Gold Coast renovation planning, consultations, and site content.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/terms-conditions",
  keywords: ["terms and conditions", "Gold Coast renovation terms", "Concept Design Construct terms"],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/terms-conditions",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Terms & Conditions", url: "/terms-conditions" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <TermsConditionsClient />
    </>
  );
}
