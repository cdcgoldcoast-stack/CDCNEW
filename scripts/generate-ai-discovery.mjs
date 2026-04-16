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
const SITEMAP_INVENTORY_PATH = path.join(ROOT_DIR, "artifacts", "seo-sitemap-inventory.json");
const PUBLIC_SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");
const GENERATED_PROJECT_SLUGS_PATH = path.join(ROOT_DIR, "src", "generated", "project-slugs.json");

const AI_DISCOVERY_PATH = path.join(PUBLIC_DIR, "ai-discovery.json");
const LLMS_PATH = path.join(PUBLIC_DIR, "llms.txt");
const LLMS_FULL_PATH = path.join(PUBLIC_DIR, "llms-full.txt");

const BUSINESS_PROFILE = {
  name: "Concept Design Construct",
  alternateName: "CD Construct",
  canonicalDomain: PRODUCTION_DOMAIN,
  summary:
    "Gold Coast renovation builder focused on kitchen, bathroom, whole-home, apartment, outdoor, laundry, and home extension projects with design-led planning and QBCC-licensed delivery.",
  expertise: [
    "Kitchen renovations",
    "Bathroom renovations",
    "Whole-home renovations",
    "Apartment renovations",
    "Outdoor renovations",
    "Laundry renovations",
    "Home extensions",
  ],
  serviceAreas: [
    "Gold Coast",
    "Broadbeach",
    "Burleigh Heads",
    "Mermaid Beach",
    "Palm Beach",
    "Robina",
    "Southport",
    "Helensvale",
    "Surfers Paradise",
  ],
  contact: {
    phone: "+61 413 468 928",
    email: "info@cdconstruct.com.au",
    consultationUrl: `${PRODUCTION_DOMAIN}/book-renovation-consultation`,
  },
};

const PRIMARY_ROUTE_PATHS = new Set([
  "/",
  "/about-us",
  "/renovation-services",
  "/kitchen-renovations-gold-coast",
  "/bathroom-renovations-gold-coast",
  "/whole-home-renovations-gold-coast",
  "/home-extensions-gold-coast",
  "/renovation-projects",
  "/renovation-gallery",
  "/blog",
  "/book-renovation-consultation",
]);

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

const humanizeRoutePath = (routePath) => {
  if (routePath === "/") return "Homepage";
  return routePath
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
    )
    .join(" / ");
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

async function extractRouteSummary(routePath) {
  const htmlPath = routeToHtmlFile(routePath);

  try {
    const html = await fs.readFile(htmlPath, "utf8");
    const document = new JSDOM(html).window.document;
    const title = document.querySelector("title")?.textContent?.trim() || "";
    const description =
      document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "";
    return {
      title,
      description,
    };
  } catch {
    return {
      title: "",
      description: "",
    };
  }
}

function buildLlmsText({
  generatedAt,
  domain,
  routes,
  projectRoutes,
}) {
  const primaryRoutes = routes.filter((route) => PRIMARY_ROUTE_PATHS.has(route.path));
  const locationRoutes = routes
    .filter(
      (route) =>
        route.path.endsWith("-renovations") &&
        !route.path.includes("/renovation-projects/") &&
        !route.path.endsWith("-gold-coast"),
    )
    .slice(0, 12);
  const blogRoutes = routes.filter((route) => route.path.startsWith("/blog/")).slice(0, 6);
  const lines = [];

  lines.push(`# ${new URL(domain).hostname} AI Content Index`);
  lines.push(`Generated: ${generatedAt}`);
  lines.push("");
  lines.push("## Business");
  lines.push(`Name: ${BUSINESS_PROFILE.name}`);
  lines.push(`Also known as: ${BUSINESS_PROFILE.alternateName}`);
  lines.push(`Canonical domain: ${domain}`);
  lines.push(`Summary: ${BUSINESS_PROFILE.summary}`);
  lines.push(`Core services: ${BUSINESS_PROFILE.expertise.join(", ")}`);
  lines.push(`Primary service areas: ${BUSINESS_PROFILE.serviceAreas.join(", ")}`);
  lines.push(`Contact phone: ${BUSINESS_PROFILE.contact.phone}`);
  lines.push(`Contact email: ${BUSINESS_PROFILE.contact.email}`);
  lines.push(`Consultation URL: ${BUSINESS_PROFILE.contact.consultationUrl}`);
  lines.push("");
  lines.push("## Core Public Pages");
  for (const route of primaryRoutes) {
    lines.push(`- ${route.url} | ${route.title || route.path}`);
  }

  lines.push("");
  lines.push("## Local Service Area Pages");
  if (locationRoutes.length === 0) {
    lines.push("- None listed");
  } else {
    for (const route of locationRoutes) {
      lines.push(`- ${route.url} | ${route.title || route.path}`);
    }
  }

  lines.push("");
  lines.push("## Renovation Guides");
  if (blogRoutes.length === 0) {
    lines.push("- None listed");
  } else {
    for (const route of blogRoutes) {
      lines.push(`- ${route.url} | ${route.title || route.path}`);
    }
  }

  lines.push("");
  lines.push("## Project Detail Pages");
  if (projectRoutes.length === 0) {
    lines.push("- None listed");
  } else {
    for (const route of projectRoutes) {
      lines.push(`- ${route.url} | ${route.title || route.path}`);
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
    lines.push(`Title: ${route.title || humanizeRoutePath(route.path)}`);
    lines.push(`Description: ${route.description || "unknown"}`);
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

async function readLocalSitemapEntries() {
  try {
    const source = await fs.readFile(SITEMAP_INVENTORY_PATH, "utf8");
    const parsed = JSON.parse(source);
    if (Array.isArray(parsed?.entries) && parsed.entries.length > 0) {
      return parsed.entries
        .map((entry) => ({
          loc: `${entry?.url || ""}`.trim(),
          lastmod: `${entry?.lastmod || ""}`.trim() || null,
        }))
        .filter((entry) => Boolean(entry.loc));
    }
  } catch {
    // Fallback for legacy environments still using a generated public sitemap.xml.
  }

  const sitemapXml = await fs.readFile(PUBLIC_SITEMAP_PATH, "utf8");
  return parseSitemapEntries(sitemapXml);
}

async function main() {
  const [entries, generatedProjectSlugs] = await Promise.all([
    readLocalSitemapEntries(),
    loadGeneratedProjectSlugs(GENERATED_PROJECT_SLUGS_PATH),
  ]);

  if (entries.length === 0) {
    throw new Error("Sitemap inventory has no URL entries. Run `npm run seo:sync` first.");
  }

  const routeInventory = [];
  for (const entry of entries) {
    const routePath = normalizePath(pathFromUrl(entry.loc, PRODUCTION_DOMAIN));
    const [structuredDataTypes, routeSummary] = await Promise.all([
      extractStructuredDataTypes(routePath),
      extractRouteSummary(routePath),
    ]);
    routeInventory.push({
      path: routePath,
      url: entry.loc,
      lastmod: entry.lastmod,
      title: routeSummary.title || humanizeRoutePath(routePath),
      description: routeSummary.description,
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
    business: BUSINESS_PROFILE,
    urlCount: routeInventory.length,
    projectUrlCount: projectRoutes.length,
    contentTypeCounts,
    structuredDataTypeCounts,
    primaryRoutes: routeInventory.filter((route) => PRIMARY_ROUTE_PATHS.has(route.path)),
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
