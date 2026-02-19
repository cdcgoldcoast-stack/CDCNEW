import {
  PRODUCTION_DOMAIN,
  SITE_NAME,
  SITE_ALTERNATE_NAME,
  BUSINESS_INFO,
  SERVICE_AREAS,
  withBrandDescription,
} from "@/config/seo";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProjectData {
  name: string;
  description: string;
  location: string | null;
  image: string;
  category: string;
  path?: string;
  publishedAt?: string;
  modifiedAt?: string;
  authorName?: string;
  tags?: string[];
}

const ORGANIZATION_ID = `${PRODUCTION_DOMAIN}#organization`;

/**
 * Generate FAQ Page structured data for rich snippets
 */
export const generateFAQSchema = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

/**
 * Generate WebPage + CreativeWork structured data for project pages
 */
export const generateProjectSchema = (project: ProjectData) => {
  const path = project.path || "";
  const pageUrl = `${PRODUCTION_DOMAIN}${path}`;
  const imageUrl = project.image.startsWith("http") ? project.image : `${PRODUCTION_DOMAIN}${project.image}`;
  const aboutTopics = [
    "Gold Coast renovation project",
    `${project.category} renovation`,
    project.location ? `${project.location} renovation` : "Gold Coast home renovation",
  ];

  const contentLocation = project.location
    ? {
        "@type": "Place",
        name: project.location,
        address: {
          "@type": "PostalAddress",
          addressLocality: project.location,
          addressRegion: SERVICE_AREAS.state,
          addressCountry: SERVICE_AREAS.country,
        },
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: `${project.name} Renovation Project`,
    description: project.description,
    url: pageUrl,
    image: imageUrl,
    about: aboutTopics,
    contentLocation,
    provider: {
      "@id": ORGANIZATION_ID,
    },
    mainEntity: {
      "@type": "CreativeWork",
      "@id": `${pageUrl}#creativework`,
      name: project.name,
      description: project.description,
      image: imageUrl,
      about: aboutTopics,
      genre: project.category,
      datePublished: project.publishedAt || undefined,
      dateModified: project.modifiedAt || undefined,
      mainEntityOfPage: pageUrl || undefined,
      contentLocation,
      provider: {
        "@id": ORGANIZATION_ID,
      },
      creator: {
        "@id": ORGANIZATION_ID,
      },
      author: {
        "@type": "Person",
        name: project.authorName || SITE_NAME,
      },
      publisher: {
        "@id": ORGANIZATION_ID,
      },
      keywords: project.tags?.length ? project.tags.join(", ") : undefined,
    },
  };
};

/**
 * Generate BreadcrumbList structured data
 */
export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${PRODUCTION_DOMAIN}${item.url}`,
  })),
});

/**
 * Generate ItemList structured data for portfolio/gallery pages
 */
export const generateItemListSchema = (
  items: Array<{ name: string; url: string; image: string; position: number }>
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: items.map((item) => ({
    "@type": "ListItem",
    position: item.position,
    item: {
      "@type": "CreativeWork",
      name: item.name,
      url: `${PRODUCTION_DOMAIN}${item.url}`,
      image: item.image.startsWith("http") ? item.image : `${PRODUCTION_DOMAIN}${item.image}`,
    },
  })),
});

/**
 * Generate AboutPage structured data
 */
export const generateAboutPageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${PRODUCTION_DOMAIN}/about-us#webpage`,
  name: `About ${SITE_NAME}`,
  description: withBrandDescription(
    `Learn about ${SITE_NAME}'s mission to deliver quality service with quality outcomes for Gold Coast home renovations.`,
  ),
  url: `${PRODUCTION_DOMAIN}/about-us`,
  mainEntity: {
    "@id": ORGANIZATION_ID,
    "@type": BUSINESS_INFO.type,
    name: SITE_NAME,
    url: PRODUCTION_DOMAIN,
    email: BUSINESS_INFO.email,
    areaServed: SERVICE_AREAS.primary.map(city => ({ "@type": "City", name: city })),
  },
});

/**
 * Generate ContactPage structured data
 */
export const generateContactPageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${PRODUCTION_DOMAIN}/book-renovation-consultation#webpage`,
  name: "Get a Quote - Gold Coast Home Renovation",
  description: withBrandDescription(
    "Start your Gold Coast renovation journey. Get a free consultation and quote for your kitchen, bathroom, or whole-home renovation project.",
  ),
  url: `${PRODUCTION_DOMAIN}/book-renovation-consultation`,
  mainEntity: {
    "@id": ORGANIZATION_ID,
    "@type": BUSINESS_INFO.type,
    name: SITE_NAME,
    email: BUSINESS_INFO.email,
    areaServed: SERVICE_AREAS.primary.map(city => ({ "@type": "City", name: city })),
  },
});

/**
 * Generate LocalBusiness schema for homepage and global branding.
 */
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": BUSINESS_INFO.type,
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  legalName: SITE_NAME,
  alternateName: SITE_ALTERNATE_NAME,
  brand: {
    "@type": "Brand",
    name: SITE_ALTERNATE_NAME,
  },
  description: withBrandDescription(
    "Gold Coast renovation builders for kitchens, bathrooms, and whole homes. Design-led, QBCC licensed. Free consultation.",
  ),
  url: PRODUCTION_DOMAIN,
  logo: `${PRODUCTION_DOMAIN}/logo.webp`,
  image: `${PRODUCTION_DOMAIN}/og-image.jpg`,
  email: BUSINESS_INFO.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: SERVICE_AREAS.primary[0],
    addressRegion: SERVICE_AREAS.state,
    addressCountry: SERVICE_AREAS.country,
  },
  areaServed: [
    ...SERVICE_AREAS.primary.map((city) => ({ "@type": "City", name: city })),
    { "@type": "State", name: SERVICE_AREAS.state },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: BUSINESS_INFO.openingHours.days,
    opens: BUSINESS_INFO.openingHours.opens,
    closes: BUSINESS_INFO.openingHours.closes,
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Gold Coast Renovation Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Kitchen Renovation Gold Coast",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Bathroom Renovation Gold Coast",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Whole Home Renovation Gold Coast",
        },
      },
    ],
  },
});
