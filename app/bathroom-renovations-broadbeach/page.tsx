import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

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

  const serviceSchema = generateServiceSchema({
    name: "Bathroom Renovation Broadbeach",
    description: pageDescription,
    path: "/bathroom-renovations-broadbeach",
    serviceType: "Bathroom Renovation",
    areaServed: "Broadbeach, Gold Coast",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <BathroomRenovationsClient
        pageContext={{
          breadcrumbItems: [
            { label: "Home", href: "/" },
            { label: "Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
            { label: "Broadbeach" },
          ],
          heroEyebrow: "Broadbeach Bathroom Builders",
          heroTitle: "Bathroom Renovations in Broadbeach",
          heroDescription:
            "Professional bathroom renovations in Broadbeach, from compact apartment ensuites to luxurious family bathrooms. We plan around high-rise access, body corporate requirements, and waterproofing detail from day one.",
          faqHeading: "Broadbeach Bathroom Renovation Questions",
          faqItems: serviceFaqs,
          localFocus: {
            eyebrow: "Broadbeach Project Fit",
            title: "Bathroom Renovations Planned For Broadbeach Apartments And Coastal Homes",
            description:
              "Broadbeach bathroom projects often need access coordination, tighter sequencing, and waterproofing that protects adjoining apartments as well as your own space. We build those realities into the scope early.",
            bullets: [
              "Custom bathroom design in Broadbeach",
              "Waterproofing with 10-year warranty",
              "Floor and wall tiling",
              "Vanity, shower and fixture installation",
              "Full bathroom renovation project management",
            ],
            links: [
              { label: "Gold Coast Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
              { label: "Kitchen Renovations Broadbeach", href: "/kitchen-renovations-broadbeach" },
              { label: "Broadbeach Renovations", href: "/broadbeach-renovations" },
            ],
          },
          areasSectionDescription:
            "We renovate bathrooms across the Gold Coast, including Broadbeach apartments, beachside homes, and nearby family properties.",
        }}
      />
    </>
  );
}
