import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arena Dona Santa - Gestão Inteligente de Quadras Esportivas",
  description: "Organize seus jogos, gerencie suas turmas e divida custos de forma inteligente. A plataforma completa para reservar quadras esportivas.",
  keywords: ["arena esportiva", "reserva de quadras", "gestão de jogos", "rateio", "turmas"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
