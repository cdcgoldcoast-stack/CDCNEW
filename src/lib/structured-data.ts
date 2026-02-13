import { PRODUCTION_DOMAIN, SITE_NAME, BUSINESS_INFO, SERVICE_AREAS } from "@/config/seo";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProjectData {
  name: string;
  description: string;
  year: number | string | null;
  location: string | null;
  image: string;
  category: string;
}

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
 * Generate CreativeWork/Project structured data for project pages
 */
export const generateProjectSchema = (project: ProjectData) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: project.name,
  description: project.description,
  dateCreated: project.year?.toString() || undefined,
  locationCreated: project.location ? {
    "@type": "Place",
    name: project.location,
    address: {
      "@type": "PostalAddress",
      addressLocality: project.location,
      addressRegion: SERVICE_AREAS.state,
      addressCountry: SERVICE_AREAS.country,
    },
  } : undefined,
  image: project.image.startsWith("http") ? project.image : `${PRODUCTION_DOMAIN}${project.image}`,
  creator: {
    "@type": "Organization",
    name: SITE_NAME,
    url: PRODUCTION_DOMAIN,
  },
  genre: project.category,
});

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
  name: `About ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME}'s mission to deliver quality service with quality outcomes for Gold Coast home renovations.`,
  url: `${PRODUCTION_DOMAIN}/about-us`,
  mainEntity: {
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
  name: "Get a Quote - Gold Coast Home Renovation",
  description: "Start your Gold Coast renovation journey. Get a free consultation and quote for your kitchen, bathroom, or whole-home renovation project.",
  url: `${PRODUCTION_DOMAIN}/get-quote`,
  mainEntity: {
    "@type": BUSINESS_INFO.type,
    name: SITE_NAME,
    email: BUSINESS_INFO.email,
    areaServed: SERVICE_AREAS.primary.map(city => ({ "@type": "City", name: city })),
  },
});
