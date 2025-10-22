import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    }
  );
}

/**
 * Limpa completamente a sessão do Supabase
 * Útil para resolver problemas de "Invalid Refresh Token"
 */
export async function clearSupabaseSession() {
  const supabase = createClient();

  // 1. Fazer logout (remove tokens do servidor)
  await supabase.auth.signOut();

  // 2. Limpar localStorage
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });
  }

  return true;
}
