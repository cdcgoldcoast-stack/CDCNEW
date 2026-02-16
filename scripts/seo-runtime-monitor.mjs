import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import {
  PRODUCTION_DOMAIN,
  parseEnvBoolean,
  normalizeAbsoluteUrl,
  parseSitemapEntries,
  normalizePath,
  pathFromUrl,
  loadGeneratedProjectSlugs,
  sameDomain,
  slugFromProjectPath,
} from "./lib/seo-utils.mjs";
import { sendAlert } from "./lib/notify.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const GENERATED_PROJECT_SLUGS_PATH = path.join(ROOT_DIR, "src", "generated", "project-slugs.json");
const VERCEL_CONFIG_PATH = path.join(ROOT_DIR, "vercel.json");
const ARTIFACTS_DIR = path.join(ROOT_DIR, "artifacts");
const OUTPUT_PATH = path.join(ARTIFACTS_DIR, "seo-monitor-report.json");

const baseUrl = process.env.SEO_MONITOR_BASE_URL || PRODUCTION_DOMAIN;
const strictMode = parseEnvBoolean(process.env.SEO_MONITOR_STRICT, true);
const maxSitemapChecks = Number.parseInt(process.env.SEO_MONITOR_MAX_URLS || "120", 10);
const timeoutMs = Number.parseInt(process.env.SEO_MONITOR_TIMEOUT_MS || "12000", 10);

const REQUIRED_TWITTER_META = [
  "twitter:card",
  "twitter:domain",
  "twitter:url",
  "twitter:title",
  "twitter:description",
  "twitter:image",
  "twitter:image:alt",
];

