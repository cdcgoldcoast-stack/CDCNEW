import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Gold Coast Kitchen Renovations | Design & Build by CD Construct";
const pageDescription =
  "Gold Coast kitchen renovations and remodelling with bespoke designs, quality craftsmanship & smooth project management. Fixed price quotes. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a kitchen renovation cost on the Gold Coast?",
    answer:
      "Kitchen renovation costs depend on scope, size, and finishes. A mid-range kitchen renovation typically starts from $35,000-$50,000, while premium kitchens with custom cabinetry and high-end appliances can range from $60,000-$100,000+. We provide fixed-price quotes after detailed consultation and design.",
  },
  {
    question: "How long does a kitchen renovation take?",
    answer:
      "Most kitchen renovations take 4-8 weeks from demolition to handover, depending on complexity and custom elements. This includes cabinetry installation, benchtops, appliances, splashback, and final touches. We provide a detailed timeline during planning so you know exactly what to expect.",
  },
  {
    question: "Do you handle council approvals for kitchen renovations?",
    answer:
      "Most kitchen renovations don't require council approval if they don't involve structural changes or plumbing relocations. If your project does need approvals, we coordinate the entire process including building certifiers and required documentation.",
  },
  {
    question: "Can I live in my home during a kitchen renovation?",
    answer:
      "Yes, though there will be disruption. We set up temporary kitchen facilities and schedule work to minimise inconvenience. Many clients choose to stay elsewhere during the most intensive phases (1-2 weeks), but it's not required.",
  },
  {
    question: "Do you provide kitchen design services?",
    answer:
      "Absolutely. Our design process includes layout optimisation, workflow planning, cabinetry design, appliance selection, and material choices. We create detailed 3D renders so you can visualise the result before construction begins.",
  },
  {
    question: "What kitchen styles do you specialise in?",
    answer:
      "We design and build all kitchen styles including modern minimalist, Hamptons, coastal, contemporary, and classic traditional. Our portfolio includes everything from compact apartment kitchens to large entertainer's kitchens.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/kitchen-renovations-gold-coast",
  keywords: [
    "kitchen renovation Gold Coast",
    "Gold Coast kitchen renovations",
    "kitchen remodelling Gold Coast",
    "kitchen design Gold Coast",
    "kitchen builders Gold Coast",
    "custom kitchens Gold Coast",
    "kitchen makeover Gold Coast",
    "modern kitchen renovation",
    "Hampton kitchen Gold Coast",
    "kitchen renovation cost",
    "QBCC kitchen builder",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/kitchen-renovations-gold-coast",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Kitchen Renovations Gold Coast", url: "/kitchen-renovations-gold-coast" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  // Service schema for rich snippets
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kitchen Renovation Gold Coast",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: {
      "@type": "City",
      name: "Gold Coast",
    },
    description: pageDescription,
    serviceType: "Kitchen Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Kitchen renovation services summary for search crawlers">
        <h1>Gold Coast Kitchen Renovations by {SITE_NAME}</h1>
        <p>
          Complete kitchen renovation services including design, cabinetry, benchtops, appliances, 
          splashbacks, and installation. QBCC licensed builders serving all Gold Coast suburbs.
        </p>
        <h2>Our Kitchen Renovation Services Include:</h2>
        <ul>
          <li>Custom kitchen design and 3D visualisation</li>
          <li>Cabinetry supply and installation</li>
          <li>Stone and engineered benchtops</li>
          <li>Appliance selection and integration</li>
          <li>Splashback tiling</li>
          <li>Lighting design and installation</li>
          <li>Plumbing and electrical work</li>
          <li>Project management from start to finish</li>
        </ul>
        <p>
          View our <a href="/renovation-projects">kitchen renovation portfolio</a> or 
          <a href="/book-renovation-consultation">book a free consultation</a> to discuss your project.
        </p>
      </section>
      <KitchenRenovationsClient />
    </>
  );
}
