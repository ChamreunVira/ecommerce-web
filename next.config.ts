import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8081',
      },
      {
        protocol: 'https',
        hostname: 'bakong.nbc.gov.kh',
      }
    ],
  },
};

export default nextConfig;
