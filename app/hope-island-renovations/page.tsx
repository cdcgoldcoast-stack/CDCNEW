import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { HopeIslandRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME } from "@/config/seo";

const pageTitle = "Hope Island Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Luxury renovation builders in Hope Island. Kitchen, bathroom and whole-home renovations for waterfront, golf course and resort-style homes. QBCC licensed Gold Coast builder.";

const serviceFaqs = [
  {
    question: "Do you renovate waterfront homes in Hope Island?",
    answer:
      "Yes, we have extensive experience renovating waterfront canal homes throughout Hope Island. We understand the premium finishes, marine-grade materials, and design considerations required for Hope Island's prestigious waterfront properties.",
  },
  {
    question: "How much does a luxury renovation cost in Hope Island?",
    answer:
      "Hope Island renovation costs typically range from $50,000 for a high-end bathroom to $250,000+ for comprehensive whole-home upgrades. Hope Island homeowners often invest in premium materials, designer kitchens, and resort-style bathrooms that match the suburb's luxury lifestyle.",
  },
  {
    question: "Can you renovate within Hope Island gated communities?",
    answer:
      "Absolutely. We regularly work within Hope Island's gated estates and understand the access requirements, community guidelines, and approval processes involved. We coordinate with body corporates and community managers to ensure a smooth renovation experience.",
  },
  {
    question: "Do you work on golf course properties in Hope Island?",
    answer:
      "Yes, we renovate homes overlooking Hope Island's golf courses. We design living spaces that frame those green views, with large windows, seamless indoor-outdoor transitions, and finishes that complement the resort-style setting Hope Island is known for.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/hope-island-renovations",
  keywords: [
    "Hope Island renovations",
    "Hope Island kitchen renovation",
    "Hope Island bathroom renovation",
    "waterfront renovation Hope Island",
    "Hope Island renovation builder",
    "luxury renovation Hope Island",
    "Hope Island home renovation Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/hope-island-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Hope Island Renovations", url: "/hope-island-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Hope Island renovation services summary for search crawlers">
        <p className="font-semibold">Hope Island Renovations by {SITE_NAME}</p>
        <p>
          Luxury kitchen, bathroom and whole-home renovations in Hope Island. Specialists in
          waterfront properties, golf course homes, and resort-style living. Based on the Gold Coast.
        </p>
        <p className="font-semibold">Our Hope Island Renovation Services:</p>
        <ul>
          <li>Kitchen renovations</li>
          <li>Bathroom renovations</li>
          <li>Whole-home renovations</li>
          <li>Waterfront home upgrades</li>
          <li>Resort-style transformations</li>
        </ul>
      </section>
      <HopeIslandRenovationsClient />
    </>
  );
}
