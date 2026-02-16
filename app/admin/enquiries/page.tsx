import type { Metadata } from "next";
import { AdminEnquiriesClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin - Enquiries",
  description: "Internal enquiry management area.",
  path: "/admin/enquiries",
  noIndex: true,
});

export default function Page() {
  return <AdminEnquiriesClient />;
}
