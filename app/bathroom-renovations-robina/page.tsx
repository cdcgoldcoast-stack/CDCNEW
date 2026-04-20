import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Bathroom Renovations Robina | CD Construct";
const pageDescription =
  "Bathroom renovations in Robina by CD Construct. Family bathrooms, ensuites and powder rooms with waterproofing-led construction and quality finishes for Robina homes. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a bathroom renovation cost in Robina?",
    answer:
      "Bathroom renovation costs in Robina typically range from $28,000-$40,000 for a standard family bathroom and $40,000-$65,000+ for a luxury ensuite with premium fixtures. Robina homes often have multiple bathrooms, and we offer package pricing for renovating more than one bathroom at a time.",
  },
  {
    question: "How long does a bathroom renovation take in Robina?",
    answer:
      "Most Robina bathroom renovations take 3-5 weeks from demolition to completion. This includes waterproofing with mandatory curing time, tiling, and fixture installation. If you're renovating multiple bathrooms, we can stage the work to ensure you always have a functioning bathroom available.",
  },
  {
    question: "Can you renovate multiple bathrooms in my Robina home at once?",
    answer:
      "Yes, renovating multiple bathrooms simultaneously is more efficient and cost-effective. Many Robina families choose to renovate the main bathroom, ensuite, and powder room together. We stage the work so you always have at least one usable bathroom throughout the project.",
  },
  {
    question: "What bathroom features are popular in Robina homes?",
    answer:
      "Robina homeowners often choose spacious walk-in showers, freestanding baths, double vanities, and underfloor heating. Family bathrooms benefit from durable, low-maintenance finishes and ample storage. We design bathrooms that suit your family's needs and complement your home's style.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/bathroom-renovations-robina",
  keywords: [
    "bathroom renovation Robina",
    "Robina bathroom renovation",
    "bathroom renovations Robina",
    "bathroom builders Robina",
    "bathroom remodel Robina",
    "Robina renovation builders",
    "family bathroom renovation Robina",
    "ensuite renovation Robina",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/bathroom-renovations-robina",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bathroom Renovations", url: "/bathroom-renovations-gold-coast" },
    { name: "Robina", url: "/bathroom-renovations-robina" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = generateServiceSchema({
    name: "Bathroom Renovation Robina",
    description: pageDescription,
    path: "/bathroom-renovations-robina",
    serviceType: "Bathroom Renovation",
    areaServed: "Robina, Gold Coast",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <BathroomRenovationsClient
        pageContext={{
          breadcrumbItems: [
            { label: "Home", href: "/" },
            { label: "Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
            { label: "Robina" },
          ],
          heroEyebrow: "Robina Bathroom Builders",
          heroTitle: "Bathroom Renovations in Robina",
          heroDescription:
            "Professional bathroom renovations in Robina, from family bathrooms and ensuites to powder rooms built around quality waterproofing, durable fixtures, and layouts that support family life.",
          faqHeading: "Robina Bathroom Renovation Questions",
          faqItems: serviceFaqs,
          localFocus: {
            eyebrow: "Robina Project Fit",
            title: "Bathroom Renovations For Practical Robina Family Living",
            description:
              "Robina bathroom projects are usually about making everyday routines smoother, improving storage, and lifting tired finishes without sacrificing durability. We scope those priorities into the layout and spec from the start.",
            bullets: [
              "Custom bathroom design in Robina",
              "Waterproofing with 10-year warranty",
              "Floor and wall tiling",
              "Vanity, shower and fixture installation",
              "Full bathroom renovation project management",
            ],
            links: [
              { label: "Gold Coast Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
              { label: "Kitchen Renovations Robina", href: "/kitchen-renovations-robina" },
              { label: "Robina Renovations", href: "/robina-renovations" },
            ],
          },
          areasSectionDescription:
            "We renovate bathrooms across the Gold Coast, including Robina homes where family use, storage, and durable finishes are usually the priority.",
        }}
      />
    </>
  );
}
