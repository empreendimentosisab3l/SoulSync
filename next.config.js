/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  experimental: {
    optimizePackageImports: ['lucide-react', 'lottie-react', 'framer-motion'],
  },
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable compression
  compress: true,
  // Enable React strict mode for better performance
  reactStrictMode: true,
}

module.exports = nextConfig
