import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const CLIENT_SCAN_DIRS = ["src", "public", "dist", "app", "components", "compat", "lib"];
const CLIENT_SCAN_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".html",
  ".css",
  ".txt",
]);

const SECRET_PATTERNS = [
  { name: "Supabase service role key marker", regex: /SUPABASE_SERVICE_ROLE_KEY/i },
  { name: "Private key block", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i },
  { name: "Google API key format", regex: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: "Generic secret key format", regex: /\bsk_(?:live|test)_[0-9A-Za-z]{16,}\b/ },
  { name: "Service role JWT marker", regex: /"role"\s*:\s*"service_role"/i },
];

const ALLOWED_IMPORT_META_ENV = new Set(["DEV", "PROD", "MODE", "BASE_URL", "SSR"]);
const CLIENT_ENV_REGEX = /import\.meta\.env\.([A-Z0-9_]+)/g;

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function relative(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function collectClientFiles() {
  const out = [];
  for (const relDir of CLIENT_SCAN_DIRS) {
    const fullDir = path.join(ROOT, relDir);
    if (!fs.existsSync(fullDir)) continue;

    for (const filePath of walk(fullDir)) {
      const ext = path.extname(filePath).toLowerCase();
      if (CLIENT_SCAN_EXTENSIONS.has(ext)) {
        out.push(filePath);
      }
    }
  }

  return out;
}

function fail(failures, message) {
  failures.push(message);
}

function checkClientSecrets(failures) {
  const files = collectClientFiles();

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    const rel = relative(filePath);

    for (const pattern of SECRET_PATTERNS) {
      if (pattern.regex.test(content)) {
        fail(failures, `[secret] ${pattern.name} found in client-exposed file: ${rel}`);
      }
    }
  }
}

function checkClientEnvUsage(failures) {
  const srcDir = path.join(ROOT, "src");
  if (!fs.existsSync(srcDir)) return;

  const files = walk(srcDir).filter((filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    return ext === ".ts" || ext === ".tsx" || ext === ".js" || ext === ".jsx";
  });

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    const rel = relative(filePath);
    let match;
    while ((match = CLIENT_ENV_REGEX.exec(content)) !== null) {
      const envName = match[1];
      if (!envName.startsWith("VITE_") && !ALLOWED_IMPORT_META_ENV.has(envName)) {
        fail(failures, `[env] Non-public env var used in client bundle: import.meta.env.${envName} (${rel})`);
      }
    }
  }
}

function checkFunctionGuarding(failures) {
  const adminOnly = [
    "supabase/functions/generate-project-content/index.ts",
    "supabase/functions/refine-content/index.ts",
  ];

  for (const relPath of adminOnly) {
    const fullPath = path.join(ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      fail(failures, `[functions] Missing admin-only function file: ${relPath}`);
      continue;
    }
    const content = fs.readFileSync(fullPath, "utf8");
    if (!content.includes("requireAdminUser(")) {
      fail(failures, `[functions] Admin-only function missing requireAdminUser guard: ${relPath}`);
    }
  }

  const publicFunctions = [
    "supabase/functions/chat/index.ts",
    "supabase/functions/save-enquiry/index.ts",
    "supabase/functions/save-chat-inquiry/index.ts",
    "supabase/functions/search-images/index.ts",
    "supabase/functions/image-proxy/index.ts",
    "supabase/functions/generate-design/index.ts",
  ];

  for (const relPath of publicFunctions) {
    const fullPath = path.join(ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      fail(failures, `[functions] Missing public function file: ${relPath}`);
      continue;
    }
    const content = fs.readFileSync(fullPath, "utf8");
    if (!content.includes("rejectDisallowedOrigin(")) {
      fail(failures, `[functions] Public function missing origin check: ${relPath}`);
    }
    if (!content.includes("enforceRateLimit(")) {
      fail(failures, `[functions] Public function missing rate-limit check: ${relPath}`);
    }
  }
}

function checkSensitiveMigrationHardening(failures) {
  const migrationsDir = path.join(ROOT, "supabase/migrations");
  if (!fs.existsSync(migrationsDir)) {
    fail(failures, "[migrations] Missing supabase/migrations directory");
    return;
  }

  const migrationFiles = walk(migrationsDir).filter((filePath) => filePath.endsWith(".sql"));
  const combined = migrationFiles
    .map((filePath) => fs.readFileSync(filePath, "utf8"))
    .join("\n\n");

  const checks = [
    {
      name: "enquiries FORCE RLS",
      regex: /ALTER TABLE\s+public\.enquiries\s+FORCE\s+ROW\s+LEVEL\s+SECURITY/i,
    },
    {
      name: "chat_inquiries FORCE RLS",
      regex: /ALTER TABLE\s+public\.chat_inquiries\s+FORCE\s+ROW\s+LEVEL\s+SECURITY/i,
    },
    {
      name: "moodboards FORCE RLS",
      regex: /ALTER TABLE\s+public\.moodboards\s+FORCE\s+ROW\s+LEVEL\s+SECURITY/i,
    },
    {
      name: "enquiries anon revoke",
      regex: /REVOKE\s+ALL\s+ON\s+TABLE\s+public\.enquiries\s+FROM\s+anon/i,
    },
    {
      name: "chat_inquiries anon revoke",
      regex: /REVOKE\s+ALL\s+ON\s+TABLE\s+public\.chat_inquiries\s+FROM\s+anon/i,
    },
    {
      name: "moodboards anon revoke",
      regex: /REVOKE\s+ALL\s+ON\s+TABLE\s+public\.moodboards\s+FROM\s+anon/i,
    },
  ];

  for (const check of checks) {
    if (!check.regex.test(combined)) {
      fail(failures, `[migrations] Missing hardening statement: ${check.name}`);
    }
  }
}

function main() {
  const failures = [];

  if (!exists("src")) {
    console.error("[security:audit] src directory not found");
    process.exit(1);
  }

  checkClientSecrets(failures);
  checkClientEnvUsage(failures);
  checkFunctionGuarding(failures);
  checkSensitiveMigrationHardening(failures);

  if (failures.length > 0) {
    console.error("[security:audit] Failed checks:");
    for (const failure of failures) {
      console.error(` - ${failure}`);
    }
    process.exit(1);
  }

  console.log("[security:audit] All checks passed.");
}

main();
