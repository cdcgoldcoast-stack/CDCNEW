import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Bathroom Renovations Robina | CD Construct";
const pageDescription =
  "Bathroom renovations in Robina by CD Construct. Family bathrooms, ensuites and powder rooms with waterproofing-led construction and quality finishes for Robina homes. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a bathroom renovation cost in Robina?",
    answer:
      "Bathroom renovation costs in Robina typically range from $28,000-$40,000 for a standard family bathroom and $40,000-$65,000+ for a luxury ensuite with premium fixtures. Robina homes often have multiple bathrooms, and we offer package pricing for renovating more than one bathroom at a time.",
  },
  {
    question: "How long does a bathroom renovation take in Robina?",
    answer:
      "Most Robina bathroom renovations take 3-5 weeks from demolition to completion. This includes waterproofing with mandatory curing time, tiling, and fixture installation. If you&apos;re renovating multiple bathrooms, we can stage the work to ensure you always have a functioning bathroom available.",
  },
  {
    question: "Can you renovate multiple bathrooms in my Robina home at once?",
    answer:
      "Yes, renovating multiple bathrooms simultaneously is more efficient and cost-effective. Many Robina families choose to renovate the main bathroom, ensuite, and powder room together. We stage the work so you always have at least one usable bathroom throughout the project.",
  },
  {
    question: "What bathroom features are popular in Robina homes?",
    answer:
      "Robina homeowners often choose spacious walk-in showers, freestanding baths, double vanities, and underfloor heating. Family bathrooms benefit from durable, low-maintenance finishes and ample storage. We design bathrooms that suit your family&apos;s needs and complement your home&apos;s style.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/bathroom-renovations-robina",
  keywords: [
    "bathroom renovation Robina",
    "Robina bathroom renovation",
    "bathroom renovations Robina",
    "bathroom builders Robina",
    "bathroom remodel Robina",
    "Robina renovation builders",
    "family bathroom renovation Robina",
    "ensuite renovation Robina",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/bathroom-renovations-robina",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bathroom Renovations", url: "/bathroom-renovations-gold-coast" },
    { name: "Robina", url: "/bathroom-renovations-robina" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bathroom Renovation Robina",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Robina, Gold Coast" },
    description: pageDescription,
    serviceType: "Bathroom Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Robina bathroom renovation services for search crawlers">
        <h2>Bathroom Renovations in Robina by {SITE_NAME}</h2>
        <p>
          Professional bathroom renovations in Robina, from family bathrooms and ensuites to powder rooms.
          We specialise in quality waterproofing, premium fixtures, and designs that suit Robina&apos;s
          family-friendly lifestyle.
        </p>
        <ul>
          <li>Custom bathroom design in Robina</li>
          <li>Waterproofing with 10-year warranty</li>
          <li>Floor and wall tiling</li>
          <li>Vanity, shower and fixture installation</li>
          <li>Full bathroom renovation project management</li>
        </ul>
        <p>
          View our <a href="/bathroom-renovations-gold-coast">Gold Coast bathroom renovations</a> or{" "}
          <a href="/robina-renovations">Robina renovations</a> for more details.
        </p>
      </section>
      <BathroomRenovationsClient />
    </>
  );
}
