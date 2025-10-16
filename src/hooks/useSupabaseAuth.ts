/**
 * Hook para usar autenticação Supabase
 * Wrapper do useSupabaseAuth do context
 */

import { useSupabaseAuth as useSupabaseAuthContext } from '../contexts/SupabaseAuthContext';

export function useSupabaseAuth() {
  return useSupabaseAuthContext();
}

/**
 * Hook para verificar se usuário está autenticado
 */
export function useIsAuthenticated() {
  const { isAuthenticated, isLoading } = useSupabaseAuthContext();
  return { isAuthenticated, isLoading };
}

/**
 * Hook para obter usuário atual
 */
export function useCurrentUser() {
  const { user, isLoading } = useSupabaseAuthContext();
  return { user, isLoading };
}

/**
 * Hook para fazer login
 */
export function useSignIn() {
  const { signIn, isLoading, error } = useSupabaseAuthContext();
  return { signIn, isLoading, error };
}

/**
 * Hook para fazer registro
 */
export function useSignUp() {
  const { signUp, isLoading, error } = useSupabaseAuthContext();
  return { signUp, isLoading, error };
}

/**
 * Hook para fazer logout
 */
export function useSignOut() {
  const { signOut, isLoading } = useSupabaseAuthContext();
  return { signOut, isLoading };
}

/**
 * Hook para atualizar perfil
 */
export function useUpdateProfile() {
  const { updateProfile, isLoading, error } = useSupabaseAuthContext();
  return { updateProfile, isLoading, error };
}

