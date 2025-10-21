/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['supabase.co'], // For Supabase Storage images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  typescript: {
    // Enable strict type checking in production
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enable eslint in production
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
