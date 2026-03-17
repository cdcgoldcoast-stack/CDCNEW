import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

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
      "Palm Beach homes suit coastal contemporary, Hamptons, and relaxed modern kitchen styles. We recommend durable, salt-air resistant finishes, light colour palettes that reflect natural light, and indoor-outdoor flow designs that connect to alfresco entertaining areas. Each kitchen is designed to complement Palm Beach&apos;s coastal lifestyle.",
  },
  {
    question: "Do you use materials suited to Palm Beach&apos;s coastal environment?",
    answer:
      "Yes, we select materials that withstand Palm Beach&apos;s coastal conditions. This includes marine-grade hardware, moisture-resistant cabinetry, engineered stone benchtops, and finishes that resist salt air corrosion. Our material selections ensure your kitchen looks great and performs well for years to come.",
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

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kitchen Renovation Palm Beach",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Palm Beach, Gold Coast" },
    description: pageDescription,
    serviceType: "Kitchen Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Palm Beach kitchen renovation services for search crawlers">
        <h2>Kitchen Renovations in Palm Beach by {SITE_NAME}</h2>
        <p>
          Professional kitchen renovations in Palm Beach, specialising in coastal kitchen designs with
          durable, salt-air resistant finishes. From beachside cottage kitchens to modern entertainer&apos;s
          kitchens, we deliver quality craftsmanship for Palm Beach homeowners.
        </p>
        <ul>
          <li>Custom kitchen design in Palm Beach</li>
          <li>Kitchen cabinetry and stone benchtops</li>
          <li>Appliance integration and selection</li>
          <li>Kitchen lighting and splashbacks</li>
          <li>Full kitchen renovation project management</li>
        </ul>
        <p>
          View our <a href="/kitchen-renovations-gold-coast">Gold Coast kitchen renovations</a> or{" "}
          <a href="/palm-beach-renovations">Palm Beach renovations</a> for more details.
        </p>
      </section>
      <KitchenRenovationsClient />
    </>
  );
}
