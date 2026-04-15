import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BundallRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Bundall Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Renovation builders in Bundall specialising in established homes and waterfront properties. Kitchen, bathroom and whole-home renovations for Bundall families on the Gold Coast.";

const serviceFaqs = [
  {
    question: "What types of homes do you renovate in Bundall?",
    answer:
      "We renovate all property types in Bundall, from 1970s brick homes to 1990s rendered houses and waterfront properties along the Nerang River. Many Bundall homes have great bones but need modernising - we specialise in opening up dated floor plans, updating kitchens and bathrooms, and creating contemporary living spaces while preserving the character that makes Bundall homes special.",
  },
  {
    question: "How much does a home renovation cost in Bundall?",
    answer:
      "Bundall renovation costs vary depending on the scope. Kitchen renovations typically range from $35,000-$65,000, bathrooms from $25,000-$45,000, and whole-home renovations from $150,000-$350,000+. Waterfront properties in Bundall may require additional considerations for council compliance and flood-smart design, which we can advise on during your consultation.",
  },
  {
    question: "Do you handle council approvals for Bundall renovations?",
    answer:
      "Yes, we manage all Gold Coast City Council approvals required for Bundall renovations. Many Bundall homes sit on flood-overlay zones or have heritage considerations, and we understand the specific planning requirements for this area. We coordinate with council, engineers, and certifiers to ensure your Bundall renovation is fully compliant.",
  },
  {
    question: "How long does a typical Bundall home renovation take?",
    answer:
      "Most Bundall home renovations take 8-16 weeks depending on scope. A kitchen renovation is typically 5-7 weeks, a bathroom 4-6 weeks, and a whole-home renovation 12-20 weeks. Older Bundall homes sometimes reveal hidden issues like asbestos or outdated wiring, so we always allow contingency time to handle any surprises professionally.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/bundall-renovations",
  keywords: [
    "Bundall renovations",
    "Bundall kitchen renovation",
    "Bundall bathroom renovation",
    "Bundall home renovation",
    "Bundall renovation builder",
    "waterfront renovation Bundall",
    "Gold Coast home renovations",
    "renovation builder Bundall",
    "established home renovation Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/bundall-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bundall Renovations", url: "/bundall-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Bundall renovation services summary for search crawlers">
        <p className="font-semibold">Bundall Renovations by {SITE_NAME}</p>
        <p>
          Renovation builders in Bundall specialising in established homes and waterfront properties.
          Kitchen, bathroom and whole-home renovations for Bundall families on the Gold Coast.
          Expert at modernising 1970s-90s homes with open-plan living and contemporary finishes.
        </p>
        <p className="font-semibold">Our Bundall Renovation Services:</p>
        <ul>
          <li>Kitchen renovations Bundall</li>
          <li>Bathroom renovations Bundall</li>
          <li>Whole-home renovations Bundall</li>
          <li>Waterfront property renovations</li>
          <li>Established home modernisation</li>
          <li>Open-plan living conversions</li>
        </ul>
      </section>
      <BundallRenovationsClient />
    </>
  );
}
