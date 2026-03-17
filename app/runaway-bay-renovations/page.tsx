import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { RunawayBayRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Runaway Bay Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Canal-front and family home renovations in Runaway Bay. Kitchen, bathroom and whole-home upgrades for waterfront properties and established homes on the Gold Coast.";

const serviceFaqs = [
  {
    question: "Do you renovate canal-front homes in Runaway Bay?",
    answer:
      "Yes, canal-front renovations are one of our specialities in Runaway Bay. We understand the unique considerations of waterfront properties - from flood-smart design and moisture management to maximising water views and creating seamless indoor-outdoor entertaining areas that take advantage of your canal frontage.",
  },
  {
    question: "How much does a renovation cost in Runaway Bay?",
    answer:
      "Runaway Bay renovation costs depend on the size and scope of your project. Kitchen renovations typically range from $30,000-$60,000, bathrooms from $22,000-$45,000, and whole-home renovations from $120,000-$300,000+. Canal-front properties in Runaway Bay may need additional flood compliance work, which we factor into our detailed quotes.",
  },
  {
    question: "Can you update my 1980s home in Runaway Bay without rebuilding?",
    answer:
      "Absolutely. Many Runaway Bay homes from the 1980s and 90s have solid structures that just need modernising. We specialise in opening up closed-off floor plans, replacing dated kitchens and bathrooms, and adding contemporary finishes - all without the cost and disruption of a full rebuild. Your Runaway Bay home can feel brand new while keeping its structural integrity.",
  },
  {
    question: "Do you build outdoor entertaining areas for Runaway Bay homes?",
    answer:
      "Yes, outdoor living is a key part of many Runaway Bay renovations. We design and build alfresco areas, covered patios, and outdoor kitchens that complement your indoor renovation. For canal-front Runaway Bay properties, we create entertaining spaces that frame your water views and make the most of the Gold Coast lifestyle.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/runaway-bay-renovations",
  keywords: [
    "Runaway Bay renovations",
    "Runaway Bay kitchen renovation",
    "Runaway Bay bathroom renovation",
    "canal-front renovation Runaway Bay",
    "Runaway Bay renovation builder",
    "waterfront renovation Gold Coast",
    "Runaway Bay home renovation",
    "family home renovation Runaway Bay",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/runaway-bay-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Runaway Bay Renovations", url: "/runaway-bay-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <section className="sr-only" aria-label="Runaway Bay renovation services summary for search crawlers">
        <h2>Runaway Bay Renovations by {SITE_NAME}</h2>
        <p>
          Canal-front and family home renovations in Runaway Bay. Kitchen, bathroom and whole-home
          upgrades for waterfront properties and established homes. Specialists in flood-smart design
          and indoor-outdoor living on the Gold Coast.
        </p>
        <h2>Our Runaway Bay Renovation Services:</h2>
        <ul>
          <li>Kitchen renovations Runaway Bay</li>
          <li>Bathroom renovations Runaway Bay</li>
          <li>Canal-front home renovations</li>
          <li>Whole-home renovations Runaway Bay</li>
          <li>Outdoor entertaining areas</li>
          <li>Flood-smart waterfront design</li>
        </ul>
      </section>
      <RunawayBayRenovationsClient />
    </>
  );
}
