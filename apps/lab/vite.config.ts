import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/postcss";
import { existsSync } from "node:fs";
import path from "node:path";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const forceSourceUi =
    env.VITE_UI_SOURCE === "1" || env.VITE_UI_SOURCE === "true";
  // Vite dev (`serve`) always uses the UI source; prod build uses dist unless forced.
  const useSourceUi = forceSourceUi || command === "serve";
  const uiSourcePath = path.resolve(__dirname, "../../packages/ui/src");
  const uiDistPath = path.resolve(__dirname, "../../packages/ui/dist/index.js");

  if (!useSourceUi && !existsSync(uiDistPath)) {
    throw new Error(
      "packages/ui/dist is missing. Run `pnpm -F @laboratoire/ui build` first or set VITE_UI_SOURCE=1."
    );
  }

  return {
    base: "/",
    plugins: [react()],
    resolve: {
      alias: {
        "@laboratoire/ui": useSourceUi ? uiSourcePath : uiDistPath,
      },
    },
    css: {
      postcss: {
        plugins: [tailwind()],
      },
    },
  };
});
