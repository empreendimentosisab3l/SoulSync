/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  experimental: {
    optimizePackageImports: ['lucide-react', 'lottie-react'],
  },
  // Reduce function size
  serverComponentsExternalPackages: [],
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
