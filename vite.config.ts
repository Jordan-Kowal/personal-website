import react from "@vitejs/plugin-react";
import million from "million/compiler";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig(({ command, mode }) => ({
  plugins: [
    million.vite({ auto: true }),
    react(),
    {
      name: "inject-react-scan",
      transformIndexHtml(html) {
        if (mode === "development") {
          return html.replace(
            "</head>",
            `<script src="https://unpkg.com/react-scan/dist/auto.global.js"></script></head>`,
          );
        }
        return html;
      },
    },
  ],
  server: {
    port: 3000,
    cors: true,
  },
  esbuild: {
    loader: "tsx",
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".ts": "tsx",
      },
    },
  },
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
  build: {
    assetsDir: "static",
    chunkSizeWarningLimit: 1024,
  },
}));
