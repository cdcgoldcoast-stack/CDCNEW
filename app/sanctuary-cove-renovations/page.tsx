import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SanctuaryCoveRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME } from "@/config/seo";

const pageTitle = "Sanctuary Cove Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Prestige renovation builders for Sanctuary Cove. Bespoke kitchen, bathroom and whole-home renovations for marina and golf course homes. QBCC licensed Gold Coast builder.";

const serviceFaqs = [
  {
    question: "Do you renovate prestige homes in Sanctuary Cove?",
    answer:
      "Yes, we specialise in high-end renovations for Sanctuary Cove's prestige properties. From marina-front residences to golf course estates, we deliver bespoke designs with premium materials and meticulous craftsmanship that meet the standards Sanctuary Cove homeowners expect.",
  },
  {
    question: "How much does a renovation cost in Sanctuary Cove?",
    answer:
      "Sanctuary Cove renovation costs typically start from $60,000 for a luxury bathroom and range to $300,000+ for comprehensive whole-home transformations. Given the calibre of homes in Sanctuary Cove, our clients often select premium stone, custom cabinetry, and designer fixtures.",
  },
  {
    question: "Can you work within Sanctuary Cove community guidelines?",
    answer:
      "Absolutely. We have experience working within Sanctuary Cove's community guidelines and approval processes. We handle all necessary approvals, coordinate with the community management team, and ensure our work meets the aesthetic standards of this exclusive estate.",
  },
  {
    question: "Do you renovate marina homes in Sanctuary Cove?",
    answer:
      "Yes, we have renovated several marina-front properties in Sanctuary Cove. We understand the importance of maximising water views, using marine-grade materials where needed, and creating seamless indoor-outdoor entertaining spaces that take advantage of the waterfront setting.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/sanctuary-cove-renovations",
  keywords: [
    "Sanctuary Cove renovations",
    "Sanctuary Cove kitchen renovation",
    "Sanctuary Cove bathroom renovation",
    "prestige renovation Sanctuary Cove",
    "Sanctuary Cove renovation builder",
    "luxury renovation Sanctuary Cove",
    "Sanctuary Cove home renovation Gold Coast",
    "marina renovation Sanctuary Cove",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/sanctuary-cove-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Sanctuary Cove Renovations", url: "/sanctuary-cove-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Sanctuary Cove renovation services summary for search crawlers">
        <p className="font-semibold">Sanctuary Cove Renovations by {SITE_NAME}</p>
        <p>
          Prestige kitchen, bathroom and whole-home renovations in Sanctuary Cove. Specialists in
          marina homes, golf course properties, and bespoke luxury design. QBCC licensed Gold Coast builder.
        </p>
        <p className="font-semibold">Our Sanctuary Cove Renovation Services:</p>
        <ul>
          <li>Kitchen renovations</li>
          <li>Bathroom renovations</li>
          <li>Whole-home renovations</li>
          <li>Marina-front home upgrades</li>
          <li>Prestige home transformations</li>
        </ul>
      </section>
      <SanctuaryCoveRenovationsClient />
    </>
  );
}
