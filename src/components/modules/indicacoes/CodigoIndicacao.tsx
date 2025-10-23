'use client';

import { useState } from 'react';
import { Copy, Share2, Check, MessageCircle, Link2, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { CodigoIndicacao } from '@/types/indicacoes.types';

interface CodigoIndicacaoProps {
  codigo: CodigoIndicacao;
}

export function CodigoIndicacao({ codigo }: CodigoIndicacaoProps) {
  const [copiado, setCopiado] = useState(false);
  const [linkCopiado, setLinkCopiado] = useState(false);
  const { toast } = useToast();

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(codigo.codigo);
      setCopiado(true);
      toast({
        title: "Código copiado! 📋",
        description: `Código ${codigo.codigo} copiado para a área de transferência!`,
      });
      
      setTimeout(() => {
        setCopiado(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao copiar código",
        variant: "destructive",
      });
    }
  };

  const copiarLink = async () => {
    const url = `${window.location.origin}/auth/cadastro?codigo=${codigo.codigo}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopiado(true);
      toast({
        title: "Link copiado! 🔗",
        description: "Link de cadastro com seu código foi copiado!",
      });
      
      setTimeout(() => {
        setLinkCopiado(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao copiar link",
        variant: "destructive",
      });
    }
  };

  const compartilharWhatsApp = () => {
    const texto = `🏓 *Arena Dona Santa* 🏓

Oi! Venha jogar na melhor arena esportiva da cidade!

Use meu código de indicação: *${codigo.codigo}*

✨ Você ganha créditos para suas reservas!
🎯 É só se cadastrar com meu código

Link direto: ${window.location.origin}/auth/cadastro?codigo=${codigo.codigo}

Vamos jogar juntos! 🏓`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(whatsappUrl, '_blank');
  };

  const compartilharGenerico = async () => {
    const texto = `🏓 Arena Dona Santa - Use meu código de indicação ${codigo.codigo} e ganhe créditos! 🎁`;
    const url = `${window.location.origin}/auth/cadastro?codigo=${codigo.codigo}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Arena Dona Santa - Código de Indicação',
          text: texto,
          url: url,
        });
      } catch (error) {
        // Fallback para copiar
        await navigator.clipboard.writeText(`${texto}\n\n${url}`);
        toast({
          title: "Conteúdo copiado! 📱",
          description: "Texto e link copiados para compartilhar!",
        });
      }
    } else {
      // Fallback para copiar
      await navigator.clipboard.writeText(`${texto}\n\n${url}`);
      toast({
        title: "Conteúdo copiado! 📱",
        description: "Texto e link copiados para compartilhar!",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Seu Código de Indicação
        </CardTitle>
        <CardDescription>
          Compartilhe seu código e ganhe créditos quando seus amigos se cadastrarem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Código de Indicação */}
        <div className="space-y-3">
          <Label htmlFor="codigo">Seu Código de Indicação</Label>
          <div className="flex gap-2">
            <Input
              id="codigo"
              value={codigo.codigo}
              readOnly
              className="font-mono text-2xl font-bold text-center bg-primary/5 border-primary/20"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copiarCodigo}
              className="shrink-0"
            >
              {copiado ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Compartilhe este código com seus amigos
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="font-bold text-2xl text-blue-600">{codigo.total_indicacoes}</div>
            <div className="text-sm text-blue-600/80">Indicações Feitas</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="font-bold text-2xl text-green-600">{codigo.total_creditos_recebidos}</div>
            <div className="text-sm text-green-600/80">Créditos Ganhos</div>
          </div>
        </div>

        {/* Opções de Compartilhamento */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Compartilhar com Amigos
          </h4>
          
          <div className="grid grid-cols-1 gap-2">
            {/* WhatsApp */}
            <Button 
              onClick={compartilharWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar por WhatsApp
            </Button>
            
            {/* Copiar Link */}
            <Button 
              variant="outline"
              onClick={copiarLink}
              className="w-full"
            >
              {linkCopiado ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Link Copiado!
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  Copiar Link de Cadastro
                </>
              )}
            </Button>
            
            {/* Compartilhar Genérico */}
            <Button 
              variant="outline"
              onClick={compartilharGenerico}
              className="w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Outras Opções
            </Button>
          </div>
        </div>

        {/* Dica */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            💡 <strong>Dica:</strong> Seus amigos ganham créditos ao se cadastrar com seu código, 
            e você também recebe créditos quando eles se cadastram!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}