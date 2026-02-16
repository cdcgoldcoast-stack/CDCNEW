import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  PRODUCTION_DOMAIN,
  parseSitemapEntries,
  parseSitemapUrls,
  pathFromUrl,
  normalizePath,
  isNoindexRoute,
} from "./lib/seo-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_SITEMAP_PATH = path.join(ROOT_DIR, "public", "sitemap.xml");
const VERCEL_CONFIG_PATH = path.join(ROOT_DIR, "vercel.json");
const DEFAULT_OUTPUT_PATH = path.join(ROOT_DIR, "artifacts", "seo-gsc-correlation.json");

function parseArgs(argv) {
  const args = { input: "", output: DEFAULT_OUTPUT_PATH };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--input") {
      args.input = argv[index + 1] || "";
      index += 1;
    } else if (token === "--output") {
      args.output = argv[index + 1] || DEFAULT_OUTPUT_PATH;
      index += 1;
    }
  }
  return args;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (inQuotes) {
      if (char === "\"" && next === "\"") {
        field += "\"";
        index += 1;
      } else if (char === "\"") {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === "\"") {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char === "\r") {
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.length === 0) return [];
  const headers = rows[0].map((header) => header.trim());

  return rows
    .slice(1)
    .filter((candidate) => candidate.some((value) => value.trim().length > 0))
    .map((candidate) => {
      const record = {};
      for (let index = 0; index < headers.length; index += 1) {
        record[headers[index]] = (candidate[index] || "").trim();
      }
      return record;
    });
}

function normalizeReason(reason) {
  return `${reason || ""}`.toLowerCase().replace(/\s+/g, " ").trim();
}

function getUrlFromRow(row) {
  return (
    row.Page ||
    row.page ||
    row.URL ||
    row.Url ||
    row.url ||
    row["Affected page"] ||
    row["Affected Page"] ||
    row.Address ||
    row.address ||
    ""
  ).trim();
}

function getReasonFromRow(row) {
  return (
    row.Reason ||
    row.reason ||
    row["Issue type"] ||
    row["Issue Type"] ||
    row.Issue ||
    row.issue ||
    ""
  ).trim();
}

function getValidationFromRow(row) {
  return (row.Validation || row.validation || "").trim();
}

function isExpectedReason(reason) {
  return (
    reason.includes("page with redirect") ||
    reason.includes("alternate page with proper canonical tag") ||
    reason.includes("excluded by 'noindex' tag") ||
    reason.includes("excluded by noindex tag")
  );
}

function isFixReason(reason) {
  return (
    reason.includes("not found (404)") ||
    reason.includes("soft 404") ||
    reason.includes("blocked due to access forbidden (403)") ||
    reason.includes("blocked due to other 4xx issue") ||
    reason.includes("crawled - currently not indexed") ||
    reason.includes("discovered - currently not indexed")
  );
}

function recommendAction({ normalizedReason, inSitemap, isRedirectSource, isNoindexPath }) {
  if (normalizedReason.includes("page with redirect")) {
    return "No action if redirect is intentional and source URL is not in sitemap.";
  }
  if (normalizedReason.includes("alternate page with proper canonical tag")) {
    return "No action if canonical target is indexable and matches sitemap.";
  }
  if (normalizedReason.includes("excluded by 'noindex' tag") || normalizedReason.includes("excluded by noindex tag")) {
    return "No action for intentional admin/auth/utility pages. Remove noindex only if page should rank.";
  }
  if (normalizedReason.includes("soft 404")) {
    return "Return true 404 for invalid URLs or add substantial canonical content.";
  }
  if (normalizedReason.includes("not found (404)")) {
    if (inSitemap) return "Critical: remove from sitemap or restore content.";
    if (isRedirectSource) return "Consider adding explicit redirect only for high-value legacy URLs.";
    return "Audit inbound links and redirect only high-value legacy paths.";
  }
  if (normalizedReason.includes("access forbidden (403)") || normalizedReason.includes("other 4xx")) {
    return "Review server access rules and verify pages intended for crawling are publicly accessible.";
  }
  if (normalizedReason.includes("crawled - currently not indexed") || normalizedReason.includes("discovered - currently not indexed")) {
    if (isNoindexPath) return "Expected for intentionally non-indexable routes.";
    return "Improve internal linking/content quality and keep canonical/sitemap stable.";
  }
  return "Manual review required.";
}

async function loadSitemapPathSet() {
  try {
    const xml = await fs.readFile(PUBLIC_SITEMAP_PATH, "utf8");
    return new Set(parseSitemapUrls(xml).map((url) => pathFromUrl(url, PRODUCTION_DOMAIN)).filter(Boolean));
  } catch {
    return new Set();
  }
}

