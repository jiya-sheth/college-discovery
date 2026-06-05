/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Force all pages to be dynamic to avoid prerender errors
  staticPageGenerationTimeout: 0,
};

module.exports = nextConfig;