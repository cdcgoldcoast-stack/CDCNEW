import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SouthportRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME } from "@/config/seo";

const pageTitle = "Southport Renovations | Kitchen, Bathroom & Home | CD Construct";
const pageDescription =
  "Renovation builders in Southport. Kitchen, bathroom and whole-home renovations for character homes and waterfront properties. QBCC licensed. Based in Broadbeach.";

const serviceFaqs = [
  {
    question: "Do you renovate homes in Southport?",
    answer:
      "Yes, we regularly work in Southport on a variety of homes - from character Queenslanders and post-war cottages to modern waterfront properties. We understand the diverse architecture and renovation needs of this historic Gold Coast suburb.",
  },
  {
    question: "How much does a renovation cost in Southport?",
    answer:
      "Southport renovation costs vary widely depending on the property type. Character home renovations typically range from $80,000-$250,000+, while modern home updates range from $50,000-$150,000. Waterfront properties may have additional considerations for materials and access.",
  },
  {
    question: "Can you renovate character homes in Southport?",
    answer:
      "Absolutely. Southport has many beautiful character homes, and we specialise in renovations that preserve their heritage features while adding modern comforts. We understand the requirements for working with Queenslanders, post-war homes, and other character properties.",
  },
  {
    question: "Do you work on waterfront properties in Southport?",
    answer:
      "Yes, we have experience renovating waterfront properties along the Broadwater and canals in Southport. We understand the specific requirements for these locations, including materials that withstand water exposure and designs that maximise water views.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/southport-renovations",
  keywords: [
    "Southport renovations",
    "Southport kitchen renovation",
    "Southport bathroom renovation",
    "character home renovation Southport",
    "Southport renovation builder",
    "Southport home renovation",
    "Queenslander renovation Southport",
    "waterfront renovation Southport",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/southport-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Southport Renovations", url: "/southport-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Southport renovation services summary for search crawlers">
        <h1>Southport Renovations by {SITE_NAME}</h1>
        <p>
          Kitchen, bathroom and whole-home renovations in Southport. Specialists in character 
          homes, Queenslanders, and waterfront properties. Based in Broadbeach.
        </p>
      </section>
      <SouthportRenovationsClient />
    </>
  );
}
