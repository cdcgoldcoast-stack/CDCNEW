# SEO-Focused Code Review

**Date:** February 2026  
**Scope:** Metadata, structured data, sitemap/robots, crawlability, and consistency.

---

## Summary

The site has strong SEO foundations: centralised config, consistent `buildMetadata()`, JSON-LD on key pages, sr-only crawler content, and clear noindex for admin/auth. This review applied three targeted improvements and documents current state and optional follow-ups.

---

## Changes Made This Review

1. **Title length and branding** ([lib/seo.ts](lib/seo.ts))  
   All metadata titles now go through `formatPageTitle()` from [src/config/seo.ts](src/config/seo.ts), so:
   - Titles are truncated to 60 characters (word boundary) for better SERP display.
   - Brand is applied consistently where missing.
   - The same safe title is used for `<title>`, Open Graph, and Twitter.

2. **Project pages as articles** ([app/renovation-projects/[slug]/page.tsx](app/renovation-projects/[slug]/page.tsx))  
   `generateMetadata()` now passes `type: "article"`, `articlePublishedTime`, `articleModifiedTime`, and `articleTags` into `buildMetadata()`. That gives:
   - Correct `og:type` and article meta for case studies.
   - `article:published_time` and `article:modified_time` for freshness signals.
   - Better alignment with the existing CreativeWork/WebPage JSON-LD.

3. **Single source for default OG image** ([app/layout.tsx](app/layout.tsx))  
   Root layout now uses `DEFAULT_META.image` from config instead of a duplicate URL, so the default share image is defined only in [src/config/seo.ts](src/config/seo.ts).

---

## What’s Already in Good Shape

| Area | Notes |
|------|--------|
| **Canonicals** | Every page uses `buildMetadata({ path })`; canonicals are normalised (no trailing slash) via `absoluteUrl()` in [lib/seo.ts](lib/seo.ts). |
| **Robots** | [app/robots.ts](app/robots.ts) allows `/`, disallows `/admin`, `/auth`, `/brand-guidelines`, `/api/`; host and sitemap set. |
| **Noindex** | Auth, admin, brand-guidelines, and not-found all call `buildMetadata(..., noIndex: true)`. |
| **Sitemap** | [app/sitemap.ts](app/sitemap.ts) uses static routes + `fetchProjects()`; project entries use `lastModified` from `modifiedAt`/`publishedAt`/year. |
| **Structured data** | Home: WebSite, LocalBusiness, FAQPage. Projects: WebPage + CreativeWork, BreadcrumbList. Services: WebPage, ItemList, FAQ, Breadcrumb. About/quote: AboutPage, ContactPage. |
| **Crawlable content** | Home and services have sr-only sections with required phrases and internal links; project pages have sr-only H1/H2/description. |
| **Internal links** | Header/Footer use [HEADER_SITELINK_TARGETS](src/config/seo.ts) / FOOTER_SITELINK_TARGETS; Footer uses `<a href>` for nav and project links. |
| **Redirects** | Legacy paths in [next.config.mjs](next.config.mjs); no redirect loops; redirect sources not in sitemap. |

---

## Optional Follow-Ups

- **LocalBusiness image/logo**  
  [src/lib/structured-data.ts](src/lib/structured-data.ts) `generateLocalBusinessSchema()` uses `logo: .../logo.webp` and `image: .../og-image.jpg`. If those files don’t exist at the root, consider pointing to `DEFAULT_META.image` or existing assets to avoid 404s in rich results.

- **Sitelink list vs dynamic projects**  
  Footer project links are hardcoded. If project slugs change often, consider deriving that list from the same source as the sitemap (e.g. `project-slugs.json` or `fetchProjects()`) so new projects get footer links without code changes.

- **Run automated audit**  
  After build, run `npm run seo:audit` (and optionally `SEO_AUDIT_HTTP=1` for live checks) to validate canonicals, meta, and content rules in [scripts/seo-audit.mjs](scripts/seo-audit.mjs).

---

## Key Files (SEO)

- **Config:** [src/config/seo.ts](src/config/seo.ts), [lib/seo.ts](lib/seo.ts)
- **Routes:** [app/sitemap.ts](app/sitemap.ts), [app/robots.ts](app/robots.ts)
- **Structured data:** [src/lib/structured-data.ts](src/lib/structured-data.ts), [components/JsonLd.tsx](components/JsonLd.tsx)
- **Audit:** [scripts/seo-audit.mjs](scripts/seo-audit.mjs), [scripts/sync-seo-artifacts.mjs](scripts/sync-seo-artifacts.mjs)
