import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ApartmentRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Apartment Renovations | CD Construct";
const pageDescription =
  "Specialist apartment and unit renovations on the Gold Coast. Body corporate compliant, strata-experienced builders. High-rise and low-rise renovations. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does an apartment renovation cost on the Gold Coast?",
    answer:
      "Apartment renovation costs on the Gold Coast typically range from $30,000 for a kitchen or bathroom refresh to $150,000+ for a full apartment transformation. Costs depend on apartment size, scope of work, and level of finishes. We provide detailed fixed-price quotes after an on-site inspection and body corporate review.",
  },
  {
    question: "How long does an apartment renovation take?",
    answer:
      "Most apartment renovations take 4-10 weeks depending on scope. A single-room renovation such as a kitchen or bathroom can be completed in 4-6 weeks, while full apartment renovations typically take 8-10 weeks. Body corporate working hour restrictions and service elevator availability can influence the timeline.",
  },
  {
    question: "Do you handle body corporate approvals for apartment renovations?",
    answer:
      "Yes, managing body corporate approvals is a core part of our apartment renovation service. We prepare all required documentation, architectural drawings, and renovation applications. We also coordinate with building managers regarding noise restrictions, working hours, service elevator bookings, and waste removal.",
  },
  {
    question: "Can you renovate a high-rise apartment on the Gold Coast?",
    answer:
      "Absolutely. We have extensive experience renovating apartments in high-rise buildings across the Gold Coast, from Surfers Paradise to Broadbeach and beyond. We understand the unique logistics including material delivery via service elevators, noise curfews, and building-specific rules.",
  },
  {
    question: "What are the biggest challenges with apartment renovations?",
    answer:
      "The main challenges include body corporate compliance, restricted working hours (often 7am-5pm weekdays), noise management, material logistics in high-rise buildings, and working within compact spaces. Our experience with strata renovations means we plan for all of these from day one, ensuring a smooth process for you and your neighbours.",
  },
  {
    question: "Can you make a small apartment feel more spacious?",
    answer:
      "Yes, space maximisation is central to our apartment renovation designs. Techniques include open-plan layouts, integrated storage, light colour palettes, mirror placement, streamlined cabinetry, and clever lighting design. We create detailed 3D renders so you can see how the space will feel before work begins.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/apartment-renovations-gold-coast",
  keywords: [
    "apartment renovation Gold Coast",
    "Gold Coast apartment renovations",
    "unit renovation Gold Coast",
    "high-rise renovation Gold Coast",
    "body corporate renovation",
    "strata renovation Gold Coast",
    "apartment remodel Gold Coast",
    "Gold Coast unit makeover",
    "apartment kitchen renovation Gold Coast",
    "QBCC apartment builder",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/apartment-renovations-gold-coast",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Apartment Renovations Gold Coast", url: "/apartment-renovations-gold-coast" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = generateServiceSchema({
    name: "Apartment Renovation Gold Coast",
    description: pageDescription,
    path: "/apartment-renovations-gold-coast",
    serviceType: "Apartment Renovation",
    areaServed: "Gold Coast",
    areaType: "City",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <ApartmentRenovationsClient />
    </>
  );
}
