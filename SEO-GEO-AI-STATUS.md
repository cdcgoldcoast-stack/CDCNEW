# SEO, GEO & AI Optimization — Complete Status

**Site:** cdconstruct.com.au
**Last updated:** 2026-04-17
**Business:** Concept Design Construct (CD Construct) — Gold Coast home renovation builder
**Founder:** Mark Mayne, Director — QBCC Licence #15155156

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Total pages | 75 |
| Sitemap entries (static) | 65 |
| Sitemap entries (dynamic) | ~32 (9 projects + 23 blog posts) |
| Service areas | 20 suburbs + Gold Coast |
| Google rating | 4.9 / 5 (50 reviews) — [verified link](https://share.google/1WcObYnrBH3UkL0OO) |
| QBCC Licence | 15155156 (displayed in Footer, About Us, and schema) |
| Founding year | 2000 (in schema as `foundingDate`) |
| Schema types deployed | 12+ |
| Blog posts | 23 (all authored by Mark Mayne with personal voice) |
| Blog citations | 18 external sources across 6 posts |
| Unique images in use | 86 (from 112 available, max 3 pages per image) |
| llms.txt pages indexed | ~50 |

---

## Session Changelog (2026-04-17)

### Commits Pushed (8)

1. **Landing page** — Created `/lp/gold-coast-renovations` for Google Ads (isolated, no nav, noindex)
2. **GTM fix** — Added inline `<script>` in `<head>` for immediate loading (was deferred/broken)
3. **SEO improvements** — Content expansion on 6 thin pages, internal linking fixes on 6 suburbs, 12 sub-location pages unblocked, 7 meta descriptions differentiated, QBCC licence displayed, Mark Mayne added to About page, Person schema, blog author default
4. **Technical SEO fixes** — Hero preload URL fixed, 301 redirect for deleted page, robots.txt cleaned, llms.txt expanded with 25 missing pages, areaServed schema type fix
5. **Schema/audit sync** — Removed redundant LocalBusiness from testimonials, added `foundingDate: "2000"`, synced seo-utils.mjs with 12 new routes
6. **Google Reviews linked** — GoogleReviewBadge now clickable, linked in testimonials text, added to schema `sameAs`
7. **Blog personalisation** — All 23 posts have founder-voice opening paragraph + updated author box (MM initials, personal bio)
8. **Image redistribution + citations** — 20 suburb pages given location-specific images (27→86 unique), 18 citations added to 6 posts, 2 factual errors fixed

---

## 1. Technical SEO

### Domain & Canonical Setup

- **Canonical domain:** `https://www.cdconstruct.com.au`
- **Non-www redirect:** Permanent 301 via vercel.json (also handles 4 alternate domains)
- **Trailing slash:** Removed via permanent redirect in next.config.mjs
- **Hreflang:** `en-AU` + `x-default` both point to canonical
- **metadataBase:** Set in root layout for correct canonical generation on all pages

### Robots.txt

```
User-agent: *
Allow: /
Disallow: /admin, /admin/, /auth, /brand-guidelines, /api/

User-agent: Googlebot — Allow: /
User-agent: Bingbot — Allow: /
User-agent: Twitterbot — Allow: /
User-agent: facebookexternalhit — Allow: /

Sitemap: https://www.cdconstruct.com.au/sitemap.xml
```

Note: `/lp/` is NOT blocked in robots.txt — noindex metadata handles LP exclusion (letting bots see the noindex tag is better than blocking them entirely).

### Sitemap

- **Revalidation:** Every 900 seconds (15 min)
- **Homepage:** Priority 1.0, weekly
- **Service pages (8):** Priority 0.8-0.9, weekly
- **Location pages (20):** Priority 0.7, weekly
- **Service + location hybrids (12):** Priority 0.7, monthly — previously noIndexed, now indexed with unique content
- **Blog posts:** Priority 0.65, monthly (dynamic from CMS)
- **Project pages:** Priority 0.7, monthly (dynamic from DB)
- **Supporting pages:** Priority 0.3-0.7 (FAQ, testimonials, tools, legal)

### Redirects

**next.config.mjs (24 permanent redirects):**
- Legacy URL consolidation (old WordPress paths to new routes)
- URL structure migration (`/projects` -> `/renovation-projects`, etc.)
- Service page consolidation (`/custom-home-builders`, `/home-renovations-gold-coast` -> `/renovation-services`)
- Deleted page redirect (`/gold-coast-renovations` -> `/renovation-services`)
- All single-hop (no redirect chains)

**vercel.json (5 domain redirects):**
- `cdconstruct.com.au` -> `www.cdconstruct.com.au` (permanent)
- `cdcconstruct.com.au` (typo) -> canonical
- `conceptdesignconstruct.com.au` (legacy brand) -> canonical

**middleware.ts (28 legacy paths):**
- 410 Gone for WordPress remnants (`/author/`, `/category/`, `/wp-content/`, `/wp-includes/`)
- 410 Gone for Melbourne-specific pages (no longer serviced)
- All return `x-robots-tag: noindex, nofollow` with 1-hour cache

### Metadata Generation

Every page uses `buildMetadata()` which generates:
- Title (max 60 chars, includes brand)
- Description (max 160 chars, smart word-boundary truncation)
- Canonical URL (absolute, via `absoluteUrl()`)
- OpenGraph (1200x630, type, locale en_AU)
- Twitter Card (summary_large_image)
- Keywords (auto-deduplicated, brand keywords added when indexable)
- Robots meta (index/follow, GoogleBot: max-snippet -1, max-image-preview large)
- Article metadata (published_time, modified_time, author, tags) when applicable

### Security Headers

- CSP with allowlisted domains (GTM, Facebook, Supabase, Vercel)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### Google Tag Manager

- Inline `<script>` in `<head>` of root layout (fires synchronously on every page load)
- noscript iframe in `<body>`
- Container ID: `GTM-T7838TJS`

---

## 2. Structured Data (Schema.org)

### Schema Types Deployed

| Schema Type | Where Used | Count |
|-------------|-----------|-------|
| WebPage | All pages | ~55 |
| BreadcrumbList | All subpages | ~55 |
| LocalBusiness | Homepage, location pages, service pages | ~30 |
| FAQPage | Homepage, FAQ page, service/location pages | ~30 |
| BlogPosting | Blog detail pages | 23 |
| CreativeWork | Project detail pages | 9 |
| ItemList | Gallery, projects listing, blog listing | 3 |
| WebSite | Homepage | 1 |
| SiteNavigationElement | Homepage | 1 |
| AboutPage | About Us | 1 |
| ContactPage | Book Consultation | 1 |
| Person (Founder) | Embedded in LocalBusiness via `founder` field | 1 |

### LocalBusiness Schema

```
Name:            Concept Design Construct
Alternate Name:  CD Construct
Founded:         2000
Type:            HomeAndConstructionBusiness
Founder:         Mark Mayne, Director (@id: #mark-mayne)

Address:         1907/22 Surf Parade, Broadbeach, QLD 4218, AU
Phone:           +61413468928
Email:           info@cdconstruct.com.au
Coordinates:     -28.0167, 153.4000

Credentials:     QBCC Licensed Builder (#15155156)
Member of:       Master Builders Queensland, QBCC
Social:          Instagram, Facebook, Google Reviews

Area Served:     Gold Coast + 20 suburbs + South East Queensland (AdministrativeArea)
Price Range:     $$$$
Hours:           Mon-Fri 08:00-17:00

Aggregate Rating: 4.9/5 from 50 reviews
Sample Reviews:   3 embedded (Trish, Erin & Sam, Emmanuel Vella)
Service Catalog:  Kitchen, Bathroom, Whole Home Renovation
```

### Founder Schema (Person)

```
@id:         https://www.cdconstruct.com.au#mark-mayne
Name:        Mark Mayne
Title:       Director
Works For:   Concept Design Construct (#organization)
Knows About: Gold Coast home renovations, kitchen renovations,
             bathroom renovations, QBCC licensed building, project management
```

---

## 3. Page Architecture

### Core Pages (7)

| Page | Route | Schema |
|------|-------|--------|
| Homepage | `/` | WebSite, LocalBusiness, FAQ, SiteNav |
| About Us | `/about-us` | AboutPage, Breadcrumb |
| How We Work | `/how-we-work` | WebPage, Breadcrumb |
| Why CDC | `/why-cdc` | WebPage, Breadcrumb |
| FAQ | `/faq` | WebPage, FAQ, Breadcrumb |
| Testimonials | `/testimonials` | WebPage, Breadcrumb |
| Before & After | `/before-after` | WebPage, Breadcrumb |

### Service Pages (8)

Kitchen, Bathroom, Whole-Home, Laundry, Outdoor, Apartment, Home Extensions, and Services hub. All have WebPage + FAQ + Breadcrumb schema (some with Service schema).

### Location Pages (20)

Broadbeach, Mermaid Beach, Palm Beach, Robina, Southport, Burleigh Heads, Surfers Paradise, Bundall, Runaway Bay, Coomera, Upper Coomera, Nerang, Mudgeeraba, Varsity Lakes, Coolangatta, Currumbin, Miami, Hope Island, Sanctuary Cove, Helensvale.

All have: WebPage + FAQ + LocalBusiness + Breadcrumb. Each now has **location-specific images** (no image used on more than 3 pages, and only for adjacent suburbs).

### Service + Location Hybrid Pages (12)

Kitchen and bathroom pages for 6 suburbs. All indexed (noIndex removed), in sitemap at priority 0.7.

| Service | Broadbeach | Helensvale | Palm Beach | Robina | Southport | Surfers Paradise |
|---------|-----------|-----------|-----------|--------|----------|-----------------|
| Kitchen | Yes | Yes | Yes | Yes | Yes | Yes |
| Bathroom | Yes | Yes | Yes | Yes | Yes | Yes |

Each has: unique meta description, 4 suburb-specific FAQs, suburb-specific pricing, FAQ schema, breadcrumbs.

### Landing Pages (Isolated)

- `/lp/gold-coast-renovations` — Google Ads landing page
  - No Header/Footer, no site navigation links
  - noindex, nofollow (metadata only, not robots.txt)
  - Not in sitemap or llms.txt
  - Form source tagged `lp-gold-coast` for analytics separation
  - All images use Supabase transforms with hero preload

### Dynamic Pages

- **Blog:** `/blog` (index) + `/blog/[slug]` (23 posts) — BlogPosting schema
- **Projects:** `/renovation-projects` (listing) + `/renovation-projects/[slug]` (9 projects) — CreativeWork schema

---

## 4. GEO (Generative Engine Optimization)

### AI Discovery Files

Generated automatically at build time via `npm run seo:ai-discovery` (runs in prebuild).

| File | Purpose |
|------|---------|
| `public/llms.txt` | Business profile + curated URL index for LLM crawlers |
| `public/llms-full.txt` | Complete route inventory with metadata and schema types |
| `public/ai-discovery.json` | Machine-readable JSON: URL count, content types, schema types per page |

### What LLMs Can Extract

1. **Business identity:** Name, alternate name, address, phone, email, founding year
2. **Credentials:** QBCC Licence #15155156, Master Builders QLD membership
3. **Founder:** Mark Mayne, Director (Person schema with @id)
4. **Services:** Kitchen, bathroom, whole-home, apartment, outdoor, laundry, extensions
5. **Service areas:** Gold Coast + 20 specific suburbs
6. **Social proof:** 4.9/5 from 50 reviews — [verifiable Google link](https://share.google/1WcObYnrBH3UkL0OO)
7. **Content depth:** 23 blog posts with founder authorship and external citations
8. **FAQ answers:** 18+ FAQs on homepage/FAQ page, 4-6 per service/location page

### Citation Readiness

| Signal | Status |
|--------|--------|
| Named founder with title | Done — Mark Mayne, Director in Person schema |
| Verifiable credentials | Done — QBCC #15155156 in schema + visible on site |
| Third-party membership | Done — Master Builders QLD in schema |
| Review verification | Done — Google Reviews link in schema sameAs + clickable badge |
| Blog authorship | Done — All 23 posts by Mark Mayne with personal voice |
| External citations | Done — 18 citations across 6 posts (QBCC, Qld Gov, NCC, BOM, HIA) |
| Video content | Missing — No video on site |
| Case studies with outcomes | Weak — 9 project pages lack budget/timeline data |

---

## 5. Blog Content

### Authorship & Voice

- **Author:** Mark Mayne (set in frontmatter on all 23 posts, fallback in blog.ts)
- **Author box:** "MM" initials + personal bio ("Mark Mayne is the founder and director of Concept Design Construct, a QBCC licensed renovation builder based in Broadbeach. With over 25 years in the industry, he leads every project from consultation through handover.")
- **Personal voice:** Every post has a founder-written opening paragraph (2-3 sentences in first person, referencing specific Gold Coast suburbs and 25 years of experience)

### External Citations (18 total)

| Blog Post | Citations | Sources |
|-----------|-----------|---------|
| How to Choose a Renovation Builder | 5 | QBCC (licensing, deposits, contracts, warranty, home warranty scheme) |
| Granny Flat Gold Coast | 3 | Qld Planning (secondary dwellings, state code), Gold Coast Council |
| Flood-Resilient Renovation | 2 | Gold Coast Council (flood search, flood risk area) |
| Energy-Efficient Renovation | 3 | Australian Government (NCC 2022), BOM (solar), NatHERS |
| Bathroom Renovation Cost | 2 | NCC (waterproofing Part 10.2), HIA (AS 3740) |
| Apartment Body Corporate Guide | 3 | NCC (waterproofing), HIA (AS 3740), QBCC (building work) |

### Factual Corrections Made

| Claim | Was | Corrected To | Source |
|-------|-----|-------------|--------|
| Max deposit (contracts over $20K) | 10% | 5% | [QBCC](https://www.qbcc.qld.gov.au/home-owner-hub/build-renovate/contracts-payments/deposits-progress-payments) |
| Non-structural defect warranty | 12 months | 6 months | [QBCC](https://www.qbcc.qld.gov.au/your-property/queensland-home-warranty-scheme/time-limits-cover-claims) |

---

## 6. Image Strategy

### Before (pre-session)

- 27 unique images across 164 references
- Worst offender: `Elanora-House-Renovations.webp` on 17 different suburb pages
- Same Elanora/Helensvale photos used for Broadbeach, Southport, Hope Island, etc.

### After (current)

- **86 unique images** in use (from 112 available in Supabase)
- **Max 3 pages per image** (only for geographically adjacent suburbs)
- **26 images** still in reserve for future pages
- Every suburb page shows photos from its own area or immediate neighbours

### Image Optimization

- `ResponsiveImage` component with Supabase CDN transforms
- srcSet: 320w, 480w, 640w, 768w, 960w, 1200w
- Above-fold: `eager` + `fetchPriority="high"`
- Below-fold: `lazy` + `fetchPriority="low"`
- LP page: hero preloaded, quality 50, all images use `useSupabaseTransform`

---

## 7. Internal Linking

### Hub-and-Spoke Model

- **Hub:** `/renovation-services` links to all 8 service pages
- **Service pages** link to: consultation form, portfolio, suburb pages
- **Location pages** link to suburb-specific service pages where available
- **Blog posts** link to relevant service and location pages
- **Footer** includes links to all services, key suburbs, and company pages

### Suburb -> Service Linking

6 suburb pages link to their own suburb-specific service pages:

| Suburb | Kitchen Link | Bathroom Link |
|--------|-------------|---------------|
| Broadbeach | `/kitchen-renovations-broadbeach` | `/bathroom-renovations-broadbeach` |
| Helensvale | `/kitchen-renovations-helensvale` | `/bathroom-renovations-helensvale` |
| Robina | `/kitchen-renovations-robina` | `/bathroom-renovations-robina` |
| Palm Beach | `/kitchen-renovations-palm-beach` | `/bathroom-renovations-palm-beach` |
| Southport | `/kitchen-renovations-southport` | `/bathroom-renovations-southport` |
| Surfers Paradise | `/kitchen-renovations-surfers-paradise` | `/bathroom-renovations-surfers-paradise` |

---

## 8. Trust Signals Visible on Site

| Signal | Where Displayed |
|--------|----------------|
| QBCC Licence #15155156 | Footer (next to logo), About Us page, LocalBusiness schema |
| Master Builders QLD | Footer logo, About Us, schema `memberOf` |
| Google Reviews 4.9/50 | Clickable badge on Homepage, Why CDC, Testimonials — links to [Google profile](https://share.google/1WcObYnrBH3UkL0OO) |
| Mark Mayne, Director | About Us page, blog author box, Person schema |
| Founded 2000 | schema `foundingDate`, About Us content |

---

## 9. SEO Audit Tooling

| Script | Purpose |
|--------|---------|
| `npm run seo:sync` | Sync SEO artifacts |
| `npm run seo:audit` | Full SEO audit (canonicals, content rules, links) |
| `npm run seo:audit:live` | Audit against live HTTP responses |
| `npm run seo:ai-discovery` | Regenerate llms.txt, llms-full.txt, ai-discovery.json |
| `npm run seo:monitor` | Runtime SEO monitoring |
| `npm run seo:assert:metadata-source` | Verify metadata source consistency |
| `npm run seo:check:live` | Live indexing smoke test |
| `npm run seo:release:gate` | Full pre-release gate (audit + cutover + monitor) |
| `npm run seo:gsc:ingest` | Ingest Google Search Console report |

**Pre-build pipeline** (`npm run prebuild`):
1. `seo:sync` — Sync SEO artifacts
2. `seo:ai-discovery` — Regenerate AI discovery files
3. `seo:assert:metadata-source` — Verify metadata consistency

**Audit route coverage:** `scripts/lib/seo-utils.mjs` includes all 12 sub-location pages in EXTENDED_ROUTES.

---

## 10. What's Left (Requires Real Content, Not Code)

| Gap | Impact | What's Needed |
|-----|--------|--------------|
| Project case studies | High | Real budgets, timelines, and outcomes on 9 project pages — only Mark can provide |
| Before/after from real builds | High | Actual transformation photos (current page has 1 AI mockup) |
| Video content | High | Walkthroughs, testimonials — requires filming |
| Suburb page content depth | Medium | 20 pages share ~60% boilerplate — needs genuine local stories and detail |
| "100+ projects" claim | Medium | Only 9 project pages exist — need more projects or remove the claim |
| Performance tracking | Medium | No rankings, traffic, or lead data — set up GSC reporting |
| Remaining blog citations | Low | 17 posts still lack external sources (6 done, 17 to go) |

### Strategic Guidance

The technical SEO layer is complete. Future effort should focus on **trust, proof, and original content** rather than adding more technical infrastructure. The highest-leverage work is:

1. Real project data with outcomes (budgets, timelines, what went right)
2. Suburb-specific content beyond templates (local knowledge, specific builds)
3. Named expert commentary (Mark writing or reviewing content)
4. Performance measurement (GSC, analytics, conversion tracking)

Schema coverage, redirects, sitemap, robots, structured data, and GEO files are all in good shape and don't need further expansion.
