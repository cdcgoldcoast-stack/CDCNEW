import type { Metadata } from "next";
import { DEFAULT_META, PRODUCTION_DOMAIN, SITE_NAME, SITELINK_TARGETS } from "@/config/seo";

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

const resolveImageUrl = (image: string) => (image.startsWith("http") ? image : `${SITE_URL}${image}`);

export const absoluteUrl = (path: string) => new URL(normalizePath(path), SITE_URL).toString();

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
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
  keywords,
  author = SITE_NAME,
  articlePublishedTime,
  articleModifiedTime,
  articleTags = [],
}: BuildMetadataOptions): Metadata => {
  const canonical = absoluteUrl(path);
  const imageUrl = resolveImageUrl(image);
  const cleanArticleTags = articleTags.filter(Boolean);
  const openGraph: Metadata["openGraph"] = {
    type,
    url: canonical,
    title,
    description,
    siteName: SITE_NAME,
    locale: DEFAULT_LOCALE,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };

  if (type === "article") {
    if (articlePublishedTime) {
      openGraph.publishedTime = articlePublishedTime;
    }
    if (articleModifiedTime) {
      openGraph.modifiedTime = articleModifiedTime;
    }
    if (author) {
      openGraph.authors = [author];
    }
    if (cleanArticleTags.length > 0) {
      openGraph.tags = cleanArticleTags;
    }
  }

  const otherMeta: Record<string, string> = {
    "twitter:domain": SITE_HOST,
    "twitter:url": canonical,
    "twitter:image:alt": title,
  };

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
    title,
    description,
    keywords,
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
        "x-default": SITE_URL,
      },
    },
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
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
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
  description,
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
  searchPath = "/project-gallery",
}: WebSiteSchemaOptions = {}) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: SITE_NAME,
    alternateName: "CD Construct",
    url: SITE_URL,
    inLanguage: "en-AU",
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
