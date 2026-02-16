import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ServicesClient } from "@/components/route-clients";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { buildMetadata, generateServiceCatalogSchema, generateWebPageSchema } from "@/lib/seo";

const pageTitle = "Gold Coast Renovation Services";
const pageDescription =
  "Explore Gold Coast renovation services for kitchens, bathrooms, whole-home upgrades, and extensions with design-led planning and QBCC licensed builds.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/services",
  keywords: [
    "Gold Coast renovation services",
    "kitchen renovation Gold Coast",
    "bathroom renovation Gold Coast",
    "whole-home renovations Gold Coast",
    "home extensions Gold Coast",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/services",
    name: pageTitle,
    description: pageDescription,
  });
  const serviceCatalogSchema = generateServiceCatalogSchema([
    "Kitchen Renovation Gold Coast",
    "Bathroom Renovation Gold Coast",
    "Whole-Home Renovation Gold Coast",
    "Home Extensions Gold Coast",
  ]);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, serviceCatalogSchema, breadcrumbSchema]} />
      <ServicesClient />
    </>
  );
}
