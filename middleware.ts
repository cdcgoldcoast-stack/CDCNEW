import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LEGACY_GONE_PREFIXES = [
  "/author/",
  "/category/",
  "/faq-items",
  "/faq_category/",
  "/project-items",
  "/wp-content/plugins/gravityforms",
  "/wp-includes/",
  "/latest-building-news-australia/",
];

const LEGACY_GONE_PATHS = new Set([
  "/faqs",
  "/south-east-melbourne-custom-home-builders",
  "/dive-into-luxury-how-to-build-the-perfect-pool-on-the-gold-coast",
  "/building-your-dream-home-a-guide-to-constructing-a-house-on-the-gold-coast",
  "/choosing-long-lasting-building-materials",
  "/custom-home-builders-gold-coast",
  "/add-value-to-your-home-with-a-budget-bathroom-renovation",
  "/luxury-home-builders-gold-coast",
  "/luxury-home-builders-on-the-gold-coast-your-guide-to-building-your-dream-home",
  "/bayside-custom-home-builders",
]);

const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
};

const isLegacyGonePath = (pathname: string) => {
  const normalizedPath = normalizePathname(pathname);
  if (LEGACY_GONE_PATHS.has(normalizedPath)) return true;
  return LEGACY_GONE_PREFIXES.some(
    (prefix) => normalizedPath === prefix.replace(/\/+$/, "") || normalizedPath.startsWith(prefix)
  );
};

export function middleware(request: NextRequest) {
  if (!isLegacyGonePath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return new NextResponse("Gone", {
    status: 410,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml).*)"],
};
