import type { Metadata } from "next";
import { AdminReferralsClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin - Referrals",
  description: "Referral program submissions and commission tracking.",
  path: "/admin/referrals",
  noIndex: true,
});

export default function Page() {
  return <AdminReferralsClient />;
}
