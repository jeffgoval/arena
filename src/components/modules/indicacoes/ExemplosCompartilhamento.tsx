'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Mail, 
  Share2, 
  Copy, 
  Instagram, 
  Facebook,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ExemplosCompartilhamentoProps {
  codigo: string;
}

export function ExemplosCompartilhamento({ codigo }: ExemplosCompartilhamentoProps) {
  const [copiado, setCopiado] = useState<string | null>(null);
  const { toast } = useToast();

  if (!codigo) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Código de indicação não disponível</p>
        </CardContent>
      </Card>
    );
  }

  const copiarTexto = async (texto: string, tipo: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(tipo);
      toast({
        title: "Copiado! 📋",
        description: `Texto para ${tipo} copiado!`,
      });
      
      setTimeout(() => {
        setCopiado(null);
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao copiar texto",
        variant: "destructive",
      });
    }
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const exemplos = {
    whatsapp: `🏓 *Arena Dona Santa* 🏓

Oi! Descobri uma arena incrível para jogar tênis de mesa, beach tennis e muito mais!

🎁 *OFERTA ESPECIAL:* Use meu código *${codigo}* no cadastro e ganhe créditos grátis!

✨ Benefícios:
• Quadras modernas e bem equipadas
• Sistema fácil de reservas
• Créditos para desconto
• Comunidade ativa de jogadores

👉 Cadastre-se aqui: ${baseUrl}/auth/cadastro?codigo=${codigo}

Vamos jogar juntos! 🏓`,

    email: `Assunto: Convite especial - Arena Dona Santa 🏓

Olá!

Quero te convidar para conhecer a Arena Dona Santa, uma plataforma incrível para reservar quadras esportivas!

🎁 OFERTA ESPECIAL: Use meu código de indicação "${codigo}" no cadastro e ganhe créditos grátis para suas primeiras reservas!

Por que você vai amar:
✅ Quadras modernas e bem equipadas
✅ Sistema de reservas super fácil
✅ Preços justos e transparentes
✅ Comunidade ativa de esportistas
✅ Créditos de bônus para novos usuários

👉 Cadastre-se agora: ${baseUrl}/auth/cadastro?codigo=${codigo}

Mal posso esperar para jogar com você!

Abraços! 🏓`,

    instagram: `🏓 Descobri a melhor arena da cidade! 

Arena Dona Santa tem tudo:
✨ Quadras incríveis
✨ Sistema fácil de reservas  
✨ Preços justos

🎁 DICA: Use meu código ${codigo} no cadastro e ganhe créditos grátis!

Link na bio ou: ${baseUrl}/auth/cadastro?codigo=${codigo}

#ArenaDonaSanta #TenisDeMesa #BeachTennis #Esportes #${codigo}`,

    facebook: `🏓 Pessoal, descobri uma arena incrível aqui na cidade!

A Arena Dona Santa é perfeita para quem ama esportes:
• Quadras modernas de tênis de mesa e beach tennis
• Sistema online super fácil para reservar
• Preços justos e ambiente top
• Comunidade ativa de jogadores

🎁 BÔNUS ESPECIAL: Quem se cadastrar com meu código "${codigo}" ganha créditos grátis para as primeiras reservas!

Interessados, é só acessar: ${baseUrl}/auth/cadastro?codigo=${codigo}

Quem topa uma partida? 🏓

#ArenaDonaSanta #Esportes #TenisDeMesa`,

    simples: `Oi! Use meu código ${codigo} na Arena Dona Santa e ganhe créditos grátis! 
${baseUrl}/auth/cadastro?codigo=${codigo} 🏓`
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Exemplos de Compartilhamento
        </CardTitle>
        <CardDescription>
          Textos prontos para compartilhar seu código de diferentes formas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="whatsapp" className="text-xs">
              <MessageCircle className="h-3 w-3 mr-1" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="email" className="text-xs">
              <Mail className="h-3 w-3 mr-1" />
              Email
            </TabsTrigger>
            <TabsTrigger value="instagram" className="text-xs">
              <Instagram className="h-3 w-3 mr-1" />
              Instagram
            </TabsTrigger>
            <TabsTrigger value="facebook" className="text-xs">
              <Facebook className="h-3 w-3 mr-1" />
              Facebook
            </TabsTrigger>
            <TabsTrigger value="simples" className="text-xs">
              <Share2 className="h-3 w-3 mr-1" />
              Simples
            </TabsTrigger>
          </TabsList>

          {Object.entries(exemplos).map(([tipo, texto]) => (
            <TabsContent key={tipo} value={tipo} className="space-y-4">
              <div className="relative">
                <div className="bg-muted/50 p-4 rounded-lg text-sm whitespace-pre-line border">
                  {texto}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copiarTexto(texto, tipo)}
                  className="absolute top-2 right-2"
                >
                  {copiado === tipo ? (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>

              {/* Dicas específicas por plataforma */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {tipo === 'whatsapp' && (
                    <>💡 <strong>Dica:</strong> Envie para grupos de esportes ou amigos que gostam de jogar!</>
                  )}
                  {tipo === 'email' && (
                    <>💡 <strong>Dica:</strong> Personalize com o nome do amigo e adicione detalhes sobre vocês jogarem juntos!</>
                  )}
                  {tipo === 'instagram' && (
                    <>💡 <strong>Dica:</strong> Poste nos Stories com uma foto da arena ou de você jogando!</>
                  )}
                  {tipo === 'facebook' && (
                    <>💡 <strong>Dica:</strong> Compartilhe em grupos de esportes locais ou na sua timeline!</>
                  )}
                  {tipo === 'simples' && (
                    <>💡 <strong>Dica:</strong> Perfeito para SMS, Telegram ou qualquer mensagem rápida!</>
                  )}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Estatísticas de Compartilhamento */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg border">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            📊 Dicas para Mais Indicações
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="text-xs">1</Badge>
              <span>Compartilhe em grupos de esportes</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="text-xs">2</Badge>
              <span>Convide amigos que já praticam esportes</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="text-xs">3</Badge>
              <span>Poste nas redes sociais com fotos</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="text-xs">4</Badge>
              <span>Explique os benefícios da arena</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}