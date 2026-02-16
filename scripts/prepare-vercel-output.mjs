#!/usr/bin/env node
/**
 * Packages dist/ into Vercel Build Output API v3 format (.vercel/output/)
 * so `vercel deploy --prebuilt` can deploy it without Vercel running a build.
 *
 * Reads vercel.json for headers, redirects, and rewrites and converts them
 * into the config.json routes format.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const OUTPUT_DIR = path.join(ROOT, ".vercel", "output");
const STATIC_DIR = path.join(OUTPUT_DIR, "static");
const GENERATED_PROJECT_SLUGS_PATH = path.join(ROOT, "src", "generated", "project-slugs.json");
const PROJECT_DETAIL_DYNAMIC_REWRITE_SOURCE = "/renovation-projects/:slug";
const PROJECT_DETAIL_REWRITE_DESTINATION = "/index.html";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (!fs.existsSync(DIST)) {
  console.error("[prepare-vercel-output] dist/ not found — run `npm run build` first.");
  process.exit(1);
}

const vercelConfig = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8"));

function loadGeneratedProjectDetailRewrites() {
  try {
    const source = fs.readFileSync(GENERATED_PROJECT_SLUGS_PATH, "utf8");
    const parsed = JSON.parse(source);
    const slugs = Array.isArray(parsed?.slugs) ? parsed.slugs : [];

    return [...new Set(
      slugs
        .map((slug) => `${slug}`.trim().toLowerCase())
        .filter((slug) => slug && SLUG_PATTERN.test(slug))
    )]
      .sort()
      .map((slug) => ({
        source: `/renovation-projects/${slug}`,
        destination: PROJECT_DETAIL_REWRITE_DESTINATION,
      }));
  } catch {
    return [];
  }
}

function materializeProjectDetailRewrites(rewrites) {
  const hasDynamicProjectRewrite = rewrites.some(
    (rewrite) => rewrite?.source === PROJECT_DETAIL_DYNAMIC_REWRITE_SOURCE
  );

  if (!hasDynamicProjectRewrite) {
    return rewrites;
  }

  const hasExplicitProjectRewrites = rewrites.some((rewrite) => {
    const source = `${rewrite?.source || ""}`;
    return source.startsWith("/renovation-projects/") &&
      source !== "/renovation-projects" &&
      source !== PROJECT_DETAIL_DYNAMIC_REWRITE_SOURCE;
  });

  if (hasExplicitProjectRewrites) {
    return rewrites.filter(
      (rewrite) => rewrite?.source !== PROJECT_DETAIL_DYNAMIC_REWRITE_SOURCE
    );
  }

  const generatedProjectDetailRewrites = loadGeneratedProjectDetailRewrites();

  if (generatedProjectDetailRewrites.length === 0) {
    return rewrites;
  }

  const expandedRewrites = [];
  for (const rewrite of rewrites) {
    if (rewrite?.source === PROJECT_DETAIL_DYNAMIC_REWRITE_SOURCE) {
      expandedRewrites.push(...generatedProjectDetailRewrites);
    } else {
      expandedRewrites.push(rewrite);
    }
  }

  console.log(
    `[prepare-vercel-output] Expanded ${PROJECT_DETAIL_DYNAMIC_REWRITE_SOURCE} to ${generatedProjectDetailRewrites.length} project detail rewrites`
  );
  return expandedRewrites;
}

/**
 * Convert vercel.json path pattern to a regex string.
 *   :param+ → (.+)       (one or more segments)
 *   :param  → ([^/]+)    (single segment)
 */
function pathToRegex(pattern) {
  return pattern
    .replace(/:(\w+)\+/g, "(.+)")
    .replace(/:(\w+)/g, "([^/]+)");
}

/**
 * Replace :param references in a destination string with $N capture-group
 * back-references, matching the order params appear in the source pattern.
 */
function convertDestination(source, destination) {
  const params = [];
  source.replace(/:(\w+)\+?/g, (_, name) => {
    params.push(name);
    return _;
  });
  let result = destination;
  params.forEach((name, i) => {
    result = result.replaceAll(`:${name}+`, `$${i + 1}`);
    result = result.replaceAll(`:${name}`, `$${i + 1}`);
  });
  return result;
}

// --- Build routes array ---

const routes = [];

// 1. Headers (continue: true so the request proceeds to the next match)
for (const group of vercelConfig.headers || []) {
  const headers = {};
  for (const h of group.headers) {
    headers[h.key] = h.value;
  }
  routes.push({ src: pathToRegex(group.source), headers, continue: true });
}

// 2. Redirects
for (const r of vercelConfig.redirects || []) {
  routes.push({
    src: pathToRegex(r.source),
    headers: { Location: convertDestination(r.source, r.destination) },
    status: r.permanent ? 308 : 307,
  });
}

// 3. Filesystem handler — serve static files before rewrites
routes.push({ handle: "filesystem" });

// 4. Rewrites (SPA fallback for client-side routes)
const effectiveRewrites = materializeProjectDetailRewrites(vercelConfig.rewrites || []);
for (const r of effectiveRewrites) {
  routes.push({
    src: pathToRegex(r.source),
    dest: r.destination,
  });
}

// --- Write output ---

fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUTPUT_DIR, "config.json"),
  JSON.stringify({ version: 3, routes }, null, 2)
);
fs.cpSync(DIST, STATIC_DIR, { recursive: true });

console.log("[prepare-vercel-output] .vercel/output/config.json created");
console.log("[prepare-vercel-output] dist/ → .vercel/output/static/");
console.log("[prepare-vercel-output] Done.");
