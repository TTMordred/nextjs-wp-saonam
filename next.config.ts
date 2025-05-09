import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['saonamtg.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'saonamtg.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  // Enable static exports for hosting on traditional servers if needed
  // output: 'export',

  // External packages for server components
  serverExternalPackages: ['sharp'],
};

export default nextConfig;
