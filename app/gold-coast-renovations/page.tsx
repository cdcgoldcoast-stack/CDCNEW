import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { GoldCoastRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME } from "@/config/seo";

const pageTitle = "Gold Coast Renovations | Free Consultation | CD Construct";
const pageDescription =
  "Transform your Gold Coast home with QBCC licensed renovations. Kitchen, bathroom and whole-home experts since 2000. Book your free consultation today.";

const serviceFaqs = [
  {
    question: "How long does a kitchen renovation take on the Gold Coast?",
    answer:
      "A Gold Coast kitchen renovation typically takes approximately 2 weeks from demolition to completion when planned correctly.",
  },
  {
    question: "How long does a bathroom renovation take?",
    answer:
      "A standard bathroom renovation spans approximately 4 weeks, while luxury bathrooms can take around 6 weeks.",
  },
  {
    question: "How much does a renovation cost on the Gold Coast?",
    answer:
      "Costs range from approximately $10,000 to $150,000 or more depending on scope. We provide transparent, itemised quotes.",
  },
  {
    question: "Do I need council approval for a Gold Coast renovation?",
    answer:
      "Most internal renovations on the Gold Coast do not require council approval. Approval generally applies to extensions or changes to the building footprint.",
  },
  {
    question: "Can I live in the house during renovation?",
    answer:
      "Yes. CD Construct plans the work to minimise disruption and keeps the site tidy throughout.",
  },
  {
    question: "Is CD Construct licensed and insured?",
    answer:
      "Yes. CD Construct holds a QBCC licence and is a member of Master Builders Queensland, with full home warranty insurance on every project.",
  },
  {
    question: "Is the renovation consultation really free?",
    answer:
      "Absolutely. CD Construct visits your home, discusses your goals, and provides honest advice at no cost.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/gold-coast-renovations",
  keywords: [
    "Gold Coast renovations",
    "Gold Coast home renovation",
    "kitchen renovation Gold Coast",
    "bathroom renovation Gold Coast",
    "whole home renovation Gold Coast",
    "Gold Coast renovation builder",
    "QBCC licensed builder Gold Coast",
    "home extensions Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/gold-coast-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovations", url: "/gold-coast-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Gold Coast renovation services summary for search crawlers">
        <p className="font-semibold">Gold Coast Renovations by {SITE_NAME}</p>
        <p>
          QBCC licensed Gold Coast renovation specialists since 2000. Kitchen, bathroom and
          whole-home renovations, home extensions and apartment renovations with full home warranty
          insurance and a written workmanship guarantee.
        </p>
        <p className="font-semibold">Our Gold Coast Renovation Services:</p>
        <ul>
          <li>Kitchen renovations across the Gold Coast</li>
          <li>Bathroom renovations with waterproofing-led upgrades</li>
          <li>Whole-home renovations</li>
          <li>Home extensions with council approval support</li>
          <li>Laundry and connected spaces</li>
          <li>Body corporate compliant apartment renovations</li>
        </ul>
      </section>
      <GoldCoastRenovationsClient />
    </>
  );
}
