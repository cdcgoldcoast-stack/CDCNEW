import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Kitchen Renovations Surfers Paradise | CD Construct";
const pageDescription =
  "Kitchen renovations in Surfers Paradise by CD Construct. High-rise apartment and penthouse kitchen remodels with luxury finishes, custom cabinetry and smart storage. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a kitchen renovation cost in Surfers Paradise?",
    answer:
      "Kitchen renovation costs in Surfers Paradise typically range from $30,000-$55,000 for standard apartment kitchens and $60,000-$120,000+ for penthouse or luxury apartment kitchens. Many Surfers Paradise kitchens require space-efficient designs that maximise storage in compact floor plans. We provide fixed-price quotes after consultation.",
  },
  {
    question: "How long does a kitchen renovation take in Surfers Paradise?",
    answer:
      "Most Surfers Paradise kitchen renovations take 4-8 weeks from demolition to handover. High-rise apartments require careful coordination with building management for lift access, work hours, and material deliveries. We handle all logistics to ensure a smooth renovation process.",
  },
  {
    question: "Do you renovate kitchens in Surfers Paradise high-rise apartments?",
    answer:
      "Yes, we specialise in high-rise kitchen renovations throughout Surfers Paradise. We understand the unique challenges of renovating in towers like Q1, Soul, and Hilton residences, including body corporate requirements, restricted work hours, and coordinating lift access for materials and waste removal.",
  },
  {
    question: "What kitchen designs suit Surfers Paradise apartments?",
    answer:
      "Surfers Paradise apartments suit modern, sleek kitchen designs that maximise natural light and ocean views. We recommend handleless cabinetry, integrated appliances, stone or engineered benchtops, and layouts that create an open flow between kitchen and living areas. Each design is tailored to your apartment&apos;s floor plan.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/kitchen-renovations-surfers-paradise",
  keywords: [
    "kitchen renovation Surfers Paradise",
    "Surfers Paradise kitchen renovation",
    "kitchen renovations Surfers Paradise",
    "kitchen builders Surfers Paradise",
    "kitchen remodel Surfers Paradise",
    "Surfers Paradise renovation builders",
    "apartment kitchen renovation Surfers Paradise",
    "penthouse kitchen Surfers Paradise",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/kitchen-renovations-surfers-paradise",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Kitchen Renovations", url: "/kitchen-renovations-gold-coast" },
    { name: "Surfers Paradise", url: "/kitchen-renovations-surfers-paradise" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kitchen Renovation Surfers Paradise",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Surfers Paradise, Gold Coast" },
    description: pageDescription,
    serviceType: "Kitchen Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Surfers Paradise kitchen renovation services for search crawlers">
        <h2>Kitchen Renovations in Surfers Paradise by {SITE_NAME}</h2>
        <p>
          Professional kitchen renovations in Surfers Paradise, from compact apartment kitchens to luxury
          penthouse entertainer&apos;s kitchens. We specialise in high-rise renovations with body corporate
          coordination and building management liaison.
        </p>
        <ul>
          <li>Custom kitchen design in Surfers Paradise</li>
          <li>Kitchen cabinetry and stone benchtops</li>
          <li>Appliance integration and selection</li>
          <li>Kitchen lighting and splashbacks</li>
          <li>Full kitchen renovation project management</li>
        </ul>
        <p>
          View our <a href="/kitchen-renovations-gold-coast">Gold Coast kitchen renovations</a> or{" "}
          <a href="/surfers-paradise-renovations">Surfers Paradise renovations</a> for more details.
        </p>
      </section>
      <KitchenRenovationsClient />
    </>
  );
}
