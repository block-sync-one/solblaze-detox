/** @type {import('next').NextConfig} */
const nextConfig = {
  // Improve build performance and reliability
  poweredByHeader: false,
  // Handle external domains for images if needed
  images: {
    domains: ['api.stakewiz.com', 'www.validators.app'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  
  // Improve build reliability
  typescript: {
    // Don't fail build on type errors during deployment
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Don't fail build on lint errors during deployment
    ignoreDuringBuilds: false,
  }
}

module.exports = nextConfig;
