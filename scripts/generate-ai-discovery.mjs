import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import {
  PRODUCTION_DOMAIN,
  parseSitemapEntries,
  pathFromUrl,
  normalizePath,
  classifyContentType,
  loadGeneratedProjectSlugs,
  isProjectDetailPath,
} from "./lib/seo-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const NEXT_SERVER_APP_DIR = path.join(ROOT_DIR, ".next", "server", "app");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const PUBLIC_SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");
const GENERATED_PROJECT_SLUGS_PATH = path.join(ROOT_DIR, "src", "generated", "project-slugs.json");

const AI_DISCOVERY_PATH = path.join(PUBLIC_DIR, "ai-discovery.json");
const LLMS_PATH = path.join(PUBLIC_DIR, "llms.txt");
const LLMS_FULL_PATH = path.join(PUBLIC_DIR, "llms-full.txt");

const FALLBACK_SCHEMA_TYPES_BY_ROUTE = {
  "/": ["HomeAndConstructionBusiness", "FAQPage"],
  "/about-us": ["AboutPage"],
  "/renovation-projects": ["ItemList"],
  "/book-renovation-consultation": ["ContactPage"],
  "/renovation-life-stages": ["FAQPage"],
};

const routeToHtmlFile = (routePath) => {
  if (routePath === "/") return path.join(NEXT_SERVER_APP_DIR, "index.html");
  return path.join(NEXT_SERVER_APP_DIR, `${routePath.replace(/^\//, "")}.html`);
};

function collectSchemaTypes(node, sink) {
  if (!node) return;

  if (Array.isArray(node)) {
    for (const item of node) {
      collectSchemaTypes(item, sink);
    }
    return;
  }

  if (typeof node !== "object") return;

  const typeValue = node["@type"];
  if (typeof typeValue === "string" && typeValue.trim()) {
    sink.add(typeValue.trim());
  } else if (Array.isArray(typeValue)) {
    for (const item of typeValue) {
      if (typeof item === "string" && item.trim()) {
        sink.add(item.trim());
      }
    }
  }

  for (const value of Object.values(node)) {
    collectSchemaTypes(value, sink);
  }
}

async function extractStructuredDataTypes(routePath) {
  const htmlPath = routeToHtmlFile(routePath);

  let html = "";
  try {
    html = await fs.readFile(htmlPath, "utf8");
  } catch {
    if (isProjectDetailPath(routePath)) {
      return ["BreadcrumbList", "CreativeWork"];
    }
    return FALLBACK_SCHEMA_TYPES_BY_ROUTE[routePath] || [];
  }

  const types = new Set();
  const document = new JSDOM(html).window.document;
  const jsonLdScripts = [...document.querySelectorAll('script[type="application/ld+json"]')];

  for (const script of jsonLdScripts) {
    const raw = script.textContent?.trim();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      collectSchemaTypes(parsed, types);
    } catch {
      // Ignore malformed JSON-LD snippets.
    }
  }

  if (types.size === 0) {
    if (isProjectDetailPath(routePath)) {
      return ["BreadcrumbList", "CreativeWork"];
    }
    return (FALLBACK_SCHEMA_TYPES_BY_ROUTE[routePath] || []).slice().sort();
  }

  return [...types].sort();
}

