import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  experimental: {
    // @ts-expect-error: turbopack config might not be perfectly typed in this version
    turbopack: {
      root: process.cwd(),
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
