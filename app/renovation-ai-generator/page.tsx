import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { AIDesignGeneratorClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Renovations AI Visualiser | Design Preview";
const pageDescription =
  "Upload your room and preview Gold Coast renovations concepts while keeping your existing layout. Compare finishes and design direction before final selections.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/renovation-ai-generator",
  keywords: [
    "Gold Coast AI renovation visualiser",
    "AI kitchen renovation preview Gold Coast",
    "AI bathroom renovation preview Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/renovation-ai-generator",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovations Design Tools", url: "/renovation-design-tools" },
    { name: "Gold Coast Renovations AI Visualiser", url: "/renovation-ai-generator" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <section className="sr-only">
        <h1>Gold Coast Renovations AI Visualiser</h1>
        <p>
          The Concept Design Construct AI Visualiser helps Gold Coast homeowners preview renovation
          concepts before committing to a full design process. Upload a photo of your kitchen,
          bathroom, laundry, or living space and see AI-generated renderings that keep your existing
          layout while exploring new finishes, joinery, lighting, and material palettes.
        </p>
        <h2>How the AI visualiser supports your renovation planning</h2>
        <p>
          Use the tool to compare direction options side-by-side, then bring the results to your
          first consultation with our design-led team. The visualiser is intentionally focused on
          early-stage exploration — it is a starting point, not a substitute for the detailed
          drawings, documentation, and fixed-price quotes we prepare during a full project.
        </p>
        <h2>Explore Gold Coast renovation services</h2>
        <p>
          After previewing ideas with the visualiser, continue to our{" "}
          <a href="/renovation-services">renovation services overview</a>, browse completed{" "}
          <a href="/renovation-projects">Gold Coast renovation projects</a>, or read{" "}
          <a href="/how-we-work">how we work</a> to understand our process. When you are ready to
          discuss your project, <a href="/book-renovation-consultation">book a consultation</a>{" "}
          with our QBCC-licensed builders.
        </p>
        <h2>Specialist renovation pages</h2>
        <p>
          For category-specific guidance, visit our{" "}
          <a href="/kitchen-renovations-gold-coast">kitchen renovations Gold Coast</a>,{" "}
          <a href="/bathroom-renovations-gold-coast">bathroom renovations Gold Coast</a>, or{" "}
          <a href="/whole-home-renovations-gold-coast">whole home renovations Gold Coast</a> pages.
        </p>
      </section>
      <AIDesignGeneratorClient />
    </>
  );
}
