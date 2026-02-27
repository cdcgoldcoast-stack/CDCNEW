import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { MoodboardClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Renovations Moodboard Creator | Plan Your Style";
const pageDescription =
  "Collect inspiration, curate palettes, and organise references for your Gold Coast renovations using our online moodboard creator.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/renovation-design-tools/moodboard",
  keywords: [
    "Gold Coast renovation moodboard",
    "renovation style planner Gold Coast",
    "interior renovation inspiration Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/renovation-design-tools/moodboard",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovations Design Tools", url: "/renovation-design-tools" },
    { name: "Gold Coast Renovations Moodboard Creator", url: "/renovation-design-tools/moodboard" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <section className="py-16 md:py-20 bg-background">
        <div className="container-wide max-w-3xl text-foreground/80">
          <h1 className="font-serif text-h2-mobile md:text-h1 leading-tight mb-6">
            Gold Coast Renovations Moodboard Creator
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            The moodboard creator is a simple workspace for collecting Gold Coast renovation
            inspiration in one place. You can group reference images, colour palettes, and material
            ideas so that patterns emerge before you make final selections.
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            Many clients use it to separate &quot;must keep&quot; ideas from &quot;nice to have&quot; options,
            or to create different boards for kitchen, bathroom, and whole-home renovation stages.
            This makes it easier to brief the design and construction team on what feels right for
            your household rather than starting from a blank slate.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            Once you have a board that feels aligned, you can share it during a consultation so
            layout, budget, and specification decisions reflect the style direction you actually
            want to live with every day.
          </p>
          <h2 className="font-serif text-h3 md:text-h2 leading-tight mt-10 mb-4">
            Keep Your Board Practical
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            Strong boards usually combine visual references with short notes about why each image
            matters, such as storage goals, cleaning practicality, or finish durability.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            You can also compare with the{" "}
            <Link href="/renovation-ai-generator" className="text-primary underline underline-offset-4">
              AI visualiser
            </Link>{" "}
            and then bring your final board into a{" "}
            <Link href="/book-renovation-consultation" className="text-primary underline underline-offset-4">
              renovation consultation
            </Link>
            .
          </p>
        </div>
      </section>
      <MoodboardClient />
    </>
  );
}
