import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { GetQuoteClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateContactPageSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Renovations Quote | Book Your Consultation";
const pageDescription =
  "Start your Gold Coast renovations plan with a consultation and scope discussion for kitchen, bathroom, and whole-home projects.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/book-renovation-consultation",
  keywords: [
    "Gold Coast renovation quote",
    "Gold Coast kitchen renovation quote",
    "Gold Coast bathroom renovation quote",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/book-renovation-consultation",
    name: pageTitle,
    description: pageDescription,
  });
  const contactSchema = generateContactPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovations Quote", url: "/book-renovation-consultation" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, contactSchema, breadcrumbSchema]} />
      <GetQuoteClient />
    </>
  );
}
