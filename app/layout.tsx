import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import AppProviders from "../components/AppProviders";
import { DEFAULT_META, PRODUCTION_DOMAIN, SITE_NAME } from "@/config/seo";
import { GTM_CONTAINER_ID } from "@/lib/analytics";
import "./globals.css";

const GTM_NOSCRIPT_URL = `https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`;

const SITE_URL = PRODUCTION_DOMAIN;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_META.title,
    template: "%s",
  },
  description: DEFAULT_META.description,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  referrer: "strict-origin-when-cross-origin",
  generator: "Next.js",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-AU": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  icons: {
    icon: [{ url: "/favicon-v2.png?v=2", type: "image/png", sizes: "256x256" }],
    shortcut: [{ url: "/favicon-v2.png?v=2", type: "image/png" }],
    apple: [{ url: "/favicon-v2.png?v=2", type: "image/png", sizes: "256x256" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || undefined,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f2e8",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="icon" type="image/png" href="/favicon-v2.png?v=2" sizes="256x256" />
        <link rel="dns-prefetch" href="//iqugsxeejieneyksfbza.supabase.co" />
        <link rel="preconnect" href="https://iqugsxeejieneyksfbza.supabase.co" crossOrigin="anonymous" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body>
        <noscript>
          <iframe
            src={GTM_NOSCRIPT_URL}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AppProviders>{children}</AppProviders>
        <VercelAnalytics />
      </body>
    </html>
  );
}
