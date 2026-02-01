import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/postcss";
import path from "node:path";

export default defineConfig({
  base: "/",
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
