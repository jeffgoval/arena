import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Arena Dona Santa - Gestão Inteligente de Quadras Esportivas",
  description: "Organize seus jogos, gerencie suas turmas e divida custos de forma inteligente. A plataforma completa para reservar quadras esportivas.",
  keywords: ["arena esportiva", "reserva de quadras", "gestão de jogos", "rateio", "turmas"],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
