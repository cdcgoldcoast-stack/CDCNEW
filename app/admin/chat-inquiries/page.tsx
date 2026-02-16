import type { Metadata } from "next";
import { AdminChatInquiriesClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin - Chat Inquiries",
  description: "Internal AI chat enquiry management area.",
  path: "/admin/chat-inquiries",
  noIndex: true,
});

export default function Page() {
  return <AdminChatInquiriesClient />;
}
