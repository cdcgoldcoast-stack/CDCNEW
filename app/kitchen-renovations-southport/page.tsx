import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Kitchen Renovations Southport | CD Construct";
const pageDescription =
  "Kitchen renovations in Southport by CD Construct. Transform dated kitchens in older homes with modern layouts, custom cabinetry and quality finishes. QBCC licensed Gold Coast builders.";

const serviceFaqs = [
  {
    question: "How much does a kitchen renovation cost in Southport?",
    answer:
      "Kitchen renovation costs in Southport typically range from $35,000-$55,000 for a mid-range kitchen and $55,000-$95,000+ for premium renovations. Many Southport homes have older kitchens that benefit from complete layout reconfiguration, which we specialise in. We provide fixed-price quotes after consultation.",
  },
  {
    question: "How long does a kitchen renovation take in Southport?",
    answer:
      "Most Southport kitchen renovations take 4-8 weeks from demolition to handover. Older Southport homes may require additional work such as updating electrical wiring, replumbing, or addressing asbestos in pre-1990 properties. We identify these issues during our initial assessment and factor them into the timeline.",
  },
  {
    question: "Do older Southport homes need extra work during kitchen renovations?",
    answer:
      "Many Southport homes built before 1990 may have outdated wiring, galvanised plumbing, or asbestos-containing materials. We conduct thorough assessments before starting and coordinate licensed asbestos removal, electrical upgrades, and replumbing as needed. This ensures your new kitchen meets current building standards.",
  },
  {
    question: "Can you open up a closed kitchen layout in a Southport home?",
    answer:
      "Yes, many Southport homes have closed-off kitchens that can be opened up to create modern open-plan living. We assess structural walls, coordinate engineering if load-bearing walls need modification, and design layouts that transform the flow of your home while maximising natural light.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/kitchen-renovations-southport",
  keywords: [
    "kitchen renovation Southport",
    "Southport kitchen renovation",
    "kitchen renovations Southport",
    "kitchen builders Southport",
    "kitchen remodel Southport",
    "Southport renovation builders",
    "older home kitchen renovation Southport",
    "custom kitchen Southport",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/kitchen-renovations-southport",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Kitchen Renovations", url: "/kitchen-renovations-gold-coast" },
    { name: "Southport", url: "/kitchen-renovations-southport" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kitchen Renovation Southport",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Southport, Gold Coast" },
    description: pageDescription,
    serviceType: "Kitchen Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Southport kitchen renovation services for search crawlers">
        <p className="font-semibold">Kitchen Renovations in Southport by {SITE_NAME}</p>
        <p>
          Professional kitchen renovations in Southport, specialising in transforming dated kitchens in
          older homes into modern open-plan designs. We handle everything from asbestos assessment to
          structural modifications and premium finishes.
        </p>
        <ul>
          <li>Custom kitchen design in Southport</li>
          <li>Kitchen cabinetry and stone benchtops</li>
          <li>Appliance integration and selection</li>
          <li>Kitchen lighting and splashbacks</li>
          <li>Full kitchen renovation project management</li>
        </ul>
        <p>
          View our <a href="/kitchen-renovations-gold-coast">Gold Coast kitchen renovations</a> or{" "}
          <a href="/southport-renovations">Southport renovations</a> for more details.
        </p>
      </section>
      <KitchenRenovationsClient />
    </>
  );
}
