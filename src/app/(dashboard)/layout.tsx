'use client';

import { useUser } from '@/hooks/auth/useUser';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, LayoutDashboard, Users, Calendar, Settings, LogOut, Building2, Home, Trophy, CreditCard, Crown } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-dark/70 font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  const isGestor = user?.profile?.role === 'gestor' || user?.profile?.role === 'admin';

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray via-white to-gray/50 flex">
      {/* Sidebar Profissional */}
      <aside className="w-72 bg-white shadow-2xl flex flex-col border-r border-gray-200">
        {/* Header do Sidebar com Logo */}
        <div className="p-6 bg-primary border-b border-primary-dark">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-md group-hover:scale-105 transition-transform">
              <Image
                src="/logo-arena.png"
                alt="Arena Dona Santa"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">
                Arena Dona Santa
              </h1>
              <p className="text-xs text-white/90 font-medium">Painel de Controle</p>
            </div>
          </Link>
        </div>

        {/* Perfil do Usuário */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {user?.profile?.nome_completo?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate text-sm">
                {user?.profile?.nome_completo?.split(' ').slice(0, 2).join(' ')}
              </p>
              <p className="text-xs text-gray-600 truncate">{user?.profile?.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
              {user?.profile?.role === 'gestor' || user?.profile?.role === 'admin' ? (
                <><Crown className="w-3 h-3" /> {user?.profile?.role?.toUpperCase()}</>
              ) : (
                user?.profile?.role?.toUpperCase()
              )}
            </span>
            <span className="text-xs font-semibold text-gray-700">
              R$ {user?.profile?.saldo_creditos?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <Link
              href="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                pathname === '/'
                  ? 'bg-gray text-dark shadow-md'
                  : 'text-dark/70 hover:bg-gray/50 hover:text-dark'
              }`}
            >
              <Home className={`h-5 w-5 ${pathname === '/' ? 'text-primary' : 'group-hover:text-primary'}`} />
              <span className="font-semibold">Início</span>
            </Link>

            <Link
              href="/cliente"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive('/cliente')
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className={`h-5 w-5 ${isActive('/cliente') ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              href="/cliente/reservas"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive('/cliente/reservas')
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Calendar className={`h-5 w-5 ${isActive('/cliente/reservas') ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} />
              <span className="font-medium">Minhas Reservas</span>
            </Link>

            <Link
              href="/cliente/turmas"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive('/cliente/turmas')
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Users className={`h-5 w-5 ${isActive('/cliente/turmas') ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} />
              <span className="font-medium">Minhas Turmas</span>
            </Link>

            <Link
              href="/cliente/jogos"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive('/cliente/jogos')
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Trophy className={`h-5 w-5 ${isActive('/cliente/jogos') ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} />
              <span className="font-medium">Meus Jogos</span>
            </Link>

            <Link
              href="/cliente/creditos"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive('/cliente/creditos')
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <CreditCard className={`h-5 w-5 ${isActive('/cliente/creditos') ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} />
              <span className="font-medium">Meus Créditos</span>
            </Link>

            {isGestor && (
              <>
                <div className="pt-4 pb-2">
                  <div className="flex items-center gap-2 px-4 mb-2">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Área do Gestor</p>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                </div>

                <Link
                  href="/gestor/quadras"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    pathname?.startsWith('/gestor/quadras')
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-gray-900'
                  }`}
                >
                  <Building2 className={`h-5 w-5 ${pathname?.startsWith('/gestor/quadras') ? 'text-white' : 'text-gray-500 group-hover:text-amber-600'}`} />
                  <span className="font-medium">Quadras</span>
                </Link>

                <Link
                  href="/gestor/agenda"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive('/gestor/agenda')
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-gray-900'
                  }`}
                >
                  <Calendar className={`h-5 w-5 ${isActive('/gestor/agenda') ? 'text-white' : 'text-gray-500 group-hover:text-amber-600'}`} />
                  <span className="font-medium">Agenda</span>
                </Link>

                <Link
                  href="/gestor/clientes"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive('/gestor/clientes')
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-gray-900'
                  }`}
                >
                  <Users className={`h-5 w-5 ${isActive('/gestor/clientes') ? 'text-white' : 'text-gray-500 group-hover:text-amber-600'}`} />
                  <span className="font-medium">Clientes</span>
                </Link>

                <Link
                  href="/gestor/configuracoes"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive('/gestor/configuracoes')
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-gray-900'
                  }`}
                >
                  <Settings className={`h-5 w-5 ${isActive('/gestor/configuracoes') ? 'text-white' : 'text-gray-500 group-hover:text-amber-600'}`} />
                  <span className="font-medium">Configurações</span>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Footer com Logout */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors w-full font-medium shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
