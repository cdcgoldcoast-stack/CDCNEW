import type { Metadata } from "next";
import { generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";

// Force static generation for homepage SEO
export const dynamic = "force-static";
export const revalidate = 900;
import JsonLd from "@/components/JsonLd";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SSRHomeClient from "../components/SSRHomeClient";
import { buildMetadata, generateWebSiteSchema, generateSiteNavigationSchema } from "@/lib/seo";
import { PRIMARY_KEYWORDS } from "@/config/seo";

const homepageFAQs = [
  {
    question: "How long does a kitchen renovation take?",
    answer:
      "Timing depends on scope and selections. Locked decisions and planning are what keep schedules predictable. We'll provide a realistic timeline based on your specific project during the planning phase.",
  },
  {
    question: "How long does a bathroom renovation take?",
    answer:
      "Bathrooms vary by complexity, but clear scope and selections reduce surprises. A straightforward bathroom refresh may take several weeks, while a full reconfiguration takes longer.",
  },
  {
    question: "How much does a renovation cost on the Gold Coast?",
    answer:
      "Costs depend on scope, structural changes, finishes, and approvals. Most bathroom renovations start in the mid five figures, kitchens usually start higher, and full-home renovations vary widely based on layout and specification.",
  },
  {
    question: "Do renovations on the Gold Coast need council approval?",
    answer:
      "Some renovations do, especially if they involve structural changes, extensions, or changes to the home footprint. We help identify what approvals are needed early.",
  },
  {
    question: "Do you handle approvals and coordination?",
    answer:
      "Yes. We guide the process and work with the right consultants so approvals and planning feel clear, not confusing.",
  },
  {
    question: "Do you help with design and selections?",
    answer:
      "Yes. We guide layout, design decisions, and selections so the process feels calm and manageable. You won't be left to figure it out alone.",
  },
  {
    question: "Can you renovate one space or the whole home?",
    answer:
      "Yes. Many clients start with a key space that will make the biggest difference. Others reshape the whole home for better flow and comfort. We help you decide what makes most sense for your situation.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Concept Design Construct (CD Construct) | Gold Coast",
    description:
      "Concept Design Construct (CD Construct) are Gold Coast renovation builders for kitchens, bathrooms, and whole-home transformations with design-led planning, QBCC licensed delivery, and clear timelines.",
    path: "/",
    keywords: PRIMARY_KEYWORDS,
  }),
};

export default function HomePage() {
  const localBusinessSchema = generateLocalBusinessSchema();
  const faqSchema = generateFAQSchema(homepageFAQs);
  const webSiteSchema = generateWebSiteSchema();
  const siteNavigationSchema = generateSiteNavigationSchema();

  return (
    <>
      <JsonLd data={[webSiteSchema, localBusinessSchema, faqSchema, siteNavigationSchema]} />
      <div className="min-h-screen">
        <Header />
        <Hero />
        <SSRHomeClient />
      </div>
      <p className="sr-only">
        Concept Design Construct, also known as CD Construct, delivers design-led home renovations across the Gold
        Coast including kitchens, bathrooms, and whole-home transformations.
      </p>
    </>
  );
}
