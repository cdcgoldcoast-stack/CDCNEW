import fs from "fs/promises";
import path from "path";
import { JSDOM } from "jsdom";
import { fileURLToPath, pathToFileURL } from "url";
import {
  CORE_ROUTES,
  EXTENDED_ROUTES,
  canonicalForPath,
  loadGeneratedProjectSlugs,
  normalizePath,
} from "./lib/seo-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const NEXT_SERVER_APP_DIR = path.join(ROOT_DIR, ".next", "server", "app");
const GENERATED_PROJECT_SLUGS_PATH = path.join(ROOT_DIR, "src", "generated", "project-slugs.json");
const VERCEL_CONFIG_PATH = path.join(ROOT_DIR, "vercel.json");
const NEXT_CONFIG_PATH = path.join(ROOT_DIR, "next.config.mjs");
const ARTIFACTS_DIR = path.join(ROOT_DIR, "artifacts");
const OUTPUT_PATH = path.join(ARTIFACTS_DIR, "next-cutover-audit.json");

const PRIVATE_ROUTES = [
  "/auth",
  "/admin",
  "/admin/projects",
  "/admin/enquiries",
  "/admin/chat-inquiries",
  "/admin/gallery",
  "/admin/site-images",
  "/admin/image-assets",
  "/admin/settings",
  "/brand-guidelines",
];

const REQUIRED_REDIRECT_SOURCES = [
  "/:path+/",
  "/our-story",
  "/projects/:slug",
  "/projects",
  "/gallery",
  "/design-tools",
  "/design-tools/ai-generator/intro",
  "/design-tools/ai-generator",
  "/design-tools/moodboard",
];

const normalizeAbsolute = (value) => {
  try {
    const url = new URL(value);
    if (url.pathname !== "/") {
      url.pathname = url.pathname.replace(/\/+$/, "");
    }
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
};

const routeToHtmlPath = (route) => {
  if (route === "/") {
    return path.join(NEXT_SERVER_APP_DIR, "index.html");
  }
  const normalized = normalizePath(route).replace(/^\//, "");
  return path.join(NEXT_SERVER_APP_DIR, `${normalized}.html`);
};

const extractMetaByName = (document, name) => {
  const node = document.querySelector(`meta[name="${name}"]`);
  return node?.getAttribute("content")?.trim() || "";
};

const extractMetaByProperty = (document, property) => {
  const node = document.querySelector(`meta[property="${property}"]`);
  return node?.getAttribute("content")?.trim() || "";
};

const readVercelRedirects = async () => {
  try {
    const source = await fs.readFile(VERCEL_CONFIG_PATH, "utf8");
    const parsed = JSON.parse(source);
    return Array.isArray(parsed?.redirects) ? parsed.redirects : [];
  } catch {
    return [];
  }
};

const readNextRedirects = async () => {
  try {
    const mod = await import(pathToFileURL(NEXT_CONFIG_PATH).href);
    const config = mod?.default || {};
    if (typeof config.redirects !== "function") return [];
    const redirects = await config.redirects();
    return Array.isArray(redirects) ? redirects : [];
  } catch {
    return [];
  }
};

const checkRedirectCoverage = async () => {
  const [vercelRedirects, nextRedirects] = await Promise.all([
    readVercelRedirects(),
    readNextRedirects(),
  ]);
  const availableSources = new Set(
    [...vercelRedirects, ...nextRedirects]
      .map((entry) => `${entry?.source || ""}`.trim())
      .filter(Boolean),
  );
  const missing = REQUIRED_REDIRECT_SOURCES.filter((source) => !availableSources.has(source));

  return {
    missing,
    found: REQUIRED_REDIRECT_SOURCES.filter((source) => availableSources.has(source)),
  };
};

const main = async () => {
  const failures = [];
  const results = [];
  const startedAt = Date.now();

  const slugs = await loadGeneratedProjectSlugs(GENERATED_PROJECT_SLUGS_PATH);
  const projectRoutes = slugs.map((slug) => `/renovation-projects/${slug}`);
  const publicRoutes = [...CORE_ROUTES, ...EXTENDED_ROUTES, ...projectRoutes].map(normalizePath);
  const privateRoutes = PRIVATE_ROUTES.map(normalizePath);
  const allRoutes = [...new Set([...publicRoutes, ...privateRoutes])];

  for (const route of allRoutes) {
    const htmlPath = routeToHtmlPath(route);
    const isPrivateRoute = privateRoutes.includes(route);
    const expectedCanonical = normalizeAbsolute(canonicalForPath(route));

    let html;
    try {
      html = await fs.readFile(htmlPath, "utf8");
    } catch {
      failures.push({
        route,
        issue: "missing_html",
        htmlPath: path.relative(ROOT_DIR, htmlPath),
      });
      continue;
    }

    const document = new JSDOM(html).window.document;
    const title = document.querySelector("title")?.textContent?.trim() || "";
    const description = extractMetaByName(document, "description");
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() || "";
    const robots = extractMetaByName(document, "robots").toLowerCase();
    const ogTitle = extractMetaByProperty(document, "og:title");
    const hasJsonLd = document.querySelectorAll('script[type="application/ld+json"]').length > 0;

    const routeIssues = [];
    if (!title) routeIssues.push("missing_title");
    if (!description) routeIssues.push("missing_description");
    if (!canonical) {
      routeIssues.push("missing_canonical");
    } else if (normalizeAbsolute(canonical) !== expectedCanonical) {
      routeIssues.push("canonical_mismatch");
    }
    if (!robots) routeIssues.push("missing_robots");
    if (!ogTitle) routeIssues.push("missing_og_title");

    if (isPrivateRoute) {
      if (!robots.includes("noindex")) routeIssues.push("private_route_not_noindex");
    } else {
      if (robots.includes("noindex")) routeIssues.push("public_route_is_noindex");
      if (!hasJsonLd) routeIssues.push("missing_jsonld");
    }

    const routeResult = {
      route,
      htmlPath: path.relative(ROOT_DIR, htmlPath),
      isPrivateRoute,
      title,
      canonical,
      robots,
      hasJsonLd,
      issues: routeIssues,
    };
    results.push(routeResult);

    if (routeIssues.length > 0) {
      failures.push(routeResult);
    }
  }

  const redirectCoverage = await checkRedirectCoverage();
  if (redirectCoverage.missing.length > 0) {
    failures.push({
      route: "[redirects]",
      issues: redirectCoverage.missing.map((source) => `missing_redirect_source:${source}`),
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    totals: {
      publicRoutes: publicRoutes.length,
      privateRoutes: privateRoutes.length,
      totalRoutes: allRoutes.length,
      failedRoutes: failures.filter((entry) => entry.route !== "[redirects]").length,
    },
    redirectCoverage,
    failures,
    results,
  };

  await fs.mkdir(ARTIFACTS_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  if (failures.length > 0) {
    console.error(
      `[cutover:audit] Failed with ${failures.length} issue scope(s). See ${path.relative(
        ROOT_DIR,
        OUTPUT_PATH,
      )}`,
    );
    process.exit(1);
  }

  console.log(
    `[cutover:audit] Passed. Verified ${allRoutes.length} route(s) and ${REQUIRED_REDIRECT_SOURCES.length} required redirect source(s).`,
  );
  console.log(`[cutover:audit] Report written to ${path.relative(ROOT_DIR, OUTPUT_PATH)}`);
};

main().catch((error) => {
  console.error("[cutover:audit] Unexpected failure:", error);
  process.exit(1);
});
