import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SurfersParadiseRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Surfers Paradise Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Luxury apartment and penthouse renovations in Surfers Paradise. Kitchen, bathroom and whole-home transformations with body corporate expertise. Your Gold Coast high-rise renovation specialists.";

const serviceFaqs = [
  {
    question: "Do you specialise in high-rise apartment renovations in Surfers Paradise?",
    answer:
      "Yes, we are experienced high-rise renovation specialists in Surfers Paradise. We understand the unique logistics of working in towers - from service elevator bookings and materials handling to body corporate approvals and restricted work hours. We have completed renovations across many Surfers Paradise buildings.",
  },
  {
    question: "How much does an apartment renovation cost in Surfers Paradise?",
    answer:
      "Surfers Paradise apartment renovation costs depend on the scope and finishes selected. Kitchen renovations typically range from $35,000-$70,000, bathrooms from $25,000-$50,000, and full apartment renovations from $120,000-$300,000+. Penthouse and luxury fit-outs can exceed these ranges depending on specifications.",
  },
  {
    question: "Can you renovate while I rent out my Surfers Paradise apartment?",
    answer:
      "We work with many Surfers Paradise investors who want to renovate between tenancies. We can plan and schedule your renovation to fit between bookings, minimising vacancy time. A well-executed renovation in Surfers Paradise can significantly increase rental returns and property value.",
  },
  {
    question: "What body corporate requirements apply to Surfers Paradise renovations?",
    answer:
      "Surfers Paradise buildings typically require body corporate approval before renovations begin. This includes submitting plans, proof of insurance, and contractor details. Work hours are usually restricted to weekdays, and noise-generating tasks must follow building rules. We handle all of this documentation and liaison on your behalf.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/surfers-paradise-renovations",
  keywords: [
    "Surfers Paradise renovations",
    "Surfers Paradise kitchen renovation",
    "Surfers Paradise bathroom renovation",
    "apartment renovation Surfers Paradise",
    "penthouse renovation Gold Coast",
    "Surfers Paradise renovation builder",
    "high-rise renovation Gold Coast",
    "luxury apartment renovation Surfers Paradise",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/surfers-paradise-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Surfers Paradise Renovations", url: "/surfers-paradise-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <SurfersParadiseRenovationsClient />
    </>
  );
}
