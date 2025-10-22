"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: string | string[];
  fallback?: React.ReactNode;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallback 
}: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      
      if (!response.ok) {
        router.push('/auth');
        return;
      }

      const data = await response.json();
      setUser(data.user);
      
      // Verificar autorização
      const isAuthorized = checkAuthorization(data.user);
      setAuthorized(isAuthorized);
      
      if (!isAuthorized) {
        // Redirecionar para dashboard apropriado
        if (data.user.role === 'gestor' || data.user.role === 'admin') {
          router.push('/gestor');
        } else {
          router.push('/cliente');
        }
      }
      
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const checkAuthorization = (user: User): boolean => {
    // Verificar role se especificado
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(user.role)) {
        return false;
      }
    }

    // Verificar permissão se especificada
    if (requiredPermission) {
      const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
      
      // Admin tem todas as permissões
      if (user.permissions.includes('*')) {
        return true;
      }
      
      // Verificar se tem pelo menos uma das permissões necessárias
      const hasPermission = permissions.some(permission => 
        user.permissions.includes(permission)
      );
      
      if (!hasPermission) {
        return false;
      }
    }

    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Acesso Negado</p>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}