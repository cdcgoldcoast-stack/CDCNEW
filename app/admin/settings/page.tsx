import type { Metadata } from "next";
import { AdminSettingsClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin - Account Settings",
  description: "Internal account settings page.",
  path: "/admin/settings",
  noIndex: true,
});

export default function Page() {
  return <AdminSettingsClient />;
}
