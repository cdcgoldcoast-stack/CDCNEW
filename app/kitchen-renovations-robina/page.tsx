import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Kitchen Renovations Robina | CD Construct";
const pageDescription =
  "Kitchen renovations in Robina by CD Construct. Family-sized kitchen remodels with custom cabinetry, stone benchtops and modern layouts for Robina homes. QBCC licensed Gold Coast builders.";

const serviceFaqs = [
  {
    question: "How much does a kitchen renovation cost in Robina?",
    answer:
      "Kitchen renovation costs in Robina typically range from $40,000-$65,000 for a mid-range family kitchen and $65,000-$110,000+ for premium kitchens with high-end finishes. Robina homes often have generous kitchen spaces that suit open-plan entertainer&apos;s designs. We provide fixed-price quotes after a detailed consultation.",
  },
  {
    question: "How long does a kitchen renovation take in Robina?",
    answer:
      "Most Robina kitchen renovations take 4-8 weeks from demolition to handover, depending on complexity and custom elements. Robina&apos;s family homes typically have larger kitchens that may include butler&apos;s pantry additions, which can extend the timeline. We provide a detailed schedule during planning.",
  },
  {
    question: "What kitchen layouts work best for Robina homes?",
    answer:
      "Robina homes often feature spacious open-plan living, making U-shaped, L-shaped, and island kitchen layouts popular choices. Many families opt for a butler&apos;s pantry to keep the main kitchen clutter-free. We design kitchens that suit your family&apos;s lifestyle and the flow of your home.",
  },
  {
    question: "Do you handle all trades for Robina kitchen renovations?",
    answer:
      "Yes, we manage all trades including cabinetry, plumbing, electrical, tiling, benchtop templating and installation, painting, and appliance fitting. As your single point of contact, we coordinate everything from design through to handover so you don&apos;t have to chase individual tradespeople.",
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

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kitchen Renovation Robina",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Robina, Gold Coast" },
    description: pageDescription,
    serviceType: "Kitchen Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Robina kitchen renovation services for search crawlers">
        <p className="font-semibold">Kitchen Renovations in Robina by {SITE_NAME}</p>
        <p>
          Professional kitchen renovations in Robina, specialising in family-sized kitchens with modern
          open-plan layouts. From contemporary island kitchens to butler&apos;s pantry additions, we deliver
          quality craftsmanship for Robina homeowners.
        </p>
        <ul>
          <li>Custom kitchen design in Robina</li>
          <li>Kitchen cabinetry and stone benchtops</li>
          <li>Appliance integration and selection</li>
          <li>Kitchen lighting and splashbacks</li>
          <li>Full kitchen renovation project management</li>
        </ul>
        <p>
          View our <a href="/kitchen-renovations-gold-coast">Gold Coast kitchen renovations</a> or{" "}
          <a href="/robina-renovations">Robina renovations</a> for more details.
        </p>
      </section>
      <KitchenRenovationsClient />
    </>
  );
}
