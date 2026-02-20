import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { isSitemapEligibleRoute, normalizePath } from "./lib/seo-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const PROJECT_DATA_PATH = path.join(ROOT_DIR, "src", "data", "projects.ts");
const GENERATED_SLUGS_PATH = path.join(ROOT_DIR, "src", "generated", "project-slugs.json");
const SITEMAP_PATH = path.join(ROOT_DIR, "public", "sitemap.xml");
const VERCEL_CONFIG_PATH = path.join(ROOT_DIR, "vercel.json");
const BLOG_CONTENT_PATH = path.join(ROOT_DIR, "content", "blog");

const PRODUCTION_DOMAIN = "https://www.cdconstruct.com.au";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:[/-][a-z0-9]+)*$/;
const EXCLUDED_PROJECT_SLUGS = new Set([
  "coastal-modern",
  "heritage-revival",
  "retreat-house",
  "sunshine-retreat",
  "urban-oasis",
]);

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about-us", changefreq: "monthly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.75" },
  { path: "/renovation-projects", changefreq: "weekly", priority: "0.9" },
  { path: "/renovation-services", changefreq: "monthly", priority: "0.8" },
  { path: "/kitchen-renovations-gold-coast", changefreq: "weekly", priority: "0.9" },
  { path: "/bathroom-renovations-gold-coast", changefreq: "weekly", priority: "0.9" },
  { path: "/whole-home-renovations-gold-coast", changefreq: "weekly", priority: "0.9" },
  { path: "/broadbeach-renovations", changefreq: "weekly", priority: "0.85" },
  { path: "/mermaid-beach-renovations", changefreq: "weekly", priority: "0.85" },
  { path: "/palm-beach-renovations", changefreq: "weekly", priority: "0.85" },
  { path: "/robina-renovations", changefreq: "weekly", priority: "0.85" },
  { path: "/southport-renovations", changefreq: "weekly", priority: "0.85" },
  { path: "/renovations/burleigh-heads", changefreq: "weekly", priority: "0.85" },
  { path: "/renovation-life-stages", changefreq: "monthly", priority: "0.7" },
  { path: "/book-renovation-consultation", changefreq: "monthly", priority: "0.9" },
  { path: "/renovation-gallery", changefreq: "weekly", priority: "0.7" },
  { path: "/renovation-design-tools", changefreq: "monthly", priority: "0.6" },
  { path: "/renovation-ai-generator/intro", changefreq: "monthly", priority: "0.5" },
  { path: "/renovation-ai-generator", changefreq: "monthly", priority: "0.5" },
  { path: "/renovation-design-tools/moodboard", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-conditions", changefreq: "yearly", priority: "0.3" },
];

const PROJECT_META = {
  changefreq: "monthly",
  priority: "0.7",
};

const BLOG_META = {
  changefreq: "monthly",
  priority: "0.65",
};

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqSorted(values) {
  return [...new Set(
    values
      .map((value) => `${value}`.trim().toLowerCase())
      .filter((value) => value && SLUG_PATTERN.test(value))
  )].sort();
}

function uniqSortedBlogSlugs(values) {
  return [...new Set(
    values
      .map((value) => `${value}`.trim().toLowerCase())
      .filter((value) => value && BLOG_SLUG_PATTERN.test(value))
  )].sort();
}

function filterExcludedSlugs(values) {
  return values.filter((slug) => !EXCLUDED_PROJECT_SLUGS.has(slug));
}

function formatDateUTC(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function toAbsoluteCanonicalUrl(pathname) {
  const normalizedPath = normalizePath(pathname);
  if (normalizedPath === "/") return PRODUCTION_DOMAIN;
  return `${PRODUCTION_DOMAIN}${normalizedPath}`;
}

async function readStaticProjectSlugs() {
  try {
    const source = await fs.readFile(PROJECT_DATA_PATH, "utf8");
    const matches = [...source.matchAll(/slug:\s*"([^"]+)"/g)];
    return uniqSorted(matches.map((match) => match[1]));
  } catch (error) {
    console.warn(`[seo:sync] Could not read static projects from ${PROJECT_DATA_PATH}:`, error);
    return [];
  }
}

async function readPreviousGeneratedSlugs() {
  try {
    const source = await fs.readFile(GENERATED_SLUGS_PATH, "utf8");
    const parsed = JSON.parse(source);
    if (!Array.isArray(parsed?.slugs)) return [];
    return uniqSorted(parsed.slugs.map((slug) => `${slug}`));
  } catch {
    return [];
  }
}

async function readSupabaseProjectSlugs() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) {
    console.warn("[seo:sync] Supabase credentials not found in env. Using static/public slugs.");
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase
      .from("projects")
      .select("name")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[seo:sync] Supabase project fetch failed:", error.message);
      return [];
    }

    const slugs = (data || [])
      .map((project) => generateSlug(project?.name || ""))
      .filter(Boolean);

    return uniqSorted(slugs);
  } catch (error) {
    console.warn("[seo:sync] Could not load project slugs from Supabase:", error);
    return [];
  }
}

