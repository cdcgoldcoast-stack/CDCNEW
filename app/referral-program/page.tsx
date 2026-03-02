import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ReferralProgramClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Referral Program | Earn Up To $2,000 Per Referral";
const pageDescription =
  "Know a Gold Coast homeowner thinking about renovating? Refer them to CDC and earn up to $2,000 when the project goes ahead. No experience required.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/referral-program",
  keywords: [
    "renovation referral program",
    "Gold Coast renovation referral",
    "earn money referring renovations",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/referral-program",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Referral Program", url: "/referral-program" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <ReferralProgramClient />
    </>
  );
}
