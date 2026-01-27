import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: 'export' to support full Vercel features
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  trailingSlash: false, // Default for Next.js apps
  images: {
    // Enabled image optimization for Vercel
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
    ],
  },
  // Remove unused modules
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
