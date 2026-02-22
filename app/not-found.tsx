import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Page Not Found",
  description:
    "The requested page could not be found. Explore our Gold Coast renovation services and completed projects.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <h2 className="mb-4 text-xl font-normal text-muted-foreground">Oops! Page not found</h2>
        <div className="text-sm">
          <Link href="/" className="text-primary underline hover:text-primary/90">
            Return to the Gold Coast renovation home page
          </Link>
        </div>
      </div>
    </div>
  );
}
