import type { Metadata } from "next";
import { AdminIndexClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  description: "Internal administration area for Concept Design Construct.",
  path: "/admin",
  noIndex: true,
});

export default function Page() {
  return <AdminIndexClient />;
}
