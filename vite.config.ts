import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import devtools from "solid-devtools/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig(({ mode }) => ({
  plugins: [
    devtools({
      autoname: true,
    }),
    solidPlugin(),
    tailwindcss(),
    visualizer({
      filename: "bundle-stats.html",
      title: "Bundle Stats",
      gzipSize: true,
      open: true,
    }),
  ],
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  base: "/",
}));
