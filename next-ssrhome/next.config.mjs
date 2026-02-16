import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_riMzmbUjAEXtvSij0Ho2Ew_eGK9ChO8";
const isDevelopment = process.env.NODE_ENV === "development";

const readRootEnvValue = (key) => {
  const envFiles = [
    path.resolve(__dirname, "..", ".env.local"),
    path.resolve(__dirname, "..", ".env"),
  ];

  for (const filePath of envFiles) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match) continue;

      const [, envKey, rawValue] = match;
      if (envKey !== key) continue;

      const value = rawValue.trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        return value.slice(1, -1);
      }

      return value;
    }
  }

  return undefined;
};

const resolvedSupabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  readRootEnvValue("NEXT_PUBLIC_SUPABASE_URL") ||
  readRootEnvValue("VITE_SUPABASE_URL") ||
  "https://iqugsxeejieneyksfbza.supabase.co";

const resolvedSupabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  readRootEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
  readRootEnvValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
  readRootEnvValue("VITE_SUPABASE_ANON_KEY") ||
  readRootEnvValue("VITE_SUPABASE_PUBLISHABLE_KEY") ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  typescript: {
    // Temporary while shared source is split across root + next-ssrhome.
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: resolvedSupabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: resolvedSupabaseAnonKey,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iqugsxeejieneyksfbza.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    const scriptSrc = isDevelopment
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net"
      : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net";
    const cspValue =
      `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; ` +
      "font-src 'self'; connect-src 'self' https://iqugsxeejieneyksfbza.supabase.co https://www.google-analytics.com https://www.facebook.com; " +
      "frame-ancestors 'none'; base-uri 'self'; form-action 'self';";

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspValue,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination:
          "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Master-Builders.webp",
        permanent: true,
      },
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
      {
        source: "/our-story",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/projects/:slug",
        destination: "/renovation-projects/:slug",
        permanent: true,
      },
      {
        source: "/projects",
        destination: "/renovation-projects",
        permanent: true,
      },
      {
        source: "/gallery",
        destination: "/project-gallery",
        permanent: true,
      },
      {
        source: "/design-tools/ai-generator/intro",
        destination: "/renovation-design-tools/ai-generator/intro",
        permanent: true,
      },
      {
        source: "/design-tools/ai-generator",
        destination: "/renovation-design-tools/ai-generator",
        permanent: true,
      },
      {
        source: "/design-tools/moodboard",
        destination: "/renovation-design-tools/moodboard",
        permanent: true,
      },
      {
        source: "/design-tools",
        destination: "/renovation-design-tools",
        permanent: true,
      },
      {
        source: "/ssrhome",
        destination: "/",
        permanent: false,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@/hooks/useSiteAssets$": path.resolve(__dirname, "compat/useSiteAssets.ts"),
      "@/data/projects$": path.resolve(__dirname, "compat/projects.ts"),
      "@/integrations/supabase/client$": path.resolve(__dirname, "compat/supabase-client.ts"),
      "@/config/endpoints$": path.resolve(__dirname, "compat/endpoints.ts"),
      "@/components/SEO$": path.resolve(__dirname, "compat/SEO.tsx"),
      "@/components/JsonLd$": path.resolve(__dirname, "components/JsonLd.tsx"),
      "@/components/route-clients$": path.resolve(__dirname, "components/route-clients.tsx"),
      "@/lib/metaPixel$": path.resolve(__dirname, "compat/metaPixel.ts"),
      "@/lib/seo$": path.resolve(__dirname, "lib/seo.ts"),
      "@/components/ResponsiveImage$": path.resolve(__dirname, "compat/ResponsiveImage.tsx"),
      "@/components/ui/button$": path.resolve(__dirname, "compat/button.tsx"),
      "react-router-dom$": path.resolve(__dirname, "compat/react-router-dom.tsx"),
      "@": path.resolve(__dirname, "../src"),
    };

    return config;
  },
};

export default nextConfig;
