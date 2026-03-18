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
      "A well-planned Gold Coast kitchen renovation takes approximately 2 weeks from demolition to completion. Timing depends on scope and selections, but locked decisions and thorough planning are what keep schedules predictable. We provide a realistic, stage-by-stage timeline during the planning phase so you know exactly what to expect.",
  },
  {
    question: "How long does a bathroom renovation take?",
    answer:
      "A standard Gold Coast bathroom renovation typically takes around 4 weeks, while luxury or fully reconfigured bathrooms can take up to 6 weeks. Clear scope and early selections reduce surprises. We map out every stage from strip-out to fit-off so the process stays on track.",
  },
  {
    question: "How much does a renovation cost on the Gold Coast?",
    answer:
      "Gold Coast renovation costs depend on scope, structural changes, finishes, and approvals. Most bathroom renovations start in the mid five figures, kitchens usually begin around $30k, and full-home renovations vary widely based on layout and specification. We provide transparent, itemised quotes so you can make confident decisions.",
  },
  {
    question: "Do renovations on the Gold Coast need council approval?",
    answer:
      "Some Gold Coast renovations do require approval, especially if they involve structural changes, extensions, or alterations to the building footprint. Most internal renovations do not need council approval. We help identify what permits or certifications are needed early so there are no delays once work begins.",
  },
  {
    question: "Do you handle approvals and coordination?",
    answer:
      "Yes, we guide the entire approvals process and coordinate with the right consultants so permits and planning feel clear, not confusing. From council submissions to trade scheduling, our Gold Coast team manages the details so you can focus on the exciting parts of your renovation.",
  },
  {
    question: "Do you help with design and selections?",
    answer:
      "Yes, we guide layout, design decisions, and material selections so the renovation process feels calm and manageable. Our experience with Gold Coast homes means we can recommend what works best for your space, climate, and lifestyle. You will not be left to figure it out alone.",
  },
  {
    question: "Can you renovate one space or the whole home?",
    answer:
      "Yes, we handle everything from single-room updates to complete whole-home transformations across the Gold Coast. Many clients start with one key space that will make the biggest difference, while others reshape the entire home for better flow and comfort. We help you decide what makes most sense for your situation and budget.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Gold Coast Renovations | Kitchen, Bathroom & Home | CD Construct",
    description:
      "Gold Coast renovation builders for kitchens, bathrooms & whole-home transformations. Design-led planning, QBCC licensed, clear timelines. Free consultation.",
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
