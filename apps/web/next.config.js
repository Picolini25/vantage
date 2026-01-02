/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.steamstatic.com', 'steamcdn-a.akamaihd.net'],
  },
  transpilePackages: ['@vantage/shared'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },
}

module.exports = nextConfig
