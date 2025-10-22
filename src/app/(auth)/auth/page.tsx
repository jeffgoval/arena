'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';

type TabType = 'cliente' | 'gestor';
type ModeType = 'login' | 'cadastro';

export default function AuthPage() {
  const [tab, setTab] = useState<TabType>('cliente');
  const [mode, setMode] = useState<ModeType>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Cadastro
  const [signupData, setSignupData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    password: '',
  });

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword(loginData);

      if (authError) throw authError;

      // Buscar role
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      // Redirecionar baseado no role
      if (profile?.role === 'gestor') {
        router.push('/gestor');
      } else {
        router.push('/cliente');
      }
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      // Criar usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
      });

      if (authError) throw authError;

      // Criar perfil
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            nome: signupData.nome,
            email: signupData.email,
            whatsapp: signupData.whatsapp,
            role: tab, // cliente ou gestor
          });

        if (profileError) throw profileError;
      }

      // Redirecionar
      router.push(tab === 'gestor' ? '/gestor' : '/cliente');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs Cliente/Gestor */}
      <div className="flex gap-2 p-1 bg-gray rounded-lg">
        <button
          onClick={() => setTab('cliente')}
          className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-sm transition-all ${
            tab === 'cliente'
              ? 'bg-white text-dark shadow-sm'
              : 'text-dark/60 hover:text-dark'
          }`}
        >
          👤 Cliente
        </button>
        <button
          onClick={() => setTab('gestor')}
          className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-sm transition-all ${
            tab === 'gestor'
              ? 'bg-white text-dark shadow-sm'
              : 'text-dark/60 hover:text-dark'
          }`}
        >
          🏢 Gestor
        </button>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-dark">
          {mode === 'login' ? 'Entrar' : 'Criar Conta'}
        </h2>
        <p className="text-dark/60 mt-2">
          {mode === 'login'
            ? `Acesse como ${tab === 'cliente' ? 'cliente' : 'gestor'}`
            : `Cadastre-se como ${tab === 'cliente' ? 'cliente' : 'gestor'}`}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* LOGIN FORM */}
      {mode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? 'Entrando...' : (
              <>
                <span>Entrar</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}

      {/* CADASTRO FORM */}
      {mode === 'cadastro' && (
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
              <input
                type="text"
                value={signupData.nome}
                onChange={(e) => setSignupData({ ...signupData, nome: e.target.value })}
                required
                placeholder="João Silva"
                className="w-full pl-10 pr-4 py-3 border border-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
              <input
                type="tel"
                value={signupData.whatsapp}
                onChange={(e) => setSignupData({ ...signupData, whatsapp: e.target.value })}
                required
                placeholder="(33) 9 9999-9999"
                className="w-full pl-10 pr-4 py-3 border border-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
              <input
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-4 py-3 border border-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? 'Criando...' : (
              <>
                <span>Criar Conta</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Toggle Login/Cadastro */}
      <div className="text-center">
        <button
          onClick={() => setMode(mode === 'login' ? 'cadastro' : 'login')}
          className="text-sm text-primary hover:text-primary/80 font-semibold"
        >
          {mode === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
        </button>
      </div>
    </div>
  );
}
