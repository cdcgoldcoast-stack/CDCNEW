import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const GENERATED_PROJECT_SLUGS_PATH = path.join(ROOT_DIR, "src", "generated", "project-slugs.json");

const PRODUCTION_DOMAIN = "https://www.cdconstruct.com.au";

const CORE_ROUTES = [
  "/",
  "/about-us",
  "/renovation-projects",
  "/services",
  "/project-gallery",
  "/renovation-design-tools",
  "/get-quote",
  "/life-stages",
  "/privacy-policy",
  "/terms-conditions",
];

const EXTENDED_ROUTES = [
  "/renovation-design-tools/ai-generator/intro",
  "/renovation-design-tools/ai-generator",
  "/renovation-design-tools/moodboard",
];

const FALLBACK_PROJECT_SLUGS = [
  "coastal-modern",
  "heritage-revival",
  "family-hub",
  "retreat-house",
  "urban-oasis",
  "sunshine-retreat",
];

const REQUIRED_TWITTER_META = [
  "twitter:card",
  "twitter:domain",
  "twitter:url",
  "twitter:title",
  "twitter:description",
  "twitter:image",
  "twitter:image:alt",
];

const parseEnvBoolean = (value, defaultValue = false) => {
  if (typeof value === "undefined") return defaultValue;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const includeExtendedRoutes = parseEnvBoolean(process.env.PRERENDER_EXTENDED, true);
const includeProjectDetailRoutes = parseEnvBoolean(process.env.PRERENDER_PROJECT_DETAIL, false);

const normalizePath = (route) => {
  if (!route || route === "/") return "/";
  const withLeadingSlash = route.startsWith("/") ? route : `/${route}`;
  return withLeadingSlash.replace(/\/+$/, "");
};

const routeToFilePath = (route) => {
  if (route === "/") return path.join(DIST_DIR, "index.html");
  return path.join(DIST_DIR, route.replace(/^\//, ""), "index.html");
};

const canonicalForRoute = (route) => new URL(normalizePath(route), PRODUCTION_DOMAIN).toString();

const extractMetaByName = (document, name) => {
  const meta = document.querySelector(`meta[name="${name}"]`);
  return meta?.getAttribute("content")?.trim() || "";
};

const hasFollowedInternalLinks = (document) => {
  const links = [...document.querySelectorAll("a[href]")];
  const followedInternalLinks = new Set();

  for (const link of links) {
    const href = (link.getAttribute("href") || "").trim();
    const rel = (link.getAttribute("rel") || "").toLowerCase();

    if (!href || !href.startsWith("/") || href.startsWith("//")) continue;
    if (href.startsWith("/#")) continue;
    if (rel.includes("nofollow")) continue;

    followedInternalLinks.add(href.split("#")[0]);
  }

  return followedInternalLinks.size >= 2;
};

const hasBrokenHeadingHierarchy = (document) => {
  const headingLevels = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((heading) =>
    Number(heading.tagName.replace("H", ""))
  );

  if (headingLevels.length === 0) return true;
  if (headingLevels[0] !== 1) return true;

  for (let index = 1; index < headingLevels.length; index += 1) {
    if (headingLevels[index] - headingLevels[index - 1] > 1) {
      return true;
    }
  }

  return false;
};

const loadProjectRoutes = async () => {
  try {
    const source = await fs.readFile(GENERATED_PROJECT_SLUGS_PATH, "utf8");
    const parsed = JSON.parse(source);
    const slugs = Array.isArray(parsed?.slugs) ? parsed.slugs : [];
    return [...new Set(slugs.map((slug) => `${slug}`.trim()).filter(Boolean))].map(
      (slug) => `/renovation-projects/${slug}`
    );
  } catch {
    return FALLBACK_PROJECT_SLUGS.map((slug) => `/renovation-projects/${slug}`);
  }
};

const getAuditRoutes = async () => {
  const routes = [...CORE_ROUTES];

  if (includeExtendedRoutes) {
    routes.push(...EXTENDED_ROUTES);
  }

  if (includeProjectDetailRoutes) {
    routes.push(...(await loadProjectRoutes()));
  }

  return [...new Set(routes)];
};

const auditRoute = async (route) => {
  const issues = [];
  const htmlPath = routeToFilePath(route);

  let html;
  try {
    html = await fs.readFile(htmlPath, "utf8");
  } catch {
    issues.push(`Missing prerendered HTML at ${path.relative(ROOT_DIR, htmlPath)}`);
    return issues;
  }

  const document = new JSDOM(html).window.document;

  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() || "";
  if (!canonical) {
    issues.push("Missing canonical tag");
  } else {
    const expectedCanonical = canonicalForRoute(route);
    if (canonical !== expectedCanonical) {
      issues.push(`Canonical mismatch. Expected ${expectedCanonical}, found ${canonical}`);
    }
  }

  const metaDescription = extractMetaByName(document, "description");
  if (!metaDescription) {
    issues.push("Missing meta description");
  }

  for (const tagName of REQUIRED_TWITTER_META) {
    if (!extractMetaByName(document, tagName)) {
      issues.push(`Missing ${tagName}`);
    }
  }

  if (document.querySelectorAll("h1").length === 0) {
    issues.push("Missing H1");
  }

  if (document.querySelectorAll("h2").length === 0) {
    issues.push("Missing H2");
  }

  if (hasBrokenHeadingHierarchy(document)) {
    issues.push("Broken heading hierarchy");
  }

  const linkedImages = [...document.querySelectorAll("a img")];
  for (const image of linkedImages) {
    const alt = image.getAttribute("alt");
    if (!alt || !alt.trim()) {
      issues.push("Anchored image missing alt text");
      break;
    }
  }

  if (!hasFollowedInternalLinks(document)) {
    issues.push("Fewer than 2 followed internal links");
  }

  return issues;
};

const main = async () => {
  const routes = await getAuditRoutes();
  const failures = [];

  console.log(
    `[seo:audit] Auditing ${routes.length} routes (extended=${includeExtendedRoutes ? "on" : "off"}, projectDetail=${includeProjectDetailRoutes ? "on" : "off"})`
  );

  for (const route of routes) {
    const issues = await auditRoute(route);
    if (issues.length > 0) {
      failures.push({ route, issues });
    }
  }

  if (failures.length > 0) {
    console.error(`[seo:audit] Failed on ${failures.length} route(s):`);
    for (const failure of failures) {
      console.error(`- ${failure.route}`);
      for (const issue of failure.issues) {
        console.error(`  - ${issue}`);
      }
    }
    process.exit(1);
  }

  console.log("[seo:audit] All checks passed.");
};

main().catch((error) => {
  console.error("[seo:audit] Unexpected failure:", error);
  process.exit(1);
});
