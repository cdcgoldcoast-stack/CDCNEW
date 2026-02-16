import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { GetQuoteClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateContactPageSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Free Quote | Gold Coast Home Renovation Consultation";
const pageDescription =
  "Start your Gold Coast renovation with a consultation and scope discussion for kitchen, bathroom, and whole-home renovation projects.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/get-quote",
  keywords: [
    "Gold Coast renovation quote",
    "Gold Coast kitchen renovation quote",
    "Gold Coast bathroom renovation quote",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/get-quote",
    name: pageTitle,
    description: pageDescription,
  });
  const contactSchema = generateContactPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Get Quote", url: "/get-quote" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, contactSchema, breadcrumbSchema]} />
      <GetQuoteClient />
    </>
  );
}
