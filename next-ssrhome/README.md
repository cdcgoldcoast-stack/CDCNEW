# Next.js Application (`next-ssrhome`)

This folder is the primary production web app for `www.cdconstruct.com.au`.
It serves the full site using Next.js App Router with SSR/SSG metadata and SEO routing.

## Local Development

From repo root:

```bash
npm run dev
```

This runs:

- `npm run dev:ssrhome`
- Next.js app at `http://localhost:3001`

## Build

From repo root:

```bash
npm run build
```

This runs SEO artifact sync first, then builds the Next app in this folder.

## Routing

- Canonical public routes are implemented directly in `next-ssrhome/app/**`.
- Legacy aliases (`/projects/*`, `/gallery`, `/design-tools/*`, `/our-story`) are handled via redirects.
- `/ssrhome` is kept only as a compatibility alias and redirects to `/`.

## Assets and Data

- Supabase env values are read from root env files and Next env vars.
- Shared UI/components/data from `../src` are consumed through compatibility aliases during migration.
