import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Bathroom Renovations Helensvale | CD Construct";
const pageDescription =
  "Bathroom renovations in Helensvale by CD Construct. Family bathrooms, luxury ensuites and kids' bathrooms with expert waterproofing and quality finishes. QBCC licensed Gold Coast builders.";

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
      "Helensvale families often choose double vanities in master ensuites, durable low-maintenance finishes for kids' bathrooms, freestanding baths, spacious walk-in showers, and underfloor heating for winter comfort. We design bathrooms that balance style with practicality for busy family life.",
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

  const serviceSchema = generateServiceSchema({
    name: "Bathroom Renovation Helensvale",
    description: pageDescription,
    path: "/bathroom-renovations-helensvale",
    serviceType: "Bathroom Renovation",
    areaServed: "Helensvale, Gold Coast",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <BathroomRenovationsClient
        pageContext={{
          breadcrumbItems: [
            { label: "Home", href: "/" },
            { label: "Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
            { label: "Helensvale" },
          ],
          heroEyebrow: "Helensvale Bathroom Builders",
          heroTitle: "Bathroom Renovations in Helensvale",
          heroDescription:
            "Professional bathroom renovations in Helensvale, from family bathrooms and master ensuites to kids' bathrooms and powder rooms built for busy everyday use and long-term durability.",
          faqHeading: "Helensvale Bathroom Renovation Questions",
          faqItems: serviceFaqs,
          localFocus: {
            eyebrow: "Helensvale Project Fit",
            title: "Bathroom Renovations For Helensvale Family Homes",
            description:
              "Helensvale bathroom briefs often focus on better family function, smarter storage, and finishes that can handle daily wear. We plan layout, waterproofing, and fixture selection around that practical reality.",
            bullets: [
              "Custom bathroom design in Helensvale",
              "Waterproofing with 10-year warranty",
              "Floor and wall tiling",
              "Vanity, shower and fixture installation",
              "Full bathroom renovation project management",
            ],
            links: [
              { label: "Gold Coast Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
              { label: "Kitchen Renovations Helensvale", href: "/kitchen-renovations-helensvale" },
              { label: "Helensvale Renovations", href: "/helensvale-renovations" },
            ],
          },
          areasSectionDescription:
            "We renovate bathrooms across the Gold Coast, including Helensvale family homes where durability, storage, and layout efficiency matter most.",
        }}
      />
    </>
  );
}
