/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@portfolio/ui', '@portfolio/types', '@portfolio/utils', '@portfolio/config'],
  reactStrictMode: true,
};

module.exports = nextConfig;
