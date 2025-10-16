/**
 * Componente de Rota Protegida
 * Redireciona para login se não autenticado
 */

import React from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'manager';
}

export function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { user, isAuthenticated, isLoading } = useSupabaseAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.hash = '#login-supabase';
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">
            Você não tem permissão para acessar esta página.
          </p>
          <a href="#dashboard" className="text-blue-600 hover:underline">
            Voltar ao Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook para verificar se usuário está autenticado
 */
export function useRequireAuth(requiredRole?: 'client' | 'manager') {
  const { user, isAuthenticated, isLoading } = useSupabaseAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.hash = '#login-supabase';
    }
  }, [isAuthenticated, isLoading]);

  if (requiredRole && user?.role !== requiredRole) {
    window.location.hash = '#dashboard';
  }

  return { user, isAuthenticated, isLoading };
}

