import type { Metadata } from "next";
import { BrandGuidelinesClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Brand Guidelines",
  description: "Internal Concept Design Construct brand guidelines.",
  path: "/brand-guidelines",
  noIndex: true,
});

export default function Page() {
  return <BrandGuidelinesClient />;
}
