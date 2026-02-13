/**
 * Centralised SEO Configuration
 * 
 * This file contains all SEO-related constants and configuration
 * to ensure consistent branding across the site.
 */

// Production domain - update this when connecting custom domain
const envDomain = (import.meta.env?.VITE_SITE_URL as string | undefined) || "";
export const PRODUCTION_DOMAIN = (envDomain ? envDomain.replace(/\/$/, "") : "https://cdconstruct.com.au");

// Site branding
export const SITE_NAME = "Concept Design Construct";
export const SITE_TAGLINE = "Gold Coast Home Renovations";

// Default meta content
export const DEFAULT_META = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: "Expert Gold Coast renovations for kitchens, bathrooms, and whole homes. QBCC licensed builders transforming Gold Coast homes. Free consultation.",
  image: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Gold-Coast-Renovations.webp",
};

// Service areas
export const SERVICE_AREAS = {
  primary: ["Gold Coast", "Brisbane"],
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
];

// Helper function to get full URL
export const getFullUrl = (path: string = "/") => {
  return `${PRODUCTION_DOMAIN}${path}`;
};

// Helper function to format page title
export const formatPageTitle = (pageTitle?: string) => {
  if (!pageTitle) return DEFAULT_META.title;
  return `${pageTitle} | ${SITE_NAME}`;
};
