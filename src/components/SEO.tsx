import { Helmet } from "react-helmet-async";
import { PRODUCTION_DOMAIN, SITE_NAME, DEFAULT_META } from "@/config/seo";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  jsonLd?: object | object[];
}

export const SEO = ({
  title,
  description = DEFAULT_META.description,
  image = DEFAULT_META.image,
  url,
  type = "website",
  noIndex = false,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title 
    ? `${title} | ${SITE_NAME}` 
    : DEFAULT_META.title;
  const canonicalUrl = new URL(url || "/", PRODUCTION_DOMAIN).toString();
  const imageUrl = image.startsWith("http") ? image : `${PRODUCTION_DOMAIN}${image}`;
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
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_AU" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Structured Data */}
      {renderJsonLd()}
    </Helmet>
  );
};

export default SEO;
