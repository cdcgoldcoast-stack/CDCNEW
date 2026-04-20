import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Kitchen Renovations Helensvale | CD Construct";
const pageDescription =
  "Kitchen renovations in Helensvale by CD Construct. Modern family kitchen remodels with island benches, butler's pantries and open-plan layouts for Helensvale homes. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a kitchen renovation cost in Helensvale?",
    answer:
      "Kitchen renovation costs in Helensvale typically range from $40,000-$65,000 for a mid-range family kitchen and $65,000-$110,000+ for premium kitchens with stone benchtops, custom cabinetry, and butler's pantry additions. Helensvale's larger homes often allow for generous kitchen designs. We provide fixed-price quotes after consultation.",
  },
  {
    question: "How long does a kitchen renovation take in Helensvale?",
    answer:
      "Most Helensvale kitchen renovations take 5-8 weeks from demolition to handover. Larger kitchens with island benches, butler's pantries, or structural modifications may take longer. We provide a detailed timeline during the design phase so you can plan around the renovation.",
  },
  {
    question: "What kitchen designs are popular in Helensvale?",
    answer:
      "Helensvale families often choose large island kitchens with seating, butler's pantries for hidden storage, and open-plan layouts that connect to outdoor entertaining areas. Hamptons, modern contemporary, and transitional styles are all popular in the area. We tailor every design to your home and lifestyle.",
  },
  {
    question: "Can you add a butler's pantry to my Helensvale kitchen?",
    answer:
      "Yes, butler's pantry additions are one of our most popular upgrades in Helensvale. We can convert adjacent spaces, extend the kitchen footprint, or reconfigure the existing layout to accommodate a walk-in pantry. This adds valuable storage and keeps your main kitchen clutter-free for entertaining.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/kitchen-renovations-helensvale",
  keywords: [
    "kitchen renovation Helensvale",
    "Helensvale kitchen renovation",
    "kitchen renovations Helensvale",
    "kitchen builders Helensvale",
    "kitchen remodel Helensvale",
    "Helensvale renovation builders",
    "family kitchen renovation Helensvale",
    "custom kitchen Helensvale",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/kitchen-renovations-helensvale",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Kitchen Renovations", url: "/kitchen-renovations-gold-coast" },
    { name: "Helensvale", url: "/kitchen-renovations-helensvale" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = generateServiceSchema({
    name: "Kitchen Renovation Helensvale",
    description: pageDescription,
    path: "/kitchen-renovations-helensvale",
    serviceType: "Kitchen Renovation",
    areaServed: "Helensvale, Gold Coast",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <KitchenRenovationsClient
        pageContext={{
          breadcrumbItems: [
            { label: "Home", href: "/" },
            { label: "Kitchen Renovations", href: "/kitchen-renovations-gold-coast" },
            { label: "Helensvale" },
          ],
          heroEyebrow: "Helensvale Kitchen Builders",
          heroTitle: "Kitchen Renovations in Helensvale",
          heroDescription:
            "Professional kitchen renovations in Helensvale, specialising in spacious family kitchens with island benches, butler's pantries, and open-plan layouts built for everyday use and entertaining.",
          faqHeading: "Helensvale Kitchen Renovation Questions",
          faqItems: serviceFaqs,
          localFocus: {
            eyebrow: "Helensvale Project Fit",
            title: "Kitchen Renovations For Larger Helensvale Family Homes",
            description:
              "Helensvale kitchens often have the footprint to support bigger layout moves, pantry additions, and stronger links to outdoor living. We use that flexibility to improve workflow, storage, and family function without overcomplicating the build.",
            bullets: [
              "Custom kitchen design in Helensvale",
              "Kitchen cabinetry and stone benchtops",
              "Appliance integration and selection",
              "Kitchen lighting and splashbacks",
              "Full kitchen renovation project management",
            ],
            links: [
              { label: "Gold Coast Kitchen Renovations", href: "/kitchen-renovations-gold-coast" },
              { label: "Bathroom Renovations Helensvale", href: "/bathroom-renovations-helensvale" },
              { label: "Helensvale Renovations", href: "/helensvale-renovations" },
            ],
          },
          areasSectionDescription:
            "We renovate kitchens across the Gold Coast, including Helensvale family homes and nearby suburbs where larger layouts need smarter planning.",
        }}
      />
    </>
  );
}
