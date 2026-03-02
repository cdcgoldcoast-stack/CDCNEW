import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { TestimonialsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Client Testimonials | Gold Coast Renovations";
const pageDescription =
  "Read real testimonials from Gold Coast homeowners who have renovated with Concept Design Construct. 4.9-star Google rating from 47 reviews.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/testimonials",
  keywords: [
    "renovation reviews Gold Coast",
    "Gold Coast builder testimonials",
    "CD Construct reviews",
    "renovation client feedback",
    "home renovation testimonials",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/testimonials",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Testimonials", url: "/testimonials" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <TestimonialsClient />
    </>
  );
}
