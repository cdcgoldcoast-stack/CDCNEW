import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Bathroom Renovations Helensvale | CD Construct";
const pageDescription =
  "Bathroom renovations in Helensvale by CD Construct. Family bathrooms, luxury ensuites and kids&apos; bathrooms with expert waterproofing and quality finishes. QBCC licensed Gold Coast builders.";

const serviceFaqs = [
  {
    question: "How much does a bathroom renovation cost in Helensvale?",
    answer:
      "Bathroom renovation costs in Helensvale typically range from $28,000-$42,000 for a standard family bathroom and $42,000-$70,000+ for a luxury master ensuite with premium fixtures. Many Helensvale homes have multiple bathrooms, and we offer package pricing for renovating two or more bathrooms together.",
  },
  {
    question: "How long does a bathroom renovation take in Helensvale?",
    answer:
      "Most Helensvale bathroom renovations take 3-5 weeks from demolition to completion. This includes waterproofing with mandatory curing time, tiling, and fixture installation. Renovating multiple bathrooms simultaneously can be staged to ensure you always have a functioning bathroom available.",
  },
  {
    question: "What bathroom features do Helensvale families choose?",
    answer:
      "Helensvale families often choose double vanities in master ensuites, durable low-maintenance finishes for kids&apos; bathrooms, freestanding baths, spacious walk-in showers, and underfloor heating for winter comfort. We design bathrooms that balance style with practicality for busy family life.",
  },
  {
    question: "Can you create a luxury master ensuite in my Helensvale home?",
    answer:
      "Yes, luxury master ensuites are one of our specialities in Helensvale. We can expand your existing ensuite, add a freestanding bath, install double vanities, and create a walk-in shower with feature tiling. Our 3D design process lets you visualise your dream ensuite before construction begins.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/bathroom-renovations-helensvale",
  keywords: [
    "bathroom renovation Helensvale",
    "Helensvale bathroom renovation",
    "bathroom renovations Helensvale",
    "bathroom builders Helensvale",
    "bathroom remodel Helensvale",
    "Helensvale renovation builders",
    "family bathroom renovation Helensvale",
    "ensuite renovation Helensvale",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/bathroom-renovations-helensvale",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bathroom Renovations", url: "/bathroom-renovations-gold-coast" },
    { name: "Helensvale", url: "/bathroom-renovations-helensvale" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bathroom Renovation Helensvale",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Helensvale, Gold Coast" },
    description: pageDescription,
    serviceType: "Bathroom Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Helensvale bathroom renovation services for search crawlers">
        <h2>Bathroom Renovations in Helensvale by {SITE_NAME}</h2>
        <p>
          Professional bathroom renovations in Helensvale, from family bathrooms and master ensuites to
          kids&apos; bathrooms and powder rooms. We deliver quality waterproofing, premium fixtures, and
          designs tailored to Helensvale&apos;s family homes.
        </p>
        <ul>
          <li>Custom bathroom design in Helensvale</li>
          <li>Waterproofing with 10-year warranty</li>
          <li>Floor and wall tiling</li>
          <li>Vanity, shower and fixture installation</li>
          <li>Full bathroom renovation project management</li>
        </ul>
        <p>
          View our <a href="/bathroom-renovations-gold-coast">Gold Coast bathroom renovations</a> or{" "}
          <a href="/helensvale-renovations">Helensvale renovations</a> for more details.
        </p>
      </section>
      <BathroomRenovationsClient />
    </>
  );
}
