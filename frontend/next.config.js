/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AMADEUS_API_KEY: process.env.AMADEUS_API_KEY,
    AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET,
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'logos-world.net' },
    ],
  },
};

module.exports = nextConfig;