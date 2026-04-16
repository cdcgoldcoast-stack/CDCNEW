import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { HelensvaleRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME } from "@/config/seo";

const pageTitle = "Helensvale Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Open-plan conversions for established Helensvale homes. Kitchen, bathroom and whole-home renovations for 1990s-2000s family properties. QBCC licensed Gold Coast builders.";

const serviceFaqs = [
  {
    question: "Do you renovate established homes in Helensvale?",
    answer:
      "Yes, we regularly renovate homes throughout Helensvale, from the original 1990s estates through to early 2000s properties. We understand the common layouts, construction styles, and the upgrades that make the biggest difference in Helensvale family homes.",
  },
  {
    question: "How much does a renovation cost in Helensvale?",
    answer:
      "Helensvale renovation costs typically range from $35,000 for a bathroom upgrade to $160,000+ for whole-home transformations. Many Helensvale homeowners find that updating their kitchen, opening up the living areas, and modernising bathrooms dramatically improves their home.",
  },
  {
    question: "Can you convert closed-plan Helensvale homes to open-plan?",
    answer:
      "Absolutely. Many 1990s and early 2000s Helensvale homes were built with separate rooms and closed-off kitchens. We specialise in removing walls to create the open-plan kitchen, dining, and living spaces that modern families need - while ensuring structural integrity.",
  },
  {
    question: "How close are you to Helensvale?",
    answer:
      "Our Broadbeach base is around 25 minutes from Helensvale. We regularly work in the area and know the suburb well, including homes near Westfield Helensvale, the tram corridor, and the established estates throughout the suburb.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/helensvale-renovations",
  keywords: [
    "Helensvale renovations",
    "Helensvale kitchen renovation",
    "Helensvale bathroom renovation",
    "family home renovation Helensvale",
    "Helensvale renovation builder",
    "Helensvale home renovation",
    "open plan renovation Helensvale",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/helensvale-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Helensvale Renovations", url: "/helensvale-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <HelensvaleRenovationsClient />
    </>
  );
}
