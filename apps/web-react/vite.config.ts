import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/postcss";

export default defineConfig({
  base: "/laboratoire/react/",
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
});
