import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { MermaidBeachRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME } from "@/config/seo";

const pageTitle = "Mermaid Beach Renovations | Kitchen, Bathroom & Home | CD Construct";
const pageDescription =
  "Renovation builders in Mermaid Beach. Kitchen, bathroom and whole-home renovations for beachside homes. QBCC licensed. Based in Broadbeach - your local Gold Coast builder.";

const serviceFaqs = [
  {
    question: "Do you renovate homes in Mermaid Beach?",
    answer:
      "Yes, we regularly renovate homes throughout Mermaid Beach, from original beach shacks to modern architect-designed homes. We understand the coastal conditions and design homes that embrace the beachside lifestyle.",
  },
  {
    question: "How much does a renovation cost in Mermaid Beach?",
    answer:
      "Mermaid Beach renovation costs typically range from $50,000 for a bathroom renovation to $200,000+ for a whole-home transformation. Beachfront properties often require specialised materials and finishes to withstand salt air, which we factor into our quotes.",
  },
  {
    question: "Can you work with the coastal conditions in Mermaid Beach?",
    answer:
      "Absolutely. We understand the challenges of coastal renovating - salt air, sand, and humidity. We specify materials and finishes designed to withstand these conditions while maintaining a beautiful aesthetic that suits beachside living.",
  },
  {
    question: "Do you do outdoor living renovations in Mermaid Beach?",
    answer:
      "Yes, we specialise in creating indoor-outdoor flow that Mermaid Beach homes are famous for. This includes deck additions, outdoor kitchens, pool surrounds, and alfresco areas that connect your home to the beach lifestyle.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/mermaid-beach-renovations",
  keywords: [
    "Mermaid Beach renovations",
    "Mermaid Beach kitchen renovation",
    "Mermaid Beach bathroom renovation",
    "beach house renovation Mermaid Beach",
    "Mermaid Beach renovation builder",
    "coastal renovation Gold Coast",
    "Mermaid Beach home renovation",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/mermaid-beach-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Mermaid Beach Renovations", url: "/mermaid-beach-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Mermaid Beach renovation services summary for search crawlers">
        <h1>Mermaid Beach Renovations by {SITE_NAME}</h1>
        <p>
          Kitchen, bathroom and whole-home renovations in Mermaid Beach. Specialists in 
          coastal homes with materials designed for beachside conditions. Based in Broadbeach.
        </p>
      </section>
      <MermaidBeachRenovationsClient />
    </>
  );
}
