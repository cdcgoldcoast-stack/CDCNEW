import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Bathroom Renovations Broadbeach | CD Construct";
const pageDescription =
  "Bathroom renovations in Broadbeach by CD Construct. Apartment ensuites, family bathrooms and powder rooms with waterproofing-led construction and premium finishes. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a bathroom renovation cost in Broadbeach?",
    answer:
      "Bathroom renovation costs in Broadbeach typically range from $25,000-$40,000 for apartment bathrooms and $35,000-$60,000+ for larger family bathrooms or luxury ensuites. Broadbeach apartments often require specialist waterproofing and body corporate coordination. We provide fixed-price quotes after consultation.",
  },
  {
    question: "How long does a bathroom renovation take in Broadbeach?",
    answer:
      "Most Broadbeach bathroom renovations take 3-5 weeks from demolition to completion. Apartment renovations may take slightly longer due to body corporate work hour restrictions and lift access scheduling. Our waterproofing includes mandatory curing time and flood testing before tiling begins.",
  },
  {
    question: "Can you renovate apartment bathrooms in Broadbeach high-rises?",
    answer:
      "Yes, we regularly renovate bathrooms in Broadbeach high-rise apartments. We manage all body corporate approvals, coordinate lift bookings for material delivery, and work within building noise restrictions. Our waterproofing exceeds standards to protect neighbouring units.",
  },
  {
    question: "What waterproofing do you provide for Broadbeach bathroom renovations?",
    answer:
      "We provide a 10-year waterproofing warranty on all Broadbeach bathroom renovations, exceeding the standard 7-year requirement. This is especially important in apartment buildings where waterproofing failures can affect units below. All work is carried out by licensed applicators with full flood testing.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/bathroom-renovations-broadbeach",
  noIndex: true,
  keywords: [
    "bathroom renovation Broadbeach",
    "Broadbeach bathroom renovation",
    "bathroom renovations Broadbeach",
    "bathroom builders Broadbeach",
    "bathroom remodel Broadbeach",
    "Broadbeach renovation builders",
    "apartment bathroom renovation Broadbeach",
    "ensuite renovation Broadbeach",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/bathroom-renovations-broadbeach",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bathroom Renovations", url: "/bathroom-renovations-gold-coast" },
    { name: "Broadbeach", url: "/bathroom-renovations-broadbeach" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bathroom Renovation Broadbeach",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Broadbeach, Gold Coast" },
    description: pageDescription,
    serviceType: "Bathroom Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Broadbeach bathroom renovation services for search crawlers">
        <p className="font-semibold">Bathroom Renovations in Broadbeach by {SITE_NAME}</p>
        <p>
          Professional bathroom renovations in Broadbeach, from compact apartment ensuites to luxurious
          family bathrooms. We specialise in high-rise apartment bathrooms with expert waterproofing and
          body corporate compliant renovations.
        </p>
        <ul>
          <li>Custom bathroom design in Broadbeach</li>
          <li>Waterproofing with 10-year warranty</li>
          <li>Floor and wall tiling</li>
          <li>Vanity, shower and fixture installation</li>
          <li>Full bathroom renovation project management</li>
        </ul>
        <p>
          View our <a href="/bathroom-renovations-gold-coast">Gold Coast bathroom renovations</a> or{" "}
          <a href="/broadbeach-renovations">Broadbeach renovations</a> for more details.
        </p>
      </section>
      <BathroomRenovationsClient />
    </>
  );
}
