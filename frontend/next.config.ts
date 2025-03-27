import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: {
    buildActivity: false,
    // buildActivityPosition: 'bottom-right'
  }
};

export default nextConfig;