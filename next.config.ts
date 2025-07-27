import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false, // Keep this false since we fixed the TS errors
  },
  experimental: {
    // Enable server actions
  },
  // Force all pages to be client-side rendered to avoid hydration issues
  trailingSlash: false,
  reactStrictMode: false, // Disable strict mode temporarily to avoid double effects
};

export default nextConfig;
