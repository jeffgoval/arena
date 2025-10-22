'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputCPF } from '@/components/shared/forms/InputCPF';
import { InputCEP } from '@/components/shared/forms/InputCEP';
import { InputWhatsApp } from '@/components/shared/forms/InputWhatsApp';
import { useToast } from '@/hooks/use-toast';

import { cadastroSchema, type CadastroFormData } from '@/lib/validations/user.schema';
import { fetchAddressByCEP } from '@/lib/utils/cep';
import { unformatCPF } from '@/lib/utils/cpf';
import { unformatPhone } from '@/lib/utils/phone';

export const dynamic = 'force-dynamic';

export default function CadastroPage() {
  const [loading, setLoading] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
  });

  const cpf = watch('cpf') || '';
  const cep = watch('cep') || '';
  const whatsapp = watch('whatsapp') || '';

  const handleCEPComplete = async (cepValue: string) => {
    setLoadingCEP(true);
    try {
      const address = await fetchAddressByCEP(cepValue);
      if (address) {
        setValue('logradouro', address.logradouro);
        setValue('bairro', address.bairro);
        setValue('cidade', address.localidade);
        setValue('estado', address.uf);
        toast({
          title: 'CEP encontrado!',
          description: 'Endereço preenchido automaticamente.',
        });
      } else {
        toast({
          title: 'CEP não encontrado',
          description: 'Preencha o endereço manualmente.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao buscar CEP',
        description: 'Tente novamente ou preencha manualmente.',
        variant: 'destructive',
      });
    } finally {
      setLoadingCEP(false);
    }
  };

  const onSubmit = async (data: CadastroFormData) => {
    setLoading(true);

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nome_completo: data.nome_completo,
            role: 'cliente',
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // 2. Atualizar perfil completo
      const { error: profileError } = await supabase
        .from('users')
        .update({
          cpf: unformatCPF(data.cpf),
          rg: data.rg || null,
          data_nascimento: data.data_nascimento,
          whatsapp: unformatPhone(data.whatsapp),
          cep: data.cep || null,
          logradouro: data.logradouro || null,
          numero: data.numero || null,
          complemento: data.complemento || null,
          bairro: data.bairro || null,
          cidade: data.cidade || null,
          estado: data.estado || null,
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Bem-vindo à Arena Dona Santa.',
      });

      // Redirecionar para dashboard
      router.push('/cliente');
    } catch (err: any) {
      console.error('Signup error:', err);
      toast({
        title: 'Erro ao criar conta',
        description: err.message || 'Tente novamente.',
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent to-secondary mb-4">
          <span className="text-3xl">🎯</span>
        </div>
        <h2 className="text-3xl font-black text-dark mb-2">
          Crie sua Conta
        </h2>
        <p className="text-dark/60">
          Junte-se à melhor arena de Governador Valadares!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome Completo */}
        <div>
          <Label htmlFor="nome_completo">Nome Completo *</Label>
          <Input
            id="nome_completo"
            {...register('nome_completo')}
            placeholder="João da Silva"
          />
          {errors.nome_completo && (
            <p className="text-sm text-red-600 mt-1">{errors.nome_completo.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* CPF */}
        <div>
          <Label htmlFor="cpf">CPF *</Label>
          <InputCPF
            id="cpf"
            value={cpf}
            onChange={(value) => setValue('cpf', value)}
          />
          {errors.cpf && (
            <p className="text-sm text-red-600 mt-1">{errors.cpf.message}</p>
          )}
        </div>

        {/* RG */}
        <div>
          <Label htmlFor="rg">RG</Label>
          <Input
            id="rg"
            {...register('rg')}
            placeholder="00.000.000-0"
            maxLength={20}
          />
          {errors.rg && (
            <p className="text-sm text-red-600 mt-1">{errors.rg.message}</p>
          )}
        </div>

        {/* Data de Nascimento */}
        <div>
          <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
          <Input
            id="data_nascimento"
            type="date"
            {...register('data_nascimento')}
          />
          {errors.data_nascimento && (
            <p className="text-sm text-red-600 mt-1">{errors.data_nascimento.message}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <Label htmlFor="whatsapp">WhatsApp *</Label>
          <InputWhatsApp
            id="whatsapp"
            value={whatsapp}
            onChange={(value) => setValue('whatsapp', value)}
          />
          {errors.whatsapp && (
            <p className="text-sm text-red-600 mt-1">{errors.whatsapp.message}</p>
          )}
        </div>

        {/* Seção de Endereço */}
        <div className="bg-gray/30 rounded-xl p-5 border-2 border-gray/50">
          <h3 className="font-bold mb-4 text-dark flex items-center gap-2">
            <span className="text-lg">📍</span>
            Endereço (Opcional)
          </h3>

          {/* CEP */}
          <div className="mb-4">
            <Label htmlFor="cep">CEP</Label>
            <div className="flex gap-2">
              <InputCEP
                id="cep"
                value={cep}
                onChange={(value) => setValue('cep', value)}
                onCEPChange={handleCEPComplete}
              />
              {loadingCEP && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            </div>
            {errors.cep && (
              <p className="text-sm text-red-600 mt-1">{errors.cep.message}</p>
            )}
          </div>

          {/* Logradouro */}
          <div className="mb-4">
            <Label htmlFor="logradouro">Rua/Avenida</Label>
            <Input
              id="logradouro"
              {...register('logradouro')}
              placeholder="Rua das Flores"
            />
          </div>

          {/* Número e Complemento */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                {...register('numero')}
                placeholder="123"
              />
            </div>
            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                {...register('complemento')}
                placeholder="Apto 45"
              />
            </div>
          </div>

          {/* Bairro */}
          <div className="mb-4">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              {...register('bairro')}
              placeholder="Centro"
            />
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                {...register('cidade')}
                placeholder="Governador Valadares"
              />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                {...register('estado')}
                placeholder="MG"
                maxLength={2}
              />
            </div>
          </div>
        </div>

        {/* Seção de Senha */}
        <div className="bg-primary/5 rounded-xl p-5 border-2 border-primary/20">
          <h3 className="font-bold mb-4 text-dark flex items-center gap-2">
            <span className="text-lg">🔒</span>
            Defina sua Senha
          </h3>

          {/* Senha */}
          <div className="mb-4">
            <Label htmlFor="password">Senha *</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div>
            <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Repita a senha"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Criando sua conta...
            </>
          ) : (
            <>
              <span className="mr-2">🎯</span>
              Criar Conta Gratuita
            </>
          )}
        </Button>
      </form>

      {/* Link para Login */}
      <div className="text-center pt-4 border-t border-gray/30">
        <p className="text-dark/70 mb-3">
          Já tem uma conta?
        </p>
        <Link href="/login">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-2 border-secondary text-secondary hover:bg-secondary/5 font-bold transition-all duration-300 hover:scale-[1.02]"
          >
            Fazer Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
