'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, clearSupabaseSession } from '@/lib/supabase/client';

/**
 * SessionGuard - Detecta e limpa sessões inválidas automaticamente
 *
 * Resolve o erro: "Invalid Refresh Token: Refresh Token Not Found"
 *
 * Uso: Adicione em layouts de autenticação ou root layout
 */
export function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Verificar sessão ao carregar
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          // Se houver erro de sessão, limpar tudo
          if (
            error.message?.includes('Invalid Refresh Token') ||
            error.message?.includes('Refresh Token Not Found') ||
            error.message?.includes('refresh_token_not_found')
          ) {
            console.warn('⚠️ Sessão inválida detectada. Limpando...');
            await clearSupabaseSession();
            router.push('/auth');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      }
    };

    checkSession();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        // Limpar completamente ao fazer logout
        await clearSupabaseSession();
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('✅ Token atualizado com sucesso');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null; // Componente invisível
}
