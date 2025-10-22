'use client';

import { useUser } from '@/hooks/auth/useUser';
import { usePermissions } from '@/hooks/auth/usePermissions';
import Link from 'next/link';
import { Calendar, Users, Trophy, CreditCard, Crown } from 'lucide-react';

export default function ClienteDashboard() {
  const { data: user, isLoading } = useUser();
  const { role, isAdmin, isGestor } = usePermissions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-dark/70 font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Olá, {user?.profile?.nome_completo?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Bem-vindo de volta ao seu dashboard. Pronto para jogar?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card de Créditos */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                Saldo
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              R$ {user?.profile?.saldo_creditos?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-600">Créditos disponíveis</p>
          </div>

          {/* Card de Perfil */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              {role && (
                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full uppercase">
                  {role}
                </span>
              )}
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1">{user?.profile?.email}</p>
            <p className="text-sm text-gray-600">CPF: {user?.profile?.cpf}</p>
          </div>

          {/* Card de Status */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                ATIVO
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1">Conta Ativa</p>
            <p className="text-sm text-gray-600">Tudo funcionando perfeitamente!</p>
          </div>
        </div>

        {/* Admin/Gestor Alert */}
        {(isAdmin() || isGestor()) && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  Acesso Especial: {role?.toUpperCase()}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Você possui permissões especiais nesta plataforma.
                </p>
                {isGestor() && (
                  <Link href="/gestor">
                    <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                      Acessar Painel do Gestor →
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Ações Rápidas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="group bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-primary p-6 rounded-lg transition-all text-left">
              <Calendar className="w-8 h-8 mb-3 text-primary" />
              <h4 className="font-semibold text-base mb-1 text-gray-900">Nova Reserva</h4>
              <p className="text-sm text-gray-600">Reserve uma quadra agora</p>
            </button>

            <button className="group bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-primary p-6 rounded-lg transition-all text-left">
              <Users className="w-8 h-8 mb-3 text-primary" />
              <h4 className="font-semibold text-base mb-1 text-gray-900">Minhas Turmas</h4>
              <p className="text-sm text-gray-600">Gerencie seus grupos</p>
            </button>

            <button className="group bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-primary p-6 rounded-lg transition-all text-left">
              <Trophy className="w-8 h-8 mb-3 text-primary" />
              <h4 className="font-semibold text-base mb-1 text-gray-900">Meus Jogos</h4>
              <p className="text-sm text-gray-600">Histórico de partidas</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
