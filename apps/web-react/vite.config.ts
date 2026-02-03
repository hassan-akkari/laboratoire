import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/postcss";
import path from "node:path";

// const isPages = !!process.env.GITHUB_PAGES;

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const forceSourceUi =
    env.VITE_UI_SOURCE === "1" || env.VITE_UI_SOURCE === "true";
  const useSourceUi =
    forceSourceUi || (command === "serve" && mode !== "production");

  return {
    base: "/react/",
    plugins: [react()],
    resolve: useSourceUi
      ? {
          alias: {
            "@laboratoire/ui": path.resolve(__dirname, "../../packages/ui/src"),
          },
        }
      : undefined,
    css: {
      postcss: {
        plugins: [tailwind()],
      },
    },
  };
});
