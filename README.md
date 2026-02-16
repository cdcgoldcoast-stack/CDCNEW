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
npm run cutover:audit
npm run seo:check
npm run seo:ai-discovery
npm run seo:monitor
npm run seo:gsc:ingest -- --input <gsc-export.csv>
npm run security:audit
```

Generated artifacts:

- `src/generated/project-slugs.json`
- `public/sitemap.xml`
- `public/ai-discovery.json`
- `public/llms.txt`
- `public/llms-full.txt`

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

Fallback env names still supported for compatibility:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_ANON_KEY`
