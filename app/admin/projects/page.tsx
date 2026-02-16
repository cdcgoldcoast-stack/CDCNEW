import type { Metadata } from "next";
import { AdminProjectsClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin - Projects",
  description: "Internal project administration area.",
  path: "/admin/projects",
  noIndex: true,
});

export default function Page() {
  return <AdminProjectsClient />;
}
