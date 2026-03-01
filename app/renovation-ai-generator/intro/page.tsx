import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { AIDesignIntroClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Renovations AI Design Generator | Preview";
const pageDescription =
  "Preview Gold Coast renovations concepts in minutes. Upload room photos, test finishes, and generate visual directions before your project planning phase.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/renovation-ai-generator/intro",
  keywords: [
    "AI renovation design Gold Coast",
    "Gold Coast renovation visual preview",
    "AI room renovation concept",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/renovation-ai-generator/intro",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovations Design Tools", url: "/renovation-design-tools" },
    { name: "Gold Coast Renovations AI Preview", url: "/renovation-ai-generator/intro" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <AIDesignIntroClient />
      <section className="py-16 md:py-20 bg-background">
        <div className="container-wide max-w-3xl text-foreground/80">
          <h2 className="font-serif text-h2-mobile md:text-h2 leading-tight mb-6">
            Preview Gold Coast Renovations With AI
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            This introduction page explains how the AI design generator fits into a calm, realistic
            renovation planning process. It walks through what makes a good reference photo,
            examples of spaces that benefit most, and how to interpret the concepts you receive.
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            Rather than replacing design, the tool helps you sense-check style directions and
            finishes at a low-stakes stage. You will see how different palettes, textures, and
            lighting ideas might sit within a Burleigh, Broadbeach, or Palm Beach home before you
            commit to orders or demolition.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            After reviewing this overview, you can move into the generator itself, upload your own
            images, and start collecting concepts to discuss with the team during a formal
            consultation.
          </p>
          <h3 className="font-serif text-h3 md:text-h2 leading-tight mt-10 mb-4">
            What To Prepare Before You Start
          </h3>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            For the best output, use bright, uncluttered photos and keep your first prompt simple.
            <strong> Start with one clear style direction</strong>, then test variations after you
            review your first set of concepts.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-base md:text-lg leading-relaxed mb-6">
            <li>Use one room at a time so you can compare options cleanly.</li>
            <li>Save your strongest concepts and note what you like in each one.</li>
            <li>Bring those references into your consultation to speed up decisions.</li>
          </ul>
          <p className="text-base md:text-lg leading-relaxed">
            Next step: open the{" "}
            <Link href="/renovation-ai-generator" className="text-primary underline underline-offset-4">
              AI visualiser
            </Link>{" "}
            or jump to{" "}
            <Link href="/book-renovation-consultation" className="text-primary underline underline-offset-4">
              book a renovation consultation
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
