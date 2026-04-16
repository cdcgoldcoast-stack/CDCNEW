import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { MudgeerabaRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Mudgeeraba Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Renovation builders in Mudgeeraba, Gold Coast. Kitchen, bathroom and whole-home renovations for acreage properties and character homes. Design-led planning for semi-rural living.";

const serviceFaqs = [
  {
    question: "Do you renovate acreage properties in Mudgeeraba?",
    answer:
      "Yes, we have extensive experience renovating acreage homes throughout Mudgeeraba. These properties often have unique character features worth preserving, and we work closely with homeowners to modernise living spaces while respecting the original charm of the home and its connection to the surrounding landscape.",
  },
  {
    question: "How much does a renovation cost in Mudgeeraba?",
    answer:
      "Mudgeeraba renovation costs reflect the larger property sizes typical in the area. Kitchen renovations generally range from $35,000-$70,000, bathrooms from $25,000-$50,000, and whole-home renovations from $150,000-$350,000+. We provide detailed, transparent quotes based on your specific Mudgeeraba property.",
  },
  {
    question: "Can you preserve character features during a Mudgeeraba renovation?",
    answer:
      "Absolutely. Many Mudgeeraba homes have beautiful character elements like timber features, high ceilings, and unique architectural details. Our design team carefully plans around these features, blending modern functionality with the existing character that makes your Mudgeeraba home special.",
  },
  {
    question: "How do you handle renovations on larger Mudgeeraba properties?",
    answer:
      "For larger Mudgeeraba properties, we develop comprehensive renovation plans that can be staged if needed. We manage site access, coordinate trades efficiently, and plan around the unique aspects of semi-rural properties including septic systems, tank water, and rural infrastructure.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/mudgeeraba-renovations",
  keywords: [
    "Mudgeeraba renovations",
    "Mudgeeraba kitchen renovation",
    "Mudgeeraba bathroom renovation",
    "acreage renovation Mudgeeraba",
    "Mudgeeraba renovation builder",
    "Gold Coast hinterland renovations",
    "Mudgeeraba home renovation",
    "character home renovation Mudgeeraba",
    "kitchen renovation Mudgeeraba Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/mudgeeraba-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Mudgeeraba Renovations", url: "/mudgeeraba-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <MudgeerabaRenovationsClient />
    </>
  );
}
