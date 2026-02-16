import type { Metadata } from "next";
import { PrintBrochureClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Print Brochure",
  description: "Internal print brochure export tool.",
  path: "/print-brochure",
  noIndex: true,
});

export default function Page() {
  return <PrintBrochureClient />;
}