const severityRank = {
  info: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

function createCheckResult(id, severity, status, message, details = {}) {
  return {
    id,
    severity,
    status,
    message,
    details,
  };
}

function computeSummary(checks) {
  const total = checks.length;
  const failed = checks.filter((check) => check.status === "fail").length;
  const warned = checks.filter((check) => check.status === "warn").length;
  const passed = checks.filter((check) => check.status === "pass").length;

  const bySeverity = {
    info: checks.filter((check) => check.severity === "info").length,
    medium: checks.filter((check) => check.severity === "medium").length,
    high: checks.filter((check) => check.severity === "high").length,
    critical: checks.filter((check) => check.severity === "critical").length,
  };

  const highestFailSeverity = checks
    .filter((check) => check.status === "fail")
    .reduce((highest, check) => {
      if (severityRank[check.severity] > severityRank[highest]) {
        return check.severity;
      }
      return highest;
    }, "info");

  return {
    total,
    passed,
    warned,
    failed,
    bySeverity,
    highestFailSeverity,
  };
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "user-agent": "cdc-seo-monitor/1.0",
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function extractMetaByName(document, name) {
  const node = document.querySelector(`meta[name="${name}"]`);
  return node?.getAttribute("content")?.trim() || "";
}

function collectLegacyImageSources(document, pageUrl) {
  const offenders = [];
  const images = [...document.querySelectorAll("img[src]")];

  for (const image of images) {
    const src = (image.getAttribute("src") || "").trim();
    if (!src || src.startsWith("data:")) continue;

    try {
      const pathname = new URL(src, pageUrl).pathname.toLowerCase();
      if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg") || pathname.endsWith(".png")) {
        offenders.push(src);
      }
    } catch {
      // Ignore unparseable URLs.
    }
  }

  return [...new Set(offenders)];
}

async function loadVercelRedirectPairs() {
  try {
    const source = await fs.readFile(VERCEL_CONFIG_PATH, "utf8");
    const parsed = JSON.parse(source);
    const redirects = Array.isArray(parsed?.redirects) ? parsed.redirects : [];

    return redirects
      .map((redirect) => ({
        source: `${redirect?.source || ""}`.trim(),
        destination: `${redirect?.destination || ""}`.trim(),
      }))
      .filter((redirect) => redirect.source && redirect.destination)
      .filter((redirect) => !/[:*()[\]+?]/.test(redirect.source))
      .filter((redirect) => {
        if (/^https?:\/\//i.test(redirect.destination)) {
          return sameDomain(redirect.destination, baseUrl);
        }
        return !/[:*()[\]+?]/.test(redirect.destination);
      })
      .map((redirect) => ({
        sourcePath: normalizePath(redirect.source),
        destinationPath: /^https?:\/\//i.test(redirect.destination)
          ? normalizePath(new URL(redirect.destination).pathname)
          : normalizePath(redirect.destination),
      }))
      .filter((redirect) => redirect.sourcePath && redirect.destinationPath);
  } catch {
    return [];
  }
}

async function monitorRobotsAndSitemap(checks) {
  const robotsUrl = new URL("/robots.txt", baseUrl).toString();
  const sitemapUrl = new URL("/sitemap.xml", baseUrl).toString();

  let robotsText = "";
  try {
    const robotsResponse = await fetchWithTimeout(robotsUrl, { redirect: "manual" });
    if (robotsResponse.status !== 200) {
      checks.push(
        createCheckResult(
          "robots_available",
          "critical",
          "fail",
          `robots.txt returned ${robotsResponse.status}`,
          { robotsUrl }
        )
      );
    } else {
      robotsText = await robotsResponse.text();
      checks.push(createCheckResult("robots_available", "info", "pass", "robots.txt is reachable", { robotsUrl }));
    }
  } catch (error) {
    checks.push(
      createCheckResult("robots_available", "critical", "fail", "robots.txt request failed", {
        robotsUrl,
        error: String(error),
      })
    );
  }

  if (robotsText) {
    const hasSitemapPointer = robotsText
      .split(/\r?\n/)
      .some((line) => line.trim().toLowerCase().startsWith("sitemap:"));
    if (!hasSitemapPointer) {
      checks.push(
        createCheckResult(
          "robots_sitemap_pointer",
          "high",
          "fail",
          "robots.txt missing Sitemap directive"
        )
      );
    } else {
      checks.push(
        createCheckResult(
          "robots_sitemap_pointer",
          "info",
          "pass",
          "robots.txt contains Sitemap directive"
        )
      );
    }
  }

  try {
    const sitemapResponse = await fetchWithTimeout(sitemapUrl, { redirect: "manual" });
    if (sitemapResponse.status !== 200) {
      checks.push(
        createCheckResult(
          "sitemap_available",
          "critical",
          "fail",
          `sitemap.xml returned ${sitemapResponse.status}`,
          { sitemapUrl }
        )
      );
      return [];
    }

    const sitemapXml = await sitemapResponse.text();
    const entries = parseSitemapEntries(sitemapXml);
    if (entries.length === 0) {
      checks.push(
        createCheckResult(
          "sitemap_entries",
          "critical",
          "fail",
          "sitemap.xml has zero URL entries",
          { sitemapUrl }
        )
      );
      return [];
    }

    checks.push(
      createCheckResult(
        "sitemap_entries",
        "info",
        "pass",
        `sitemap.xml parsed successfully (${entries.length} entries)`,
        { sitemapUrl, entries: entries.length }
      )
    );

    return entries;
  } catch (error) {
    checks.push(
      createCheckResult("sitemap_available", "critical", "fail", "sitemap.xml request failed", {
        sitemapUrl,
        error: String(error),
      })
    );
    return [];
  }
}

async function monitorSitemapUrls(entries, checks) {
  const urlsToCheck = entries.slice(0, Math.max(1, maxSitemapChecks));
  let failures = 0;
  const canonicalMismatches = [];
  const noindexUrls = [];
  const missingTwitterMetaUrls = [];
  const legacyImageUrls = [];

  for (const entry of urlsToCheck) {
    const normalizedUrl = normalizeAbsoluteUrl(entry.loc);
    if (!normalizedUrl) {
      failures += 1;
      checks.push(
        createCheckResult("sitemap_url_validity", "high", "fail", "Invalid sitemap URL", {
          loc: entry.loc,
        })
      );
      continue;
    }

    let response;
    try {
      response = await fetchWithTimeout(normalizedUrl, { redirect: "manual" });
    } catch (error) {
      failures += 1;
      checks.push(
        createCheckResult("sitemap_url_status", "critical", "fail", "Sitemap URL request failed", {
          url: normalizedUrl,
          error: String(error),
        })
      );
      continue;
    }

    if (response.status >= 300 && response.status < 400) {
      failures += 1;
      checks.push(
        createCheckResult(
          "sitemap_url_redirect",
          "high",
          "fail",
          "Sitemap URL redirects instead of returning 200",
          {
            url: normalizedUrl,
            status: response.status,
            location: response.headers.get("location") || null,
          }
        )
      );
      continue;
    }

    if (response.status !== 200) {
      failures += 1;
      checks.push(
        createCheckResult(
          "sitemap_url_status",
          "high",
          "fail",
          `Sitemap URL returned non-200 (${response.status})`,
          { url: normalizedUrl }
        )
      );
      continue;
    }

    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("text/html")) {
      const html = await response.text();
      const document = new JSDOM(html).window.document;
      const robots = (document.querySelector('meta[name="robots"]')?.getAttribute("content") || "").toLowerCase();
      if (robots.includes("noindex")) {
        failures += 1;
        noindexUrls.push({ url: normalizedUrl, robots });
      }
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() || "";
      const normalizedCanonical = normalizeAbsoluteUrl(canonical);
      if (!normalizedCanonical) {
        failures += 1;
        checks.push(
          createCheckResult("live_canonical", "high", "fail", "Missing or invalid canonical on sitemap URL", {
            url: normalizedUrl,
            canonical,
          })
        );
      } else if (normalizedCanonical !== normalizedUrl) {
        failures += 1;
        canonicalMismatches.push({ url: normalizedUrl, canonical: normalizedCanonical });
      }

      const missingTwitterTags = REQUIRED_TWITTER_META.filter((tagName) => !extractMetaByName(document, tagName));
      if (missingTwitterTags.length > 0) {
        failures += 1;
        missingTwitterMetaUrls.push({ url: normalizedUrl, missingTwitterTags });
      }

      const legacyImages = collectLegacyImageSources(document, normalizedUrl);
      if (legacyImages.length > 0) {
        legacyImageUrls.push({
          url: normalizedUrl,
          legacyImages: legacyImages.slice(0, 8),
        });
      }
    }
  }

  if (canonicalMismatches.length > 0) {
    checks.push(
      createCheckResult(
        "live_canonical_match",
        "high",
        "fail",
        `Live canonical mismatch on ${canonicalMismatches.length} URL(s)`,
        { mismatches: canonicalMismatches.slice(0, 20) }
      )
    );
  } else {
    checks.push(
      createCheckResult(
        "live_canonical_match",
        "info",
        "pass",
        `Canonical matched for ${urlsToCheck.length} checked sitemap URL(s)`
      )
    );
  }

  if (noindexUrls.length > 0) {
    checks.push(
      createCheckResult(
        "sitemap_noindex_conflict",
        "high",
        "fail",
        `Sitemap contains ${noindexUrls.length} URL(s) rendering noindex`,
        { urls: noindexUrls.slice(0, 20) }
      )
    );
  } else {
    checks.push(
      createCheckResult(
        "sitemap_noindex_conflict",
        "info",
        "pass",
        `No noindex conflicts found in ${urlsToCheck.length} checked sitemap URL(s)`
      )
    );
  }

  if (missingTwitterMetaUrls.length > 0) {
    checks.push(
      createCheckResult(
        "twitter_meta_completeness",
        "high",
        "fail",
        `Missing required Twitter meta tags on ${missingTwitterMetaUrls.length} URL(s)`,
        { missing: missingTwitterMetaUrls.slice(0, 20) }
      )
    );
  } else {
    checks.push(
      createCheckResult(
        "twitter_meta_completeness",
        "info",
        "pass",
        `Twitter meta tags complete for ${urlsToCheck.length} checked sitemap URL(s)`
      )
    );
  }

  if (legacyImageUrls.length > 0) {
    checks.push(
      createCheckResult(
        "next_gen_image_coverage",
        "medium",
        "warn",
        `Detected legacy .jpg/.jpeg/.png image sources on ${legacyImageUrls.length} URL(s)`,
        { offenders: legacyImageUrls.slice(0, 20) }
      )
    );
  } else {
    checks.push(
      createCheckResult(
        "next_gen_image_coverage",
        "info",
        "pass",
        `No legacy .jpg/.jpeg/.png image sources detected in ${urlsToCheck.length} checked sitemap URL(s)`
      )
    );
  }

  if (failures === 0) {
    checks.push(
      createCheckResult(
        "sitemap_urls_healthy",
        "info",
        "pass",
        `All checked sitemap URLs returned healthy responses (${urlsToCheck.length})`
      )
    );
  }
}

