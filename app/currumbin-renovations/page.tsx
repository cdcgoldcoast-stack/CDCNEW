import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { CurrumbinRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Currumbin Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Renovation builders in Currumbin, Gold Coast. Kitchen, bathroom and whole-home renovations for beachside family homes. Coastal-durable designs with family-friendly layouts.";

const serviceFaqs = [
  {
    question: "What types of homes do you renovate in Currumbin?",
    answer:
      "We renovate a wide range of properties throughout Currumbin, from older beach cottages and established family homes to newer builds near the creek. Many Currumbin renovations focus on creating family-friendly layouts, enhancing outdoor living spaces, and selecting coastal-grade materials suited to the beachside environment.",
  },
  {
    question: "How much does a renovation cost in Currumbin?",
    answer:
      "Currumbin renovation costs depend on your property and scope. Kitchen renovations range from $30,000-$65,000, bathrooms from $25,000-$50,000, and whole-home renovations from $120,000-$300,000+. We use coastal-rated materials for all Currumbin projects and provide transparent, fixed-price quotes.",
  },
  {
    question: "Do you design outdoor living spaces for Currumbin homes?",
    answer:
      "Yes, outdoor living is a key part of many Currumbin renovations. We design and build covered alfresco areas, outdoor kitchens, and seamless indoor-outdoor transitions that suit the relaxed beachside lifestyle. Currumbin properties are perfect for making the most of year-round outdoor entertaining.",
  },
  {
    question: "How long does a kitchen renovation take in Currumbin?",
    answer:
      "A kitchen renovation in Currumbin typically takes 4-6 weeks from demolition to completion. We plan every Currumbin project around your family schedule and work to minimise disruption. For whole-home renovations, timelines range from 10-16 weeks depending on complexity.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/currumbin-renovations",
  keywords: [
    "Currumbin renovations",
    "Currumbin kitchen renovation",
    "Currumbin bathroom renovation",
    "Currumbin home renovation",
    "renovation builder Currumbin",
    "Gold Coast beachside renovations",
    "Currumbin house renovation",
    "family home renovation Currumbin",
    "kitchen renovation Currumbin Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/currumbin-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Currumbin Renovations", url: "/currumbin-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <CurrumbinRenovationsClient />
    </>
  );
}
