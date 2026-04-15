import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { CoolangattaRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Coolangatta Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Renovation builders in Coolangatta, Gold Coast. Kitchen, bathroom and whole-home renovations for coastal properties. Salt-air resistant materials and beachside design expertise.";

const serviceFaqs = [
  {
    question: "Do you use coastal-grade materials for Coolangatta renovations?",
    answer:
      "Yes, every Coolangatta renovation we undertake uses materials rated for coastal environments. This includes marine-grade stainless steel fixtures, salt-air resistant cabinetry finishes, and corrosion-proof hardware. Living this close to the beach demands materials that will stand up to the conditions without compromising on style.",
  },
  {
    question: "How much does a renovation cost in Coolangatta?",
    answer:
      "Coolangatta renovation costs vary by property type. Kitchen renovations typically range from $30,000-$60,000, bathrooms from $25,000-$50,000, and whole-home renovations from $100,000-$280,000+. Beach house and apartment renovations in Coolangatta may require coastal-grade materials, which we factor into every quote.",
  },
  {
    question: "Do you renovate apartments and beach houses in Coolangatta?",
    answer:
      "We renovate both apartments and freestanding homes across Coolangatta. For apartments, we manage body corporate requirements and building access. For older beach houses, we specialise in updating tired layouts with contemporary coastal design that captures ocean breezes and natural light.",
  },
  {
    question: "Can you handle council approvals for Coolangatta renovations?",
    answer:
      "Yes, we handle all necessary Gold Coast City Council approvals for Coolangatta renovations. Being a border town, some properties near the NSW border may have specific planning considerations. Our team manages the entire approval process so you can focus on the exciting design decisions.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/coolangatta-renovations",
  keywords: [
    "Coolangatta renovations",
    "Coolangatta kitchen renovation",
    "Coolangatta bathroom renovation",
    "coastal renovation Coolangatta",
    "Coolangatta renovation builder",
    "Gold Coast beachside renovations",
    "Coolangatta home renovation",
    "beach house renovation Coolangatta",
    "bathroom renovation Coolangatta Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/coolangatta-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Coolangatta Renovations", url: "/coolangatta-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Coolangatta renovation services summary for search crawlers">
        <p className="font-semibold">Coolangatta Renovations by {SITE_NAME}</p>
        <p>
          Kitchen, bathroom and whole-home renovations in Coolangatta, Gold Coast. Specialists in
          coastal property renovations using salt-air resistant materials. Apartments and beach house
          renovations with design-led planning.
        </p>
        <p className="font-semibold">Our Coolangatta Renovation Services:</p>
        <ul>
          <li>Kitchen renovations Coolangatta</li>
          <li>Bathroom renovations Coolangatta</li>
          <li>Whole-home renovations Coolangatta</li>
          <li>Beach house renovations</li>
          <li>Coastal apartment renovations</li>
          <li>Salt-air resistant material selection</li>
        </ul>
      </section>
      <CoolangattaRenovationsClient />
    </>
  );
}