function buildLlmsText({
  generatedAt,
  domain,
  routes,
  projectRoutes,
}) {
  const primaryRoutes = routes.filter((route) => route.contentType !== "project-detail");
  const lines = [];

  lines.push(`# ${new URL(domain).hostname} AI Content Index`);
  lines.push(`Generated: ${generatedAt}`);
  lines.push("");
  lines.push("## Canonical Domain");
  lines.push(domain);
  lines.push("");
  lines.push("## Primary Public Pages");
  for (const route of primaryRoutes) {
    lines.push(`- ${route.url}`);
  }

  lines.push("");
  lines.push("## Project Detail Pages");
  if (projectRoutes.length === 0) {
    lines.push("- None listed");
  } else {
    for (const route of projectRoutes) {
      lines.push(`- ${route.url}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function buildLlmsFullText({ generatedAt, domain, routes }) {
  const lines = [];
  lines.push(`# ${new URL(domain).hostname} Full AI Content Inventory`);
  lines.push(`Generated: ${generatedAt}`);
  lines.push("");

  for (const route of routes) {
    lines.push(`## ${route.path}`);
    lines.push(`URL: ${route.url}`);
    lines.push(`Type: ${route.contentType}`);
    lines.push(`Last-Modified: ${route.lastmod || "unknown"}`);
    lines.push(
      `Structured-Data-Types: ${
        route.structuredDataTypes.length > 0 ? route.structuredDataTypes.join(", ") : "none"
      }`
    );
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const [sitemapXml, generatedProjectSlugs] = await Promise.all([
    fs.readFile(PUBLIC_SITEMAP_PATH, "utf8"),
    loadGeneratedProjectSlugs(GENERATED_PROJECT_SLUGS_PATH),
  ]);

  const entries = parseSitemapEntries(sitemapXml);
  if (entries.length === 0) {
    throw new Error("sitemap.xml has no URL entries. Run `npm run seo:sync` first.");
  }

  const routeInventory = [];
  for (const entry of entries) {
    const routePath = normalizePath(pathFromUrl(entry.loc, PRODUCTION_DOMAIN));
    const structuredDataTypes = await extractStructuredDataTypes(routePath);
    routeInventory.push({
      path: routePath,
      url: entry.loc,
      lastmod: entry.lastmod,
      contentType: classifyContentType(routePath),
      structuredDataTypes,
    });
  }

  const contentTypeCounts = {};
  const structuredDataTypeCounts = {};
  for (const route of routeInventory) {
    contentTypeCounts[route.contentType] = (contentTypeCounts[route.contentType] || 0) + 1;
    for (const type of route.structuredDataTypes) {
      structuredDataTypeCounts[type] = (structuredDataTypeCounts[type] || 0) + 1;
    }
  }

  const projectRoutePaths = new Set(generatedProjectSlugs.map((slug) => `/renovation-projects/${slug}`));
  const projectRoutes = routeInventory.filter((route) => projectRoutePaths.has(route.path));
  const generatedAt = new Date().toISOString();

  const payload = {
    generatedAt,
    domain: PRODUCTION_DOMAIN,
    urlCount: routeInventory.length,
    projectUrlCount: projectRoutes.length,
    contentTypeCounts,
    structuredDataTypeCounts,
    routes: routeInventory,
  };

  await Promise.all([
    fs.writeFile(AI_DISCOVERY_PATH, `${JSON.stringify(payload, null, 2)}\n`),
    fs.writeFile(
      LLMS_PATH,
      buildLlmsText({
        generatedAt,
        domain: PRODUCTION_DOMAIN,
        routes: routeInventory,
        projectRoutes,
      })
    ),
    fs.writeFile(
      LLMS_FULL_PATH,
      buildLlmsFullText({
        generatedAt,
        domain: PRODUCTION_DOMAIN,
        routes: routeInventory,
      })
    ),
  ]);

  console.log(`[seo:ai-discovery] Wrote ${path.relative(ROOT_DIR, AI_DISCOVERY_PATH)}`);
  console.log(`[seo:ai-discovery] Wrote ${path.relative(ROOT_DIR, LLMS_PATH)}`);
  console.log(`[seo:ai-discovery] Wrote ${path.relative(ROOT_DIR, LLMS_FULL_PATH)}`);
  console.log(`[seo:ai-discovery] Routes indexed: ${routeInventory.length}`);
}

main().catch((error) => {
  console.error("[seo:ai-discovery] Failed to generate AI discovery artifacts:", error);
  process.exit(1);
});
