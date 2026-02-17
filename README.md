# Concept Design Construct

Gold Coast home renovations website for Concept Design Construct.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase

## Local Development

```sh
npm install
npm run dev
```

App runs on `http://localhost:3001`.

## Build and Run

```sh
npm run build
npm run start
```

## SEO and Quality Tooling

```sh
npm run seo:sync
npm run seo:audit
npm run seo:audit:live
npm run seo:content:report
npm run cutover:audit
npm run seo:check
npm run seo:ai-discovery
npm run seo:monitor
npm run seo:release:gate
npm run seo:gsc:ingest -- --input <gsc-export.csv>
npm run security:audit
```

Generated artifacts:

- `src/generated/project-slugs.json`
- `public/sitemap.xml`
- `public/ai-discovery.json`
- `public/llms.txt`
- `public/llms-full.txt`
- `artifacts/seo-content-audit.json`
- `artifacts/next-cutover-audit.json`
- `artifacts/seo-monitor-report.json`

Release verification (recommended):

```sh
npm run build
npm run seo:release:gate
```

Canonical host checks:

- Canonical domain is `https://www.cdconstruct.com.au`
- `seo:monitor` validates non-www to www redirect behavior, path/query preservation, and redirect-chain hygiene on sampled routes.

## Deployment (Vercel)

- Root directory: repository root (`/`)
- Framework: Next.js
- Install command: `npm install`
- Build command: `npm run build`

Redirects, headers, and image domains are defined in `next.config.mjs`.

## Environment

Supported Supabase env names:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Search verification env names (optional but recommended):

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION`

Fallback env names still supported for compatibility:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_ANON_KEY`
