import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// The @/* path alias is declared in tsconfig.json for Next.js, but Vitest does
// not read tsconfig paths on its own. Mirror the alias here so route tests that
// import (and mock) "@/lib/..." resolve the same way they do under `next dev`.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    globals: true,
  },
});
