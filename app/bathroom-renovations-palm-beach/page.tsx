import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Bathroom Renovations Palm Beach | CD Construct";
const pageDescription =
  "Bathroom renovations in Palm Beach by CD Construct. Coastal-inspired bathrooms with expert waterproofing, quality tiling and salt-air resistant finishes for Palm Beach homes. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a bathroom renovation cost in Palm Beach?",
    answer:
      "Bathroom renovation costs in Palm Beach typically range from $26,000-$40,000 for a standard bathroom and $40,000-$65,000+ for a luxury ensuite with premium fixtures. Beachside properties may require additional waterproofing considerations due to the coastal environment. We provide fixed-price quotes after consultation.",
  },
  {
    question: "How long does a bathroom renovation take in Palm Beach?",
    answer:
      "Most Palm Beach bathroom renovations take 3-5 weeks from demolition to completion. This includes waterproofing with mandatory curing time, tiling, and fixture installation. Older beachside homes may require additional time for replumbing or structural work, which we identify during our initial assessment.",
  },
  {
    question: "What bathroom finishes work best in Palm Beach&apos;s coastal environment?",
    answer:
      "We recommend marine-grade tapware, moisture-resistant vanity materials, porcelain or natural stone tiles, and corrosion-resistant hardware for Palm Beach bathrooms. These materials withstand the salt air and humidity while maintaining their appearance. Our coastal bathroom designs combine durability with a relaxed, beachy aesthetic.",
  },
  {
    question: "Can you create a coastal-style bathroom in my Palm Beach home?",
    answer:
      "Absolutely. We specialise in coastal bathroom designs that suit Palm Beach&apos;s lifestyle. Think natural stone feature walls, timber-look vanities, soft neutral palettes, and spa-like showers with ocean-inspired tiles. We create designs that bring the outdoors in while being practical for everyday use.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/bathroom-renovations-palm-beach",
  noIndex: true,
  keywords: [
    "bathroom renovation Palm Beach",
    "Palm Beach bathroom renovation",
    "bathroom renovations Palm Beach",
    "bathroom builders Palm Beach",
    "bathroom remodel Palm Beach",
    "Palm Beach renovation builders",
    "coastal bathroom Palm Beach",
    "ensuite renovation Palm Beach",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/bathroom-renovations-palm-beach",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bathroom Renovations", url: "/bathroom-renovations-gold-coast" },
    { name: "Palm Beach", url: "/bathroom-renovations-palm-beach" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bathroom Renovation Palm Beach",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Palm Beach, Gold Coast" },
    description: pageDescription,
    serviceType: "Bathroom Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Palm Beach bathroom renovation services for search crawlers">
        <p className="font-semibold">Bathroom Renovations in Palm Beach by {SITE_NAME}</p>
        <p>
          Professional bathroom renovations in Palm Beach, specialising in coastal-inspired designs with
          salt-air resistant finishes. We deliver expert waterproofing, quality tiling, and premium
          fixtures suited to Palm Beach&apos;s beachside lifestyle.
        </p>
        <ul>
          <li>Custom bathroom design in Palm Beach</li>
          <li>Waterproofing with 10-year warranty</li>
          <li>Floor and wall tiling</li>
          <li>Vanity, shower and fixture installation</li>
          <li>Full bathroom renovation project management</li>
        </ul>
        <p>
          View our <a href="/bathroom-renovations-gold-coast">Gold Coast bathroom renovations</a> or{" "}
          <a href="/palm-beach-renovations">Palm Beach renovations</a> for more details.
        </p>
      </section>
      <BathroomRenovationsClient />
    </>
  );
}
