import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const FORBIDDEN_STATIC_FILES = [
  path.join(ROOT_DIR, "public", "robots.txt"),
  path.join(ROOT_DIR, "public", "sitemap.xml"),
];

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const existing = [];
  for (const filePath of FORBIDDEN_STATIC_FILES) {
    if (await fileExists(filePath)) {
      existing.push(filePath);
    }
  }

  if (existing.length > 0) {
    const relativeList = existing.map((filePath) => path.relative(ROOT_DIR, filePath)).join(", ");
    throw new Error(
      `Static metadata files detected (${relativeList}). Use app/robots.ts and app/sitemap.ts as the single source of truth.`
    );
  }

  console.log("[seo:assert] Metadata source assertion passed.");
}

main().catch((error) => {
  console.error("[seo:assert] Failed:", error.message || error);
  process.exit(1);
});
