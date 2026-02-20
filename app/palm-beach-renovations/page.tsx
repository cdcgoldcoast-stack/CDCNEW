import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { PalmBeachRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME } from "@/config/seo";

const pageTitle = "Palm Beach Renovations | Kitchen, Bathroom & Home | CD Construct";
const pageDescription =
  "Renovation builders in Palm Beach. Kitchen, bathroom and whole-home renovations for beachside homes. Family-focused designs. QBCC licensed. Based in Broadbeach.";

const serviceFaqs = [
  {
    question: "Do you renovate homes in Palm Beach?",
    answer:
      "Yes, we regularly work in Palm Beach on everything from original fibro cottages to modern family homes. We understand the family-friendly nature of Palm Beach and design renovations that suit active lifestyles.",
  },
  {
    question: "How much does a renovation cost in Palm Beach?",
    answer:
      "Palm Beach renovation costs typically range from $40,000 for a bathroom to $180,000+ for whole-home transformations. Family homes often benefit from open-plan designs and outdoor living areas that we can incorporate into your renovation.",
  },
  {
    question: "Can you help with family-friendly designs?",
    answer:
      "Absolutely. Palm Beach is popular with families, and we design with this in mind - durable finishes, open-plan living for supervision, storage solutions, and outdoor connections for kids to play. We understand how families use their homes.",
  },
  {
    question: "Do you do outdoor living areas in Palm Beach?",
    answer:
      "Yes, we specialise in creating outdoor living spaces perfect for the Palm Beach lifestyle - covered decks, outdoor kitchens, pool areas, and secure yards that connect seamlessly with indoor living areas.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/palm-beach-renovations",
  keywords: [
    "Palm Beach renovations",
    "Palm Beach kitchen renovation",
    "Palm Beach bathroom renovation",
    "family home renovation Palm Beach",
    "Palm Beach renovation builder",
    "Palm Beach home renovation",
    "Gold Coast family renovations",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/palm-beach-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Palm Beach Renovations", url: "/palm-beach-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Palm Beach renovation services summary for search crawlers">
        <h1>Palm Beach Renovations by {SITE_NAME}</h1>
        <p>
          Kitchen, bathroom and whole-home renovations in Palm Beach. Family-focused designs 
          with durable finishes and outdoor living. Based in Broadbeach.
        </p>
      </section>
      <PalmBeachRenovationsClient />
    </>
  );
}
