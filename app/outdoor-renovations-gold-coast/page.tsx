import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { OutdoorRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Gold Coast Outdoor Living & Deck Renovations | CD Construct";
const pageDescription =
  "Outdoor living renovations on the Gold Coast including decks, alfresco areas, outdoor kitchens & pergolas. Council-approved builds with quality materials. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does an outdoor renovation cost on the Gold Coast?",
    answer:
      "Outdoor renovation costs vary widely depending on scope. A quality timber or composite deck starts from around $15,000, alfresco areas with roofing from $25,000-$50,000, and full outdoor kitchens with entertainment areas from $40,000-$80,000+. We provide detailed fixed-price quotes after an on-site assessment of your space and requirements.",
  },
  {
    question: "How long does an outdoor renovation take?",
    answer:
      "Most outdoor renovation projects take 3-8 weeks depending on complexity. A standard deck build can be completed in 3-4 weeks, while larger projects involving alfresco areas, outdoor kitchens, and pergolas typically take 6-8 weeks. Weather can occasionally cause minor delays during the Gold Coast wet season.",
  },
  {
    question: "Do outdoor structures need council approval on the Gold Coast?",
    answer:
      "Many outdoor structures on the Gold Coast require development approval from the City of Gold Coast council, particularly roofed structures, carports, and builds close to property boundaries. We handle the entire approval process including architectural drawings, engineering, and DA/BA submissions so you don't have to.",
  },
  {
    question: "What decking materials do you recommend for the Gold Coast climate?",
    answer:
      "For the Gold Coast's subtropical climate, we recommend composite decking (such as ModWood or Trex) for low maintenance and durability, or hardwood timbers like Spotted Gum and Merbau for a natural look. Both options handle humidity, UV exposure, and coastal conditions well. We advise on the best option based on your budget and lifestyle.",
  },
  {
    question: "Can you build an outdoor kitchen on an existing deck?",
    answer:
      "In many cases, yes. We assess the existing structure to ensure it can support the additional weight of benchtops, appliances, and cabinetry. If structural upgrades are needed, we handle those as part of the project. All gas and plumbing connections are completed by licensed tradespeople.",
  },
  {
    question: "Do you build pool surrounds and decking?",
    answer:
      "Yes, pool surrounds and poolside decking are a core part of our outdoor renovation services. We use slip-resistant materials suitable for wet areas and can integrate seating, planter boxes, and shade structures into the design. All work complies with pool fencing and safety regulations.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/outdoor-renovations-gold-coast",
  keywords: [
    "outdoor renovation Gold Coast",
    "Gold Coast deck builders",
    "alfresco area Gold Coast",
    "outdoor kitchen Gold Coast",
    "pergola builders Gold Coast",
    "deck renovation Gold Coast",
    "outdoor living Gold Coast",
    "carport builders Gold Coast",
    "composite decking Gold Coast",
    "pool surrounds Gold Coast",
    "QBCC outdoor builder",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/outdoor-renovations-gold-coast",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Outdoor Renovations Gold Coast", url: "/outdoor-renovations-gold-coast" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  // Service schema for rich snippets
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Outdoor Living & Deck Renovation Gold Coast",
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
    serviceType: "Outdoor Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Outdoor renovation services summary for search crawlers">
        <h2>Gold Coast Outdoor Living & Deck Renovations by {SITE_NAME}</h2>
        <p>
          Complete outdoor renovation services including deck construction, alfresco areas,
          outdoor kitchens, pergolas, carports, and pool surrounds. Council-approved builds
          with quality materials. QBCC licensed builders serving all Gold Coast suburbs.
        </p>
        <h2>Our Outdoor Renovation Services Include:</h2>
        <ul>
          <li>Timber and composite deck construction</li>
          <li>Alfresco dining and entertainment areas</li>
          <li>Outdoor kitchen design and build</li>
          <li>Pergola and shade structure construction</li>
          <li>Carport and covered parking builds</li>
          <li>Pool surrounds and poolside decking</li>
          <li>Council approvals and engineering</li>
          <li>Weatherproof roofing and screening</li>
        </ul>
        <p>
          View our <a href="/renovation-projects">outdoor renovation portfolio</a> or
          <a href="/book-renovation-consultation">book a free consultation</a> to discuss your project.
        </p>
      </section>
      <OutdoorRenovationsClient />
    </>
  );
}
