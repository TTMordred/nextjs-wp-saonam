/** @type {import('next').NextConfig} */
const nextConfig = {
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
  
  // Increase the timeout for API requests if needed
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
};

module.exports = nextConfig;
