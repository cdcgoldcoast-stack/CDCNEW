import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { LaundryRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Laundry Renovations | CD Construct";
const pageDescription =
  "Custom laundry renovations on the Gold Coast with smart storage, quality cabinetry & functional design. Combined bathroom-laundry specialists. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a laundry renovation cost on the Gold Coast?",
    answer:
      "Laundry renovation costs on the Gold Coast typically range from $8,000 for a basic refresh with new cabinetry and benchtops, up to $25,000 for a full custom laundry with stone benchtops, integrated appliances, and premium fixtures. Combined bathroom-laundry renovations may cost more depending on scope. We provide fixed-price quotes after an on-site consultation.",
  },
  {
    question: "How long does a laundry renovation take?",
    answer:
      "Most laundry renovations are completed within 2-4 weeks, depending on the scope. A simple cabinetry and benchtop upgrade can be finished in under two weeks, while a full renovation including plumbing relocation, tiling, and custom joinery may take up to four weeks. We provide a clear timeline before work begins.",
  },
  {
    question: "Can you combine my laundry and bathroom into one room?",
    answer:
      "Yes, combined bathroom-laundry renovations are one of our specialties. This is a popular option for Gold Coast homes and apartments where space is limited. We design smart layouts that integrate washing machines, dryers, and storage without compromising bathroom functionality or style.",
  },
  {
    question: "Do I need council approval for a laundry renovation?",
    answer:
      "Most laundry renovations don't require council approval provided the work stays within the existing footprint and doesn't involve structural changes. If plumbing is being relocated or walls removed, we handle any necessary approvals and certifications as part of our service.",
  },
  {
    question: "What cabinetry options are available for laundry renovations?",
    answer:
      "We offer a range of cabinetry styles including polyurethane, laminate, and timber veneer in a variety of colours and finishes. Options include overhead cupboards, pull-out hampers, broom cupboards, adjustable shelving, and integrated drying areas. All cabinetry is custom-built to maximise your available space.",
  },
  {
    question: "Can you add a utility sink to my laundry?",
    answer:
      "Absolutely. We install a range of utility sinks and trough options, from compact drop-in sinks to large freestanding tubs. Our plumbers handle all connections and drainage to ensure everything is compliant and functional.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/laundry-renovations-gold-coast",
  keywords: [
    "laundry renovation Gold Coast",
    "Gold Coast laundry renovations",
    "laundry makeover Gold Coast",
    "laundry cabinetry Gold Coast",
    "combined bathroom laundry renovation",
    "laundry storage solutions Gold Coast",
    "custom laundry design Gold Coast",
    "utility room renovation",
    "QBCC laundry builder",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/laundry-renovations-gold-coast",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Laundry Renovations Gold Coast", url: "/laundry-renovations-gold-coast" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = generateServiceSchema({
    name: "Laundry Renovation Gold Coast",
    description: pageDescription,
    path: "/laundry-renovations-gold-coast",
    serviceType: "Laundry Renovation",
    areaServed: "Gold Coast",
    areaType: "City",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <LaundryRenovationsClient />
    </>
  );
}
