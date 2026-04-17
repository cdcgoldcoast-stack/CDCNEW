import type { Metadata } from "next";
import { AdminBlogClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin - Blog",
  description: "Manage blog posts.",
  path: "/admin/blog",
  noIndex: true,
});

export default function Page() {
  return <AdminBlogClient />;
}
