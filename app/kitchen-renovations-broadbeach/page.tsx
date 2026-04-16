import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Kitchen Renovations Broadbeach | CD Construct";
const pageDescription =
  "Kitchen renovations in Broadbeach by CD Construct. Apartment and house kitchen remodels with custom cabinetry, stone benchtops and premium appliances. QBCC licensed local builders.";

const serviceFaqs = [
  {
    question: "How much does a kitchen renovation cost in Broadbeach?",
    answer:
      "Kitchen renovation costs in Broadbeach typically range from $30,000-$55,000 for apartment kitchens and $45,000-$90,000+ for freestanding homes. Broadbeach apartment kitchens often require compact, space-efficient designs that maximise storage and functionality. We provide fixed-price quotes after a detailed consultation.",
  },
  {
    question: "How long does a kitchen renovation take in Broadbeach?",
    answer:
      "Most Broadbeach kitchen renovations take 4-8 weeks from demolition to handover. Apartment kitchen renovations may require coordination with body corporate for work hours and lift access, which we manage on your behalf. We provide a detailed timeline during the planning phase.",
  },
  {
    question: "Do you renovate apartment kitchens in Broadbeach high-rises?",
    answer:
      "Yes, we specialise in Broadbeach apartment kitchen renovations. We understand body corporate requirements, restricted work hours, and the logistics of renovating in high-rise buildings. Our team coordinates lift bookings, waste removal, and noise management to ensure a smooth process.",
  },
  {
    question: "What kitchen styles work best for Broadbeach properties?",
    answer:
      "Broadbeach properties suit coastal contemporary, modern minimalist, and entertainer&apos;s kitchen designs. For beachside apartments, we recommend light colour palettes, durable surfaces that resist humidity, and layouts that maximise the views. We tailor every design to your space and lifestyle.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/kitchen-renovations-broadbeach",
  keywords: [
    "kitchen renovation Broadbeach",
    "Broadbeach kitchen renovation",
    "kitchen renovations Broadbeach",
    "kitchen builders Broadbeach",
    "kitchen remodel Broadbeach",
    "Broadbeach renovation builders",
    "apartment kitchen renovation Broadbeach",
    "custom kitchen Broadbeach",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/kitchen-renovations-broadbeach",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Kitchen Renovations", url: "/kitchen-renovations-gold-coast" },
    { name: "Broadbeach", url: "/kitchen-renovations-broadbeach" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kitchen Renovation Broadbeach",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Broadbeach, Gold Coast" },
    description: pageDescription,
    serviceType: "Kitchen Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Broadbeach kitchen renovation services for search crawlers">
        <p className="font-semibold">Kitchen Renovations in Broadbeach by {SITE_NAME}</p>
        <p>
          Professional kitchen renovations in Broadbeach, from beachside apartment kitchens to spacious
          entertainer&apos;s kitchens. We specialise in compact apartment layouts and body corporate compliant
          renovations throughout Broadbeach and the surrounding Gold Coast area.
        </p>
        <ul>
          <li>Custom kitchen design in Broadbeach</li>
          <li>Kitchen cabinetry and stone benchtops</li>
          <li>Appliance integration and selection</li>
          <li>Kitchen lighting and splashbacks</li>
          <li>Full kitchen renovation project management</li>
        </ul>
        <p>
          View our <a href="/kitchen-renovations-gold-coast">Gold Coast kitchen renovations</a> or{" "}
          <a href="/broadbeach-renovations">Broadbeach renovations</a> for more details.
        </p>
      </section>
      <KitchenRenovationsClient />
    </>
  );
}
