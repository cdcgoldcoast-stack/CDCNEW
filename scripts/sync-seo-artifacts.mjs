import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const PROJECT_DATA_PATH = path.join(ROOT_DIR, "src", "data", "projects.ts");
const GENERATED_SLUGS_PATH = path.join(ROOT_DIR, "src", "generated", "project-slugs.json");
const SITEMAP_PATH = path.join(ROOT_DIR, "public", "sitemap.xml");
const VERCEL_CONFIG_PATH = path.join(ROOT_DIR, "vercel.json");

const PRODUCTION_DOMAIN = "https://www.cdconstruct.com.au";

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about-us", changefreq: "monthly", priority: "0.8" },
  { path: "/projects", changefreq: "weekly", priority: "0.9" },
  { path: "/services", changefreq: "monthly", priority: "0.8" },
  { path: "/life-stages", changefreq: "monthly", priority: "0.7" },
  { path: "/get-quote", changefreq: "monthly", priority: "0.9" },
  { path: "/gallery", changefreq: "weekly", priority: "0.7" },
  { path: "/design-tools", changefreq: "monthly", priority: "0.6" },
  { path: "/design-tools/ai-generator/intro", changefreq: "monthly", priority: "0.5" },
  { path: "/design-tools/ai-generator", changefreq: "monthly", priority: "0.5" },
  { path: "/design-tools/moodboard", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-conditions", changefreq: "yearly", priority: "0.3" },
];

const PROJECT_META = {
  changefreq: "monthly",
  priority: "0.7",
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
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort();
}

function formatDateUTC(date = new Date()) {
  return date.toISOString().slice(0, 10);
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
    console.warn("[seo:sync] Supabase credentials not found in env. Using static/project cache slugs.");
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
    const response = await fetch(`${PRODUCTION_DOMAIN}/projects`, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; seo-sync-bot/1.0)",
      },
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const matches = [...html.matchAll(/href="\/projects\/([a-z0-9-]+)"/g)];
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
      .filter((sourcePath) => sourcePath.startsWith("/projects/"))
      .filter((sourcePath) => sourcePath !== "/projects")
      .map((sourcePath) => sourcePath.replace(/^\/projects\//, ""))
      .filter((slug) => slug && !slug.includes("/") && !slug.includes(":") && !slug.includes("("));

    return uniqSorted(projectSlugs);
  } catch {
    return [];
  }
}

function buildSitemapXml(projectSlugs) {
  const lastmod = formatDateUTC();

  const entries = [
    ...STATIC_ROUTES,
    ...projectSlugs.map((slug) => ({
      path: `/projects/${slug}`,
      changefreq: PROJECT_META.changefreq,
      priority: PROJECT_META.priority,
    })),
  ];

  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

  for (const entry of entries) {
    lines.push("  <url>");
    lines.push(`    <loc>${PRODUCTION_DOMAIN}${entry.path}</loc>`);
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

async function writeSitemap(projectSlugs) {
  const sitemapXml = buildSitemapXml(projectSlugs);
  await fs.writeFile(SITEMAP_PATH, sitemapXml);
}

async function main() {
  const [supabaseSlugs, vercelRewriteSlugs, publicSiteSlugs, staticSlugs, previousSlugs] = await Promise.all([
    readSupabaseProjectSlugs(),
    readVercelRewriteProjectSlugs(),
    readPublicSiteProjectSlugs(),
    readStaticProjectSlugs(),
    readPreviousGeneratedSlugs(),
  ]);

  const preferredSlugs = [
    ...supabaseSlugs,
    ...vercelRewriteSlugs,
    ...publicSiteSlugs,
  ];

  const mergedSlugs = preferredSlugs.length > 0
    ? uniqSorted(preferredSlugs)
    : uniqSorted([...staticSlugs, ...previousSlugs]);

  await writeProjectSlugArtifact(mergedSlugs, {
    supabase: supabaseSlugs.length,
    vercelRewrites: vercelRewriteSlugs.length,
    publicSite: publicSiteSlugs.length,
    staticFallback: staticSlugs.length,
    previousGenerated: previousSlugs.length,
  });
  await writeSitemap(mergedSlugs);

  console.log(`[seo:sync] Project slugs: ${mergedSlugs.length}`);
  console.log(`[seo:sync] Updated ${path.relative(ROOT_DIR, GENERATED_SLUGS_PATH)}`);
  console.log(`[seo:sync] Updated ${path.relative(ROOT_DIR, SITEMAP_PATH)}`);
}

main().catch((error) => {
  console.error("[seo:sync] Failed to update SEO artifacts:", error);
  process.exit(1);
});
