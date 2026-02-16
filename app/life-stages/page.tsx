import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { LifeStagesClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Life Stage Renovations | Gold Coast Homes";
const pageDescription =
  "Find the right Gold Coast renovation approach for each life stage, from first-home upgrades to future-ready living and accessibility planning.";

const lifeStageFaqs = [
  {
    question: "How much does a bathroom renovation cost on the Gold Coast?",
    answer:
      "Costs vary by size, finishes, and whether plumbing moves. Bathroom renovation budgets on the Gold Coast often start around the lower range for basic updates and rise with layout changes and premium inclusions.",
  },
  {
    question: "What renovations add the most value on the Gold Coast?",
    answer:
      "Kitchen upgrades, bathroom renovations, and layout improvements are commonly the highest-impact renovation categories for daily use and resale appeal on the Gold Coast.",
  },
  {
    question: "How do I check if a builder is QBCC licensed?",
    answer:
      "Use the official QBCC public register to confirm licence status and review any relevant compliance history before committing to a renovation contract.",
  },
  {
    question: "What is a contract variation in a renovation project?",
    answer:
      "A contract variation is a formal change to your original renovation agreement. It should always be documented in writing with updated cost and timeline details.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/life-stages",
  keywords: [
    "life stage renovations Gold Coast",
    "future ready home renovations Gold Coast",
    "accessibility renovations Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/life-stages",
    name: pageTitle,
    description: pageDescription,
  });
  const faqSchema = generateFAQSchema(lifeStageFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Life Stages", url: "/life-stages" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, faqSchema, breadcrumbSchema]} />
      <LifeStagesClient />
    </>
  );
}
