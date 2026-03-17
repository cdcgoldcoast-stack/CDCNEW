import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { MiamiRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME } from "@/config/seo";

const pageTitle = "Miami Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Renovation builders in Miami, Gold Coast. Kitchen, bathroom and whole-home renovations for beach cottages and coastal homes. QBCC licensed. Based in Broadbeach - your local builder.";

const serviceFaqs = [
  {
    question: "Do you renovate older beach homes in Miami?",
    answer:
      "Yes, we specialise in transforming Miami's older fibro and brick beach cottages into contemporary coastal homes. We understand the unique character of Miami properties and design renovations that embrace the beachside lifestyle while modernising every detail.",
  },
  {
    question: "How much does a renovation cost in Miami?",
    answer:
      "Miami renovation costs typically range from $35,000 for a bathroom update to $180,000+ for a full beach cottage transformation. Older Miami homes often benefit from kitchen modernisation, bathroom upgrades, and opening up living areas to capture coastal breezes.",
  },
  {
    question: "Can you work on compact lots in Miami?",
    answer:
      "Absolutely. Many Miami properties sit on smaller beachside blocks, and we have extensive experience maximising space on compact lots. We design clever storage solutions, open-plan layouts, and indoor-outdoor connections that make smaller Miami homes feel spacious.",
  },
  {
    question: "How close are you to Miami on the Gold Coast?",
    answer:
      "Our Broadbeach base is just 10 minutes from Miami, making us one of the closest renovation builders to the suburb. We know the local council requirements, the salt-air building considerations, and the coastal aesthetic that Miami homeowners love.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/miami-renovations",
  keywords: [
    "Miami renovations",
    "Miami kitchen renovation",
    "Miami bathroom renovation",
    "beach cottage renovation Miami",
    "Miami renovation builder",
    "Miami home renovation",
    "coastal renovation Miami Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/miami-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Miami Renovations", url: "/miami-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Miami renovation services summary for search crawlers">
        <h2>Miami Renovations by {SITE_NAME}</h2>
        <p>
          Kitchen, bathroom and whole-home renovations in Miami, Gold Coast. Specialists in
          transforming beach cottages into modern coastal homes. Based in Broadbeach.
        </p>
        <h2>Our Miami Renovation Services:</h2>
        <ul>
          <li>Kitchen renovations</li>
          <li>Bathroom renovations</li>
          <li>Whole-home renovations</li>
          <li>Beach cottage transformations</li>
          <li>Compact lot renovations</li>
        </ul>
      </section>
      <MiamiRenovationsClient />
    </>
  );
}
