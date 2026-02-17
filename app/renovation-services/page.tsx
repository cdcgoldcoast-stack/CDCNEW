import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ServicesClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateServiceCatalogSchema, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Renovations | Services for Kitchen, Bathroom & Full Home";
const pageDescription =
  "Explore Gold Coast renovations for kitchens, bathrooms, whole-home upgrades, and extensions with design-led planning and QBCC licensed delivery.";
const serviceFaqs = [
  {
    question: "Which renovation services does Concept Design Construct provide on the Gold Coast?",
    answer:
      "We deliver kitchen, bathroom, and whole-home renovation services, including planning guidance and licensed construction delivery.",
  },
  {
    question: "Do you handle renovation planning and approvals?",
    answer:
      "Yes. We help structure planning and scope early, then coordinate the right pathway for approvals when required.",
  },
  {
    question: "Can I start with one space before renovating the full home?",
    answer:
      "Yes. Many clients begin with a key area like a kitchen or bathroom, then stage additional work over time.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/renovation-services",
  keywords: [
    "Gold Coast renovation services",
    "kitchen renovation Gold Coast",
    "bathroom renovation Gold Coast",
    "whole-home renovations Gold Coast",
    "home extensions Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/renovation-services",
    name: pageTitle,
    description: pageDescription,
  });
  const serviceCatalogSchema = generateServiceCatalogSchema([
    "Kitchen Renovation Gold Coast",
    "Bathroom Renovation Gold Coast",
    "Whole-Home Renovation Gold Coast",
    "Home Extensions Gold Coast",
  ]);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovation Services", url: "/renovation-services" },
  ]);
  const faqSchema = generateFAQSchema(serviceFaqs);

  return (
    <>
      <JsonLd data={[webPageSchema, serviceCatalogSchema, breadcrumbSchema, faqSchema]} />
      <section className="sr-only" aria-label="Services summary for search crawlers">
        <p>Gold Coast renovation service scope.</p>
        <ul>
          <li>Kitchen renovation planning and delivery focused on workflow and storage.</li>
          <li>Bathroom renovation services with durable finishes and waterproofing detail.</li>
          <li>Whole-home renovation services aligned to family lifestyle and long-term value.</li>
          <li>Extension planning support where additional living space is needed.</li>
        </ul>
        <p>
          Start with a scope consultation through <a href="/book-renovation-consultation">our renovation quote page</a> or review
          examples in the <a href="/renovation-projects">Gold Coast renovations project portfolio</a>.
        </p>
      </section>
      <ServicesClient />
    </>
  );
}