async function monitorRedirectHygiene(checks) {
  const redirectPairs = await loadVercelRedirectPairs();
  if (redirectPairs.length === 0) {
    checks.push(
      createCheckResult("redirect_hygiene", "medium", "warn", "No static redirects found to validate")
    );
    return;
  }

  const failures = [];
  for (const pair of redirectPairs) {
    const sourceUrl = new URL(pair.sourcePath, baseUrl).toString();
    const expectedDestination = normalizePath(pair.destinationPath);

    let sourceResponse;
    try {
      sourceResponse = await fetchWithTimeout(sourceUrl, { redirect: "manual" });
    } catch (error) {
      failures.push({ sourceUrl, reason: `request_failed:${String(error)}` });
      continue;
    }

    if (!(sourceResponse.status >= 300 && sourceResponse.status < 400)) {
      failures.push({
        sourceUrl,
        reason: `unexpected_status:${sourceResponse.status}`,
      });
      continue;
    }

    const location = sourceResponse.headers.get("location") || "";
    const redirectedPath = location ? normalizePath(pathFromUrl(location, baseUrl)) : "";
    if (redirectedPath !== expectedDestination) {
      failures.push({
        sourceUrl,
        reason: "destination_mismatch",
        expectedDestination,
        redirectedPath: redirectedPath || null,
      });
      continue;
    }

    try {
      const destinationUrl = new URL(redirectedPath, baseUrl).toString();
      const destinationResponse = await fetchWithTimeout(destinationUrl, { redirect: "manual" });
      if (destinationResponse.status >= 300 && destinationResponse.status < 400) {
        failures.push({
          sourceUrl,
          reason: "redirect_chain_detected",
          destinationUrl,
          status: destinationResponse.status,
        });
      }
    } catch (error) {
      failures.push({
        sourceUrl,
        reason: `destination_check_failed:${String(error)}`,
      });
    }
  }

  if (failures.length > 0) {
    checks.push(
      createCheckResult(
        "redirect_hygiene",
        "high",
        "fail",
        `Redirect hygiene checks failed for ${failures.length} redirect(s)`,
        { failures: failures.slice(0, 20) }
      )
    );
  } else {
    checks.push(
      createCheckResult(
        "redirect_hygiene",
        "info",
        "pass",
        `Validated ${redirectPairs.length} static redirect(s) without chain issues`
      )
    );
  }
}

