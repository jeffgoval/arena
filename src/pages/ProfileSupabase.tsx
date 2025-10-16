/**
 * Página de Perfil com Supabase Auth
 * Exibe e edita dados do usuário autenticado
 */

import React, { useState } from 'react';
import { useSupabaseAuth, useSignOut } from '../hooks/useSupabaseAuth';

export function ProfileSupabase() {
  const { user, isLoading, updateProfile } = useSupabaseAuth();
  const { signOut } = useSignOut();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    address: user?.address || '',
  });

  if (isLoading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Você não está autenticado</p>
        <a href="#login" className="text-blue-600 hover:underline">
          Fazer login
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Informações do Usuário */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Tipo de Conta</label>
            <p className="text-lg font-medium capitalize">{user.role}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Créditos</label>
            <p className="text-lg font-medium">R$ {user.credits?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <p className="text-lg font-medium capitalize">{user.status}</p>
          </div>
        </div>

        {/* Formulário de Edição */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Nome</label>
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Telefone</label>
              <p className="text-lg">{user.phone || 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Bio</label>
              <p className="text-lg">{user.bio || 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Endereço</label>
              <p className="text-lg">{user.address || 'Não informado'}</p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4"
            >
              Editar Perfil
            </button>
          </div>
        )}

        {/* Informações de Conta */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold mb-4">Informações de Conta</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>ID: {user.id}</p>
            <p>Criado em: {user.createdAt?.toLocaleDateString('pt-BR')}</p>
            <p>Status: {user.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

