/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@/components/ui'],
  },
  // Otimizações de performance
  poweredByHeader: false,
  compress: true,

  // Otimizações para desenvolvimento local
  onDemandEntries: {
    // Período que uma página fica em memória (ms)
    maxInactiveAge: 25 * 1000,
    // Número de páginas mantidas em memória
    pagesBufferLength: 2,
  },

  // Variáveis de ambiente com fallback para build
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    // Asaas - força o carregamento mesmo com $ no início
    ASAAS_API_KEY: process.env.ASAAS_API_KEY || '',
    ASAAS_ENVIRONMENT: process.env.ASAAS_ENVIRONMENT || 'sandbox',
  },
};

module.exports = nextConfig;
