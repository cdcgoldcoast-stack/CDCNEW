import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

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
    question: "What bathroom finishes work best in Palm Beach's coastal environment?",
    answer:
      "We recommend marine-grade tapware, moisture-resistant vanity materials, porcelain or natural stone tiles, and corrosion-resistant hardware for Palm Beach bathrooms. These materials withstand the salt air and humidity while maintaining their appearance. Our coastal bathroom designs combine durability with a relaxed, beachy aesthetic.",
  },
  {
    question: "Can you create a coastal-style bathroom in my Palm Beach home?",
    answer:
      "Absolutely. We specialise in coastal bathroom designs that suit Palm Beach's lifestyle. Think natural stone feature walls, timber-look vanities, soft neutral palettes, and spa-like showers with ocean-inspired tiles. We create designs that bring the outdoors in while being practical for everyday use.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/bathroom-renovations-palm-beach",
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

  const serviceSchema = generateServiceSchema({
    name: "Bathroom Renovation Palm Beach",
    description: pageDescription,
    path: "/bathroom-renovations-palm-beach",
    serviceType: "Bathroom Renovation",
    areaServed: "Palm Beach, Gold Coast",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <BathroomRenovationsClient
        pageContext={{
          breadcrumbItems: [
            { label: "Home", href: "/" },
            { label: "Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
            { label: "Palm Beach" },
          ],
          heroEyebrow: "Palm Beach Bathroom Builders",
          heroTitle: "Bathroom Renovations in Palm Beach",
          heroDescription:
            "Professional bathroom renovations in Palm Beach, specialising in coastal-inspired designs with salt-air resistant finishes, strong waterproofing detail, and fixtures suited to beachside living.",
          faqHeading: "Palm Beach Bathroom Renovation Questions",
          faqItems: serviceFaqs,
          localFocus: {
            eyebrow: "Palm Beach Project Fit",
            title: "Bathroom Renovations Built For Palm Beach Coastal Conditions",
            description:
              "Palm Beach bathrooms need material selections and detailing that suit moisture, salt air, and a relaxed coastal aesthetic. We plan for those conditions before waterproofing, tiling, and fixture decisions are locked.",
            bullets: [
              "Custom bathroom design in Palm Beach",
              "Waterproofing with 10-year warranty",
              "Floor and wall tiling",
              "Vanity, shower and fixture installation",
              "Full bathroom renovation project management",
            ],
            links: [
              { label: "Gold Coast Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
              { label: "Kitchen Renovations Palm Beach", href: "/kitchen-renovations-palm-beach" },
              { label: "Palm Beach Renovations", href: "/palm-beach-renovations" },
            ],
          },
          areasSectionDescription:
            "We renovate bathrooms across the Gold Coast, including Palm Beach homes that need coastal-ready finishes and moisture-resilient detailing.",
        }}
      />
    </>
  );
}
