'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Buscar role do usuário para redirecionar corretamente
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta.',
      });

      // Redirecionar baseado no role
      if (profile?.role === 'admin') {
        router.push('/admin');
      } else if (profile?.role === 'gestor') {
        router.push('/gestor');
      } else {
        router.push('/cliente');
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao fazer login',
        description: err.message || 'Verifique suas credenciais.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-dark mb-2">
          Bem-vindo de Volta!
        </h2>
        <p className="text-dark/60">
          Acesse sua conta para continuar
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-dark font-semibold">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="pl-10 h-12 border-2 border-gray/50 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-dark font-semibold">
            Senha
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="pl-10 h-12 border-2 border-gray/50 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/recuperar-senha"
            className="text-sm font-medium text-primary hover:text-secondary transition-colors"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Entrando...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" />
              Entrar
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray/30"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-dark/60 font-medium">
            Novo por aqui?
          </span>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-dark/70 mb-4">
          Crie sua conta e comece a jogar!
        </p>
        <Link href="/cadastro">
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-2 border-primary text-primary hover:bg-primary/5 font-bold text-lg transition-all duration-300 hover:scale-[1.02]"
          >
            Criar Conta Gratuita
          </Button>
        </Link>
      </div>
    </div>
  );
}
