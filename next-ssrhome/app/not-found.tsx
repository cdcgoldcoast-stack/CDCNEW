import type { Metadata } from "next";
import { NotFoundClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Page Not Found",
  description:
    "The requested page could not be found. Explore our Gold Coast renovation services and completed projects.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return <NotFoundClient />;
}
