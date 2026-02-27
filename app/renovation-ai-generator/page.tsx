import type { Metadata } from "next";
import Link from "next/link";
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
      <section className="py-16 md:py-20 bg-background">
        <div className="container-wide max-w-3xl text-foreground/80">
          <h1 className="font-serif text-h2-mobile md:text-h1 leading-tight mb-6">
            Gold Coast Renovations AI Visualiser
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            The AI visualiser lets you upload photos of your existing space and preview Gold Coast
            renovation concepts without changing the underlying layout. It is designed as a
            planning tool, not a final specification, so you can explore different finishes and
            directions before locking anything in.
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            Homeowners often use the tool to compare lighter and darker schemes, test how different
            tile or joinery ideas feel, and build alignment within the household before moving into
            formal design and quoting. Because it keeps the room proportions realistic, it is
            easier to translate ideas into an actual renovation scope.
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-6">
            Once you have a few concepts that feel right, you can bring them into a consultation so
            the discussion is grounded in your home, budget, and priorities rather than generic
            inspiration images.
          </p>
          <h2 className="font-serif text-h3 md:text-h2 leading-tight mt-10 mb-4">
            Move From Concepts To Real Scope
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            Treat each generated concept as a planning reference. Shortlist what works, remove what
            does not, and use that as a brief for selections and quoting.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            Need a quick refresher first? Visit the{" "}
            <Link href="/renovation-ai-generator/intro" className="text-primary underline underline-offset-4">
              AI generator intro guide
            </Link>
            . Ready to discuss real costs and stages?{" "}
            <Link href="/book-renovation-consultation" className="text-primary underline underline-offset-4">
              Book a consultation
            </Link>
            .
          </p>
        </div>
      </section>
      <AIDesignGeneratorClient />
    </>
  );
}
