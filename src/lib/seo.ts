/**
 * SEO helper utilities
 *
 * Provides metadata builders and schema generators used across pages
 * and validated by src/test/seo.test.ts.
 */

import {
  PRODUCTION_DOMAIN,
  SITE_NAME,
  SITE_ALTERNATE_NAME,
  PRIMARY_KEYWORDS,
  withBrandDescription,
} from "@/config/seo";

// ---------------------------------------------------------------------------
// buildMetadata – enriches per-page meta with brand keywords / description
// ---------------------------------------------------------------------------

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
}

interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
}

const INTERNAL_PATH_PREFIXES = ["/admin"];

export const buildMetadata = ({ title, description, path }: BuildMetadataInput): PageMetadata => {
  const isInternal = INTERNAL_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));

  if (isInternal) {
    return { title, description, keywords: [] };
  }

  return {
    title,
    description: withBrandDescription(description),
    keywords: [...PRIMARY_KEYWORDS],
  };
};

// ---------------------------------------------------------------------------
// generateWebSiteSchema – WebSite JSON-LD with SearchAction
// ---------------------------------------------------------------------------

export const generateWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${PRODUCTION_DOMAIN}#website`,
  name: SITE_NAME,
  alternateName: SITE_ALTERNATE_NAME,
  url: PRODUCTION_DOMAIN,
  description: withBrandDescription(
    "Gold Coast renovation builders for kitchens, bathrooms, and whole-home transformations.",
  ),
  keywords: [...PRIMARY_KEYWORDS],
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    url: PRODUCTION_DOMAIN,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${PRODUCTION_DOMAIN}/renovation-gallery?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});
