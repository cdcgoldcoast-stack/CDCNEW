import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Kitchen Renovations Helensvale | CD Construct";
const pageDescription =
  "Kitchen renovations in Helensvale by CD Construct. Modern family kitchen remodels with island benches, butler&apos;s pantries and open-plan layouts for Helensvale homes. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a kitchen renovation cost in Helensvale?",
    answer:
      "Kitchen renovation costs in Helensvale typically range from $40,000-$65,000 for a mid-range family kitchen and $65,000-$110,000+ for premium kitchens with stone benchtops, custom cabinetry, and butler&apos;s pantry additions. Helensvale&apos;s larger homes often allow for generous kitchen designs. We provide fixed-price quotes after consultation.",
  },
  {
    question: "How long does a kitchen renovation take in Helensvale?",
    answer:
      "Most Helensvale kitchen renovations take 5-8 weeks from demolition to handover. Larger kitchens with island benches, butler&apos;s pantries, or structural modifications may take longer. We provide a detailed timeline during the design phase so you can plan around the renovation.",
  },
  {
    question: "What kitchen designs are popular in Helensvale?",
    answer:
      "Helensvale families often choose large island kitchens with seating, butler&apos;s pantries for hidden storage, and open-plan layouts that connect to outdoor entertaining areas. Hamptons, modern contemporary, and transitional styles are all popular in the area. We tailor every design to your home and lifestyle.",
  },
  {
    question: "Can you add a butler&apos;s pantry to my Helensvale kitchen?",
    answer:
      "Yes, butler&apos;s pantry additions are one of our most popular upgrades in Helensvale. We can convert adjacent spaces, extend the kitchen footprint, or reconfigure the existing layout to accommodate a walk-in pantry. This adds valuable storage and keeps your main kitchen clutter-free for entertaining.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/kitchen-renovations-helensvale",
  noIndex: true,
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

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kitchen Renovation Helensvale",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Helensvale, Gold Coast" },
    description: pageDescription,
    serviceType: "Kitchen Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Helensvale kitchen renovation services for search crawlers">
        <p className="font-semibold">Kitchen Renovations in Helensvale by {SITE_NAME}</p>
        <p>
          Professional kitchen renovations in Helensvale, specialising in spacious family kitchens with
          island benches, butler&apos;s pantries, and open-plan layouts. We deliver quality craftsmanship
          for Helensvale&apos;s growing family community.
        </p>
        <ul>
          <li>Custom kitchen design in Helensvale</li>
          <li>Kitchen cabinetry and stone benchtops</li>
          <li>Appliance integration and selection</li>
          <li>Kitchen lighting and splashbacks</li>
          <li>Full kitchen renovation project management</li>
        </ul>
        <p>
          View our <a href="/kitchen-renovations-gold-coast">Gold Coast kitchen renovations</a> or{" "}
          <a href="/helensvale-renovations">Helensvale renovations</a> for more details.
        </p>
      </section>
      <KitchenRenovationsClient />
    </>
  );
}
