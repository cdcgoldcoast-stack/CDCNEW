/**
 * Centralised SEO Configuration
 * 
 * This file contains all SEO-related constants and configuration
 * to ensure consistent branding across the site.
 */

// Production canonical host used across canonical/og/twitter URLs.
export const PRODUCTION_DOMAIN = "https://www.cdconstruct.com.au";

// Site branding
export const SITE_NAME = "Concept Design Construct";
export const SITE_TAGLINE = "Gold Coast Home Renovations";
export const SITE_ALTERNATE_NAME = "CD Construct";
const TITLE_MAX_LENGTH = 60;
const TITLE_ELLIPSIS = "...";

// Default meta content
export const DEFAULT_META = {
  title: "Concept Design Construct (CD Construct) | Gold Coast",
  description:
    "Concept Design Construct (CD Construct) are Gold Coast renovation builders for kitchens, bathrooms, and whole-home transformations with design-led planning, QBCC licensed delivery, and clear timelines.",
  image: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Gold-Coast-Renovations.webp",
};

// Service areas
export const SERVICE_AREAS = {
  primary: ["Gold Coast"],
  suburbs: [
    "Burleigh Heads",
    "Mermaid Beach", 
    "Broadbeach",
    "Robina",
    "Southport",
    "Palm Beach",
    "Currumbin",
  ],
  region: "South East Queensland",
  state: "Queensland",
  country: "AU",
};

// Business information
export const BUSINESS_INFO = {
  name: SITE_NAME,
  type: "HomeAndConstructionBusiness",
  email: "info@cdconstruct.com.au",
  priceRange: "$$$$",
  geo: {
    latitude: "-28.0167",
    longitude: "153.4000",
  },
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "17:00",
  },
};

// Primary keywords for SEO
export const PRIMARY_KEYWORDS = [
  "Gold Coast renovations",
  "Gold Coast home renovations",
  "kitchen renovation Gold Coast",
  "bathroom renovation Gold Coast",
  "whole home renovation Gold Coast",
  "Gold Coast builders",
  "QBCC licensed builder Gold Coast",
  "Concept Design Construct",
  SITE_ALTERNATE_NAME,
  "Concept Design Construct Gold Coast",
  "CD Construct Gold Coast",
];

const normalizeSentence = (value: string) => value.trim().replace(/\s+/g, " ").replace(/[.,;:!?]+$/g, "");

const hasKeyword = (value: string, keyword: string) => value.toLowerCase().includes(keyword.toLowerCase());

export const withBrandDescription = (description: string) => {
  const cleanDescription = normalizeSentence(description);
  if (!cleanDescription) {
    return `${SITE_NAME} (${SITE_ALTERNATE_NAME}) delivers Gold Coast renovations.`;
  }

  const hasPrimaryBrand = hasKeyword(cleanDescription, SITE_NAME);
  const hasAlternateBrand = hasKeyword(cleanDescription, SITE_ALTERNATE_NAME);

  if (hasPrimaryBrand && hasAlternateBrand) {
    return `${cleanDescription}.`;
  }

  if (!hasPrimaryBrand && !hasAlternateBrand) {
    return `${cleanDescription} by ${SITE_NAME} (${SITE_ALTERNATE_NAME}).`;
  }

  if (hasPrimaryBrand) {
    return `${cleanDescription} (${SITE_ALTERNATE_NAME}).`;
  }

  return `${cleanDescription} (${SITE_NAME}).`;
};

export type SitelinkTarget = {
  path: string;
  label: string;
  description: string;
  includeInHeader?: boolean;
  includeInFooter?: boolean;
};

