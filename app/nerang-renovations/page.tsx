import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { NerangRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Nerang Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Expert renovation builders in Nerang, Gold Coast. Kitchen, bathroom and whole-home renovations for established family homes near the hinterland. QBCC licensed local builders.";

const serviceFaqs = [
  {
    question: "What types of homes do you renovate in Nerang?",
    answer:
      "We renovate all property types across Nerang, from established 1980s and 1990s family homes to newer builds on larger blocks. Our Nerang projects often involve updating older layouts to suit modern family living while taking advantage of the generous block sizes typical in this area.",
  },
  {
    question: "How much does a home renovation cost in Nerang?",
    answer:
      "Nerang renovation costs depend on scope and property size. Kitchen renovations typically range from $35,000-$65,000, bathrooms from $25,000-$50,000, and whole-home renovations from $120,000-$300,000+. Nerang homes often have larger footprints, so we provide tailored quotes based on your specific property.",
  },
  {
    question: "Can you add indoor-outdoor living areas to Nerang homes?",
    answer:
      "Absolutely. Many Nerang homes sit on generous blocks with beautiful hinterland outlooks. We specialise in creating seamless indoor-outdoor transitions with bi-fold doors, covered alfresco areas, and outdoor kitchens that make the most of your property and the surrounding landscape.",
  },
  {
    question: "How long does a whole-home renovation take in Nerang?",
    answer:
      "A typical whole-home renovation in Nerang takes 10-16 weeks depending on the scope. Kitchen-only renovations run 4-6 weeks and bathrooms 3-5 weeks. Because Nerang properties tend to be larger, we plan carefully to minimise disruption and keep your family comfortable during the build.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/nerang-renovations",
  keywords: [
    "Nerang renovations",
    "Nerang kitchen renovation",
    "Nerang bathroom renovation",
    "Nerang home renovation",
    "renovation builder Nerang",
    "Gold Coast hinterland renovations",
    "Nerang house renovation",
    "kitchen renovation Nerang Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/nerang-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Nerang Renovations", url: "/nerang-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Nerang renovation services summary for search crawlers">
        <h2>Nerang Renovations by {SITE_NAME}</h2>
        <p>
          Kitchen, bathroom and whole-home renovations in Nerang, Gold Coast. Specialists in
          renovating established family homes on larger blocks near the hinterland. QBCC licensed builders
          with extensive experience in the Nerang area.
        </p>
        <h2>Our Nerang Renovation Services:</h2>
        <ul>
          <li>Kitchen renovations Nerang</li>
          <li>Bathroom renovations Nerang</li>
          <li>Whole-home renovations Nerang</li>
          <li>Indoor-outdoor living transformations</li>
          <li>Established home modernisation</li>
          <li>Hinterland property renovations</li>
        </ul>
      </section>
      <NerangRenovationsClient />
    </>
  );
}
