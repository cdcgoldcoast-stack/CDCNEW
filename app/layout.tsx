import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import AppProviders from "../components/AppProviders";
import { DEFAULT_META, PRODUCTION_DOMAIN, SITE_NAME } from "@/config/seo";
import "./globals.css";

const SITE_URL = PRODUCTION_DOMAIN;
const DEFAULT_IMAGE =
  "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Gold-Coast-Renovations.webp";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_META.title,
    template: `%s | ${SITE_NAME}`,
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
    canonical: `${SITE_URL}/`,
    languages: {
      "en-AU": `${SITE_URL}/`,
      "x-default": `${SITE_URL}/`,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    title: DEFAULT_META.title,
    description: DEFAULT_META.description,
    images: [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: "Gold Coast renovations by Concept Design Construct",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_META.title,
    description: DEFAULT_META.description,
    images: [DEFAULT_IMAGE],
  },
  other: {
    "twitter:domain": "www.cdconstruct.com.au",
    "twitter:url": `${SITE_URL}/`,
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
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
