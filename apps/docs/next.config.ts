import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

// Monorepo root — two levels up. Same rationale as apps/web-next/next.config.ts:
// pins Turbopack's workspace root so hoisted deps resolve and the "multiple
// lockfiles" warning stays silent.
const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url)).replace(
  /\\/g,
  "/",
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Same SOURCE-VS-DIST decision as web-next (see its next.config.ts): consume
  // @laboratoire/ui through its `exports` (-> dist), with transpilePackages so
  // Next runs the compiled wrappers through its RSC + CSS pipeline. The
  // `prebuild` script in package.json builds the lib first.
  transpilePackages: ["@laboratoire/ui"],
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
