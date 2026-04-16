import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/auth",
          "/brand-guidelines",
          "/api/",
        ],
      },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Twitterbot", allow: "/" },
      { userAgent: "facebookexternalhit", allow: "/" },
    ],
    host: "https://www.cdconstruct.com.au",
    sitemap: "https://www.cdconstruct.com.au/sitemap.xml",
  };
}
