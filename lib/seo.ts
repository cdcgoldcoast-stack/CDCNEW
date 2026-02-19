import type { Metadata } from "next";
import {
  DEFAULT_META,
  PRODUCTION_DOMAIN,
  SITE_NAME,
  SITE_ALTERNATE_NAME,
  SITELINK_TARGETS,
  formatPageTitle,
  withBrandDescription,
} from "@/config/seo";

export const SITE_URL = PRODUCTION_DOMAIN;
export const SITE_HOST = "www.cdconstruct.com.au";
export const DEFAULT_OG_IMAGE = DEFAULT_META.image;
export const DEFAULT_LOCALE = "en_AU";

const normalizePath = (path: string) => {
  if (!path) return "/";
  const cleaned = path.split(/[?#]/)[0] || "/";
  const withLeadingSlash = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  if (withLeadingSlash === "/") return "/";
  return withLeadingSlash.replace(/\/+$/, "");
};

export const absoluteUrl = (path: string) => {
  const baseDomain = SITE_URL.replace(/\/+$/, "");
  const normalizedPath = normalizePath(path);
  if (normalizedPath === "/") return baseDomain;
  return new URL(normalizedPath, `${baseDomain}/`).toString();
};

export const titleFromSlug = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
  author?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleTags?: string[];
};

export const buildMetadata = ({
  title,
  description,
  path,
  image: _image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
  keywords = [],
  author = SITE_NAME,
  articlePublishedTime,
  articleModifiedTime,
  articleTags = [],
}: BuildMetadataOptions): Metadata => {
  const safeTitle = formatPageTitle(title);
  const normalizedPath = normalizePath(path);
  const isInternalRoute = normalizedPath.startsWith("/admin") || normalizedPath.startsWith("/auth");
  const safeDescription = noIndex || isInternalRoute ? description : withBrandDescription(description);
  const baseKeywords = noIndex || isInternalRoute ? [] : [SITE_NAME, SITE_ALTERNATE_NAME];
  const allKeywords = Array.from(
    new Set(
      [...keywords, ...baseKeywords]
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    ),
  );
  const canonical = absoluteUrl(path);
  void _image;
  const cleanArticleTags = articleTags.filter(Boolean);

  const otherMeta: Record<string, string> = {};

  if (type === "article") {
    if (articlePublishedTime) {
      otherMeta["article:published_time"] = articlePublishedTime;
    }
    if (articleModifiedTime) {
      otherMeta["article:modified_time"] = articleModifiedTime;
    }
    if (author) {
      otherMeta["article:author"] = author;
    }
    if (cleanArticleTags.length > 0) {
      otherMeta["article:tag"] = cleanArticleTags.join(", ");
    }
  }

  return {
    title: safeTitle,
    description: safeDescription,
    authors: [{ name: author }],
    creator: author,
    publisher: SITE_NAME,
    referrer: "strict-origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical,
      languages: {
        "en-AU": canonical,
        "x-default": canonical,
      },
    },
    keywords: allKeywords.length > 0 ? allKeywords : undefined,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    other: otherMeta,
  };
};

export const generateWebPageSchema = ({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${absoluteUrl(path)}#webpage`,
  name,
  description: withBrandDescription(description),
  url: absoluteUrl(path),
  inLanguage: "en-AU",
  isPartOf: {
    "@id": `${SITE_URL}#website`,
  },
  about: {
    "@id": `${SITE_URL}#organization`,
  },
  publisher: {
    "@id": `${SITE_URL}#organization`,
  },
});

export const generateServiceCatalogSchema = (services: string[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Gold Coast Renovation Services",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: service,
      areaServed: {
        "@type": "City",
        name: "Gold Coast",
      },
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  })),
});

type WebSiteSchemaOptions = {
  enableSearchAction?: boolean;
  searchPath?: string;
};

export const generateWebSiteSchema = ({
  enableSearchAction = false,
  searchPath = "/renovation-gallery",
}: WebSiteSchemaOptions = {}) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    url: SITE_URL,
    inLanguage: "en-AU",
    keywords: [
      "Concept Design Construct",
      "CD Construct",
      "Concept Design Construct Gold Coast",
      "CD Construct Gold Coast",
      "Gold Coast renovations",
    ],
    publisher: {
      "@id": `${SITE_URL}#organization`,
    },
    about: "Gold Coast renovations",
    hasPart: SITELINK_TARGETS.map((target) => ({
      "@type": "WebPage",
      "@id": `${absoluteUrl(target.path)}#webpage`,
      name: target.label,
      description: target.description,
      url: absoluteUrl(target.path),
    })),
  };

  if (enableSearchAction) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: `${absoluteUrl(searchPath)}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    };
  }

  return schema;
};
