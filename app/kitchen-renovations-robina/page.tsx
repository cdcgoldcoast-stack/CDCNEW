import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Kitchen Renovations Robina | CD Construct";
const pageDescription =
  "Kitchen renovations in Robina by CD Construct. Family-sized kitchen remodels with custom cabinetry, stone benchtops and modern layouts for Robina homes. QBCC licensed Gold Coast builders.";

const serviceFaqs = [
  {
    question: "How much does a kitchen renovation cost in Robina?",
    answer:
      "Kitchen renovation costs in Robina typically range from $40,000-$65,000 for a mid-range family kitchen and $65,000-$110,000+ for premium kitchens with high-end finishes. Robina homes often have generous kitchen spaces that suit open-plan entertainer's designs. We provide fixed-price quotes after a detailed consultation.",
  },
  {
    question: "How long does a kitchen renovation take in Robina?",
    answer:
      "Most Robina kitchen renovations take 4-8 weeks from demolition to handover, depending on complexity and custom elements. Robina's family homes typically have larger kitchens that may include butler's pantry additions, which can extend the timeline. We provide a detailed schedule during planning.",
  },
  {
    question: "What kitchen layouts work best for Robina homes?",
    answer:
      "Robina homes often feature spacious open-plan living, making U-shaped, L-shaped, and island kitchen layouts popular choices. Many families opt for a butler's pantry to keep the main kitchen clutter-free. We design kitchens that suit your family's lifestyle and the flow of your home.",
  },
  {
    question: "Do you handle all trades for Robina kitchen renovations?",
    answer:
      "Yes, we manage all trades including cabinetry, plumbing, electrical, tiling, benchtop templating and installation, painting, and appliance fitting. As your single point of contact, we coordinate everything from design through to handover so you don't have to chase individual tradespeople.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/kitchen-renovations-robina",
  keywords: [
    "kitchen renovation Robina",
    "Robina kitchen renovation",
    "kitchen renovations Robina",
    "kitchen builders Robina",
    "kitchen remodel Robina",
    "Robina renovation builders",
    "family kitchen renovation Robina",
    "custom kitchen Robina",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/kitchen-renovations-robina",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Kitchen Renovations", url: "/kitchen-renovations-gold-coast" },
    { name: "Robina", url: "/kitchen-renovations-robina" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = generateServiceSchema({
    name: "Kitchen Renovation Robina",
    description: pageDescription,
    path: "/kitchen-renovations-robina",
    serviceType: "Kitchen Renovation",
    areaServed: "Robina, Gold Coast",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <KitchenRenovationsClient
        pageContext={{
          breadcrumbItems: [
            { label: "Home", href: "/" },
            { label: "Kitchen Renovations", href: "/kitchen-renovations-gold-coast" },
            { label: "Robina" },
          ],
          heroEyebrow: "Robina Kitchen Builders",
          heroTitle: "Kitchen Renovations in Robina",
          heroDescription:
            "Professional kitchen renovations in Robina, specialising in family-sized kitchens with modern open-plan layouts that upgrade builder-grade spaces into better everyday living hubs.",
          faqHeading: "Robina Kitchen Renovation Questions",
          faqItems: serviceFaqs,
          localFocus: {
            eyebrow: "Robina Project Fit",
            title: "Kitchen Renovations For Modern Robina Family Living",
            description:
              "Robina kitchens are often about improving flow, increasing storage, and making the main living space work harder for families. We plan layout changes and selections around daily use, entertaining, and clean long-term maintenance.",
            bullets: [
              "Custom kitchen design in Robina",
              "Kitchen cabinetry and stone benchtops",
              "Appliance integration and selection",
              "Kitchen lighting and splashbacks",
              "Full kitchen renovation project management",
            ],
            links: [
              { label: "Gold Coast Kitchen Renovations", href: "/kitchen-renovations-gold-coast" },
              { label: "Bathroom Renovations Robina", href: "/bathroom-renovations-robina" },
              { label: "Robina Renovations", href: "/robina-renovations" },
            ],
          },
          areasSectionDescription:
            "We renovate kitchens across the Gold Coast, including Robina homes where family use, storage, and open-plan flow usually drive the brief.",
        }}
      />
    </>
  );
}
