import fs from "fs/promises";

export const PRODUCTION_DOMAIN = "https://www.cdconstruct.com.au";
export const PROJECT_ROUTE_PREFIX = "/renovation-projects/";
export const PROJECT_ROUTE_INDEX = "/renovation-projects";
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const CORE_ROUTES = [
  "/",
  "/about-us",
  "/renovation-projects",
  "/renovation-services",
  "/renovation-gallery",
  "/renovation-design-tools",
  "/book-renovation-consultation",
  "/renovation-life-stages",
  "/privacy-policy",
  "/terms-conditions",
];

export const EXTENDED_ROUTES = [
  "/renovation-ai-generator/intro",
  "/renovation-ai-generator",
  "/renovation-design-tools/moodboard",
];

export const SITELINK_TARGET_PATHS = [
  "/about-us",
  "/renovation-projects",
  "/renovation-gallery",
  "/renovation-services",
  "/renovation-life-stages",
  "/renovation-design-tools",
  "/renovation-ai-generator",
  "/book-renovation-consultation",
];

export const FALLBACK_PROJECT_SLUGS = [
  "family-hub",
  "everyday-ease",
  "light-and-flow-house",
  "seamless-bathroom",
  "stone-and-light",
  "terrazzo-retreat",
  "the-calm-edit",
  "the-elanora-residence",
  "warm-minimal-bathroom",
];

const EXCLUDED_PROJECT_SLUGS = new Set([
  "coastal-modern",
  "heritage-revival",
  "retreat-house",
  "sunshine-retreat",
  "urban-oasis",
]);

export const NOINDEX_EXACT_ROUTES = new Set([
  "/_not-found",
  "/404",
  "/auth",
  "/brand-guidelines",
]);

export const NOINDEX_PREFIXES = ["/admin"];

export const THIN_CONTENT_MIN_WORDS = 250;
export const DUPLICATE_SIMILARITY_THRESHOLD = 0.85;

const THIN_CONTENT_EXACT_EXEMPT_ROUTES = new Set([
  "/privacy-policy",
  "/terms-conditions",
]);

const DUPLICATE_EXACT_EXEMPT_ROUTES = new Set([
  "/privacy-policy",
  "/terms-conditions",
]);

export function parseEnvBoolean(value, defaultValue = false) {
  if (typeof value === "undefined") return defaultValue;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

export function normalizePath(value) {
  if (!value || value === "/") return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

export function canonicalForPath(path, domain = PRODUCTION_DOMAIN) {
  return new URL(normalizePath(path), domain).toString();
}

export function normalizeAbsoluteUrl(value) {
  try {
    const parsed = new URL(value);
    parsed.hash = "";
    if (parsed.pathname !== "/") {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

export function sameDomain(value, domain = PRODUCTION_DOMAIN) {
  try {
    const left = new URL(value).hostname;
    const right = new URL(domain).hostname;
    return left === right;
  } catch {
    return false;
  }
}

export function toAbsoluteUrl(value, domain = PRODUCTION_DOMAIN) {
  try {
    return new URL(value, domain).toString();
  } catch {
    return "";
  }
}

export function parseSitemapEntries(xmlText) {
  const entries = [];
  const urlBlocks = xmlText.match(/<url>[\s\S]*?<\/url>/g) || [];

  for (const block of urlBlocks) {
    const locMatch = block.match(/<loc>\s*([^<]+)\s*<\/loc>/i);
    if (!locMatch) continue;
    const lastmodMatch = block.match(/<lastmod>\s*([^<]+)\s*<\/lastmod>/i);
    entries.push({
      loc: locMatch[1].trim(),
      lastmod: lastmodMatch?.[1]?.trim() || null,
    });
  }

  return entries;
}

export function parseSitemapUrls(xmlText) {
  return parseSitemapEntries(xmlText).map((entry) => entry.loc);
}

export function pathFromUrl(url, domain = PRODUCTION_DOMAIN) {
  try {
    const parsed = new URL(url, domain);
    return normalizePath(parsed.pathname || "/");
  } catch {
    return "";
  }
}

export function isProjectDetailPath(routePath) {
  return routePath.startsWith(PROJECT_ROUTE_PREFIX) && routePath !== PROJECT_ROUTE_INDEX;
}

export function slugFromProjectPath(routePath) {
  if (!isProjectDetailPath(routePath)) return "";
  const slug = routePath.replace(PROJECT_ROUTE_PREFIX, "").trim();
  return SLUG_PATTERN.test(slug) ? slug : "";
}

export function isNoindexRoute(routePath) {
  if (NOINDEX_EXACT_ROUTES.has(routePath)) return true;
  return NOINDEX_PREFIXES.some((prefix) => routePath === prefix || routePath.startsWith(`${prefix}/`));
}

export function isIndexableRoute(routePath) {
  return !isNoindexRoute(normalizePath(routePath));
}

export function isCanonicalRoute(routePath) {
  return isIndexableRoute(routePath);
}

export function isSitemapEligibleRoute(routePath) {
  return isIndexableRoute(routePath);
}

export function isThinContentExempt(routePath) {
  const normalized = normalizePath(routePath);
  if (THIN_CONTENT_EXACT_EXEMPT_ROUTES.has(normalized)) return true;
  return isProjectDetailPath(normalized);
}

export function isDuplicateCompareExempt(routePath) {
  const normalized = normalizePath(routePath);
  if (DUPLICATE_EXACT_EXEMPT_ROUTES.has(normalized)) return true;
  return isProjectDetailPath(normalized);
}

export async function loadGeneratedProjectSlugs(filePath) {
  try {
    const source = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(source);
    const slugs = Array.isArray(parsed?.slugs) ? parsed.slugs : [];
    return [...new Set(
      slugs
        .map((slug) => `${slug}`.trim().toLowerCase())
        .filter((slug) => slug && SLUG_PATTERN.test(slug))
        .filter((slug) => !EXCLUDED_PROJECT_SLUGS.has(slug))
    )].sort();
  } catch {
    return [...FALLBACK_PROJECT_SLUGS];
  }
}

export function classifyContentType(routePath) {
  if (routePath === "/") return "homepage";
  if (routePath === "/about-us") return "about-page";
  if (routePath === "/renovation-services") return "services-page";
  if (routePath === "/book-renovation-consultation") return "contact-page";
  if (routePath === "/renovation-gallery") return "gallery-page";
  if (routePath === "/renovation-projects") return "projects-index";
  if (isProjectDetailPath(routePath)) return "project-detail";
  if (routePath === "/renovation-design-tools") return "design-tools";
  if (routePath.startsWith("/renovation-design-tools/")) return "design-tool";
  if (routePath === "/privacy-policy" || routePath === "/terms-conditions") return "legal-page";
  return "content-page";
}

export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
