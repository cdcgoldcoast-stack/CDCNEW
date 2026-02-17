import type { Metadata } from "next";
import ReactDOM from "react-dom";
import { generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import JsonLd from "@/components/JsonLd";
import SSRHomeClient from "../components/SSRHomeClient";
import { buildMetadata, generateWebSiteSchema } from "@/lib/seo";
import { SITELINK_TARGETS } from "@/config/seo";
import { fetchHeroImageUrl } from "@/data/projects";

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
    title: "Gold Coast Renovations | Concept Design Construct",
    description:
      "Concept Design Construct (CD Construct) are Gold Coast renovation builders for kitchens, bathrooms, and whole-home transformations with design-led planning, QBCC licensed delivery, and timelines.",
    path: "/",
  }),
};

export default async function HomePage() {
  const heroImageUrl = await fetchHeroImageUrl();

  // Preload the resolved hero image so the browser starts downloading immediately.
  ReactDOM.preload(heroImageUrl, { as: "image", fetchPriority: "high" });

  const localBusinessSchema = generateLocalBusinessSchema();
  const faqSchema = generateFAQSchema(homepageFAQs);
  const webSiteSchema = generateWebSiteSchema();
  const sitelinkTargets = SITELINK_TARGETS;

  return (
    <>
      <JsonLd data={[webSiteSchema, localBusinessSchema, faqSchema]} />
      <SSRHomeClient heroImageUrl={heroImageUrl} />
      <section className="sr-only" aria-label="Home page summary for search crawlers">
        <p>Gold Coast Renovations - Locally Trusted.</p>
        <p>
          Clear communication, realistic timelines, and quality results for kitchens, bathrooms, and
          whole-home renovations across the Gold Coast.
        </p>
        <h2>Gold Coast Renovation Services</h2>
        <ul>
          <li>Kitchen renovations designed for flow, storage, and everyday usability.</li>
          <li>Bathroom renovations focused on comfort, durability, and clean detailing.</li>
          <li>Whole-home renovations planned around lifestyle, layout, and long-term value.</li>
        </ul>
        <h2>Popular Renovation Pages</h2>
        <ul>
          {sitelinkTargets.map((target) => (
            <li key={target.path}>
              <a href={target.path}>{target.label}</a>: {target.description}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
