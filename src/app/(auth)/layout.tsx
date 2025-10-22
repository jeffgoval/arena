'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          <Image
            src="/logo-arena.png"
            alt="Arena Dona Santa"
            width={48}
            height={48}
            className="group-hover:scale-110 transition-transform"
          />
          <div>
            <h1 className="text-xl font-bold text-dark">Arena Dona Santa</h1>
            <p className="text-xs text-dark/60">Governador Valadares</p>
          </div>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray/20">
          {children}
        </div>

        {/* Link Voltar */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mt-6 text-sm text-dark/60 hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o site
        </Link>
      </div>
    </div>
  );
}
