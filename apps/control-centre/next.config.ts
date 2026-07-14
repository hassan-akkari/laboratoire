import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

// Same workspace-root pin as web-next: the hoisted node_modules and the
// workspace pnpm-lock.yaml live two levels up, and pinning it silences
// Turbopack's "multiple lockfiles" inference warning.
const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url)).replace(
  /\\/g,
  "/",
);

// LOCAL-ONLY APP. No deploy target on purpose: the control centre reads the
// local filesystem (vault, git history, data/ JSON store) and has no auth.
// See README.md — do not wire this into vercel.json.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
