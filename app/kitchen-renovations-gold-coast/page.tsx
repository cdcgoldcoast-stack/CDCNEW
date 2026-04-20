import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { KitchenRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Kitchen Renovations | CD Construct";
const pageDescription =
  "Gold Coast kitchen renovations and remodelling with bespoke designs, quality craftsmanship & smooth project management. Fixed price quotes. QBCC licensed.";

const serviceFaqs = [
  {
    question: "How much does a kitchen renovation cost on the Gold Coast?",
    answer:
      "Kitchen renovation costs depend on scope, size, and finishes. A mid-range kitchen renovation typically starts from $35,000-$50,000, while premium kitchens with custom cabinetry and high-end appliances can range from $60,000-$100,000+. We provide fixed-price quotes after detailed consultation and design.",
  },
  {
    question: "How long does a kitchen renovation take?",
    answer:
      "Most kitchen renovations take 4-8 weeks from demolition to handover, depending on complexity and custom elements. This includes cabinetry installation, benchtops, appliances, splashback, and final touches. We provide a detailed timeline during planning so you know exactly what to expect.",
  },
  {
    question: "Do you handle council approvals for kitchen renovations?",
    answer:
      "Most kitchen renovations don't require council approval if they don't involve structural changes or plumbing relocations. If your project does need approvals, we coordinate the entire process including building certifiers and required documentation.",
  },
  {
    question: "Can I live in my home during a kitchen renovation?",
    answer:
      "Yes, though there will be disruption. We set up temporary kitchen facilities and schedule work to minimise inconvenience. Many clients choose to stay elsewhere during the most intensive phases (1-2 weeks), but it's not required.",
  },
  {
    question: "Do you provide kitchen design services?",
    answer:
      "Absolutely. Our design process includes layout optimisation, workflow planning, cabinetry design, appliance selection, and material choices. We create detailed 3D renders so you can visualise the result before construction begins.",
  },
  {
    question: "What kitchen styles do you specialise in?",
    answer:
      "We design and build all kitchen styles including modern minimalist, Hamptons, coastal, contemporary, and classic traditional. Our portfolio includes everything from compact apartment kitchens to large entertainer's kitchens.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/kitchen-renovations-gold-coast",
  keywords: [
    "kitchen renovation Gold Coast",
    "Gold Coast kitchen renovations",
    "kitchen remodelling Gold Coast",
    "kitchen design Gold Coast",
    "kitchen builders Gold Coast",
    "custom kitchens Gold Coast",
    "kitchen makeover Gold Coast",
    "modern kitchen renovation",
    "Hampton kitchen Gold Coast",
    "kitchen renovation cost",
    "QBCC kitchen builder",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/kitchen-renovations-gold-coast",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Kitchen Renovations Gold Coast", url: "/kitchen-renovations-gold-coast" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  const serviceSchema = generateServiceSchema({
    name: "Kitchen Renovation Gold Coast",
    description: pageDescription,
    path: "/kitchen-renovations-gold-coast",
    serviceType: "Kitchen Renovation",
    areaServed: "Gold Coast",
    areaType: "City",
  });

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <KitchenRenovationsClient />
    </>
  );
}
