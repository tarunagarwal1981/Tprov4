import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure proper static export
  distDir: undefined, // Let Next.js use default
  // Disable server-side features
  experimental: {
    esmExternals: false,
  },
  // Ensure proper asset handling
  assetPrefix: '',
  basePath: '',
}

export default nextConfig;
