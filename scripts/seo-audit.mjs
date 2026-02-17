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
  isSitemapEligibleRoute,
  loadGeneratedProjectSlugs,
  isProjectDetailPath,
  slugFromProjectPath,
  sameDomain,
  SITELINK_TARGET_PATHS,
  isIndexableRoute,
  THIN_CONTENT_MIN_WORDS,
  DUPLICATE_SIMILARITY_THRESHOLD,
  isThinContentExempt,
  isDuplicateCompareExempt,
} from "./lib/seo-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const NEXT_SERVER_APP_DIR = path.join(ROOT_DIR, ".next", "server", "app");
const PUBLIC_SITEMAP_PATH = path.join(ROOT_DIR, "public", "sitemap.xml");
const GENERATED_PROJECT_SLUGS_PATH = path.join(ROOT_DIR, "src", "generated", "project-slugs.json");
const VERCEL_CONFIG_PATH = path.join(ROOT_DIR, "vercel.json");
const ARTIFACTS_DIR = path.join(ROOT_DIR, "artifacts");
const CONTENT_AUDIT_REPORT_PATH = path.join(ARTIFACTS_DIR, "seo-content-audit.json");

const REQUIRED_TWITTER_META = [
  "twitter:card",
  "twitter:domain",
  "twitter:url",
  "twitter:title",
  "twitter:description",
  "twitter:image",
  "twitter:image:alt",
];
const REQUIRED_OG_META = [
  "og:title",
  "og:description",
  "og:url",
  "og:site_name",
  "og:type",
  "og:image",
];
const REQUIRED_GLOBAL_META = [
  "viewport",
  "author",
  "referrer",
  "format-detection",
  "googlebot",
];

const GENERIC_INTERNAL_ANCHOR_WORDS = new Set([
  "view",
  "click",
  "more",
  "learn",
  "read",
  "start",
  "open",
  "go",
  "here",
]);

const ROUTES_REQUIRING_LISTS = new Set([
  "/",
  "/about-us",
  "/renovation-services",
  "/renovation-design-tools",
  "/book-renovation-consultation",
  "/renovation-life-stages",
  "/renovation-ai-generator/intro",
]);

const ROUTES_REQUIRING_EMPHASIS = new Set([
  "/",
  "/about-us",
  "/renovation-services",
  "/renovation-design-tools",
  "/book-renovation-consultation",
  "/renovation-life-stages",
  "/renovation-ai-generator/intro",
]);
const ORPHAN_ROUTE_EXCEPTIONS = new Set([]);

const REQUIRED_SSR_CONTENT_FRAGMENTS = {
  "/": [
    "Gold Coast Renovations - Locally Trusted",
    "Gold Coast Renovation Services",
  ],
  "/renovation-services": ["Gold Coast Renovation Services Built Around How You Live"],
};

const GOOGLEBOT_PARITY_ROUTES = ["/", "/renovation-services"];
const GOOGLEBOT_USER_AGENT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const STANDARD_BROWSER_USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const includeExtendedRoutes = parseEnvBoolean(process.env.PRERENDER_EXTENDED, true);
const includeProjectDetailRoutes = parseEnvBoolean(process.env.PRERENDER_PROJECT_DETAIL, true);
const performHttpChecks = parseEnvBoolean(
  process.env.SEO_AUDIT_HTTP,
  parseEnvBoolean(process.env.CI, false)
);
const maxHttpChecks = Number.parseInt(process.env.SEO_AUDIT_MAX_HTTP_CHECKS || "80", 10);
const httpTimeoutMs = Number.parseInt(process.env.SEO_AUDIT_TIMEOUT_MS || "12000", 10);
const liveHttpOrigin = (() => {
  const rawValue = `${process.env.SEO_AUDIT_HTTP_ORIGIN || PRODUCTION_DOMAIN}`.trim();
  try {
    const parsed = new URL(rawValue);
    parsed.pathname = "/";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return PRODUCTION_DOMAIN;
  }
})();

const routeToFilePath = (route) => {
  if (route === "/") return path.join(NEXT_SERVER_APP_DIR, "index.html");
  return path.join(NEXT_SERVER_APP_DIR, `${route.replace(/^\//, "")}.html`);
};

const normalizeComparableText = (value) =>
  value
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const extractMetaByName = (document, name) => {
  const meta = document.querySelector(`meta[name="${name}"]`);
  return meta?.getAttribute("content")?.trim() || "";
};

const extractMetaByProperty = (document, property) => {
  const meta = document.querySelector(`meta[property="${property}"]`);
  return meta?.getAttribute("content")?.trim() || "";
};

const normalizeInternalHrefPath = (href, baseRoute) => {
  const trimmed = `${href || ""}`.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("#")) return "";
  if (/^(mailto|tel|javascript|data):/i.test(trimmed)) return "";
  if (trimmed.startsWith("//")) return "";

  if (trimmed.startsWith("/")) {
    const cleanPath = trimmed.split(/[?#]/)[0] || "/";
    return normalizePath(cleanPath);
  }

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      if (!sameDomain(trimmed, PRODUCTION_DOMAIN)) return "";
      return pathFromUrl(trimmed, PRODUCTION_DOMAIN);
    }

    const resolvedUrl = new URL(trimmed, canonicalForPath(baseRoute)).toString();
    if (!sameDomain(resolvedUrl, PRODUCTION_DOMAIN)) return "";
    return pathFromUrl(resolvedUrl, PRODUCTION_DOMAIN);
  } catch {
    return "";
  }
};

