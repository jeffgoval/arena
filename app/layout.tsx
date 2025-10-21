import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/lib/react-query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Arena Dona Santa - Gestão Completa de Arena Esportiva',
  description: 'Plataforma completa para gestão de arena esportiva. Reserve quadras, gerencie turmas, convites e rateio de custos.',
  keywords: ['futebol', 'pelada', 'quadra', 'eventos esportivos', 'arena', 'organizador', 'gestão esportiva'],
  openGraph: {
    title: 'Arena Dona Santa',
    description: 'Sistema completo de gestão de arena esportiva',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
