interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  jsonLd?: object | object[];
}

// Next app routes own metadata and JSON-LD server-side.
// Keep the legacy component as a no-op so old SPA-era view code does not
// inject conflicting head tags on the client.
export const SEO = (_props: SEOProps) => null;

export default SEO;
