'use client';

import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(45,159,93,.1) 10px, rgba(45,159,93,.1) 20px)"}}>
        </div>
      </div>

      <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo-arena.png"
              alt="Arena Dona Santa Logo"
              width={100}
              height={100}
              className="mx-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Arena Dona Santa
          </h1>
          <p className="mt-2 text-gray-600 font-medium">
            Gestão Inteligente de Quadras Esportivas
          </p>
        </div>

        {/* Card Principal */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 shadow-lg rounded-xl border border-gray-200 sm:px-12">
            {children}
          </div>

          {/* Link para Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium text-sm"
            >
              ← Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
