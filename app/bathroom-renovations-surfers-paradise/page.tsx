import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

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

  const serviceSchema = generateServiceSchema({
    name: "Bathroom Renovation Surfers Paradise",
    description: pageDescription,
    path: "/bathroom-renovations-surfers-paradise",
    serviceType: "Bathroom Renovation",
    areaServed: "Surfers Paradise, Gold Coast",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <BathroomRenovationsClient
        pageContext={{
          breadcrumbItems: [
            { label: "Home", href: "/" },
            { label: "Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
            { label: "Surfers Paradise" },
          ],
          heroEyebrow: "Surfers Paradise Bathroom Builders",
          heroTitle: "Bathroom Renovations in Surfers Paradise",
          heroDescription:
            "Professional bathroom renovations in Surfers Paradise, from compact apartment ensuites to luxury penthouse bathrooms planned around high-rise logistics, waterproofing detail, and premium coastal finishes.",
          faqHeading: "Surfers Paradise Bathroom Renovation Questions",
          faqItems: serviceFaqs,
          localFocus: {
            eyebrow: "Surfers Paradise Project Fit",
            title: "Bathroom Renovations For High-Rise And Premium Coastal Apartments",
            description:
              "Surfers Paradise bathroom projects need careful access planning, body corporate compliance, and waterproofing that protects neighbouring lots as well as your own space. We build that into the scope before work starts.",
            bullets: [
              "Custom bathroom design in Surfers Paradise",
              "Waterproofing with 10-year warranty",
              "Floor and wall tiling",
              "Vanity, shower and fixture installation",
              "Full bathroom renovation project management",
            ],
            links: [
              { label: "Gold Coast Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
              { label: "Kitchen Renovations Surfers Paradise", href: "/kitchen-renovations-surfers-paradise" },
              { label: "Surfers Paradise Renovations", href: "/surfers-paradise-renovations" },
            ],
          },
          areasSectionDescription:
            "We renovate bathrooms across the Gold Coast, including Surfers Paradise apartments and premium coastal properties with more complex building logistics.",
        }}
      />
    </>
  );
}
