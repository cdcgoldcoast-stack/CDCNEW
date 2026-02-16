import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import {
  CORE_ROUTES,
  EXTENDED_ROUTES,
  PRODUCTION_DOMAIN,
  parseEnvBoolean,
  normalizePath,
  canonicalForPath,
  normalizeAbsoluteUrl,
  parseSitemapEntries,
  pathFromUrl,
  isNoindexRoute,
  loadGeneratedProjectSlugs,
  isProjectDetailPath,
  slugFromProjectPath,
  sameDomain,
} from "./lib/seo-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const PUBLIC_SITEMAP_PATH = path.join(ROOT_DIR, "public", "sitemap.xml");
const GENERATED_PROJECT_SLUGS_PATH = path.join(ROOT_DIR, "src", "generated", "project-slugs.json");
const VERCEL_CONFIG_PATH = path.join(ROOT_DIR, "vercel.json");

const REQUIRED_TWITTER_META = [
  "twitter:card",
  "twitter:domain",
  "twitter:url",
  "twitter:title",
  "twitter:description",
  "twitter:image",
  "twitter:image:alt",
];

const includeExtendedRoutes = parseEnvBoolean(process.env.PRERENDER_EXTENDED, true);
const includeProjectDetailRoutes = parseEnvBoolean(process.env.PRERENDER_PROJECT_DETAIL, false);
const performHttpChecks = parseEnvBoolean(
  process.env.SEO_AUDIT_HTTP,
  parseEnvBoolean(process.env.CI, false)
);
const maxHttpChecks = Number.parseInt(process.env.SEO_AUDIT_MAX_HTTP_CHECKS || "80", 10);
const httpTimeoutMs = Number.parseInt(process.env.SEO_AUDIT_TIMEOUT_MS || "12000", 10);

