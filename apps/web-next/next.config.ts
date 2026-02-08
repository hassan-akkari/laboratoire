import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint is handled by workspace scripts to keep tooling consistent across apps.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
