import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Kitchen Renovations Palm Beach | CD Construct";
const pageDescription =
  "Kitchen renovations in Palm Beach by CD Construct. Coastal kitchen designs with custom cabinetry, stone benchtops and durable finishes for Palm Beach homes. QBCC licensed Gold Coast builders.";

const serviceFaqs = [
  {
    question: "How much does a kitchen renovation cost in Palm Beach?",
    answer:
      "Kitchen renovation costs in Palm Beach typically range from $38,000-$60,000 for a mid-range kitchen and $60,000-$100,000+ for premium coastal kitchens with high-end finishes. Palm Beach properties range from beachside cottages to modern family homes, and we tailor our approach to suit each. We provide fixed-price quotes after consultation.",
  },
  {
    question: "How long does a kitchen renovation take in Palm Beach?",
    answer:
      "Most Palm Beach kitchen renovations take 4-8 weeks from demolition to handover. Older beachside homes may require additional time for electrical or plumbing upgrades. We provide a detailed timeline during the design phase and keep you informed throughout the build.",
  },
  {
    question: "What kitchen styles suit Palm Beach homes?",
    answer:
      "Palm Beach homes suit coastal contemporary, Hamptons, and relaxed modern kitchen styles. We recommend durable, salt-air resistant finishes, light colour palettes that reflect natural light, and indoor-outdoor flow designs that connect to alfresco entertaining areas. Each kitchen is designed to complement Palm Beach's coastal lifestyle.",
  },
  {
    question: "Do you use materials suited to Palm Beach's coastal environment?",
    answer:
      "Yes, we select materials that withstand Palm Beach's coastal conditions. This includes marine-grade hardware, moisture-resistant cabinetry, engineered stone benchtops, and finishes that resist salt air corrosion. Our material selections ensure your kitchen looks great and performs well for years to come.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/kitchen-renovations-palm-beach",
  keywords: [
    "kitchen renovation Palm Beach",
    "Palm Beach kitchen renovation",
    "kitchen renovations Palm Beach",
    "kitchen builders Palm Beach",
    "kitchen remodel Palm Beach",
    "Palm Beach renovation builders",
    "coastal kitchen Palm Beach",
    "custom kitchen Palm Beach",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/kitchen-renovations-palm-beach",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Kitchen Renovations", url: "/kitchen-renovations-gold-coast" },
    { name: "Palm Beach", url: "/kitchen-renovations-palm-beach" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = generateServiceSchema({
    name: "Kitchen Renovation Palm Beach",
    description: pageDescription,
    path: "/kitchen-renovations-palm-beach",
    serviceType: "Kitchen Renovation",
    areaServed: "Palm Beach, Gold Coast",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <KitchenRenovationsClient
        pageContext={{
          breadcrumbItems: [
            { label: "Home", href: "/" },
            { label: "Kitchen Renovations", href: "/kitchen-renovations-gold-coast" },
            { label: "Palm Beach" },
          ],
          heroEyebrow: "Palm Beach Kitchen Builders",
          heroTitle: "Kitchen Renovations in Palm Beach",
          heroDescription:
            "Professional kitchen renovations in Palm Beach, specialising in coastal kitchen designs with durable, salt-air resistant finishes for beachside cottages, modern homes, and relaxed entertainer's layouts.",
          faqHeading: "Palm Beach Kitchen Renovation Questions",
          faqItems: serviceFaqs,
          localFocus: {
            eyebrow: "Palm Beach Project Fit",
            title: "Kitchen Renovations Designed For Palm Beach Coastal Conditions",
            description:
              "Palm Beach projects need finishes and detailing that suit salt air, natural light, and indoor-outdoor living. We plan material choices and layout decisions around those conditions so the kitchen still works hard years after handover.",
            bullets: [
              "Custom kitchen design in Palm Beach",
              "Kitchen cabinetry and stone benchtops",
              "Appliance integration and selection",
              "Kitchen lighting and splashbacks",
              "Full kitchen renovation project management",
            ],
            links: [
              { label: "Gold Coast Kitchen Renovations", href: "/kitchen-renovations-gold-coast" },
              { label: "Bathroom Renovations Palm Beach", href: "/bathroom-renovations-palm-beach" },
              { label: "Palm Beach Renovations", href: "/palm-beach-renovations" },
            ],
          },
          areasSectionDescription:
            "We renovate kitchens across the Gold Coast, including Palm Beach homes that need coastal-ready finishes and entertaining-focused layouts.",
        }}
      />
    </>
  );
}
