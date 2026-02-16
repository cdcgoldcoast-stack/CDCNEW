import type { Metadata } from "next";
import { AdminGalleryClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin - Gallery",
  description: "Internal gallery management area.",
  path: "/admin/gallery",
  noIndex: true,
});

export default function Page() {
  return <AdminGalleryClient />;
}
