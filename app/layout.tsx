import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppProviders from "../components/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cdconstruct.com.au"),
  title: {
    default: "Gold Coast Renovations | Concept Design Construct",
    template: "%s | Concept Design Construct",
  },
  description:
    "Gold Coast renovation builders for kitchens, bathrooms, and whole-home transformations.",
  applicationName: "Concept Design Construct",
  keywords: [
    "Gold Coast renovations",
    "Gold Coast home renovations",
    "kitchen renovation Gold Coast",
    "bathroom renovation Gold Coast",
    "whole-home renovation Gold Coast",
    "QBCC licensed builder Gold Coast",
  ],
  alternates: {
    canonical: "https://www.cdconstruct.com.au/",
    languages: {
      "en-AU": "https://www.cdconstruct.com.au/",
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://www.cdconstruct.com.au/",
    siteName: "Concept Design Construct",
    title: "Gold Coast Renovations | Concept Design Construct",
    description:
      "Gold Coast renovation builders for kitchens, bathrooms, and whole-home transformations.",
    images: [
      {
        url: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Gold-Coast-Renovations.webp",
        width: 1200,
        height: 630,
        alt: "Gold Coast renovations by Concept Design Construct",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Coast Renovations | Concept Design Construct",
    description:
      "Gold Coast renovation builders for kitchens, bathrooms, and whole-home transformations.",
    images: [
      "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Gold-Coast-Renovations.webp",
    ],
  },
  other: {
    "twitter:domain": "www.cdconstruct.com.au",
    "twitter:url": "https://www.cdconstruct.com.au/",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
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
