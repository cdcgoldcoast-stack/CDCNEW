import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";

const GENERATED_PROJECT_SLUGS_PATH = path.resolve(__dirname, "src/generated/project-slugs.json");
const FALLBACK_PROJECT_SLUGS = [
  "coastal-modern",
  "heritage-revival",
  "family-hub",
  "retreat-house",
  "urban-oasis",
  "sunshine-retreat",
];

const CORE_PRERENDER_ROUTES = [
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

const EXTENDED_PRERENDER_ROUTES = [
  "/renovation-design-tools/ai-generator/intro",
  "/renovation-design-tools/ai-generator",
  "/renovation-design-tools/moodboard",
];

const parseEnvBoolean = (value: string | undefined, defaultValue = false) => {
  if (typeof value === "undefined") return defaultValue;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

const includeExtendedPrerenderRoutes = parseEnvBoolean(process.env.PRERENDER_EXTENDED, true);
const includeProjectDetailPrerenderRoutes = parseEnvBoolean(process.env.PRERENDER_PROJECT_DETAIL, false);

function loadProjectPrerenderRoutes(): string[] {
  try {
    const source = fs.readFileSync(GENERATED_PROJECT_SLUGS_PATH, "utf8");
    const parsed = JSON.parse(source) as { slugs?: string[] };
    if (Array.isArray(parsed.slugs) && parsed.slugs.length > 0) {
      return parsed.slugs
        .map((slug) => `${slug}`.trim())
        .filter(Boolean)
        .map((slug) => `/renovation-projects/${slug}`);
    }
  } catch {
    // Fall through to static fallback.
  }

  return FALLBACK_PROJECT_SLUGS.map((slug) => `/renovation-projects/${slug}`);
}

const prerenderRoutes = Array.from(
  new Set([
    ...CORE_PRERENDER_ROUTES,
    ...(includeExtendedPrerenderRoutes ? EXTENDED_PRERENDER_ROUTES : []),
    ...(includeProjectDetailPrerenderRoutes ? loadProjectPrerenderRoutes() : []),
  ])
);

function prerenderPlugin() {
  let outDir: string;
  return {
    name: "vite:prerender",
    apply: "build" as const,
    enforce: "post" as const,
    configResolved(config: { root: string; build: { outDir: string } }) {
      outDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.join(config.root, config.build.outDir);
    },
    async closeBundle() {
      const { default: Prerenderer } = await import("@prerenderer/prerenderer");
      const { default: PuppeteerRenderer } = await import("@prerenderer/renderer-puppeteer");
      const fs = await import("fs/promises");

      const renderer = new PuppeteerRenderer({
        headless: true,
        maxConcurrentRoutes: 4,
        timeout: 45000,
        inject: { skipAIGeneratorIntroRedirect: true },
        renderAfterDocumentEvent: "prerender-ready",
        renderAfterTime: 12000,
        skipThirdPartyRequests: true,
      });

      const prerenderer = new Prerenderer({
        staticDir: outDir,
        renderer,
      });

      try {
        try {
          await prerenderer.initialize();
        } catch (initErr) {
          console.warn("[prerender] Chrome failed to launch — skipping prerendering (SPA fallback).");
          console.warn("[prerender]", initErr instanceof Error ? initErr.message : String(initErr));
          return;
        }

        console.log(`\n[prerender] Rendering ${prerenderRoutes.length} routes...`);
        console.log(
          `[prerender] options: extended=${includeExtendedPrerenderRoutes ? "on" : "off"}, projectDetail=${includeProjectDetailPrerenderRoutes ? "on" : "off"}`
        );

        for (const route of prerenderRoutes) {
          try {
            const renderedRoutes = await prerenderer.renderRoutes([route]);
            const rendered = renderedRoutes[0];
            if (!rendered) {
              throw new Error("Renderer did not return HTML.");
            }

            const routePath = rendered.route === "/" ? "" : rendered.route;
            const dir = path.join(outDir, routePath);
            const filePath = path.join(dir, "index.html");
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(filePath, rendered.html);
            console.log(`[prerender] ${rendered.route} -> ${path.relative(outDir, filePath)}`);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[prerender] Route ${route} failed: ${message} — skipping.`);
          }
        }

        console.log("[prerender] Done!\n");
      } catch (err) {
        console.warn("[prerender] Unexpected error — skipping prerendering (SPA fallback).");
        console.warn("[prerender]", err);
      } finally {
        prerenderer.destroy();
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "production" && prerenderPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("jspdf")) return "vendor-jspdf";
          if (id.includes("html2canvas")) return "vendor-html2canvas";
          if (id.includes("@supabase/supabase-js")) return "vendor-supabase";
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("use-callback-ref")) return "vendor-react";
          if (id.includes("react-helmet-async")) return "vendor-react";
          if (id.includes("react") || id.includes("scheduler")) return "vendor-react";
          return undefined;
        },
      },
    },
  },
}));
