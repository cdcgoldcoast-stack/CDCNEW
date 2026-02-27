import type { Metadata } from "next";
import Link from "next/link";
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
      <section className="py-16 md:py-20 bg-background">
        <div className="container-wide max-w-3xl text-foreground/80">
          <h1 className="font-serif text-h2-mobile md:text-h1 leading-tight mb-6">
            Burleigh Heads Renovations
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            This page is focused on renovation work in and around Burleigh Heads on the Gold Coast.
            Many projects start with a key space such as a kitchen or bathroom, then expand into
            whole-home layout changes once the right approach is clear. The goal is always to match
            the calm, coastal character of the area while improving everyday usability.
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            Typical Burleigh Heads renovations include re-working older floor plans to improve
            light and ventilation, updating bathrooms to current waterproofing standards, and
            reshaping kitchens for entertaining and family life. Projects are planned around
            realistic timelines and a clear sequence so that disruption is minimised.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            If you are considering a renovation in Burleigh Heads, you can use this page as a
            starting point before booking a consultation. From there, the team can talk through
            scope, staging, and budget for your specific home.
          </p>
          <h2 className="font-serif text-h3 md:text-h2 leading-tight mt-10 mb-4">
            Common Burleigh Renovation Priorities
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            In many older homes, priorities include better circulation between kitchen and living
            zones, stronger connection to outdoor areas, and more durable finishes that handle salt
            air and day-to-day family wear. Early planning is also where structural constraints and
            approval requirements become clear, helping avoid costly scope changes later.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-base md:text-lg leading-relaxed mb-4">
            <li>Stage works so your household can keep functioning during construction.</li>
            <li>Confirm fixtures and finishes early to reduce lead-time delays.</li>
            <li>Use layout decisions to improve storage, flow, and natural light.</li>
          </ul>
          <p className="text-base md:text-lg leading-relaxed">
            You can review broader service options on{" "}
            <Link href="/renovation-services" className="text-primary underline underline-offset-4">
              renovation services
            </Link>{" "}
            or go straight to{" "}
            <Link href="/book-renovation-consultation" className="text-primary underline underline-offset-4">
              book a renovation consultation
            </Link>
            .
          </p>
          <p className="text-base md:text-lg leading-relaxed mt-4">
            During consultation, the focus is on what will create the biggest day-to-day lift for
            your household first, then sequencing any secondary work so quality stays high and
            timelines remain realistic. This staged approach is often the most practical way to
            renovate in Burleigh without overextending budget or decision fatigue.
          </p>
        </div>
      </section>
      <BurleighHeadsClient />
    </>
  );
}
