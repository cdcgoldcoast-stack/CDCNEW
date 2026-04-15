import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { CoomeraRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Coomera Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Renovation builders in Coomera upgrading builder-grade homes with premium finishes. Kitchen, bathroom and whole-home renovations for growing families on the Gold Coast.";

const serviceFaqs = [
  {
    question: "Can you upgrade builder-grade finishes in my Coomera home?",
    answer:
      "Absolutely. Many Coomera homes are built by volume developers with standard finishes that lack character. We transform these spaces with premium cabinetry, stone benchtops, quality tapware, and thoughtful design touches that turn your Coomera house into a personalised home. It is one of the most common renovation requests we handle in the area.",
  },
  {
    question: "How much does a renovation cost in Coomera?",
    answer:
      "Coomera renovation costs vary by scope. Kitchen upgrades from builder-grade typically range from $25,000-$55,000, bathrooms from $20,000-$40,000, and whole-home renovations from $80,000-$200,000+. Because many Coomera homes are relatively new, structural work is minimal, which helps keep costs manageable compared to older suburbs.",
  },
  {
    question: "Do I need council approval to renovate in Coomera?",
    answer:
      "Most internal renovations in Coomera - such as kitchen and bathroom upgrades - do not require council approval. However, if your Coomera renovation involves structural changes, extensions, or altering the building footprint, Gold Coast City Council approval will be needed. We assess this during your consultation and handle all necessary approvals.",
  },
  {
    question: "How long does a kitchen renovation take in Coomera?",
    answer:
      "A typical Coomera kitchen renovation takes 4-6 weeks from demolition to completion. Because most Coomera homes have relatively modern infrastructure, we can often work more efficiently than in older suburbs. We provide a detailed timeline during your Coomera consultation so you know exactly what to expect.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/coomera-renovations",
  keywords: [
    "Coomera renovations",
    "Coomera kitchen renovation",
    "Coomera bathroom renovation",
    "Coomera home renovation",
    "Coomera renovation builder",
    "builder-grade upgrade Coomera",
    "Gold Coast renovation builder",
    "kitchen renovation Coomera",
    "bathroom renovation Coomera",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/coomera-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Coomera Renovations", url: "/coomera-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Coomera renovation services summary for search crawlers">
        <p className="font-semibold">Coomera Renovations by {SITE_NAME}</p>
        <p>
          Renovation builders in Coomera upgrading builder-grade homes with premium finishes.
          Kitchen, bathroom and whole-home renovations for growing families. Specialists in
          transforming developer-standard homes into personalised living spaces on the Gold Coast.
        </p>
        <p className="font-semibold">Our Coomera Renovation Services:</p>
        <ul>
          <li>Kitchen renovations Coomera</li>
          <li>Bathroom renovations Coomera</li>
          <li>Builder-grade home upgrades</li>
          <li>Whole-home renovations Coomera</li>
          <li>Living area transformations</li>
          <li>Laundry and storage upgrades</li>
        </ul>
      </section>
      <CoomeraRenovationsClient />
    </>
  );
}
