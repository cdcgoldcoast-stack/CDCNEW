import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Bare layout for /lp/* landing pages.
 * No Header, no Footer, no sitemap link — isolated from the main site
 * so paid-traffic visitors stay focused on the conversion goal.
 */

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function LandingPageLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
