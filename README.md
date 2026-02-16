# Concept Design Construct

Gold Coast Home Renovations - Expert kitchen, bathroom, and whole-home renovations designed around how you live.

## Project Info

This is the official website for Concept Design Construct, a QBCC licensed building company serving the Gold Coast and South East Queensland.

## Technology Stack

- **Next.js (App Router)** - Production web framework for the full site
- **React** - UI framework
- **Vite** - Legacy runtime retained temporarily for archival/rollback branch only
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Supabase** - Backend services

## Development

```sh
# Install dependencies
npm install

# Start primary Next.js app
npm run dev

# Build primary Next.js app
npm run build

# Run primary Next.js production server
npm run preview

# Optional cutover parity + SEO build audit
npm run cutover:audit

# Legacy React/Vite commands (temporary rollback support only)
npm run dev:legacy
npm run build:legacy
npm run preview:legacy
```

## Deployment

- `vercel.json` is configured for Next.js cutover:
  - no SPA rewrites to `/index.html`
  - legacy URL redirects preserved
  - build uses `npm run build` and installs `next-ssrhome` dependencies

## Security Model

- This deployment uses a single frontend app. Admin page code can be discoverable as JS chunks, but sensitive operations are protected server-side.
- Security is enforced by Supabase auth, RLS policies, SQL grants, and edge-function authorization checks.
- Service-role keys must never be exposed in `src/`, `public/`, or built assets.

Run the automated security audit:

```sh
npm run security:audit
```

## SEO Features

- SSR/SSG metadata coverage for all public Next routes
- Structured data (JSON-LD) for rich snippets
- Optimised meta tags for Gold Coast renovation keywords
- XML sitemap and robots.txt
- Open Graph and Twitter Card support
- Automated SEO artifact sync before every production build:
  - `src/generated/project-slugs.json`
  - `public/sitemap.xml`

### SEO Sync (Vercel + Supabase)

`npm run build` now runs `npm run seo:sync` automatically via `prebuild`.

To pull live project slugs from Supabase during build, set one of these env pairs in Vercel:

- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (recommended)
- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (fallback)

If env vars are missing, sync falls back to static/public/generated slug sources to prevent accidental slug loss.

### SEO Reliability Tooling (Backend-Only)

- `npm run seo:check`
  - Runs sync + strict SEO audit gate (canonical/sitemap/noindex/redirect integrity).
- `npm run seo:monitor`
  - Runs live production checks and writes `artifacts/seo-monitor-report.json`.
- `npm run seo:ai-discovery`
  - Generates:
    - `public/ai-discovery.json`
    - `public/llms.txt`
    - `public/llms-full.txt`
- `npm run seo:gsc:ingest -- --input <path-to-gsc-export.csv>`
  - Correlates Search Console export with sitemap/redirect/noindex expectations.
  - Writes `artifacts/seo-gsc-correlation.json` by default.

Runtime monitor environment options:

- `SEO_MONITOR_BASE_URL` (default: `https://www.cdconstruct.com.au`)
- `SEO_MONITOR_STRICT` (default: `true`)
- `SEO_MONITOR_MAX_URLS` (default: `120`)
- `SEO_MONITOR_TIMEOUT_MS` (default: `12000`)
- `SEO_ALERT_MODE` (`off|stdout|webhook|slack|email|github|custom`)
- `SEO_ALERT_TARGET` (HTTP webhook target used by alert modes)

## Service Areas

- Gold Coast
- South East Queensland

## Contact

info@cdconstruct.com.au
