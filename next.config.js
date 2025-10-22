/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removido 'output: export' para habilitar SSR
  images: {
    // Manter unoptimized para compatibilidade com Cloudflare Pages
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
  // Configurações para SSR
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

module.exports = nextConfig;