async function monitor404Behavior(checks) {
  const probePaths = [
    `/renovation-projects/nonexistent-slug-seo-monitor-${Date.now()}`,
    `/this-should-404-seo-monitor-${Date.now()}`,
  ];

  const failures = [];
  for (const probePath of probePaths) {
    const probeUrl = new URL(probePath, baseUrl).toString();
    try {
      const response = await fetchWithTimeout(probeUrl, { redirect: "manual" });
      if (response.status !== 404) {
        failures.push({ probePath, status: response.status });
      }
    } catch (error) {
      failures.push({ probePath, error: String(error) });
    }
  }

  if (failures.length > 0) {
    checks.push(
      createCheckResult(
        "hard_404_behavior",
        "high",
        "fail",
        "Invalid routes are not consistently returning 404",
        { failures }
      )
    );
  } else {
    checks.push(
      createCheckResult("hard_404_behavior", "info", "pass", "Invalid routes return true 404 responses")
    );
  }
}

async function monitorProjectSlugDrift(entries, checks) {
  const generatedSlugs = await loadGeneratedProjectSlugs(GENERATED_PROJECT_SLUGS_PATH);
  const generatedSlugSet = new Set(generatedSlugs);

  const sitemapProjectSlugs = new Set(
    entries
      .map((entry) => slugFromProjectPath(pathFromUrl(entry.loc, baseUrl)))
      .filter(Boolean)
  );

  const missingFromSitemap = generatedSlugs.filter((slug) => !sitemapProjectSlugs.has(slug));
  const staleInSitemap = [...sitemapProjectSlugs].filter((slug) => !generatedSlugSet.has(slug));

  const projectsIndexUrl = new URL("/renovation-projects", baseUrl).toString();
  let liveProjectSlugs = [];
  try {
    const response = await fetchWithTimeout(projectsIndexUrl, { redirect: "follow" });
    if (response.ok) {
      const html = await response.text();
      const matches = [...html.matchAll(/href="\/renovation-projects\/([a-z0-9-]+)"/g)];
      liveProjectSlugs = [...new Set(matches.map((match) => match[1]))].sort();
    }
  } catch {
    // Ignore live extraction errors and rely on generated + sitemap comparison.
  }

  const liveSlugSet = new Set(liveProjectSlugs);
  const missingFromLive = liveProjectSlugs.length > 0
    ? generatedSlugs.filter((slug) => !liveSlugSet.has(slug))
    : [];

  if (missingFromSitemap.length > 0 || staleInSitemap.length > 0 || missingFromLive.length > 0) {
    checks.push(
      createCheckResult(
        "project_slug_drift",
        "high",
        "fail",
        "Project slug drift detected across generated slugs, sitemap, and live route index",
        {
          generatedCount: generatedSlugs.length,
          sitemapCount: sitemapProjectSlugs.size,
          liveCount: liveProjectSlugs.length,
          missingFromSitemap: missingFromSitemap.slice(0, 20),
          staleInSitemap: staleInSitemap.slice(0, 20),
          missingFromLive: missingFromLive.slice(0, 20),
        }
      )
    );
    return;
  }

  checks.push(
    createCheckResult(
      "project_slug_drift",
      "info",
      "pass",
      "Generated project slugs, sitemap project URLs, and live route links are aligned",
      {
        generatedCount: generatedSlugs.length,
        sitemapCount: sitemapProjectSlugs.size,
        liveCount: liveProjectSlugs.length,
      }
    )
  );
}

