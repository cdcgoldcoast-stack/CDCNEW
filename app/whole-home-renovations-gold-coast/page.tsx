import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { WholeHomeRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Gold Coast Whole-Home Renovations | Design & Build by CD Construct";
const pageDescription =
  "Transform your entire Gold Coast home with whole-home renovations. Open-plan living, modern layouts & quality finishes. QBCC licensed builders. Free consultation.";

const serviceFaqs = [
  {
    question: "How much does a whole-home renovation cost on the Gold Coast?",
    answer:
      "Whole-home renovation costs vary significantly based on size, condition, and specification. A typical 3-4 bedroom home renovation ranges from $150,000-$300,000+. This includes structural changes, kitchen, bathrooms, flooring, electrical, and finishing. We provide detailed fixed-price quotes after design finalisation.",
  },
  {
    question: "How long does a whole-home renovation take?",
    answer:
      "Most whole-home renovations take 4-6 months from demolition to handover. This includes design and approvals (4-8 weeks), construction (3-5 months), and final finishing. Complex structural work or custom elements may extend this timeline. We provide a detailed schedule during planning.",
  },
  {
    question: "Can we live in the house during a whole-home renovation?",
    answer:
      "Usually not for full whole-home renovations. Most clients arrange alternative accommodation during construction. For staged renovations, you may be able to live in parts of the home while other areas are worked on. We can discuss phasing options during consultation.",
  },
  {
    question: "Do whole-home renovations need council approval?",
    answer:
      "Most whole-home renovations require council approval or building certification, especially if they involve structural changes, extensions, or alterations to the building footprint. We handle all approvals, documentation, and building certification as part of our service.",
  },
  {
    question: "Can you match new work to existing character features?",
    answer:
      "Absolutely. We specialise in renovations that respect your home's character while adding modern functionality. Whether it's VJ walls, timber floors, or heritage features, we carefully integrate new work to complement existing elements.",
  },
  {
    question: "Do you do extensions as part of whole-home renovations?",
    answer:
      "Yes, many whole-home renovations include extensions - adding extra bedrooms, expanding living areas, or creating indoor-outdoor flow. We can assess your block's potential and design options that maximise space and value.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/whole-home-renovations-gold-coast",
  keywords: [
    "whole home renovation Gold Coast",
    "full house renovation Gold Coast",
    "home transformation Gold Coast",
    "house renovation Gold Coast",
    "complete home renovation",
    "open plan renovation Gold Coast",
    "home extension Gold Coast",
    "renovation builder Gold Coast",
    "QBCC licensed builder",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/whole-home-renovations-gold-coast",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Whole-Home Renovations Gold Coast", url: "/whole-home-renovations-gold-coast" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Whole-Home Renovation Gold Coast",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: {
      "@type": "City",
      name: "Gold Coast",
    },
    description: pageDescription,
    serviceType: "Whole-Home Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Whole-home renovation services summary for search crawlers">
        <h1>Gold Coast Whole-Home Renovations by {SITE_NAME}</h1>
        <p>
          Complete whole-home renovation services including structural changes, kitchen, bathrooms, 
          flooring, electrical, and finishing. Transform your entire home with QBCC licensed builders.
        </p>
        <h2>Our Whole-Home Renovation Services Include:</h2>
        <ul>
          <li>Complete home design and planning</li>
          <li>Structural modifications and extensions</li>
          <li>Kitchen and bathroom renovation</li>
          <li>Open-plan living transformation</li>
          <li>Indoor-outdoor flow improvements</li>
          <li>Electrical and plumbing upgrades</li>
          <li>Flooring, painting, and finishing</li>
          <li>Project management from start to finish</li>
        </ul>
      </section>
      <WholeHomeRenovationsClient />
    </>
  );
}
