import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

// Monorepo root — two levels up. Same rationale as apps/web-next/next.config.ts:
// pins Turbopack's workspace root so hoisted deps resolve and the "multiple
// lockfiles" warning stays silent.
const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url)).replace(
  /\\/g,
  "/",
);

// BACKWARDS-COMPATIBLE ENV MAPPING: the live Vercel project still defines the
// Vite-era names (VITE_ADMIN_API_BASE is marked Sensitive, and Vercel env
// vars cannot be renamed — plus production on main still needs them until
// this branch merges). Map old -> new at build time so neither a dashboard
// rename nor a value copy is ever required; NEXT_PUBLIC_* wins when both
// exist, and the VITE_* entries can be deleted whenever. Keys are included
// only when set: inlining "" would defeat the `?? fallback` defaults at the
// call sites (e.g. CalBookButton's default event link).
const adminApiBase =
  process.env.NEXT_PUBLIC_ADMIN_API_BASE ?? process.env.VITE_ADMIN_API_BASE;
const calLink = process.env.NEXT_PUBLIC_CAL_LINK ?? process.env.VITE_CAL_LINK;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    ...(adminApiBase ? { NEXT_PUBLIC_ADMIN_API_BASE: adminApiBase } : {}),
    ...(calLink ? { NEXT_PUBLIC_CAL_LINK: calLink } : {}),
  },
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
