import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { RobinaRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME } from "@/config/seo";

const pageTitle = "Robina Renovations | Kitchen, Bathroom & Home | CD Construct";
const pageDescription =
  "Renovation builders in Robina. Kitchen, bathroom and whole-home renovations for modern family homes. QBCC licensed. Based in Broadbeach - your local Gold Coast builder.";

const serviceFaqs = [
  {
    question: "Do you renovate homes in Robina?",
    answer:
      "Yes, we regularly renovate homes throughout Robina - from established 90s homes to newer properties. We understand the modern family lifestyle that Robina offers and design renovations that suit this vibrant suburb.",
  },
  {
    question: "How much does a renovation cost in Robina?",
    answer:
      "Robina renovation costs typically range from $35,000 for a bathroom to $150,000+ for whole-home renovations. The 90s homes in Robina often benefit greatly from kitchen updates, bathroom modernisation, and open-plan transformations.",
  },
  {
    question: "Can you modernise 90s homes in Robina?",
    answer:
      "Absolutely. Many Robina homes were built in the 90s with layouts that don't suit modern living. We specialise in transforming these homes - opening up kitchens, updating bathrooms, and creating the indoor-outdoor flow that today's families want.",
  },
  {
    question: "Do you work near Robina Town Centre?",
    answer:
      "Yes, we renovate properties throughout Robina including homes near Robina Town Centre, Robina Woods, and the surrounding estates. Our Broadbeach base means we're just 15 minutes away.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/robina-renovations",
  keywords: [
    "Robina renovations",
    "Robina kitchen renovation",
    "Robina bathroom renovation",
    "90s home renovation Robina",
    "Robina renovation builder",
    "Robina home renovation",
    "Robina Town Centre renovations",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/robina-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Robina Renovations", url: "/robina-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Robina renovation services summary for search crawlers">
        <h1>Robina Renovations by {SITE_NAME}</h1>
        <p>
          Kitchen, bathroom and whole-home renovations in Robina. Specialists in modernising 
          90s homes with open-plan designs. Based in Broadbeach.
        </p>
      </section>
      <RobinaRenovationsClient />
    </>
  );
}
