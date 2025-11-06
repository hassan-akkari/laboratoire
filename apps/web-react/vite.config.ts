import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/postcss";

const isPages = !!process.env.GITHUB_PAGES;

export default defineConfig({
  base: isPages ? "/laboratoire/react/" : "/",
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
});
