import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Required for static export
  output: 'export',

  // Optional: Configure asset prefix and base path based on environment variable
  assetPrefix: process.env.NODE_ENV === 'production' ? '/calendar' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/calendar' : '',
};

export default nextConfig;