const collectInternalLinksFromDocument = (document, baseRoute) => {
  const links = new Set();
  const anchors = [...document.querySelectorAll("a[href]")];

  for (const anchor of anchors) {
    const href = anchor.getAttribute("href");
    const routePath = normalizeInternalHrefPath(href, baseRoute);
    if (!routePath) continue;
    if (routePath.startsWith("/_next")) continue;
    if (routePath.startsWith("/api")) continue;
    links.add(routePath);
  }

  return links;
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

const normalizeText = (value) => value.replace(/\s+/g, " ").trim();

const hasDescriptiveMetadataText = (value) => {
  const text = normalizeText(value || "");
  if (!text) return false;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return text.length >= 24 && wordCount >= 4;
};

const isDescriptiveHeroAlt = (value) => {
  const text = normalizeText(value || "");
  if (!text) return false;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasIntentTerms = /gold coast|renovation|kitchen|bathroom|home/i.test(text);
  return text.length >= 28 && wordCount >= 5 && hasIntentTerms;
};

const extractPrimaryContentImageAlt = (document) => {
  const images = [...document.querySelectorAll("main img[alt]")];
  for (const image of images) {
    const alt = normalizeText(image.getAttribute("alt") || "");
    if (!alt) continue;
    if (/logo|icon|avatar/i.test(alt)) continue;
    return alt;
  }
  return "";
};

const findWeakInternalAnchorText = (document) => {
  const weakAnchors = [];
  const links = [...document.querySelectorAll("a[href]")];

  for (const link of links) {
    const href = (link.getAttribute("href") || "").trim();
    const rel = (link.getAttribute("rel") || "").toLowerCase();
    if (!href || !href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) continue;
    if (rel.includes("nofollow")) continue;

    const rawText = normalizeText(link.textContent || link.getAttribute("aria-label") || "");
    if (!rawText) continue;
    const lowered = rawText.toLowerCase();
    const words = lowered.split(/\s+/).filter(Boolean);
    if (words.length !== 1) continue;

    if (GENERIC_INTERNAL_ANCHOR_WORDS.has(words[0])) {
      weakAnchors.push({ href, text: rawText });
    }
  }

  return weakAnchors;
};

const collectDuplicateHeadingTexts = (document) => {
  const counts = new Map();
  const headings = [...document.querySelectorAll("h1, h2, h3")];

  for (const heading of headings) {
    const text = normalizeText(heading.textContent || "");
    if (!text) continue;
    const key = text.toLowerCase();
    counts.set(key, {
      text,
      count: (counts.get(key)?.count || 0) + 1,
    });
  }

  return [...counts.values()].filter((entry) => entry.count > 1);
};

const collectDuplicateAltTexts = (document) => {
  const counts = new Map();
  const images = [...document.querySelectorAll("img[alt]")];

  for (const image of images) {
    const alt = normalizeText(image.getAttribute("alt") || "");
    if (!alt) continue;
    if (/logo|avatar|icon/i.test(alt)) continue;

    const key = alt.toLowerCase();
    counts.set(key, {
      alt,
      count: (counts.get(key)?.count || 0) + 1,
    });
  }

  return [...counts.values()].filter((entry) => entry.count > 1);
};

const collectOneWordAltTexts = (document) => {
  const offenders = new Set();
  const images = [...document.querySelectorAll("img[alt]")];

  for (const image of images) {
    const alt = normalizeText(image.getAttribute("alt") || "");
    if (!alt) continue;
    if (/logo|avatar|icon/i.test(alt)) continue;

    const words = alt.split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      offenders.add(alt);
    }
  }

  return [...offenders];
};