// Core indexable routes we want Google to understand as primary sitelink candidates.
export const SITELINK_TARGETS: SitelinkTarget[] = [
  {
    path: "/about-us",
    label: "About Us",
    description: withBrandDescription("Meet the team behind Gold Coast renovations."),
    includeInHeader: true,
    includeInFooter: true,
  },
  {
    path: "/renovation-projects",
    label: "Renovation Projects",
    description: withBrandDescription(
      "Browse completed Gold Coast renovations across kitchens, bathrooms, and full-home upgrades.",
    ),
    includeInHeader: true,
    includeInFooter: true,
  },
  {
    path: "/renovation-gallery",
    label: "Renovation Gallery",
    description: withBrandDescription(
      "Explore Gold Coast renovations inspiration across kitchens, bathrooms, and living spaces.",
    ),
    includeInHeader: true,
    includeInFooter: true,
  },
  {
    path: "/renovation-services",
    label: "Renovation Services",
    description: withBrandDescription(
      "View Gold Coast renovation services for bathrooms, kitchens, and whole-home upgrades.",
    ),
    includeInHeader: true,
    includeInFooter: true,
  },
  {
    path: "/renovation-life-stages",
    label: "Renovation Life Stages",
    description: withBrandDescription(
      "Plan Gold Coast renovations priorities around family stages, comfort, and long-term value.",
    ),
    includeInFooter: true,
  },
  {
    path: "/renovation-design-tools",
    label: "Renovation Design Tools",
    description: withBrandDescription("Use Gold Coast renovation design tools to plan style, scope, and layout direction."),
    includeInHeader: true,
    includeInFooter: true,
  },
  {
    path: "/renovation-ai-generator",
    label: "Renovation AI Generator",
    description: withBrandDescription("Preview Gold Coast renovations directions with AI before-and-after concept visuals."),
    includeInFooter: true,
  },
  {
    path: "/book-renovation-consultation",
    label: "Book Renovation Consultation",
    description: withBrandDescription("Start your Gold Coast renovation quote and consultation process."),
    includeInFooter: true,
  },
  {
    path: "/kitchen-renovations-gold-coast",
    label: "Kitchen Renovations",
    description: withBrandDescription("Gold Coast kitchen renovations with bespoke designs and quality craftsmanship."),
    includeInHeader: false,
    includeInFooter: true,
  },
  {
    path: "/bathroom-renovations-gold-coast",
    label: "Bathroom Renovations",
    description: withBrandDescription("Gold Coast bathroom renovations with waterproofing-led construction."),
    includeInHeader: false,
    includeInFooter: true,
  },
  {
    path: "/whole-home-renovations-gold-coast",
    label: "Whole-Home Renovations",
    description: withBrandDescription("Gold Coast whole-home renovations and complete house transformations."),
    includeInHeader: false,
    includeInFooter: true,
  },
  // Location pages
  {
    path: "/broadbeach-renovations",
    label: "Broadbeach Renovations",
    description: withBrandDescription("Renovation builders in Broadbeach. Based locally."),
    includeInHeader: false,
    includeInFooter: true,
  },
  {
    path: "/mermaid-beach-renovations",
    label: "Mermaid Beach Renovations",
    description: withBrandDescription("Coastal home renovations in Mermaid Beach."),
    includeInHeader: false,
    includeInFooter: true,
  },
  {
    path: "/palm-beach-renovations",
    label: "Palm Beach Renovations",
    description: withBrandDescription("Family home renovations in Palm Beach."),
    includeInHeader: false,
    includeInFooter: true,
  },
  {
    path: "/robina-renovations",
    label: "Robina Renovations",
    description: withBrandDescription("90s home modernisation in Robina."),
    includeInHeader: false,
    includeInFooter: true,
  },
  {
    path: "/southport-renovations",
    label: "Southport Renovations",
    description: withBrandDescription("Character home renovations in Southport."),
    includeInHeader: false,
    includeInFooter: true,
  },
];

export const HEADER_SITELINK_TARGETS = SITELINK_TARGETS.filter((target) => target.includeInHeader);
export const FOOTER_SITELINK_TARGETS = SITELINK_TARGETS.filter((target) => target.includeInFooter);

// Helper function to get full URL
export const getFullUrl = (path: string = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/") return PRODUCTION_DOMAIN;
  return `${PRODUCTION_DOMAIN}${normalizedPath.replace(/\/+$/, "")}`;
};

type ProjectMetaDescriptionInput = {
  projectName: string;
  category: string;
  location?: string | null;
  summary?: string | null;
};

export const buildProjectMetaDescription = ({
  projectName,
  category,
  location,
  summary,
}: ProjectMetaDescriptionInput) => {
  const safeName = projectName.trim();
  const safeCategory = (category || "renovation").replace(/-/g, " ").trim();
  const safeLocation = (location || "Gold Coast").trim();
  const cleanSummary = normalizeSentence(summary || "");
  const brandTail = `by ${SITE_NAME} (${SITE_ALTERNATE_NAME})`;
  const contextualTail = `${safeName} is a ${safeCategory} renovation project in ${safeLocation} ${brandTail}`;

  if (!cleanSummary) {
    return `${contextualTail}.`;
  }

  const lowerSummary = cleanSummary.toLowerCase();
  const hasName = lowerSummary.includes(safeName.toLowerCase());
  const hasLocation = lowerSummary.includes(safeLocation.toLowerCase()) || lowerSummary.includes("gold coast");
  const hasPrimaryBrand = hasKeyword(lowerSummary, SITE_NAME);
  const hasAlternateBrand = hasKeyword(lowerSummary, SITE_ALTERNATE_NAME);

  if (hasName && hasLocation && hasPrimaryBrand && hasAlternateBrand) {
    return `${cleanSummary}.`;
  }

  if (hasName && hasLocation) {
    return `${cleanSummary}. Project delivered ${brandTail}.`;
  }

  return `${cleanSummary}. ${contextualTail}.`;
};

const truncateTitle = (title: string) => {
  const cleanTitle = title.trim();
  if (cleanTitle.length <= TITLE_MAX_LENGTH) return cleanTitle;

  const sliced = cleanTitle.slice(0, TITLE_MAX_LENGTH - TITLE_ELLIPSIS.length).trim();
  const lastWordBoundary = sliced.lastIndexOf(" ");
  const cutAt = lastWordBoundary > 35 ? lastWordBoundary : sliced.length;
  return `${sliced.slice(0, cutAt).trim()}${TITLE_ELLIPSIS}`;
};

// Helper function to format page title
export const formatPageTitle = (pageTitle?: string) => {
  if (!pageTitle?.trim()) return truncateTitle(DEFAULT_META.title);

  const cleanTitle = pageTitle.trim();
  const hasBrand = cleanTitle.toLowerCase().includes(SITE_NAME.toLowerCase());
  const brandedTitle = hasBrand ? cleanTitle : `${cleanTitle} | ${SITE_NAME}`;
  const preferredTitle = brandedTitle.length <= TITLE_MAX_LENGTH ? brandedTitle : cleanTitle;

  return truncateTitle(preferredTitle);
};
