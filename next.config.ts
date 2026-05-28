import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3845',
        pathname: '/assets/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        // Production backend on Railway
        protocol: 'https',
        hostname: 'mazashield-backend-production.up.railway.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        // Cloudinary CDN for uploaded product images
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    // unoptimized removed — Next.js Image Optimization is now active
  },
};

export default nextConfig;
