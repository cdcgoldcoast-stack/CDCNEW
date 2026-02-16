import type { Metadata } from "next";
import { AuthClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sign In",
  description: "Secure sign in page for Concept Design Construct internal access.",
  path: "/auth",
  noIndex: true,
});

export default function Page() {
  return <AuthClient />;
}
