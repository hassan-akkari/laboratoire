import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

// The monorepo (worktree) root — two levels up from apps/web-next. This is where
// the hoisted `node_modules` (incl. `next`) and the workspace `pnpm-lock.yaml`
// live. Pinning Turbopack's workspace root here silences the "multiple lockfiles /
// inferred workspace root" warning that arises when this app is built inside a git
// worktree (the worktree has its own pnpm-lock.yaml alongside the main checkout's)
// AND ensures Turbopack can resolve the hoisted dependencies.
const workspaceRoot = fileURLToPath(
  new URL("../..", import.meta.url),
).replace(/\\/g, "/");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // SOURCE-VS-DIST DECISION (VARIANT B): consume @laboratoire/ui from its built
  // `dist` (the package's normal `exports` entry), NOT from a TS-source alias.
  //
  // WHY DIST, NOT SOURCE: Next 16's Turbopack rejects aliasing a bare specifier to
  // an absolute on-disk `.ts` file — it then treats that path as an EXTERNAL module
  // and refuses to bundle it ("the chunking context does not support external
  // modules"). Resolving through the package's `exports` map (-> `dist/index.js`)
  // keeps the lib a first-class internal dependency that Turbopack bundles cleanly.
  //
  // `transpilePackages` is still required: the compiled wrappers carry a
  // `"use client"` directive and a side-effect `import "m3-ripple/ripple.css"`;
  // listing the package makes Next run it through its RSC + CSS pipeline so both
  // are handled (the stylesheet is extracted, the client boundary is honored).
  //
  // The `dist` is NOT committed (it is a build artifact). To keep
  // `pnpm -F web-next build` self-contained, web-next's `prebuild` script builds
  // the lib first (see apps/web-next/package.json). The warm-palette v3 CSS vars
  // come from `globals.css`'s `@import` of the lib's source `.css` (independent of
  // `dist`, which only carries JS). The v3 alias packages (`@heroui-v3/react` =
  // npm:@heroui/react@3.2.1) and `m3-ripple` resolve from the hoisted root
  // `node_modules` (node-linker=hoisted).
  transpilePackages: ["@laboratoire/ui"],
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
