'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Loader2 } from 'lucide-react';

import { loginSchema } from '@/lib/validations/auth.schema';
import type { LoginFormData } from '@/lib/validations/auth.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onForgotPassword: () => void;
  loading: boolean;
}

export function LoginForm({ onSubmit, onForgotPassword, loading }: LoginFormProps) {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="identifier">
          <Mail className="inline w-4 h-4 mr-2" />
          Email ou CPF
        </Label>
        <Input
          id="identifier"
          {...form.register('identifier')}
          placeholder="seu@email.com ou 000.000.000-00"
        />
        {form.formState.errors.identifier && (
          <p className="text-sm text-red-600 mt-1">
            {form.formState.errors.identifier.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password">
          <Lock className="inline w-4 h-4 mr-2" />
          Senha
        </Label>
        <Input
          id="password"
          type="password"
          {...form.register('password')}
          placeholder="••••••"
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-600 mt-1">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onForgotPassword}
        className="text-sm text-primary hover:underline"
      >
        Esqueceu sua senha?
      </button>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="inline w-5 h-5 mr-2 animate-spin" />
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  );
}