const routeToFilePath = (route) => {
  if (route === "/") return path.join(DIST_DIR, "index.html");
  return path.join(DIST_DIR, route.replace(/^\//, ""), "index.html");
};

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

const loadVercelConfig = async () => {
  try {
    const source = await fs.readFile(VERCEL_CONFIG_PATH, "utf8");
    return JSON.parse(source);
  } catch {
    return {};
  }
};

const isStaticRoutePattern = (route) => !/[:*()[\]+?]/.test(route);

const extractStaticRedirectPairs = (redirects) => {
  const pairs = [];
  for (const redirect of redirects || []) {
    const source = `${redirect?.source || ""}`.trim();
    const destination = `${redirect?.destination || ""}`.trim();
    if (!source || !destination) continue;
    if (!isStaticRoutePattern(source)) continue;

    let sourcePath = "";
    let destinationPath = "";

    try {
      sourcePath = normalizePath(source);
      if (/^https?:\/\//i.test(destination)) {
        if (!sameDomain(destination, PRODUCTION_DOMAIN)) continue;
        destinationPath = normalizePath(new URL(destination).pathname);
      } else {
        if (!isStaticRoutePattern(destination)) continue;
        destinationPath = normalizePath(destination);
      }
    } catch {
      continue;
    }

    if (!sourcePath || !destinationPath || sourcePath === destinationPath) continue;
    pairs.push({ sourcePath, destinationPath });
  }
  return pairs;
};

const buildRedirectChainIssues = (redirectPairs) => {
  const issues = [];
  const redirectMap = new Map(redirectPairs.map((pair) => [pair.sourcePath, pair.destinationPath]));

  for (const [sourcePath, destinationPath] of redirectMap.entries()) {
    let depth = 0;
    let currentPath = destinationPath;
    const visited = new Set([sourcePath]);

    while (redirectMap.has(currentPath) && depth < 10) {
      if (visited.has(currentPath)) {
        issues.push(`Redirect loop detected: ${sourcePath} -> ${currentPath}`);
        break;
      }
      visited.add(currentPath);
      depth += 1;
      currentPath = redirectMap.get(currentPath);
    }

    if (depth > 0 && !issues.some((issue) => issue.includes(`${sourcePath} ->`))) {
      issues.push(`Redirect chain detected: ${sourcePath} -> ${destinationPath} -> ${currentPath}`);
    }
  }

  return issues;
};

const loadProjectRoutes = async () => {
  const slugs = await loadGeneratedProjectSlugs(GENERATED_PROJECT_SLUGS_PATH);
  return slugs.map((slug) => `/renovation-projects/${slug}`);
};

const getAuditRoutes = async () => {
  const routes = [...CORE_ROUTES];

  if (includeExtendedRoutes) {
    routes.push(...EXTENDED_ROUTES);
  }

  if (includeProjectDetailRoutes) {
    routes.push(...(await loadProjectRoutes()));
  }

  return [...new Set(routes.map((route) => normalizePath(route)))];
};

const auditRouteHtml = async (route) => {
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
    const expectedCanonical = canonicalForPath(route);
    const normalizedCanonical = normalizeAbsoluteUrl(canonical);
    if (normalizedCanonical !== normalizeAbsoluteUrl(expectedCanonical)) {
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

const readSitemapEntries = async () => {
  const xml = await fs.readFile(PUBLIC_SITEMAP_PATH, "utf8");
  return parseSitemapEntries(xml);
};

const auditSitemapStructure = async ({ generatedProjectSlugs, vercelConfig }) => {
  const issues = [];
  const entries = await readSitemapEntries();
  const redirectPairs = extractStaticRedirectPairs(vercelConfig.redirects || []);
  const staticRedirectSources = new Set(redirectPairs.map((pair) => pair.sourcePath));
  const seenUrls = new Set();
  const seenPaths = new Set();
  const sitemapProjectSlugs = new Set();

  if (entries.length === 0) {
    issues.push("sitemap.xml contains no URL entries");
  }

  for (const entry of entries) {
    const normalizedUrl = normalizeAbsoluteUrl(entry.loc);
    if (!normalizedUrl) {
      issues.push(`Invalid sitemap <loc>: ${entry.loc}`);
      continue;
    }

    if (!sameDomain(normalizedUrl, PRODUCTION_DOMAIN)) {
      issues.push(`Sitemap URL is off-domain: ${entry.loc}`);
      continue;
    }

    if (seenUrls.has(normalizedUrl)) {
      issues.push(`Duplicate sitemap URL: ${normalizedUrl}`);
      continue;
    }
    seenUrls.add(normalizedUrl);

    const routePath = pathFromUrl(normalizedUrl, PRODUCTION_DOMAIN);
    seenPaths.add(routePath);

    if (isNoindexRoute(routePath)) {
      issues.push(`Noindex route included in sitemap: ${routePath}`);
    }

    if (staticRedirectSources.has(routePath)) {
      issues.push(`Redirect source included in sitemap: ${routePath}`);
    }

    try {
      const rawPath = new URL(entry.loc).pathname || "/";
      if (rawPath.length > 1 && rawPath.endsWith("/")) {
        issues.push(`Trailing-slash URL found in sitemap: ${entry.loc}`);
      }
    } catch {
      // Already captured by invalid URL check.
    }

    if (isProjectDetailPath(routePath)) {
      const slug = slugFromProjectPath(routePath);
      if (!slug) {
        issues.push(`Invalid project slug format in sitemap: ${routePath}`);
      } else {
        sitemapProjectSlugs.add(slug);
      }
    }
  }

  for (const route of CORE_ROUTES) {
    const normalizedRoute = normalizePath(route);
    if (!seenPaths.has(normalizedRoute)) {
      issues.push(`Missing core route from sitemap: ${normalizedRoute}`);
    }
  }

  const generatedProjectSlugSet = new Set(generatedProjectSlugs);
  const missingProjectSlugs = generatedProjectSlugs.filter((slug) => !sitemapProjectSlugs.has(slug));
  const staleProjectSlugs = [...sitemapProjectSlugs].filter((slug) => !generatedProjectSlugSet.has(slug));

  if (missingProjectSlugs.length > 0) {
    issues.push(
      `Generated project slugs missing in sitemap (${missingProjectSlugs.length}): ${missingProjectSlugs
        .slice(0, 8)
        .join(", ")}`
    );
  }

  if (staleProjectSlugs.length > 0) {
    issues.push(
      `Sitemap contains stale project slugs (${staleProjectSlugs.length}): ${staleProjectSlugs
        .slice(0, 8)
        .join(", ")}`
    );
  }

  issues.push(...buildRedirectChainIssues(redirectPairs));

  return {
    issues,
    sitemapUrls: [...seenUrls],
  };
};

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), httpTimeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "user-agent": "cdc-seo-audit/1.0",
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
};

const auditLiveSitemapUrls = async (sitemapUrls) => {
  const issues = [];
  const urlsToCheck = sitemapUrls.slice(0, Math.max(1, maxHttpChecks));

  for (const url of urlsToCheck) {
    let response;
    try {
      response = await fetchWithTimeout(url, { redirect: "manual" });
    } catch (error) {
      issues.push(`Live check failed for ${url}: ${String(error)}`);
      continue;
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location") || "<missing>";
      issues.push(`Sitemap URL redirects (${response.status}): ${url} -> ${location}`);
      continue;
    }

    if (response.status !== 200) {
      issues.push(`Sitemap URL returned non-200 (${response.status}): ${url}`);
      continue;
    }

    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (!contentType.includes("text/html")) {
      continue;
    }

    const html = await response.text();
    const document = new JSDOM(html).window.document;
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() || "";
    if (!canonical) {
      issues.push(`Missing canonical on live URL: ${url}`);
      continue;
    }

    const normalizedCanonical = normalizeAbsoluteUrl(canonical);
    const normalizedUrl = normalizeAbsoluteUrl(url);
    if (!normalizedCanonical) {
      issues.push(`Invalid canonical URL on live page: ${url} -> ${canonical}`);
      continue;
    }
    if (normalizedCanonical !== normalizedUrl) {
      issues.push(`Live canonical mismatch: ${url} -> ${canonical}`);
    }

    try {
      const canonicalResponse = await fetchWithTimeout(normalizedCanonical, { redirect: "manual" });
      if (canonicalResponse.status >= 300 && canonicalResponse.status < 400) {
        const location = canonicalResponse.headers.get("location") || "<missing>";
        issues.push(
          `Canonical URL redirects (${canonicalResponse.status}): ${normalizedCanonical} -> ${location}`
        );
      }
    } catch (error) {
      issues.push(`Canonical reachability check failed for ${normalizedCanonical}: ${String(error)}`);
    }
  }

  return issues;
};

const main = async () => {
  const [auditRoutes, generatedProjectSlugs, vercelConfig] = await Promise.all([
    getAuditRoutes(),
    loadGeneratedProjectSlugs(GENERATED_PROJECT_SLUGS_PATH),
    loadVercelConfig(),
  ]);

  const failures = [];

  console.log(
    `[seo:audit] Auditing ${auditRoutes.length} prerender route(s) (extended=${includeExtendedRoutes ? "on" : "off"}, projectDetail=${includeProjectDetailRoutes ? "on" : "off"})`
  );

  for (const route of auditRoutes) {
    const issues = await auditRouteHtml(route);
    if (issues.length > 0) {
      failures.push({ scope: route, issues });
    }
  }

  const sitemapAudit = await auditSitemapStructure({ generatedProjectSlugs, vercelConfig });
  if (sitemapAudit.issues.length > 0) {
    failures.push({ scope: "[sitemap]", issues: sitemapAudit.issues });
  }

  if (performHttpChecks) {
    console.log(
      `[seo:audit] Running live URL checks for ${Math.min(sitemapAudit.sitemapUrls.length, maxHttpChecks)} sitemap URL(s)`
    );
    const liveIssues = await auditLiveSitemapUrls(sitemapAudit.sitemapUrls);
    if (liveIssues.length > 0) {
      failures.push({ scope: "[live]", issues: liveIssues });
    }
  } else {
    console.log("[seo:audit] Live URL checks skipped (set SEO_AUDIT_HTTP=1 to enable).");
  }

  if (failures.length > 0) {
    console.error(`[seo:audit] Failed with ${failures.length} scope(s):`);
    for (const failure of failures) {
      console.error(`- ${failure.scope}`);
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

