"use client";

import { useEffect, useState } from 'react';
import type { UserRole } from '@/lib/auth';

interface PermissionGateProps {
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

export function PermissionGate({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallback = null
}: PermissionGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = (): boolean => {
    if (!user) return false;

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
    return null; // Não mostrar nada enquanto carrega
  }

  if (!hasAccess()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}