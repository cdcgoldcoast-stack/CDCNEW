import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { VarsityLakesRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Varsity Lakes Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Transform 2000s homes in Varsity Lakes with contemporary open-plan designs. Kitchen, bathroom and whole-home renovations with premium finishes. QBCC licensed builders.";

const serviceFaqs = [
  {
    question: "What kind of renovations do you do in Varsity Lakes?",
    answer:
      "We handle all renovation types in Varsity Lakes, from kitchen and bathroom upgrades to complete home transformations. Many Varsity Lakes homes are relatively modern but benefit from premium finish upgrades, open-plan conversions, and lifestyle enhancements that add significant value to your property.",
  },
  {
    question: "How much does a kitchen renovation cost in Varsity Lakes?",
    answer:
      "Kitchen renovations in Varsity Lakes typically range from $30,000-$60,000 depending on size and specifications. Many Varsity Lakes kitchens were built in the early 2000s and benefit greatly from updated cabinetry, stone benchtops, modern appliances, and improved layouts. We provide fixed-price quotes for all Varsity Lakes projects.",
  },
  {
    question: "Can you create open-plan living in my Varsity Lakes home?",
    answer:
      "Yes, open-plan conversions are one of our most popular renovations in Varsity Lakes. Many homes in the area have separated living, dining, and kitchen zones that can be opened up to create flowing, contemporary spaces. We handle structural assessments, council approvals, and the complete build process.",
  },
  {
    question: "How long does a bathroom renovation take in Varsity Lakes?",
    answer:
      "A standard bathroom renovation in Varsity Lakes takes 3-5 weeks from demolition to completion. This includes waterproofing, tiling, fixtures, and all finishing touches. We plan each Varsity Lakes project carefully to keep disruption to a minimum for your family.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/varsity-lakes-renovations",
  keywords: [
    "Varsity Lakes renovations",
    "Varsity Lakes kitchen renovation",
    "Varsity Lakes bathroom renovation",
    "Varsity Lakes home renovation",
    "renovation builder Varsity Lakes",
    "Gold Coast home upgrades",
    "Varsity Lakes renovation builder",
    "kitchen renovation Varsity Lakes Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/varsity-lakes-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Varsity Lakes Renovations", url: "/varsity-lakes-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <VarsityLakesRenovationsClient />
    </>
  );
}
