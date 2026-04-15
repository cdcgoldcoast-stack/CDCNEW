import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Bathroom Renovations Surfers Paradise | CD Construct";
const pageDescription =
  "Bathroom renovations in Surfers Paradise by CD Construct. Luxury apartment ensuites, hotel-style bathrooms and powder rooms with premium waterproofing and designer finishes. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a bathroom renovation cost in Surfers Paradise?",
    answer:
      "Bathroom renovation costs in Surfers Paradise typically range from $25,000-$45,000 for standard apartment bathrooms and $45,000-$80,000+ for luxury ensuites or penthouse bathrooms. High-rise apartments often require specialist waterproofing and body corporate coordination. We provide fixed-price quotes after consultation.",
  },
  {
    question: "How long does a bathroom renovation take in Surfers Paradise?",
    answer:
      "Most Surfers Paradise bathroom renovations take 3-6 weeks from demolition to completion. High-rise apartment renovations require coordination with building management for lift access and work hours. Our waterproofing includes mandatory curing time and flood testing before tiling begins.",
  },
  {
    question: "Can you renovate bathrooms in Surfers Paradise high-rise towers?",
    answer:
      "Yes, we regularly renovate bathrooms in Surfers Paradise high-rise towers including Q1, Soul, Hilton, and other premium buildings. We manage all body corporate approvals, coordinate material deliveries via service lifts, and work within building noise restrictions to minimise disruption.",
  },
  {
    question: "What bathroom styles are popular in Surfers Paradise apartments?",
    answer:
      "Surfers Paradise apartments suit hotel-inspired bathroom designs with frameless glass showers, wall-hung vanities, large format tiles, and premium tapware. We create spa-like bathrooms that complement the luxury lifestyle, using moisture-resistant materials suited to the coastal environment.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/bathroom-renovations-surfers-paradise",
  noIndex: true,
  keywords: [
    "bathroom renovation Surfers Paradise",
    "Surfers Paradise bathroom renovation",
    "bathroom renovations Surfers Paradise",
    "bathroom builders Surfers Paradise",
    "bathroom remodel Surfers Paradise",
    "Surfers Paradise renovation builders",
    "apartment bathroom renovation Surfers Paradise",
    "luxury bathroom Surfers Paradise",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/bathroom-renovations-surfers-paradise",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bathroom Renovations", url: "/bathroom-renovations-gold-coast" },
    { name: "Surfers Paradise", url: "/bathroom-renovations-surfers-paradise" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bathroom Renovation Surfers Paradise",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Surfers Paradise, Gold Coast" },
    description: pageDescription,
    serviceType: "Bathroom Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Surfers Paradise bathroom renovation services for search crawlers">
        <p className="font-semibold">Bathroom Renovations in Surfers Paradise by {SITE_NAME}</p>
        <p>
          Professional bathroom renovations in Surfers Paradise, from compact apartment ensuites to luxury
          penthouse bathrooms. We specialise in high-rise bathroom renovations with expert waterproofing
          and body corporate compliant processes.
        </p>
        <ul>
          <li>Custom bathroom design in Surfers Paradise</li>
          <li>Waterproofing with 10-year warranty</li>
          <li>Floor and wall tiling</li>
          <li>Vanity, shower and fixture installation</li>
          <li>Full bathroom renovation project management</li>
        </ul>
        <p>
          View our <a href="/bathroom-renovations-gold-coast">Gold Coast bathroom renovations</a> or{" "}
          <a href="/surfers-paradise-renovations">Surfers Paradise renovations</a> for more details.
        </p>
      </section>
      <BathroomRenovationsClient />
    </>
  );
}
