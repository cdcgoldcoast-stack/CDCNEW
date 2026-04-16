import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { HomeExtensionsClient } from "@/components/route-clients";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "@/config/seo";

const pageTitle = "Gold Coast Home Extensions | CD Construct";
const pageDescription =
  "Home extensions and room additions on the Gold Coast. Second storey additions, granny flats & garage conversions. Council approvals handled. QBCC licensed builders.";

const serviceFaqs = [
  {
    question: "How much does a home extension cost on the Gold Coast?",
    answer:
      "Home extension costs on the Gold Coast vary significantly based on size and complexity. Ground floor room additions typically start from $80,000-$150,000, second storey additions from $150,000-$300,000+, and granny flats from $120,000-$200,000. These ranges include council approvals, engineering, and construction. We provide detailed fixed-price quotes after a thorough site assessment.",
  },
  {
    question: "How long does a home extension take to build?",
    answer:
      "Home extensions typically take 8-20 weeks of construction time, depending on size and complexity. Ground floor additions are usually 8-12 weeks, while second storey additions may take 14-20 weeks. Allow an additional 4-8 weeks prior to construction for design, engineering, and council approvals.",
  },
  {
    question: "Do you handle council approvals for home extensions?",
    answer:
      "Yes, we manage the entire approval process from start to finish. This includes preparing architectural drawings, engaging structural engineers, submitting Development Applications (DA) and Building Applications (BA) to the City of Gold Coast, and coordinating with private building certifiers. We keep you informed at every stage.",
  },
  {
    question: "Can you add a second storey to my existing home?",
    answer:
      "In most cases, yes. Second storey additions are one of our core services. We begin with a structural assessment of your existing home to determine what reinforcement may be needed. Our designs ensure the new level integrates seamlessly with the existing architecture, both structurally and aesthetically.",
  },
  {
    question: "Will a home extension match my existing home?",
    answer:
      "Seamless integration is a priority in every extension we build. We carefully match rooflines, cladding, window styles, and interior finishes so the extension looks like it was always part of the home. Our designers work closely with you to ensure architectural consistency throughout.",
  },
  {
    question: "Can I live in my home during a home extension?",
    answer:
      "For most ground floor extensions and granny flats, yes. We stage the work to minimise disruption and maintain safe access to your home. Second storey additions may require temporary relocation during certain phases, particularly when the existing roof is removed. We discuss this during the planning stage so you can prepare.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/home-extensions-gold-coast",
  keywords: [
    "home extension Gold Coast",
    "Gold Coast home extensions",
    "room addition Gold Coast",
    "second storey addition Gold Coast",
    "granny flat Gold Coast",
    "garage conversion Gold Coast",
    "house extension builder Gold Coast",
    "home extension cost Gold Coast",
    "Gold Coast renovation builder",
    "QBCC home extension builder",
  ],
});

export default function Page() {
  const webPageSchema = generateWebPageSchema({
    path: "/home-extensions-gold-coast",
    name: pageTitle,
    description: pageDescription,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Home Extensions Gold Coast", url: "/home-extensions-gold-coast" },
  ]);

  const faqSchema = generateFAQSchema(serviceFaqs);

  // Service schema for rich snippets
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Home Extension Gold Coast",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
    },
    areaServed: {
      "@type": "City",
      name: "Gold Coast",
    },
    description: pageDescription,
    serviceType: "Home Extension",
  };

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema, serviceSchema]} />
      <HomeExtensionsClient />
    </>
  );
}
