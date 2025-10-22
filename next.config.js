/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removido 'output: export' para permitir SSR nas páginas do dashboard
  // Landing page pode ser estática, dashboard usa SSR/SSG conforme necessário
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

module.exports = nextConfig;