async function main() {
  const checks = [];
  const startedAt = Date.now();
  const normalizedBaseUrl = normalizeAbsoluteUrl(baseUrl);

  if (!normalizedBaseUrl) {
    throw new Error(`Invalid SEO_MONITOR_BASE_URL: ${baseUrl}`);
  }

  const entries = await monitorRobotsAndSitemap(checks);
  if (entries.length > 0) {
    await monitorSitemapUrls(entries, checks);
    await monitorProjectSlugDrift(entries, checks);
  }
  await monitorRedirectHygiene(checks);
  await monitor404Behavior(checks);

  const summary = computeSummary(checks);
  const report = {
    generatedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    baseUrl: normalizedBaseUrl,
    strictMode,
    checks,
    summary,
  };

  await fs.mkdir(ARTIFACTS_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  const summaryText = `SEO monitor: failed=${summary.failed}, warned=${summary.warned}, highest=${summary.highestFailSeverity}`;
  console.log(`[seo:monitor] ${summaryText}`);
  console.log(`[seo:monitor] Report written to ${path.relative(ROOT_DIR, OUTPUT_PATH)}`);

  await sendAlert({
    reportType: "seo-monitor",
    summaryText,
    highestSeverity: summary.highestFailSeverity,
    report,
  });

  const shouldFailBuild = strictMode && checks.some((check) => {
    if (check.status !== "fail") return false;
    return check.severity === "critical" || check.severity === "high";
  });

  if (shouldFailBuild) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[seo:monitor] Unexpected failure:", error);
  process.exit(1);
});
