import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BroadbeachRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Broadbeach Renovations | Kitchen, Bathroom & Home | CD Construct";
const pageDescription =
  "Renovation builders in Broadbeach. Kitchen, bathroom and whole-home renovations with design-led planning. We're based in Broadbeach - your local Gold Coast builder.";

const serviceFaqs = [
  {
    question: "Do you renovate apartments in Broadbeach?",
    answer:
      "Yes, we specialise in apartment renovations throughout Broadbeach. We understand body corporate requirements, work hour restrictions, and the logistics of renovating in high-rise buildings. From compact kitchen updates to full apartment transformations, we deliver quality results that maximize space and style.",
  },
  {
    question: "How much does a renovation cost in Broadbeach?",
    answer:
      "Broadbeach renovation costs vary by property type. Apartment kitchen renovations typically range from $30,000-$60,000, bathrooms from $25,000-$45,000, and whole-home renovations from $100,000-$250,000+. We're based in Broadbeach, so our local knowledge helps us provide accurate quotes for your specific building.",
  },
  {
    question: "Do you work with body corporates in Broadbeach?",
    answer:
      "Absolutely. We regularly work with Broadbeach body corporates and understand the approval processes, insurance requirements, and working hour restrictions. We handle all necessary documentation and communications with your building manager to ensure a smooth renovation process.",
  },
  {
    question: "How long do apartment renovations take in Broadbeach?",
    answer:
      "Most Broadbeach apartment renovations take 4-8 weeks depending on scope. Kitchens typically take 4-6 weeks, bathrooms 3-5 weeks, and full apartment renovations 6-10 weeks. We work within building restrictions and coordinate access to minimize disruption to neighbours.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/broadbeach-renovations",
  keywords: [
    "Broadbeach renovations",
    "Broadbeach kitchen renovation",
    "Broadbeach bathroom renovation",
    "apartment renovation Broadbeach",
    "Broadbeach renovation builder",
    "Gold Coast apartment renovations",
    "Broadbeach home renovation",
    "kitchen renovation Broadbeach",
    "bathroom renovation Broadbeach",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/broadbeach-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Broadbeach Renovations", url: "/broadbeach-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Broadbeach renovation services summary for search crawlers">
        <h1>Broadbeach Renovations by {SITE_NAME}</h1>
        <p>
          Kitchen, bathroom and whole-home renovations in Broadbeach. Specialists in apartment 
          renovations with body corporate experience. Based in Broadbeach - your local Gold Coast builder.
        </p>
        <h2>Our Broadbeach Renovation Services:</h2>
        <ul>
          <li>Apartment kitchen renovations</li>
          <li>Apartment bathroom renovations</li>
          <li>Full apartment transformations</li>
          <li>House renovations in Broadbeach</li>
          <li>Body corporate compliant renovations</li>
          <li>Space-maximising designs for apartments</li>
        </ul>
      </section>
      <BroadbeachRenovationsClient />
    </>
  );
}
