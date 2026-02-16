import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { PrivacyPolicyClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Privacy Policy";
const pageDescription =
  "Read how Concept Design Construct manages personal information for visitors exploring Gold Coast renovation services and requesting consultations.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/privacy-policy",
  keywords: ["privacy policy", "Gold Coast renovation website privacy", "Concept Design Construct policy"],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/privacy-policy",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <PrivacyPolicyClient />
    </>
  );
}
