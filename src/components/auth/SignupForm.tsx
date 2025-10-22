'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  Lock, 
  Loader2 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signupSchema, type SignupFormData } from '@/lib/validations/auth.schema';

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  loading?: boolean;
}

export function SignupForm({ onSubmit, loading = false }: SignupFormProps) {
  const [loadingCEP, setLoadingCEP] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nome_completo: '',
      cpf: '',
      rg: '',
      data_nascimento: '',
      email: '',
      whatsapp: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleCEPChange = async (cep: string) => {
    if (cep.length === 8) {
      setLoadingCEP(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          form.setValue('logradouro', data.logradouro || '');
          form.setValue('bairro', data.bairro || '');
          form.setValue('cidade', data.localidade || '');
          form.setValue('estado', data.uf || '');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setLoadingCEP(false);
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Dados Pessoais */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          <User className="w-4 h-4" />
          Dados Pessoais
        </h3>

        <div>
          <Label htmlFor="nome_completo">Nome Completo *</Label>
          <Input
            id="nome_completo"
            {...form.register('nome_completo')}
            placeholder="João da Silva"
          />
          {form.formState.errors.nome_completo && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.nome_completo.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              {...form.register('cpf')}
              placeholder="000.000.000-00"
            />
            {form.formState.errors.cpf && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.cpf.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="rg">RG</Label>
            <Input
              id="rg"
              {...form.register('rg')}
              placeholder="MG-00.000.000"
            />
            {form.formState.errors.rg && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.rg.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="data_nascimento">
            <Calendar className="inline w-4 h-4 mr-2" />
            Data de Nascimento *
          </Label>
          <Input
            id="data_nascimento"
            type="date"
            {...form.register('data_nascimento')}
          />
          {form.formState.errors.data_nascimento && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.data_nascimento.message}
            </p>
          )}
        </div>
      </div>

      {/* Contato */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Contato
        </h3>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="seu@email.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="whatsapp">WhatsApp *</Label>
          <Input
            id="whatsapp"
            {...form.register('whatsapp')}
            placeholder="(33) 99999-9999"
          />
          {form.formState.errors.whatsapp && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.whatsapp.message}
            </p>
          )}
        </div>
      </div>

      {/* Endereço */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Endereço
        </h3>

        <div>
          <Label htmlFor="cep">CEP *</Label>
          <div className="relative">
            <Input
              id="cep"
              {...form.register('cep')}
              placeholder="00000-000"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                form.setValue('cep', value);
                if (value.length === 8) {
                  handleCEPChange(value);
                }
              }}
            />
            {loadingCEP && (
              <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-primary" />
            )}
          </div>
          {form.formState.errors.cep && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.cep.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="logradouro">Logradouro *</Label>
          <Input
            id="logradouro"
            {...form.register('logradouro')}
            placeholder="Rua, Avenida, etc"
          />
          {form.formState.errors.logradouro && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.logradouro.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="numero">Número *</Label>
            <Input
              id="numero"
              {...form.register('numero')}
              placeholder="123"
            />
            {form.formState.errors.numero && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.numero.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              {...form.register('complemento')}
              placeholder="Apto, Bloco, etc"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="bairro">Bairro *</Label>
            <Input
              id="bairro"
              {...form.register('bairro')}
              placeholder="Centro"
            />
            {form.formState.errors.bairro && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.bairro.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="cidade">Cidade *</Label>
            <Input
              id="cidade"
              {...form.register('cidade')}
              placeholder="Governador Valadares"
            />
            {form.formState.errors.cidade && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.cidade.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="estado">Estado *</Label>
          <Input
            id="estado"
            {...form.register('estado')}
            placeholder="MG"
            maxLength={2}
          />
          {form.formState.errors.estado && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.estado.message}
            </p>
          )}
        </div>
      </div>

      {/* Senha */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Segurança
        </h3>

        <div>
          <Label htmlFor="password">Senha *</Label>
          <Input
            id="password"
            type="password"
            {...form.register('password')}
            placeholder="Mínimo 6 caracteres"
          />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...form.register('confirmPassword')}
            placeholder="Repita a senha"
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
            Criando conta...
          </>
        ) : (
          'Criar Conta'
        )}
      </Button>
    </form>
  );
}