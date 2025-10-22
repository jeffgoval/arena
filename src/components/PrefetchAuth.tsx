"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Componente que faz prefetch das rotas de autenticação
 * para navegação instantânea
 */
export function PrefetchAuth() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch da rota de auth assim que a página carregar
    router.prefetch("/auth");
  }, [router]);

  return null;
}