async function loadStaticRedirectSourceSet() {
  try {
    const source = await fs.readFile(VERCEL_CONFIG_PATH, "utf8");
    const parsed = JSON.parse(source);
    const redirects = Array.isArray(parsed?.redirects) ? parsed.redirects : [];
    return new Set(
      redirects
        .map((redirect) => `${redirect?.source || ""}`.trim())
        .filter((candidate) => candidate && !/[:*()[\]+?]/.test(candidate))
        .map((candidate) => normalizePath(candidate))
        .filter(Boolean)
    );
  } catch {
    return new Set();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) {
    throw new Error("Missing required argument: --input <gsc-export.csv|json>");
  }

  const inputPath = path.resolve(process.cwd(), args.input);
  const outputPath = path.resolve(process.cwd(), args.output || DEFAULT_OUTPUT_PATH);
  const raw = await fs.readFile(inputPath, "utf8");

  let rows = [];
  if (inputPath.toLowerCase().endsWith(".json")) {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      rows = parsed;
    } else if (Array.isArray(parsed?.rows)) {
      rows = parsed.rows;
    } else {
      throw new Error("Unsupported JSON format. Expected array or { rows: [] }.");
    }
  } else {
    rows = parseCsv(raw);
  }

  const [sitemapPaths, redirectSources] = await Promise.all([
    loadSitemapPathSet(),
    loadStaticRedirectSourceSet(),
  ]);

  // Keep parsed entries for traceability in the report metadata.
  let sitemapEntryCount = 0;
  try {
    const xml = await fs.readFile(PUBLIC_SITEMAP_PATH, "utf8");
    sitemapEntryCount = parseSitemapEntries(xml).length;
  } catch {
    sitemapEntryCount = 0;
  }

  const correlated = rows.map((row, index) => {
    const url = getUrlFromRow(row);
    const reasonRaw = getReasonFromRow(row);
    const normalized = normalizeReason(reasonRaw);
    const routePath = normalizePath(pathFromUrl(url, PRODUCTION_DOMAIN) || "");
    const inSitemap = routePath ? sitemapPaths.has(routePath) : false;
    const isRedirectSource = routePath ? redirectSources.has(routePath) : false;
    const isNoindexPath = routePath ? isNoindexRoute(routePath) : false;

    let classification = "review";
    if (isExpectedReason(normalized)) {
      classification = "expected";
    } else if (isFixReason(normalized)) {
      classification = "fix_needed";
    }

    if (normalized.includes("page with redirect") && isRedirectSource) {
      classification = "expected";
    }
    if (
      (normalized.includes("excluded by 'noindex' tag") || normalized.includes("excluded by noindex tag")) &&
      isNoindexPath
    ) {
      classification = "expected";
    }
    if (normalized.includes("not found (404)") && inSitemap) {
      classification = "fix_needed";
    }

    return {
      rowNumber: index + 1,
      url,
      routePath,
      reason: reasonRaw,
      normalizedReason: normalized,
      validation: getValidationFromRow(row),
      source: (row.Source || row.source || "").trim(),
      pages: Number.parseInt((row.Pages || row.pages || "0").trim(), 10) || 0,
      inSitemap,
      isRedirectSource,
      isNoindexPath,
      classification,
      recommendedAction: recommendAction({
        normalizedReason: normalized,
        inSitemap,
        isRedirectSource,
        isNoindexPath,
      }),
      raw: row,
    };
  });

  const summary = {
    totalRows: correlated.length,
    expected: correlated.filter((item) => item.classification === "expected").length,
    fixNeeded: correlated.filter((item) => item.classification === "fix_needed").length,
    review: correlated.filter((item) => item.classification === "review").length,
    reasonCounts: {},
  };

  for (const item of correlated) {
    const key = item.normalizedReason || "<missing reason>";
    summary.reasonCounts[key] = (summary.reasonCounts[key] || 0) + 1;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    sourceFile: path.relative(ROOT_DIR, inputPath),
    domain: PRODUCTION_DOMAIN,
    sitemapEntryCount,
    summary,
    rows: correlated,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`[seo:gsc:ingest] Rows processed: ${summary.totalRows}`);
  console.log(`[seo:gsc:ingest] expected=${summary.expected}, fix_needed=${summary.fixNeeded}, review=${summary.review}`);
  console.log(`[seo:gsc:ingest] Report written to ${path.relative(ROOT_DIR, outputPath)}`);
}

main().catch((error) => {
  console.error("[seo:gsc:ingest] Failed:", error);
  process.exit(1);
});

