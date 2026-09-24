import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

const OUTPUT_DIR = "dist";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },
      adapter: adapter({ pages: OUTPUT_DIR, assets: OUTPUT_DIR }),
      alias: { "@": "src" },
      // Keeps the existing `public/` folder instead of SvelteKit's `static/`.
      files: { assets: "public" },
    }),
    visualizer({
      filename: "bundle-stats.html",
      title: "Bundle Stats",
      gzipSize: true,
    }),
  ],
  build: {
    target: "esnext",
  },
});
