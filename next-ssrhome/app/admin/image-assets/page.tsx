import type { Metadata } from "next";
import { AdminImageAssetsClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin - Image Assets",
  description: "Internal image asset administration area.",
  path: "/admin/image-assets",
  noIndex: true,
});

export default function Page() {
  return <AdminImageAssetsClient />;
}
