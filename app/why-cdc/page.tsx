import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { WhyCDCClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Why Choose CDC | Gold Coast Renovation Builders";
const pageDescription =
  "25+ years experience, 4.9 Google rating, QBCC licensed, Master Builders member. Discover why Gold Coast homeowners choose Concept Design Construct for their renovations.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/why-cdc",
  keywords: [
    "why choose CDC",
    "Gold Coast renovation builder",
    "QBCC licensed builder",
    "Master Builders Gold Coast",
    "trusted renovation company",
    "best renovation builder Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/why-cdc",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Why CDC", url: "/why-cdc" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <WhyCDCClient />
    </>
  );
}
