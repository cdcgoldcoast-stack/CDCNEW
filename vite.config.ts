import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const prerenderRoutes = [
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
  "/brand-guidelines",
  "/print-brochure",
];

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
    mode === "production" && prerenderPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
