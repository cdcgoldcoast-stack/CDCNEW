import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Bathroom Renovations Southport | CD Construct";
const pageDescription =
  "Bathroom renovations in Southport by CD Construct. Modernise dated bathrooms in older homes with expert waterproofing, quality tiling and contemporary fixtures. QBCC licensed builders.";

const serviceFaqs = [
  {
    question: "How much does a bathroom renovation cost in Southport?",
    answer:
      "Bathroom renovation costs in Southport typically range from $25,000-$38,000 for a standard bathroom and $38,000-$60,000+ for a luxury ensuite. Older Southport homes may require additional work such as replumbing or asbestos removal, which we identify during our initial assessment and include in your fixed-price quote.",
  },
  {
    question: "How long does a bathroom renovation take in Southport?",
    answer:
      "Most Southport bathroom renovations take 3-6 weeks from demolition to completion. Older homes may require additional time for replumbing, electrical upgrades, or addressing asbestos. We factor these into your timeline upfront so there are no surprises during the renovation.",
  },
  {
    question: "Do older Southport bathrooms need replumbing during renovation?",
    answer:
      "Many Southport homes built before the 1990s have galvanised steel or copper plumbing that may need upgrading. We assess your existing plumbing during consultation and recommend replumbing where necessary to prevent future issues. This is included in your fixed-price quote if required.",
  },
  {
    question: "Can you modernise a small bathroom in a Southport home?",
    answer:
      "Yes, we specialise in maximising space in smaller Southport bathrooms. Clever design solutions like wall-hung vanities, recessed niches, frameless glass showers, and large format tiles can make a compact bathroom feel spacious and modern. We create 3D renders so you can visualise the transformation.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/bathroom-renovations-southport",
  noIndex: true,
  keywords: [
    "bathroom renovation Southport",
    "Southport bathroom renovation",
    "bathroom renovations Southport",
    "bathroom builders Southport",
    "bathroom remodel Southport",
    "Southport renovation builders",
    "older home bathroom renovation Southport",
    "ensuite renovation Southport",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/bathroom-renovations-southport",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bathroom Renovations", url: "/bathroom-renovations-gold-coast" },
    { name: "Southport", url: "/bathroom-renovations-southport" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bathroom Renovation Southport",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Southport, Gold Coast" },
    description: pageDescription,
    serviceType: "Bathroom Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <BathroomRenovationsClient
        pageContext={{
          breadcrumbItems: [
            { label: "Home", href: "/" },
            { label: "Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
            { label: "Southport" },
          ],
          heroEyebrow: "Southport Bathroom Builders",
          heroTitle: "Bathroom Renovations in Southport",
          heroDescription:
            "Professional bathroom renovations in Southport, specialising in modernising dated bathrooms in older homes with replumbing, asbestos-aware planning, strong waterproofing, and contemporary finishes.",
          faqHeading: "Southport Bathroom Renovation Questions",
          faqItems: serviceFaqs,
          localFocus: {
            eyebrow: "Southport Project Fit",
            title: "Bathroom Renovations That Update Older Southport Homes",
            description:
              "Southport bathroom projects often uncover ageing plumbing, older wall substrates, or asbestos-related constraints. We plan for those issues early so waterproofing, scheduling, and final selections stay under control.",
            bullets: [
              "Custom bathroom design in Southport",
              "Waterproofing with 10-year warranty",
              "Floor and wall tiling",
              "Vanity, shower and fixture installation",
              "Full bathroom renovation project management",
            ],
            links: [
              { label: "Gold Coast Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
              { label: "Southport Renovations", href: "/southport-renovations" },
            ],
          },
          areasSectionDescription:
            "We renovate bathrooms across the Gold Coast, including Southport homes and apartments that need dated wet areas modernised properly.",
        }}
      />
    </>
  );
}
