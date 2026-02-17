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
const TITLE_MAX_LENGTH = 60;
const TITLE_ELLIPSIS = "...";

// Default meta content
export const DEFAULT_META = {
  title: "Gold Coast Renovations | Concept Design Construct",
  description:
    "Concept Design Construct (CD Construct) are Gold Coast renovation builders for kitchens, bathrooms, and whole-home transformations with design-led planning, QBCC licensed delivery, and timelines.",
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
  "CD Construct",
  "CD Construct Gold Coast",
];

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
    description: "Meet the team behind Concept Design Construct Gold Coast renovations.",
    includeInHeader: true,
    includeInFooter: true,
  },
  {
    path: "/renovation-projects",
    label: "Renovation Projects",
    description: "Browse completed Gold Coast renovations across kitchens, bathrooms, and full-home upgrades.",
    includeInHeader: true,
    includeInFooter: true,
  },
  {
    path: "/renovation-gallery",
    label: "Renovation Gallery",
    description: "Explore Gold Coast renovations inspiration across kitchens, bathrooms, and living spaces.",
    includeInHeader: true,
    includeInFooter: true,
  },
  {
    path: "/renovation-services",
    label: "Renovation Services",
    description: "View Gold Coast renovation services for bathrooms, kitchens, and whole-home upgrades.",
    includeInHeader: true,
    includeInFooter: true,
  },
  {
    path: "/renovation-life-stages",
    label: "Renovation Life Stages",
    description: "Plan Gold Coast renovations priorities around family stages, comfort, and long-term value.",
    includeInFooter: true,
  },
  {
    path: "/renovation-design-tools",
    label: "Renovation Design Tools",
    description: "Use Gold Coast renovation design tools to plan style, scope, and layout direction.",
    includeInHeader: true,
    includeInFooter: true,
  },
  {
    path: "/renovation-ai-generator",
    label: "Renovation AI Generator",
    description: "Preview Gold Coast renovations directions with AI before-and-after concept visuals.",
    includeInFooter: true,
  },
  {
    path: "/book-renovation-consultation",
    label: "Book Renovation Consultation",
    description: "Start your Gold Coast renovation quote and consultation process.",
    includeInFooter: true,
  },
];

export const HEADER_SITELINK_TARGETS = SITELINK_TARGETS.filter((target) => target.includeInHeader);
export const FOOTER_SITELINK_TARGETS = SITELINK_TARGETS.filter((target) => target.includeInFooter);

// Helper function to get full URL
export const getFullUrl = (path: string = "/") => {
  return `${PRODUCTION_DOMAIN}${path}`;
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