async function readPublicSiteProjectSlugs() {
  try {
    const response = await fetch(`${PRODUCTION_DOMAIN}/renovation-projects`, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; seo-sync-bot/1.0)",
      },
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const matches = [...html.matchAll(/href="\/renovation-projects\/([a-z0-9-]+)"/g)];
    return uniqSorted(matches.map((match) => match[1]));
  } catch {
    return [];
  }
}

async function readVercelRewriteProjectSlugs() {
  try {
    const source = await fs.readFile(VERCEL_CONFIG_PATH, "utf8");
    const parsed = JSON.parse(source);
    const rewrites = Array.isArray(parsed?.rewrites) ? parsed.rewrites : [];
    const projectSlugs = rewrites
      .map((rewrite) => `${rewrite?.source || ""}`)
      .filter((sourcePath) => sourcePath.startsWith("/renovation-projects/"))
      .filter((sourcePath) => sourcePath !== "/renovation-projects")
      .map((sourcePath) => sourcePath.replace(/^\/renovation-projects\//, ""))
      .filter((slug) => slug && !slug.includes("/") && !slug.includes(":") && !slug.includes("("));

    return uniqSorted(projectSlugs);
  } catch {
    return [];
  }
}

function extractFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  return match?.[1] || "";
}

function readFrontmatterValue(frontmatter, fieldName) {
  const match = frontmatter.match(new RegExp(`^${fieldName}:\\s*(.+)$`, "mi"));
  if (!match?.[1]) return "";
  return match[1].trim().replace(/^['"]|['"]$/g, "");
}

function isDraftPost(frontmatter) {
  const draftValue = readFrontmatterValue(frontmatter, "draft");
  return draftValue.toLowerCase() === "true";
}

function isFuturePost(frontmatter) {
  const publishedAtValue = readFrontmatterValue(frontmatter, "publishedAt");
  if (!publishedAtValue) return false;
  const timestamp = new Date(publishedAtValue).getTime();
  if (Number.isNaN(timestamp)) return false;
  return timestamp > Date.now();
}

async function readBlogPostSlugsInDirectory(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const slugs = [];

  for (const entry of entries) {
    const absoluteEntryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      const nestedSlugs = await readBlogPostSlugsInDirectory(absoluteEntryPath);
      slugs.push(...nestedSlugs);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".mdx")) {
      continue;
    }

    const source = await fs.readFile(absoluteEntryPath, "utf8");
    const frontmatter = extractFrontmatter(source);
    if (isDraftPost(frontmatter) || isFuturePost(frontmatter)) {
      continue;
    }

    const relative = path.relative(BLOG_CONTENT_PATH, absoluteEntryPath).replace(/\\/g, "/");
    const slug = relative.replace(/\.mdx$/i, "");
    slugs.push(slug);
  }

  return slugs;
}

async function readBlogPostSlugs() {
  try {
    const slugs = await readBlogPostSlugsInDirectory(BLOG_CONTENT_PATH);
    return uniqSortedBlogSlugs(slugs);
  } catch {
    return [];
  }
}

function buildSitemapXml(projectSlugs, blogSlugs) {
  const lastmod = formatDateUTC();

  const rawEntries = [
    ...STATIC_ROUTES,
    ...projectSlugs.map((slug) => ({
      path: `/renovation-projects/${slug}`,
      changefreq: PROJECT_META.changefreq,
      priority: PROJECT_META.priority,
    })),
    ...blogSlugs.map((slug) => ({
      path: `/blog/${slug}`,
      changefreq: BLOG_META.changefreq,
      priority: BLOG_META.priority,
    })),
  ];

  const entries = [];
  const seenPaths = new Set();
  for (const entry of rawEntries) {
    const normalizedPath = normalizePath(entry.path);
    if (!normalizedPath) continue;
    if (!isSitemapEligibleRoute(normalizedPath)) continue;
    if (seenPaths.has(normalizedPath)) continue;
    seenPaths.add(normalizedPath);
    entries.push({
      ...entry,
      path: normalizedPath,
    });
  }

  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

  for (const entry of entries) {
    lines.push("  <url>");
    lines.push(`    <loc>${toAbsoluteCanonicalUrl(entry.path)}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    lines.push(`    <priority>${entry.priority}</priority>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  return `${lines.join("\n")}\n`;
}

async function writeProjectSlugArtifact(slugs, sourceCounts) {
  await fs.mkdir(path.dirname(GENERATED_SLUGS_PATH), { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    domain: PRODUCTION_DOMAIN,
    slugs,
    sourceCounts,
  };
  await fs.writeFile(GENERATED_SLUGS_PATH, `${JSON.stringify(payload, null, 2)}\n`);
}

async function writeSitemap(projectSlugs, blogSlugs) {
  const sitemapXml = buildSitemapXml(projectSlugs, blogSlugs);
  await fs.writeFile(SITEMAP_PATH, sitemapXml);
}

async function main() {
  const [supabaseSlugs, vercelRewriteSlugs, publicSiteSlugs, staticSlugs, previousSlugs, blogSlugs] = await Promise.all([
    readSupabaseProjectSlugs(),
    readVercelRewriteProjectSlugs(),
    readPublicSiteProjectSlugs(),
    readStaticProjectSlugs(),
    readPreviousGeneratedSlugs(),
    readBlogPostSlugs(),
  ]);

  const filteredSupabaseSlugs = filterExcludedSlugs(supabaseSlugs);
  const filteredVercelRewriteSlugs = filterExcludedSlugs(vercelRewriteSlugs);
  const filteredPublicSiteSlugs = filterExcludedSlugs(publicSiteSlugs);
  const filteredStaticSlugs = filterExcludedSlugs(staticSlugs);
  const filteredPreviousSlugs = filterExcludedSlugs(previousSlugs);

  const authoritativeSlugs = [
    ...filteredSupabaseSlugs,
    ...filteredPublicSiteSlugs,
    ...filteredVercelRewriteSlugs,
    ...filteredStaticSlugs,
    ...filteredPreviousSlugs,
  ];

  const mergedAuthoritativeSlugs = uniqSorted(authoritativeSlugs);
  const usedPreviousGeneratedFallback =
    filteredSupabaseSlugs.length === 0 &&
    filteredPublicSiteSlugs.length === 0 &&
    filteredVercelRewriteSlugs.length === 0 &&
    filteredStaticSlugs.length === 0 &&
    filteredPreviousSlugs.length > 0;
  const mergedSlugs = mergedAuthoritativeSlugs;

  const mergedSlugSet = new Set(mergedSlugs);
  const vercelRewriteSlugSet = new Set(filteredVercelRewriteSlugs);
  const missingVercelRewrites = mergedSlugs.filter((slug) => !vercelRewriteSlugSet.has(slug));
  const staleVercelRewrites = filteredVercelRewriteSlugs.filter((slug) => !mergedSlugSet.has(slug));

  if (
    filteredVercelRewriteSlugs.length > 0 &&
    (missingVercelRewrites.length > 0 || staleVercelRewrites.length > 0)
  ) {
    console.warn(
      `[seo:sync] Vercel project rewrite mismatch. missing=${missingVercelRewrites.length}, stale=${staleVercelRewrites.length}`
    );
  }

  await writeProjectSlugArtifact(mergedSlugs, {
    supabase: filteredSupabaseSlugs.length,
    vercelRewrites: filteredVercelRewriteSlugs.length,
    publicSite: filteredPublicSiteSlugs.length,
    staticFallback: filteredStaticSlugs.length,
    previousGenerated: filteredPreviousSlugs.length,
    usedPreviousGeneratedFallback,
  });
  await writeSitemap(mergedSlugs, blogSlugs);

  console.log(`[seo:sync] Project slugs: ${mergedSlugs.length}`);
  console.log(`[seo:sync] Blog slugs: ${blogSlugs.length}`);
  console.log(`[seo:sync] Updated ${path.relative(ROOT_DIR, GENERATED_SLUGS_PATH)}`);
  console.log(`[seo:sync] Updated ${path.relative(ROOT_DIR, SITEMAP_PATH)}`);
}

main().catch((error) => {
  console.error("[seo:sync] Failed to update SEO artifacts:", error);
  process.exit(1);
});