const collectInsecureHttpLinks = (document) => {
  const offenders = [];
  const links = [...document.querySelectorAll("a[href]")];

  for (const link of links) {
    const href = (link.getAttribute("href") || "").trim();
    if (!href.toLowerCase().startsWith("http://")) continue;
    if (/^http:\/\/www\.w3\.org\//i.test(href)) continue;
    offenders.push(href);
  }

  return [...new Set(offenders)];
};

const extractComparableBodyText = (document) => {
  const body = document.body;
  if (!body) return "";
  const clone = body.cloneNode(true);

  const selectors = [
    "script",
    "style",
    "noscript",
    "template",
    "svg",
    "header",
    "footer",
    "nav",
    '[aria-hidden="true"]',
    '[role="dialog"]',
    '[data-sonner-toaster]',
  ];

  clone.querySelectorAll(selectors.join(",")).forEach((node) => node.remove());
  return normalizeText(clone.textContent || "");
};

const tokenizeComparableText = (value) => {
  const matches = `${value || ""}`.toLowerCase().match(/[a-z0-9]+/g) || [];
  return matches.filter((token) => token.length >= 3);
};

const computeWordCount = (value) => tokenizeComparableText(value).length;

const computeJaccardSimilarity = (leftTokens, rightTokens) => {
  const leftSet = new Set(leftTokens);
  const rightSet = new Set(rightTokens);
  if (leftSet.size === 0 && rightSet.size === 0) return 1;
  if (leftSet.size === 0 || rightSet.size === 0) return 0;

  let intersection = 0;
  for (const token of leftSet) {
    if (rightSet.has(token)) intersection += 1;
  }

  const union = leftSet.size + rightSet.size - intersection;
  return union === 0 ? 0 : intersection / union;
};

const routeFromRenderedHtmlPath = (absolutePath) => {
  const relativePath = path.relative(NEXT_SERVER_APP_DIR, absolutePath);
  const unixPath = relativePath.split(path.sep).join("/");
  if (!unixPath.endsWith(".html")) return "";

  const withoutExtension = unixPath.replace(/\.html$/i, "");
  if (withoutExtension === "index") return "/";

  const routeCandidate = `/${withoutExtension}`;
  const normalized = normalizePath(routeCandidate);
  if (normalized.endsWith("/index")) {
    const trimmed = normalized.replace(/\/index$/, "");
    return trimmed || "/";
  }
  return normalized;
};

const collectRenderedRoutePaths = async () => {
  const files = [];

  const walk = async (dirPath) => {
    let entries = [];
    try {
      entries = await fs.readdir(dirPath, { withFileTypes: true });
    } catch {
      return;
    }

    await Promise.all(
      entries.map(async (entry) => {
        const targetPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          await walk(targetPath);
          return;
        }
        if (entry.isFile() && entry.name.endsWith(".html")) {
          files.push(targetPath);
        }
      }),
    );
  };

  await walk(NEXT_SERVER_APP_DIR);

  const routes = new Set();
  for (const filePath of files) {
    const route = routeFromRenderedHtmlPath(filePath);
    if (!route) continue;
    if (route.includes("[") || route.includes("]")) continue;
    routes.add(route);
  }

  return [...routes].sort();
};

