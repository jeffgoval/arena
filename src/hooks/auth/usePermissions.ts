'use client';

import { useUser } from './useUser';

export const PERMISSIONS = {
  admin: {
    canAccessAll: true,
    canManageUsers: true,
    canViewLogs: true,
    canManageCourts: true,
    canViewAllReservations: true,
    canManageSettings: true,
    canAccessAdminPanel: true,
  },
  gestor: {
    canAccessAll: false,
    canManageUsers: false,
    canViewLogs: false,
    canManageCourts: true,
    canViewAllReservations: true,
    canManageSettings: true,
    canViewReports: true,
    canBlockSchedules: true,
    canManageFinancial: true,
  },
  cliente: {
    canAccessAll: false,
    canCreateReservations: true,
    canManageOwnTeams: true,
    canCreateInvitations: true,
    canAcceptInvitations: true,
    canBuyCredits: true,
    canViewOwnHistory: true,
    canViewOwnReservations: true,
    canViewOwnGames: true,
  },
} as const;

export function usePermissions() {
  const { data: user, isLoading } = useUser();

  const role = user?.profile?.role ?? 'cliente';
  const permissions = PERMISSIONS[role];

  const can = (permission: string): boolean => {
    return permissions[permission as keyof typeof permissions] === true;
  };

  const isAdmin = () => role === 'admin';
  const isGestor = () => role === 'gestor';
  const isCliente = () => role === 'cliente';
  const isGestorOrAdmin = () => role === 'gestor' || role === 'admin';

  return {
    role,
    permissions,
    can,
    isAdmin,
    isGestor,
    isCliente,
    isGestorOrAdmin,
    isLoading,
  };
}
