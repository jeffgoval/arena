'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIndicacoes } from '@/hooks/useIndicacoes';

export function FormIndicacao() {
  const [emailIndicado, setEmailIndicado] = useState('');
  const [nomeIndicado, setNomeIndicado] = useState('');
  const [loading, setLoading] = useState(false);
  const { criarIndicacao } = useIndicacoes();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailIndicado.trim()) {
      toast({
        title: "Erro",
        description: "Email é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailIndicado)) {
      toast({
        title: "Erro",
        description: "Email inválido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const resultado = await criarIndicacao(emailIndicado.trim(), nomeIndicado.trim() || undefined);
      
      if (resultado.success) {
        toast({
          title: "Sucesso!",
          description: "Indicação criada com sucesso!",
        });
        setEmailIndicado('');
        setNomeIndicado('');
      } else {
        toast({
          title: "Erro",
          description: resultado.error || 'Erro ao criar indicação',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar indicação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
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
              <p className="font-medium">Assunto: Convite para Arena Dona Santa 🏓</p>
              <br />
              <p>Olá{nomeIndicado ? ` ${nomeIndicado}` : ''}!</p>
              <br />
              <p>Você foi indicado(a) para se cadastrar na Arena Dona Santa, a melhor plataforma para reservar quadras esportivas!</p>
              <br />
              <p>🎁 <strong>Benefício especial:</strong> Ao se cadastrar, você ganha créditos para usar em suas reservas!</p>
              <br />
              <p>👉 <strong>Clique aqui para se cadastrar:</strong><br />
              {window.location?.origin}/auth/cadastro</p>
              <br />
              <p>Vamos jogar juntos! 🏓</p>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          <p className="font-medium mb-1">💡 Como funciona:</p>
          <ul className="space-y-1 text-xs">
            <li>• Seu amigo receberá um convite por email com link especial</li>
            <li>• Quando ele se cadastrar, você ganha 50 créditos</li>
            <li>• Ele também ganha créditos de boas-vindas</li>
            <li>• Os créditos valem R$ 1,00 cada para usar em reservas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}