import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

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
      "Broadbeach properties suit coastal contemporary, modern minimalist, and entertainer's kitchen designs. For beachside apartments, we recommend light colour palettes, durable surfaces that resist humidity, and layouts that maximise the views. We tailor every design to your space and lifestyle.",
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

  const serviceSchema = generateServiceSchema({
    name: "Kitchen Renovation Broadbeach",
    description: pageDescription,
    path: "/kitchen-renovations-broadbeach",
    serviceType: "Kitchen Renovation",
    areaServed: "Broadbeach, Gold Coast",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <KitchenRenovationsClient
        pageContext={{
          breadcrumbItems: [
            { label: "Home", href: "/" },
            { label: "Kitchen Renovations", href: "/kitchen-renovations-gold-coast" },
            { label: "Broadbeach" },
          ],
          heroEyebrow: "Broadbeach Kitchen Builders",
          heroTitle: "Kitchen Renovations in Broadbeach",
          heroDescription:
            "Professional kitchen renovations in Broadbeach, from beachside apartment kitchens to spacious entertainer's kitchens. We plan around apartment access, body corporate requirements, and high-use entertaining layouts.",
          faqHeading: "Broadbeach Kitchen Renovation Questions",
          faqItems: serviceFaqs,
          localFocus: {
            eyebrow: "Broadbeach Project Fit",
            title: "Kitchen Renovations Planned For Broadbeach Apartments And Homes",
            description:
              "Broadbeach projects often need tighter coordination around access, noise, storage, and finishes that suit coastal living. We account for those constraints up front so the design and construction phases stay practical.",
            bullets: [
              "Custom kitchen design in Broadbeach",
              "Kitchen cabinetry and stone benchtops",
              "Appliance integration and selection",
              "Kitchen lighting and splashbacks",
              "Full kitchen renovation project management",
            ],
            links: [
              { label: "Gold Coast Kitchen Renovations", href: "/kitchen-renovations-gold-coast" },
              { label: "Bathroom Renovations Broadbeach", href: "/bathroom-renovations-broadbeach" },
              { label: "Broadbeach Renovations", href: "/broadbeach-renovations" },
            ],
          },
          areasSectionDescription:
            "We renovate kitchens across the Gold Coast, including Broadbeach apartments, beachside homes, and family properties in nearby suburbs.",
        }}
      />
    </>
  );
}
