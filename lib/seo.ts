import type { Metadata } from "next";
import { DEFAULT_META, PRODUCTION_DOMAIN, SITE_NAME } from "@/config/seo";

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
};

export const buildMetadata = ({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
  keywords,
}: BuildMetadataOptions): Metadata => {
  const canonical = absoluteUrl(path);
  const imageUrl = resolveImageUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        "en-AU": canonical,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "twitter:domain": SITE_HOST,
      "twitter:url": canonical,
      "twitter:image:alt": title,
    },
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
  name,
  description,
  url: absoluteUrl(path),
  inLanguage: "en-AU",
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
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

export const generateWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en-AU",
  about: "Gold Coast renovations",
});
