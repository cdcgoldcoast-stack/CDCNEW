"use client";

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  jsonLd?: object | object[];
};

export default function SEO(_: SEOProps) {
  return null;
}
