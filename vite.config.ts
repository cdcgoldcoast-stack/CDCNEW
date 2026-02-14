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

const basePrerenderRoutes = [
  "/",
  "/about-us",
  "/projects",
  "/services",
  "/gallery",
  "/design-tools",
  "/get-quote",
  "/life-stages",
  "/privacy-policy",
  "/terms-conditions",
];

function loadProjectPrerenderRoutes(): string[] {
  try {
    const source = fs.readFileSync(GENERATED_PROJECT_SLUGS_PATH, "utf8");
    const parsed = JSON.parse(source) as { slugs?: string[] };
    if (Array.isArray(parsed.slugs) && parsed.slugs.length > 0) {
      return parsed.slugs
        .map((slug) => `${slug}`.trim())
        .filter(Boolean)
        .map((slug) => `/projects/${slug}`);
    }
  } catch {
    // Fall through to static fallback.
  }

  return FALLBACK_PROJECT_SLUGS.map((slug) => `/projects/${slug}`);
}

const prerenderRoutes = Array.from(new Set([...basePrerenderRoutes, ...loadProjectPrerenderRoutes()]));
const isVercelBuild = process.env.VERCEL === "1";

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
        renderAfterDocumentEvent: "prerender-ready",
        renderAfterTime: 10000,
      });

      const prerenderer = new Prerenderer({
        staticDir: outDir,
        renderer,
      });

      try {
        await prerenderer.initialize();
        console.log(`\n[prerender] Rendering ${prerenderRoutes.length} routes...`);

        const renderedRoutes = await prerenderer.renderRoutes(prerenderRoutes);

        for (const route of renderedRoutes) {
          const routePath = route.route === "/" ? "" : route.route;
          const dir = path.join(outDir, routePath);
          const filePath = path.join(dir, "index.html");
          await fs.mkdir(dir, { recursive: true });
          await fs.writeFile(filePath, route.html);
          console.log(`[prerender] ${route.route} -> ${path.relative(outDir, filePath)}`);
        }

        console.log("[prerender] Done!\n");
      } catch (err) {
        console.error("[prerender] Failed:", err);
        throw err;
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
    mode === "production" && !isVercelBuild && prerenderPlugin(),
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
