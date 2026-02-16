import type { Metadata } from "next";
import { AdminSiteImagesClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin - Site Images",
  description: "Internal site image management area.",
  path: "/admin/site-images",
  noIndex: true,
});

export default function Page() {
  return <AdminSiteImagesClient />;
}
