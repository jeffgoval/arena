'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateIndicacao } from '@/hooks/core/useIndicacoes';
import { INDICACOES_CONFIG, INDICACOES_MENSAGENS, INDICACOES_TEXTOS } from '@/constants/indicacoes';

export function FormIndicacao() {
  const [emailIndicado, setEmailIndicado] = useState('');
  const [nomeIndicado, setNomeIndicado] = useState('');
  const createIndicacao = useCreateIndicacao();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailIndicado.trim()) {
      toast({
        title: "Erro",
        description: INDICACOES_MENSAGENS.ERRO_EMAIL_OBRIGATORIO,
        variant: "destructive",
      });
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailIndicado)) {
      toast({
        title: "Erro",
        description: INDICACOES_MENSAGENS.ERRO_EMAIL_INVALIDO,
        variant: "destructive",
      });
      return;
    }

    try {
      await createIndicacao.mutateAsync({
        emailIndicado: emailIndicado.trim(),
        nomeIndicado: nomeIndicado.trim() || undefined,
      });
      
      // Limpar formulário após sucesso
      setEmailIndicado('');
      setNomeIndicado('');
    } catch (error) {
      // Error handling é feito pelo hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Indicar Amigo
        </CardTitle>
        <CardDescription>
          Indique um amigo e ganhe créditos quando ele se cadastrar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email do amigo *</Label>
            <Input
              id="email"
              type="email"
              placeholder="amigo@exemplo.com"
              value={emailIndicado}
              onChange={(e) => setEmailIndicado(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome do amigo (opcional)</Label>
            <Input
              id="nome"
              type="text"
              placeholder="Nome do seu amigo"
              value={nomeIndicado}
              onChange={(e) => setNomeIndicado(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={createIndicacao.isPending}>
            {createIndicacao.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando indicação...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Indicar Amigo
              </>
            )}
          </Button>
        </form>

        {/* Prévia da Mensagem */}
        {emailIndicado && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-2">
              📧 Prévia do convite que será enviado:
            </p>
            <div className="text-xs text-blue-700 dark:text-blue-300 bg-white dark:bg-blue-900 p-2 rounded border">
              <p className="font-medium">Assunto: {INDICACOES_TEXTOS.PREVIEW_EMAIL.assunto}</p>
              <br />
              <p>{INDICACOES_TEXTOS.PREVIEW_EMAIL.saudacao(nomeIndicado || undefined)}</p>
              <br />
              <p>{INDICACOES_TEXTOS.PREVIEW_EMAIL.corpo}</p>
              <br />
              <p><strong>{INDICACOES_TEXTOS.PREVIEW_EMAIL.beneficio}</strong></p>
              <br />
              <p>👉 <strong>{INDICACOES_TEXTOS.PREVIEW_EMAIL.cta}</strong><br />
              {INDICACOES_CONFIG.APP_URL}{INDICACOES_CONFIG.CADASTRO_PATH}</p>
              <br />
              <p>{INDICACOES_TEXTOS.PREVIEW_EMAIL.despedida}</p>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          <p className="font-medium mb-1">💡 Como funciona:</p>
          <ul className="space-y-1 text-xs">
            {INDICACOES_TEXTOS.COMO_FUNCIONA.map((texto, index) => (
              <li key={index}>• {texto}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}