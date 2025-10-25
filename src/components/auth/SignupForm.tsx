'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  Lock, 
  Loader2,
  Gift 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signupSchema, type SignupFormData } from '@/lib/validations/auth.schema';
import { InputCEP } from '@/components/shared/forms/InputCEP';
import { useCEP } from '@/hooks/useCEP';
import { formatCEP } from '@/lib/utils/cep';
import { formatPhone } from '@/lib/utils/phone';
import { formatCPF } from '@/lib/utils/cpf';

interface SignupFormProps {
  onSubmit: (data: SignupFormData & { codigoIndicacao?: string }) => Promise<void>;
  loading?: boolean;
  codigoIndicacaoInicial?: string;
}

export function SignupForm({ onSubmit, loading = false, codigoIndicacaoInicial }: SignupFormProps) {
  const { loading: loadingCEP, error: cepError, fetchAddress, clearError } = useCEP();
  const [cepSuccess, setCepSuccess] = useState(false);
  const [codigoIndicacao, setCodigoIndicacao] = useState(codigoIndicacaoInicial || '');

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

  // Atualizar código de indicação quando prop mudar
  useEffect(() => {
    if (codigoIndicacaoInicial) {
      setCodigoIndicacao(codigoIndicacaoInicial);
    }
  }, [codigoIndicacaoInicial]);

  const handleCEPChange = async (cep: string) => {
    if (cep.length === 8) {
      clearError();
      setCepSuccess(false);
      
      const address = await fetchAddress(cep);
      
      if (address) {
        form.setValue('logradouro', address.logradouro || '');
        form.setValue('bairro', address.bairro || '');
        form.setValue('cidade', address.cidade || '');
        form.setValue('estado', address.estado || '');
        setCepSuccess(true);
      }
    }
  };

  const handleFormSubmit = (data: SignupFormData) => {
    return onSubmit({ ...data, codigoIndicacao: codigoIndicacao || undefined });
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
      {/* Dados Pessoais */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-2">
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

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              value={formatCPF(form.watch('cpf') || '')}
              onChange={(e) => {
                const numbers = e.target.value.replace(/\D/g, '');
                form.setValue('cpf', numbers);
              }}
              placeholder="000.000.000-00"
              maxLength={14}
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
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-2">
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
            value={formatPhone(form.watch('whatsapp') || '')}
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, '');
              form.setValue('whatsapp', numbers);
            }}
            placeholder="(33) 99999-9999"
            maxLength={15}
          />
          {form.formState.errors.whatsapp && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.whatsapp.message}
            </p>
          )}
        </div>
      </div>

      {/* Endereço */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4" />
          Endereço
        </h3>

        <div>
          <Label htmlFor="cep">CEP *</Label>
          <InputCEP
            id="cep"
            value={formatCEP(form.watch('cep') || '')}
            onChange={(value) => {
              const numbers = value.replace(/\D/g, '');
              form.setValue('cep', numbers);
              clearError();
              setCepSuccess(false);
            }}
            onCEPChange={handleCEPChange}
            loading={loadingCEP}
            error={!!cepError}
            success={cepSuccess}
          />
          {form.formState.errors.cep && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.cep.message}
            </p>
          )}
          {cepError && (
            <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {cepError}
            </p>
          )}
          {cepSuccess && (
            <p className="text-sm text-green-600 mt-1">
              Endereço encontrado! Verifique os dados abaixo.
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
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
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              {...form.register('complemento')}
              placeholder="Apto, Bloco, etc"
            />
          </div>

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
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
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
      </div>

      {/* Código de Indicação */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-2">
          <Gift className="w-4 h-4" />
          Código de Indicação (Opcional)
        </h3>

        <div>
          <Label htmlFor="codigoIndicacao">Código de Indicação</Label>
          <Input
            id="codigoIndicacao"
            value={codigoIndicacao}
            onChange={(e) => setCodigoIndicacao(e.target.value.toUpperCase())}
            placeholder="Digite o código aqui"
            className="font-mono text-center"
            maxLength={20}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Tem um código de indicação? Use aqui e ganhe créditos!
          </p>
        </div>
      </div>

      {/* Senha */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-2">
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