const parseRouteLiteral = (rawPath) => {
  const input = `${rawPath || ""}`.trim();
  if (!input.startsWith("/")) return "";
  const cleanPath = input.split(/[?#]/)[0] || "/";
  return normalizePath(cleanPath);
};

const getThinContentMinimumWords = (route) => {
  const normalized = normalizePath(route);
  if (
    normalized === "/" ||
    normalized === "/about-us" ||
    normalized === "/renovation-services" ||
    normalized === "/renovation-life-stages"
  ) {
    return THIN_CONTENT_MIN_WORDS;
  }

  if (
    normalized === "/book-renovation-consultation" ||
    normalized === "/renovation-projects" ||
    normalized === "/renovation-design-tools" ||
    normalized === "/renovation-ai-generator/intro"
  ) {
    return 80;
  }

  if (normalized === "/renovation-gallery" || normalized === "/renovation-design-tools/moodboard") {
    return 60;
  }

  if (normalized === "/renovation-ai-generator") {
    return 40;
  }

  return THIN_CONTENT_MIN_WORDS;
};

const collectInternalAnchorTargetsFromSource = (source) => {
  const targets = new Set();
  const matcher = /(?:href|to)\s*=\s*(?:\{)?["'`](\/[^"'`}]+(?:[?#][^"'`}]+)?)["'`]/g;
  let match = matcher.exec(source);
  while (match) {
    const parsed = parseRouteLiteral(match[1]);
    if (parsed) targets.add(parsed);
    match = matcher.exec(source);
  }
  return targets;
};

const shouldScanNavigationSourceFile = (absolutePath) => {
  const relativePath = path.relative(ROOT_DIR, absolutePath).split(path.sep).join("/");
  if (!/\.(?:[cm]?[jt]sx?)$/i.test(relativePath)) return false;
  if (!/^(app|src|components|compat)\//.test(relativePath)) return false;
  if (relativePath.includes("/node_modules/")) return false;
  if (relativePath.includes("/admin/")) return false;
  if (relativePath.includes("/Auth.")) return false;
  if (relativePath.includes("/BrandGuidelines.")) return false;
  if (relativePath.endsWith(".d.ts")) return false;
  return true;
};

const collectSourceFilesForNavigationAudit = async () => {
  const candidateRoots = ["app", "src", "components", "compat"].map((segment) =>
    path.join(ROOT_DIR, segment),
  );
  const files = [];

  const walk = async (dirPath) => {
    let entries = [];
    try {
      entries = await fs.readdir(dirPath, { withFileTypes: true });
    } catch {
      return;
    }

    await Promise.all(
      entries.map(async (entry) => {
        const targetPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          await walk(targetPath);
          return;
        }
        if (entry.isFile() && shouldScanNavigationSourceFile(targetPath)) {
          files.push(targetPath);
        }
      }),
    );
  };

  await Promise.all(candidateRoots.map((rootPath) => walk(rootPath)));
  return [...new Set(files)].sort();
};

const extractOnClickNavigationPaths = (source) => {
  const paths = [];

  const pushPath = (rawPath, absoluteIndex) => {
    const parsed = parseRouteLiteral(rawPath);
    if (!parsed) return;
    if (!isIndexableRoute(parsed)) return;
    paths.push({ path: parsed, index: absoluteIndex });
  };

  const navigatePattern = /(?:navigate|router\.(?:push|replace))\(\s*["'`](\/[^"'`]+(?:[?#][^"'`]+)?)["'`]/g;
  let match = navigatePattern.exec(source);
  while (match) {
    const snippetStart = Math.max(0, match.index - 260);
    const snippet = source.slice(snippetStart, match.index + 80);
    if (/onClick\s*=\s*{[\s\S]*$/m.test(snippet)) {
      pushPath(match[1], match.index);
    }
    match = navigatePattern.exec(source);
  }

  const locationPattern = /window\.location\.href\s*=\s*["'`](\/[^"'`]+(?:[?#][^"'`]+)?)["'`]/g;
  match = locationPattern.exec(source);
  while (match) {
    const snippetStart = Math.max(0, match.index - 260);
    const snippet = source.slice(snippetStart, match.index + 80);
    if (/onClick\s*=\s*{[\s\S]*$/m.test(snippet)) {
      pushPath(match[1], match.index);
    }
    match = locationPattern.exec(source);
  }

  return paths;
};

const auditNonAnchorInternalNavigationSource = async () => {
  const issues = [];
  const files = await collectSourceFilesForNavigationAudit();

  for (const absolutePath of files) {
    let source = "";
    try {
      source = await fs.readFile(absolutePath, "utf8");
    } catch {
      continue;
    }

    const anchorTargets = collectInternalAnchorTargetsFromSource(source);
    const onclickNavigations = extractOnClickNavigationPaths(source);
    if (onclickNavigations.length === 0) continue;

    const seen = new Set();
    for (const navigation of onclickNavigations) {
      if (anchorTargets.has(navigation.path)) continue;
      const key = `${navigation.path}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const relativePath = path.relative(ROOT_DIR, absolutePath).split(path.sep).join("/");
      issues.push(
        `Non-anchor internal navigation detected in ${relativePath} for ${navigation.path}. Add a crawlable <a href> or <Link to>.`,
      );
    }
  }

  return issues;
};

const auditMetadataUniqueness = async (routes) => {
  const issues = [];
  const titleToRoutes = new Map();
  const descriptionToRoutes = new Map();
  const canonicalToRoutes = new Map();

  for (const route of routes) {
    if (!isIndexableRoute(route)) continue;
    const htmlPath = routeToFilePath(route);
    let html = "";
    try {
      html = await fs.readFile(htmlPath, "utf8");
    } catch {
      continue;
    }

    const document = new JSDOM(html).window.document;
    const title = normalizeText(document.querySelector("title")?.textContent || "");
    const description = normalizeText(extractMetaByName(document, "description"));
    const canonical = normalizeAbsoluteUrl(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() || "",
    );

    if (title) {
      const bucket = titleToRoutes.get(title) || [];
      bucket.push(route);
      titleToRoutes.set(title, bucket);
    }

    if (description) {
      const bucket = descriptionToRoutes.get(description) || [];
      bucket.push(route);
      descriptionToRoutes.set(description, bucket);
    }

    if (canonical) {
      const bucket = canonicalToRoutes.get(canonical) || [];
      bucket.push(route);
      canonicalToRoutes.set(canonical, bucket);
    }
  }

  for (const [title, titleRoutes] of titleToRoutes.entries()) {
    if (titleRoutes.length <= 1) continue;
    issues.push(
      `Duplicate title across ${titleRoutes.length} routes: "${title}" -> ${titleRoutes.join(", ")}`,
    );
  }

  for (const [description, descriptionRoutes] of descriptionToRoutes.entries()) {
    if (descriptionRoutes.length <= 1) continue;
    issues.push(
      `Duplicate meta description across ${descriptionRoutes.length} routes: "${description}" -> ${descriptionRoutes.join(", ")}`,
    );
  }

  for (const [canonical, canonicalRoutes] of canonicalToRoutes.entries()) {
    if (canonicalRoutes.length <= 1) continue;
    issues.push(
      `Duplicate canonical URL across ${canonicalRoutes.length} routes: ${canonical} -> ${canonicalRoutes.join(", ")}`,
    );
  }

  return issues;
};

const auditThinAndDuplicateContent = async (routes) => {
  const issues = [];
  const routeSummaries = [];

  for (const route of routes) {
    const htmlPath = routeToFilePath(route);
    let html = "";
    try {
      html = await fs.readFile(htmlPath, "utf8");
    } catch {
      routeSummaries.push({
        route,
        indexable: isIndexableRoute(route),
        excludedReason: isIndexableRoute(route) ? null : "noindex-route",
        readError: `missing_html:${path.relative(ROOT_DIR, htmlPath)}`,
        wordCount: 0,
        thinFlag: false,
        duplicateMatches: [],
      });
      continue;
    }

    const document = new JSDOM(html).window.document;
    const comparableText = extractComparableBodyText(document);
    const wordCount = computeWordCount(comparableText);
    const indexable = isIndexableRoute(route);
    const thinExempt = isThinContentExempt(route);
    const thinMinimumWords = getThinContentMinimumWords(route);
    const thinFlag = indexable && !thinExempt && wordCount < thinMinimumWords;

    routeSummaries.push({
      route,
      indexable,
      excludedReason: indexable ? null : "noindex-route",
      wordCount,
      thinExempt,
      duplicateExempt: isDuplicateCompareExempt(route),
      thinMinimumWords,
      comparableText,
      duplicateMatches: [],
      thinFlag,
    });

    if (thinFlag) {
      issues.push(
        `Thin content on indexable route ${route}: ${wordCount} words (minimum ${thinMinimumWords})`,
      );
    }
  }

  const comparableRoutes = routeSummaries.filter(
    (entry) =>
      entry.indexable &&
      !entry.duplicateExempt &&
      !entry.readError &&
      `${entry.comparableText || ""}`.length > 0,
  );
  const duplicatePairs = [];

  for (let leftIndex = 0; leftIndex < comparableRoutes.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < comparableRoutes.length; rightIndex += 1) {
      const left = comparableRoutes[leftIndex];
      const right = comparableRoutes[rightIndex];
      const similarity = computeJaccardSimilarity(
        tokenizeComparableText(left.comparableText),
        tokenizeComparableText(right.comparableText),
      );

      if (similarity >= DUPLICATE_SIMILARITY_THRESHOLD) {
        duplicatePairs.push({
          leftRoute: left.route,
          rightRoute: right.route,
          similarity: Number(similarity.toFixed(3)),
        });
        left.duplicateMatches.push({ route: right.route, similarity: Number(similarity.toFixed(3)) });
        right.duplicateMatches.push({ route: left.route, similarity: Number(similarity.toFixed(3)) });
        issues.push(
          `Near-duplicate indexable routes detected (${similarity.toFixed(3)}): ${left.route} <> ${right.route}`,
        );
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    thresholds: {
      thinContentMinWords: THIN_CONTENT_MIN_WORDS,
      duplicateSimilarity: DUPLICATE_SIMILARITY_THRESHOLD,
    },
    totals: {
      routes: routeSummaries.length,
      indexable: routeSummaries.filter((entry) => entry.indexable).length,
      excluded: routeSummaries.filter((entry) => !entry.indexable).length,
      thin: routeSummaries.filter((entry) => entry.thinFlag).length,
      duplicatePairs: duplicatePairs.length,
    },
    duplicatePairs,
    routes: routeSummaries
      .map((entry) => ({
        route: entry.route,
        indexable: entry.indexable,
        excludedReason: entry.excludedReason,
        wordCount: entry.wordCount,
        thinExempt: Boolean(entry.thinExempt),
        duplicateExempt: Boolean(entry.duplicateExempt),
        thinMinimumWords: entry.thinMinimumWords,
        thinFlag: Boolean(entry.thinFlag),
        readError: entry.readError || null,
        duplicateMatches: entry.duplicateMatches.slice(0, 20),
      }))
      .sort((left, right) => left.route.localeCompare(right.route)),
  };

  return { issues, report };
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

const auditInternalLinkGraph = async ({ routes, vercelConfig }) => {
  const issues = [];
  const issueSet = new Set();
  const redirectPairs = extractStaticRedirectPairs(vercelConfig.redirects || []);
  const validTargets = new Set([
    ...routes,
    ...redirectPairs.map((pair) => pair.sourcePath),
  ]);
  const inboundCount = new Map(routes.map((route) => [route, 0]));

  for (const route of routes) {
    const htmlPath = routeToFilePath(route);
    let html = "";
    try {
      html = await fs.readFile(htmlPath, "utf8");
    } catch {
      // Missing files are already reported in route-level audit.
      continue;
    }

    const document = new JSDOM(html).window.document;
    const links = collectInternalLinksFromDocument(document, route);

    for (const targetPath of links) {
      if (!validTargets.has(targetPath)) {
        issueSet.add(`Broken internal link: ${route} -> ${targetPath}`);
        continue;
      }
      if (inboundCount.has(targetPath) && targetPath !== route) {
        inboundCount.set(targetPath, (inboundCount.get(targetPath) || 0) + 1);
      }
    }
  }

  const orphanRoutes = [...inboundCount.entries()]
    .filter(
      ([route, count]) =>
        route !== "/" &&
        count === 0 &&
        !ORPHAN_ROUTE_EXCEPTIONS.has(route)
    )
    .map(([route]) => route)
    .sort();

  if (orphanRoutes.length > 0) {
    issueSet.add(
      `Indexable orphan routes found (${orphanRoutes.length}): ${orphanRoutes.slice(0, 20).join(", ")}`
    );
  }

  issues.push(...issueSet);
  return {
    issues,
    inboundCount,
  };
};

const auditSitelinkTargets = async ({ routes, sitemapPaths, inboundCount }) => {
  const issues = [];
  const routeSet = new Set(routes.map((route) => normalizePath(route)));
  const sitemapSet = new Set((sitemapPaths || []).map((routePath) => normalizePath(routePath)));
  let homepageDocument = null;

  try {
    const homepageHtml = await fs.readFile(routeToFilePath("/"), "utf8");
    homepageDocument = new JSDOM(homepageHtml).window.document;
  } catch {
    issues.push("Unable to validate sitelink targets because homepage HTML is missing");
  }

  for (const targetPath of SITELINK_TARGET_PATHS) {
    const normalizedTargetPath = normalizePath(targetPath);

    if (!routeSet.has(normalizedTargetPath)) {
      issues.push(`Sitelink target missing from generated routes: ${normalizedTargetPath}`);
      continue;
    }

    if (!sitemapSet.has(normalizedTargetPath)) {
      issues.push(`Sitelink target missing from sitemap: ${normalizedTargetPath}`);
    }

    const inboundLinks = inboundCount?.get(normalizedTargetPath) || 0;
    if (inboundLinks === 0) {
      issues.push(`Sitelink target has no internal inbound links: ${normalizedTargetPath}`);
    }

    if (homepageDocument) {
      const homepageAnchors = [...homepageDocument.querySelectorAll("a[href]")];
      const matchingAnchors = homepageAnchors.filter((anchor) => {
        const rel = (anchor.getAttribute("rel") || "").toLowerCase();
        if (rel.includes("nofollow")) return false;
        const href = anchor.getAttribute("href");
        return normalizeInternalHrefPath(href, "/") === normalizedTargetPath;
      });

      if (matchingAnchors.length === 0) {
        issues.push(`Homepage is missing a crawlable link to sitelink target: ${normalizedTargetPath}`);
      } else {
        const hasDescriptiveAnchor = matchingAnchors.some((anchor) => {
          const anchorText = normalizeText(anchor.textContent || anchor.getAttribute("aria-label") || "");
          return anchorText.split(/\s+/).filter(Boolean).length >= 2;
        });

        if (!hasDescriptiveAnchor) {
          issues.push(`Homepage links to ${normalizedTargetPath} are not descriptive enough`);
        }
      }
    }

    const targetHtmlPath = routeToFilePath(normalizedTargetPath);
    let targetHtml = "";
    try {
      targetHtml = await fs.readFile(targetHtmlPath, "utf8");
    } catch {
      issues.push(`Missing rendered HTML for sitelink target: ${normalizedTargetPath}`);
      continue;
    }

    const targetDocument = new JSDOM(targetHtml).window.document;
    const canonical = targetDocument.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() || "";
    const expectedCanonical = canonicalForPath(normalizedTargetPath);
    const normalizedCanonical = normalizeAbsoluteUrl(canonical);

    if (!canonical) {
      issues.push(`Sitelink target missing canonical tag: ${normalizedTargetPath}`);
    } else if (normalizedCanonical !== normalizeAbsoluteUrl(expectedCanonical)) {
      issues.push(
        `Sitelink target canonical mismatch: ${normalizedTargetPath} -> ${canonical} (expected ${expectedCanonical})`
      );
    }

    const robotsMeta = extractMetaByName(targetDocument, "robots").toLowerCase();
    const googlebotMeta = extractMetaByName(targetDocument, "googlebot").toLowerCase();
    if (robotsMeta.includes("noindex") || googlebotMeta.includes("noindex")) {
      issues.push(`Sitelink target is marked noindex: ${normalizedTargetPath}`);
    }
  }

  return [...new Set(issues)];
};

const auditRouteHtml = async (route) => {
  const issues = [];
  const htmlPath = routeToFilePath(route);

  let html;
  try {
    html = await fs.readFile(htmlPath, "utf8");
  } catch {
    issues.push(`Missing rendered HTML at ${path.relative(ROOT_DIR, htmlPath)}`);
    return issues;
  }

  const document = new JSDOM(html).window.document;
  const isProjectRoute = isProjectDetailPath(route);
  const bodyText = normalizeComparableText(document.body?.textContent || html);

  const titleTag = document.querySelector("title")?.textContent?.trim() || "";
  if (!titleTag) {
    issues.push("Missing <title> tag");
  }

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

  for (const tagName of REQUIRED_GLOBAL_META) {
    if (!extractMetaByName(document, tagName)) {
      issues.push(`Missing ${tagName}`);
    }
  }

  const hasManifestLink = Boolean(document.querySelector('link[rel="manifest"]'));
  if (!hasManifestLink) {
    issues.push("Missing web manifest link");
  }

  const hreflangEnAu = document.querySelector('link[rel="alternate"][hreflang="en-AU"]');
  if (!hreflangEnAu) {
    issues.push("Missing hreflang alternate for en-AU");
  }

  const hreflangXDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
  if (!hreflangXDefault) {
    issues.push("Missing hreflang alternate for x-default");
  }

  for (const property of REQUIRED_OG_META) {
    if (!extractMetaByProperty(document, property)) {
      issues.push(`Missing ${property}`);
    }
  }

  for (const tagName of REQUIRED_TWITTER_META) {
    if (!extractMetaByName(document, tagName)) {
      issues.push(`Missing ${tagName}`);
    }
  }

  const twitterImageAlt = extractMetaByName(document, "twitter:image:alt");
  if (twitterImageAlt && !hasDescriptiveMetadataText(twitterImageAlt)) {
    issues.push("twitter:image:alt is too short or not descriptive");
  }

  if (isProjectRoute) {
    const jsonLdContent = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((script) => script.textContent || "")
      .join("\n");
    if (!jsonLdContent.includes('"CreativeWork"')) {
      issues.push("Project route is missing CreativeWork schema");
    }
    if (!jsonLdContent.includes("mainEntityOfPage")) {
      issues.push("Project route schema is missing mainEntityOfPage");
    }
    if (!(jsonLdContent.includes("contentLocation") || jsonLdContent.includes("locationCreated"))) {
      issues.push("Project route schema is missing content location");
    }
    if (!jsonLdContent.includes('"provider"')) {
      issues.push("Project route schema is missing provider");
    }
  }

  const requiredFragments = REQUIRED_SSR_CONTENT_FRAGMENTS[route] || [];
  for (const fragment of requiredFragments) {
    if (!bodyText.includes(normalizeComparableText(fragment))) {
      issues.push(`Missing required crawlable content fragment: "${fragment}"`);
    }
  }

  if (route === "/" && bodyText.length < 600) {
    issues.push("Homepage appears too thin in rendered HTML body text");
  }

  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && !extractMetaByName(document, "google-site-verification")) {
    issues.push("Missing google-site-verification meta");
  }
  if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && !extractMetaByName(document, "msvalidate.01")) {
    issues.push("Missing bing verification meta (msvalidate.01)");
  }
  if (process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION && !extractMetaByName(document, "yandex-verification")) {
    issues.push("Missing yandex-verification meta");
  }

  const h1Count = document.querySelectorAll("h1").length;
  if (h1Count === 0) {
    issues.push("Missing H1");
  } else if (h1Count > 1) {
    issues.push(`Expected single H1 but found ${h1Count}`);
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
    const link = image.closest("a");
    const linkIsDecorative =
      link?.getAttribute("aria-hidden") === "true" ||
      link?.getAttribute("tabindex") === "-1";
    if ((!alt || !alt.trim()) && !linkIsDecorative) {
      issues.push("Anchored image missing alt text");
      break;
    }
  }

  if (!hasFollowedInternalLinks(document)) {
    issues.push("Fewer than 2 followed internal links");
  }

  const weakInternalAnchorText = findWeakInternalAnchorText(document);
  if (weakInternalAnchorText.length > 0) {
    issues.push(
      `Generic one-word internal anchor text found (${weakInternalAnchorText.length}): ${weakInternalAnchorText
        .slice(0, 5)
        .map((entry) => `${entry.text} -> ${entry.href}`)
        .join(", ")}`
    );
  }

  const duplicateHeadings = collectDuplicateHeadingTexts(document);
  if (duplicateHeadings.length > 0) {
    issues.push(
      `Duplicate heading text found (${duplicateHeadings.length}): ${duplicateHeadings
        .slice(0, 6)
        .map((entry) => `${entry.text} (${entry.count})`)
        .join(", ")}`
    );
  }

  const duplicateAlts = collectDuplicateAltTexts(document);
  if (duplicateAlts.length > 0) {
    issues.push(
      `Duplicate image alt text found (${duplicateAlts.length}): ${duplicateAlts
        .slice(0, 6)
        .map((entry) => `${entry.alt} (${entry.count})`)
        .join(", ")}`
    );
  }

  const oneWordAlts = collectOneWordAltTexts(document);
  if (oneWordAlts.length > 0) {
    issues.push(`One-word image alt text found (${oneWordAlts.length}): ${oneWordAlts.slice(0, 8).join(", ")}`);
  }

  if (route === "/") {
    const primaryHeroAlt = extractPrimaryContentImageAlt(document);
    if (!primaryHeroAlt) {
      issues.push("Homepage primary content image is missing alt text");
    } else if (!isDescriptiveHeroAlt(primaryHeroAlt)) {
      issues.push(`Homepage hero image alt is not descriptive enough: "${primaryHeroAlt}"`);
    }
  }

  const insecureHttpLinks = collectInsecureHttpLinks(document);
  if (insecureHttpLinks.length > 0) {
    issues.push(`Insecure http:// links found (${insecureHttpLinks.length}): ${insecureHttpLinks.slice(0, 6).join(", ")}`);
  }

  const listItemCount = document.querySelectorAll("ul li, ol li").length;
  if (ROUTES_REQUIRING_LISTS.has(route) && listItemCount < 2) {
    issues.push("Content is missing semantic list markup (expected at least one list section)");
  }

  const emphasisCount = document.querySelectorAll("strong, b").length;
  if (ROUTES_REQUIRING_EMPHASIS.has(route) && emphasisCount < 1) {
    issues.push("Content is missing emphasis elements (expected <strong> or <b>)");
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

    if (!isSitemapEligibleRoute(routePath)) {
      issues.push(`Non-indexable route included in sitemap: ${routePath}`);
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
    sitemapPaths: [...seenPaths],
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

const fetchLiveHtmlForRoute = async (route, userAgent) => {
  const url = canonicalForPath(route, liveHttpOrigin);
  const response = await fetchWithTimeout(url, {
    redirect: "follow",
    headers: {
      "user-agent": userAgent,
      accept: "text/html,application/xhtml+xml",
    },
  });

  if (response.status !== 200) {
    throw new Error(`${url} returned status ${response.status}`);
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (!contentType.includes("text/html")) {
    throw new Error(`${url} returned non-HTML content type: ${contentType || "<missing>"}`);
  }

  return response.text();
};

const auditGooglebotParity = async () => {
  const issues = [];

  for (const route of GOOGLEBOT_PARITY_ROUTES) {
    let standardHtml;
    let googlebotHtml;

    try {
      [standardHtml, googlebotHtml] = await Promise.all([
        fetchLiveHtmlForRoute(route, STANDARD_BROWSER_USER_AGENT),
        fetchLiveHtmlForRoute(route, GOOGLEBOT_USER_AGENT),
      ]);
    } catch (error) {
      issues.push(`Googlebot parity fetch failed for ${route}: ${String(error)}`);
      continue;
    }

    const standardText = normalizeComparableText(new JSDOM(standardHtml).window.document.body?.textContent || "");
    const googlebotText = normalizeComparableText(new JSDOM(googlebotHtml).window.document.body?.textContent || "");

    if (!standardText || !googlebotText) {
      issues.push(`Googlebot parity text extraction failed for ${route}`);
      continue;
    }

    const shortest = Math.min(standardText.length, googlebotText.length);
    const longest = Math.max(standardText.length, googlebotText.length);
    if (longest > 0 && shortest / longest < 0.7) {
      issues.push(
        `Googlebot parity mismatch for ${route}: body text lengths differ significantly (browser=${standardText.length}, googlebot=${googlebotText.length})`
      );
    }

    const requiredFragments = REQUIRED_SSR_CONTENT_FRAGMENTS[route] || [];
    for (const fragment of requiredFragments) {
      const normalizedFragment = normalizeComparableText(fragment);
      if (!standardText.includes(normalizedFragment)) {
        issues.push(`Browser HTML missing required fragment on ${route}: "${fragment}"`);
      }
      if (!googlebotText.includes(normalizedFragment)) {
        issues.push(`Googlebot HTML missing required fragment on ${route}: "${fragment}"`);
      }
    }
  }

  return issues;
};

const auditLiveSitemapUrls = async (sitemapPaths) => {
  const issues = [];
  const pathsToCheck = sitemapPaths.slice(0, Math.max(1, maxHttpChecks));

  for (const routePath of pathsToCheck) {
    const url = canonicalForPath(routePath, liveHttpOrigin);
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
    const robots = (document.querySelector('meta[name="robots"]')?.getAttribute("content") || "").toLowerCase();
    if (robots.includes("noindex")) {
      issues.push(`Sitemap URL is noindex on live page: ${url}`);
    }
    if (!canonical) {
      issues.push(`Missing canonical on live URL: ${url}`);
      continue;
    }

    const normalizedCanonical = normalizeAbsoluteUrl(canonical);
    const expectedCanonical = canonicalForPath(routePath, PRODUCTION_DOMAIN);
    if (!normalizedCanonical) {
      issues.push(`Invalid canonical URL on live page: ${url} -> ${canonical}`);
      continue;
    }
    if (normalizedCanonical !== normalizeAbsoluteUrl(expectedCanonical)) {
      issues.push(`Live canonical mismatch: ${url} -> ${canonical} (expected ${expectedCanonical})`);
    }

    if (sameDomain(normalizedCanonical, liveHttpOrigin)) {
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
    `[seo:audit] Auditing ${auditRoutes.length} route(s) from Next build output (extended=${includeExtendedRoutes ? "on" : "off"}, projectDetail=${includeProjectDetailRoutes ? "on" : "off"})`
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

  const linkGraphAudit = await auditInternalLinkGraph({ routes: auditRoutes, vercelConfig });
  if (linkGraphAudit.issues.length > 0) {
    failures.push({ scope: "[links]", issues: linkGraphAudit.issues });
  }

  const sitelinkIssues = await auditSitelinkTargets({
    routes: auditRoutes,
    sitemapPaths: sitemapAudit.sitemapPaths,
    inboundCount: linkGraphAudit.inboundCount,
  });
  if (sitelinkIssues.length > 0) {
    failures.push({ scope: "[sitelinks]", issues: sitelinkIssues });
  }

  const metadataUniquenessIssues = await auditMetadataUniqueness(auditRoutes);
  if (metadataUniquenessIssues.length > 0) {
    failures.push({ scope: "[metadata-uniqueness]", issues: metadataUniquenessIssues });
  }

  const nonAnchorNavigationIssues = await auditNonAnchorInternalNavigationSource();
  if (nonAnchorNavigationIssues.length > 0) {
    failures.push({ scope: "[internal-nav]", issues: nonAnchorNavigationIssues });
  }

  const renderedRoutes = await collectRenderedRoutePaths();
  const contentAudit = await auditThinAndDuplicateContent(renderedRoutes);
  if (contentAudit.issues.length > 0) {
    failures.push({ scope: "[content]", issues: contentAudit.issues });
  }

  await fs.mkdir(ARTIFACTS_DIR, { recursive: true });
  await fs.writeFile(CONTENT_AUDIT_REPORT_PATH, `${JSON.stringify(contentAudit.report, null, 2)}\n`);
  console.log(
    `[seo:audit] Content report written to ${path.relative(ROOT_DIR, CONTENT_AUDIT_REPORT_PATH)}`
  );

  if (performHttpChecks) {
    console.log(
      `[seo:audit] Running live URL checks for ${Math.min(
        sitemapAudit.sitemapPaths.length,
        maxHttpChecks
      )} sitemap URL(s) using origin ${liveHttpOrigin}`
    );
    const liveIssues = await auditLiveSitemapUrls(sitemapAudit.sitemapPaths);
    if (liveIssues.length > 0) {
      failures.push({ scope: "[live]", issues: liveIssues });
    }

    console.log(
      `[seo:audit] Running Googlebot parity checks for ${GOOGLEBOT_PARITY_ROUTES.length} route(s) using origin ${liveHttpOrigin}`
    );
    const googlebotParityIssues = await auditGooglebotParity();
    if (googlebotParityIssues.length > 0) {
      failures.push({ scope: "[googlebot-parity]", issues: googlebotParityIssues });
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
