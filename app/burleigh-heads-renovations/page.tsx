import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BurleighHeadsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Burleigh Heads Renovations | Kitchen, Bathroom & Home",
  description:
    "Coastal home renovations in Burleigh Heads capturing beachside character. Kitchen, bathroom and whole-home transformations. 25+ years on the Gold Coast. QBCC licensed.",
  path: "/burleigh-heads-renovations",
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/burleigh-heads-renovations",
    name: "Burleigh Heads Renovations | Kitchen, Bathroom & Home",
    description:
      "Coastal home renovations in Burleigh Heads capturing beachside character. Kitchen, bathroom and whole-home transformations. 25+ years on the Gold Coast. QBCC licensed.",
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Burleigh Heads Renovations", url: "/burleigh-heads-renovations" },
  ]);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, localBusinessSchema]} />
      <BurleighHeadsClient />
    </>
  );
}
