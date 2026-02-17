import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { PRODUCTION_DOMAIN, SITE_NAME, DEFAULT_META, formatPageTitle } from "@/config/seo";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  jsonLd?: object | object[];
}

const normalizeCanonicalPath = (path: string) => {
  const withoutQueryOrHash = path.split(/[?#]/)[0] || "/";
  const withLeadingSlash = withoutQueryOrHash.startsWith("/")
    ? withoutQueryOrHash
    : `/${withoutQueryOrHash}`;

  if (withLeadingSlash === "/") {
    return "/";
  }

  return withLeadingSlash.replace(/\/+$/, "");
};

const resolvePath = (url: string) => {
  try {
    return new URL(url, PRODUCTION_DOMAIN).pathname;
  } catch {
    return url;
  }
};

const normalizeDescription = (value: string) => value.trim().replace(/\s+/g, " ");

export const SEO = ({
  title,
  description = DEFAULT_META.description,
  image = DEFAULT_META.image,
  url,
  type = "website",
  noIndex = false,
  jsonLd,
}: SEOProps) => {
  const location = useLocation();
  const fullTitle = formatPageTitle(title);
  const fullDescription = normalizeDescription(description || DEFAULT_META.description);
  const canonicalPath = normalizeCanonicalPath(resolvePath(url || location.pathname || "/"));
  const canonicalUrl = new URL(canonicalPath, PRODUCTION_DOMAIN).toString();
  const canonicalDomain = new URL(PRODUCTION_DOMAIN).hostname;
  const imageUrl = image.startsWith("http") ? image : `${PRODUCTION_DOMAIN}${image}`;
  const twitterImageAlt = fullTitle.toLowerCase().includes("gold coast")
    ? fullTitle
    : `${fullTitle} | Gold Coast Renovations by ${SITE_NAME}`;
  const robotsContent = noIndex ? "noindex, nofollow" : "index, follow";

  // Handle both single object and array of JSON-LD schemas
  const renderJsonLd = () => {
    if (!jsonLd) return null;
    
    if (Array.isArray(jsonLd)) {
      return jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ));
    }
    
    return (
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    );
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="robots" content={robotsContent} />
      <link key="canonical" rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta key="og:url" property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_AU" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:domain" content={canonicalDomain} />
      <meta key="twitter:url" name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={twitterImageAlt} />

      {/* JSON-LD Structured Data */}
      {renderJsonLd()}
    </Helmet>
  );
};

export default SEO;
