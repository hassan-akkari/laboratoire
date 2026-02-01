import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/postcss";
import path from "node:path";

// const isPages = !!process.env.GITHUB_PAGES;

export default defineConfig({
  base: "/react/",
  plugins: [react()],
  resolve: {
    alias: {
      "@laboratoire/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
});
