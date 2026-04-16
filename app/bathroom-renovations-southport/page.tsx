import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BathroomRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Bathroom Renovations Southport | CD Construct";
const pageDescription =
  "Bathroom renovations in Southport by CD Construct. Modernise dated bathrooms in older homes with expert waterproofing, quality tiling and contemporary fixtures. QBCC licensed builders.";

const serviceFaqs = [
  {
    question: "How much does a bathroom renovation cost in Southport?",
    answer:
      "Bathroom renovation costs in Southport typically range from $25,000-$38,000 for a standard bathroom and $38,000-$60,000+ for a luxury ensuite. Older Southport homes may require additional work such as replumbing or asbestos removal, which we identify during our initial assessment and include in your fixed-price quote.",
  },
  {
    question: "How long does a bathroom renovation take in Southport?",
    answer:
      "Most Southport bathroom renovations take 3-6 weeks from demolition to completion. Older homes may require additional time for replumbing, electrical upgrades, or addressing asbestos. We factor these into your timeline upfront so there are no surprises during the renovation.",
  },
  {
    question: "Do older Southport bathrooms need replumbing during renovation?",
    answer:
      "Many Southport homes built before the 1990s have galvanised steel or copper plumbing that may need upgrading. We assess your existing plumbing during consultation and recommend replumbing where necessary to prevent future issues. This is included in your fixed-price quote if required.",
  },
  {
    question: "Can you modernise a small bathroom in a Southport home?",
    answer:
      "Yes, we specialise in maximising space in smaller Southport bathrooms. Clever design solutions like wall-hung vanities, recessed niches, frameless glass showers, and large format tiles can make a compact bathroom feel spacious and modern. We create 3D renders so you can visualise the transformation.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/bathroom-renovations-southport",
  keywords: [
    "bathroom renovation Southport",
    "Southport bathroom renovation",
    "bathroom renovations Southport",
    "bathroom builders Southport",
    "bathroom remodel Southport",
    "Southport renovation builders",
    "older home bathroom renovation Southport",
    "ensuite renovation Southport",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/bathroom-renovations-southport",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bathroom Renovations", url: "/bathroom-renovations-gold-coast" },
    { name: "Southport", url: "/bathroom-renovations-southport" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bathroom Renovation Southport",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: { "@type": "Place", name: "Southport, Gold Coast" },
    description: pageDescription,
    serviceType: "Bathroom Renovation",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <section className="sr-only" aria-label="Southport bathroom renovation services for search crawlers">
        <p className="font-semibold">Bathroom Renovations in Southport by {SITE_NAME}</p>
        <p>
          Professional bathroom renovations in Southport, specialising in modernising dated bathrooms in
          older homes. We handle replumbing, asbestos assessment, expert waterproofing, and deliver
          contemporary bathroom designs that transform your space.
        </p>
        <ul>
          <li>Custom bathroom design in Southport</li>
          <li>Waterproofing with 10-year warranty</li>
          <li>Floor and wall tiling</li>
          <li>Vanity, shower and fixture installation</li>
          <li>Full bathroom renovation project management</li>
        </ul>
        <p>
          View our <a href="/bathroom-renovations-gold-coast">Gold Coast bathroom renovations</a> or{" "}
          <a href="/southport-renovations">Southport renovations</a> for more details.
        </p>
      </section>
      <BathroomRenovationsClient />
    </>
  );
}
