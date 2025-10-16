/**
 * Página de Login com Supabase Auth
 * Autenticação real com Supabase
 */

import React, { useState } from 'react';
import { useSignIn, useSignUp } from '../hooks/useSupabaseAuth';

export function LoginSupabase() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'client' | 'manager'>('client');

  const { signIn, isLoading: isSigningIn, error: signInError } = useSignIn();
  const { signUp, isLoading: isSigningUp, error: signUpError } = useSignUp();

  const isLoading = isSigningIn || isSigningUp;
  const error = signInError || signUpError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await signIn(email, password);
        window.location.hash = '#dashboard';
      } else {
        await signUp(email, password, name, role);
        window.location.hash = '#dashboard';
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Arena Dona Santa</h1>
        <p className="text-center text-gray-600 mb-8">
          {isLogin ? 'Faça login na sua conta' : 'Crie uma nova conta'}
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Nome (apenas para registro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role (apenas para registro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Conta
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'client' | 'manager')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="client">Jogador</option>
                <option value="manager">Gerenciador de Quadra</option>
              </select>
            </div>
          )}

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? 'Carregando...' : isLogin ? 'Entrar' : 'Registrar'}
          </button>
        </form>

        {/* Toggle entre login e registro */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-medium hover:underline"
            >
              {isLogin ? 'Registre-se' : 'Faça login'}
            </button>
          </p>
        </div>

        {/* Usuários de teste */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3 font-medium">Usuários de Teste:</p>
          <div className="space-y-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-medium">Cliente:</p>
              <p>Email: joao@email.com</p>
              <p>Senha: (qualquer senha)</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-medium">Gerenciador:</p>
              <p>Email: maria@arena.com</p>
              <p>Senha: (qualquer senha)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

