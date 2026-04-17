import type { Metadata } from "next";
import { AdminLeadsClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin - Leads",
  description: "Unified inbox for every lead across forms, chat, and popups.",
  path: "/admin/leads",
  noIndex: true,
});

export default function Page() {
  return <AdminLeadsClient />;
}
