import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

// Pin Turbopack's workspace root to the monorepo root (two levels up from
// apps/booking-service). The hoisted `node_modules` (incl. `next`) and the
// workspace `pnpm-lock.yaml` live there. Without this, Turbopack warns about
// "multiple lockfiles / inferred workspace root" (especially inside a git
// worktree, which carries its own lockfile) and can fail to resolve hoisted deps.
const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url)).replace(
  /\\/g,
  "/",
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
