import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Gold Coast Bathroom Renovations | Design & Build by CD Construct";
const pageDescription =
  "Gold Coast bathroom renovations with waterproofing-led construction, quality fixtures, and timeless design. Ensuite, family bathroom & powder room specialists. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a bathroom renovation cost on the Gold Coast?",
    answer:
      "Bathroom renovation costs vary based on size and specification. A standard bathroom renovation typically starts from $25,000-$35,000, while luxury bathrooms with high-end fixtures and tiling can range from $40,000-$60,000+. We provide detailed fixed-price quotes after design finalisation.",
  },
  {
    question: "How long does a bathroom renovation take?",
    answer:
      "Most bathroom renovations take 3-5 weeks from demolition to completion. This includes waterproofing (with mandatory curing time), tiling, fixture installation, and final finishes. Complex layouts or imported materials may extend this timeframe slightly.",
  },
  {
    question: "Do bathroom renovations need council approval on the Gold Coast?",
    answer:
      "Bathroom renovations typically don't require council approval unless structural walls are being moved or the building footprint is changing. All our bathroom work includes compliant waterproofing certificates and plumbing approvals as required by Queensland law.",
  },
  {
    question: "What waterproofing warranty do you provide?",
    answer:
      "We provide a 10-year waterproofing warranty on all bathroom renovations, exceeding the standard 7-year requirement. Our waterproofing is carried out by licensed applicators and includes full flood testing before tiling begins.",
  },
  {
    question: "Can you renovate my bathroom while keeping the same layout?",
    answer:
      "Yes, many clients choose to keep the existing layout to reduce costs and simplify the project. We can transform your bathroom with new fixtures, tiles, vanity, and finishes without moving plumbing points, delivering a fresh look at a lower price point.",
  },
  {
    question: "Do you supply bathroom fixtures and tiles?",
    answer:
      "We can supply all fixtures and tiles or work with your selections. Our trade accounts with major suppliers often secure better pricing than retail. We guide you through showrooms and provide recommendations based on your style and budget.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/bathroom-renovations-gold-coast",
  keywords: [
    "bathroom renovation Gold Coast",
    "Gold Coast bathroom renovations",
    "bathroom remodelling Gold Coast",
    "bathroom design Gold Coast",
    "bathroom builders Gold Coast",
    "ensuite renovation Gold Coast",
    "luxury bathroom Gold Coast",
    "bathroom waterproofing Gold Coast",
    "bathroom makeover Gold Coast",
    "bathroom renovation cost",
    "QBCC bathroom builder",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/bathroom-renovations-gold-coast",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bathroom Renovations Gold Coast", url: "/bathroom-renovations-gold-coast" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  // Service schema for rich snippets
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bathroom Renovation Gold Coast",
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
    serviceType: "Bathroom Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Bathroom renovation services summary for search crawlers">
        <h1>Gold Coast Bathroom Renovations by {SITE_NAME}</h1>
        <p>
          Complete bathroom renovation services including design, waterproofing, tiling, fixtures, 
          and installation. Specialists in ensuites, family bathrooms, and powder rooms. 
          QBCC licensed builders serving all Gold Coast suburbs.
        </p>
        <h2>Our Bathroom Renovation Services Include:</h2>
        <ul>
          <li>Custom bathroom design and 3D visualisation</li>
          <li>Full waterproofing with 10-year warranty</li>
          <li>Floor and wall tiling</li>
          <li>Vanity, toilet, and basin installation</li>
          <li>Shower and bath installation</li>
          <li>Lighting and ventilation</li>
          <li>Plumbing and electrical work</li>
          <li>Project management from start to finish</li>
        </ul>
        <p>
          View our <a href="/renovation-projects">bathroom renovation portfolio</a> or 
          <a href="/book-renovation-consultation">book a free consultation</a> to discuss your project.
        </p>
      </section>
      <BathroomRenovationsClient />
    </>
  );
}
