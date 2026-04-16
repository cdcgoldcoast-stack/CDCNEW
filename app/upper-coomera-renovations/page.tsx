import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { UpperCoomeraRenovationsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Upper Coomera Renovations | Kitchen, Bathroom & Home";
const pageDescription =
  "Home extensions and renovations for growing families in Upper Coomera. Kitchen, bathroom and living space expansions. Stay in the area you love. QBCC licensed.";

const serviceFaqs = [
  {
    question: "What kind of renovations do you do in Upper Coomera?",
    answer:
      "We handle all types of home renovations in Upper Coomera, from kitchen and bathroom upgrades to full home transformations. Many Upper Coomera families come to us when they need more space - whether that means extending a living area, adding a second bathroom, or completely reconfiguring their floor plan to suit a growing household.",
  },
  {
    question: "How much does a renovation cost in Upper Coomera?",
    answer:
      "Upper Coomera renovation costs depend on the scope of work. Kitchen renovations typically range from $28,000-$55,000, bathrooms from $20,000-$40,000, and whole-home renovations from $100,000-$250,000+. Because Upper Coomera homes are generally newer builds, we can often achieve impressive results without extensive structural work, which helps keep costs down.",
  },
  {
    question: "Can you extend my Upper Coomera home instead of us moving?",
    answer:
      "Yes, home extensions are a popular option in Upper Coomera where many families outgrow their homes but love the area. We can extend living areas, add rooms, or reconfigure existing spaces to create the room your family needs. Renovating is often more cost-effective than selling and buying in Upper Coomera, and you avoid stamp duty and moving costs.",
  },
  {
    question: "How do you handle renovations in Upper Coomera estates with covenants?",
    answer:
      "We are familiar with the building covenants across Upper Coomera estates. If your renovation involves external changes, we review your estate covenants before design work begins to ensure compliance. For internal renovations like kitchens and bathrooms, covenants rarely apply. We handle all necessary approvals so your Upper Coomera renovation proceeds smoothly.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/upper-coomera-renovations",
  keywords: [
    "Upper Coomera renovations",
    "Upper Coomera kitchen renovation",
    "Upper Coomera bathroom renovation",
    "Upper Coomera home renovation",
    "Upper Coomera renovation builder",
    "family home renovation Upper Coomera",
    "Gold Coast renovation builder",
    "home extension Upper Coomera",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/upper-coomera-renovations",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Upper Coomera Renovations", url: "/upper-coomera-renovations" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, localBusinessSchema]} />
      <UpperCoomeraRenovationsClient />
    </>
  );
}
