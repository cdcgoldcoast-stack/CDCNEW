import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { AboutUsClient } from "@/components/route-clients";
import { generateAboutPageSchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "About Our Gold Coast Renovation Team | Since 2000";
const pageDescription =
  "Meet Concept Design Construct, QBCC licensed specialists delivering Gold Coast renovations across kitchen, bathroom, extension, and whole-home projects since 2000.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/about-us",
  keywords: [
    "about gold coast renovation builder",
    "QBCC licensed builder Gold Coast",
    "home renovation company Gold Coast",
  ],
});

export default function Page() {
  const aboutSchema = generateAboutPageSchema();
  const webPageSchema = generateWebPageSchema({
    path: "/about-us",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Gold Coast Renovation Team", url: "/about-us" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, aboutSchema, breadcrumbSchema]} />
      <AboutUsClient />
    </>
  );
}
