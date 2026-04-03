import type { Metadata } from "next";
import { AdminUsersClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin - Users",
  description: "Manage team members and access roles.",
  path: "/admin/users",
  noIndex: true,
});

export default function Page() {
  return <AdminUsersClient />;
}
