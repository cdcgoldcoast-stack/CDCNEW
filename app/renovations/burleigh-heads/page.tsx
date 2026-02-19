import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { BurleighHeadsClient } from "@/components/route-clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Burleigh Heads Renovations | Kitchen, Bathroom & Home",
  description:
    "Renovation builders in Burleigh Heads. Kitchen, bathroom & whole-home renovations. 25+ years experience. QBCC licensed. Local Broadbeach team. Free consultation.",
  path: "/renovations/burleigh-heads",
});

export default function Page() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Concept Design Construct - Burleigh Heads Renovations",
    description:
      "Kitchen, bathroom and whole-home renovation builders servicing Burleigh Heads and surrounding Gold Coast suburbs.",
    url: "https://www.cdconstruct.com.au/renovations/burleigh-heads",
    telephone: "1300-020-232",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1907/22 Surf Parade",
      addressLocality: "Broadbeach",
      addressRegion: "QLD",
      postalCode: "4218",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -28.1029,
      longitude: 153.4487,
    },
    areaServed: {
      "@type": "City",
      name: "Burleigh Heads",
    },
    serviceType: ["Kitchen Renovations", "Bathroom Renovations", "Whole Home Renovations"],
  };

  return (
    <>
      <JsonLd data={[localBusinessSchema]} />
      <BurleighHeadsClient />
    </>
  );
}
