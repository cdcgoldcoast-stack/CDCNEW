import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Dashboard | Admin",
  description: "Internal administration dashboard.",
  path: "/admin/dashboard",
  noIndex: true,
});

export default function Page() {
  return <AdminDashboardClient />;
}
