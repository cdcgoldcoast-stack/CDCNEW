import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { NerangRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Nerang Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Hinterland property renovations in Nerang. Kitchen, bathroom and whole-home upgrades for large-block family homes. Indoor-outdoor living specialists. QBCC licensed.";

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
      <NerangRenovationsClient />
    </>
  );
}
