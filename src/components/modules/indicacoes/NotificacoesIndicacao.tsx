'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Gift, X, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificacaoIndicacao {
  id: string;
  tipo: 'indicacao_aceita' | 'bonus_recebido' | 'creditos_expiram';
  titulo: string;
  descricao: string;
  data: string;
  lida: boolean;
  dados?: {
    nomeIndicado?: string;
    creditosRecebidos?: number;
    diasParaExpirar?: number;
  };
}

interface NotificacoesIndicacaoProps {
  className?: string;
  isTabView?: boolean;
}

export function NotificacoesIndicacao({ className, isTabView = false }: NotificacoesIndicacaoProps) {
  const [notificacoes, setNotificacoes] = useState<NotificacaoIndicacao[]>([]);
  const [mostrarTodas, setMostrarTodas] = useState(false);

  // Simular notificações (em produção, viria da API)
  useEffect(() => {
    const notificacoesSimuladas: NotificacaoIndicacao[] = [
      {
        id: '1',
        tipo: 'indicacao_aceita',
        titulo: 'Indicação Aceita! 🎉',
        descricao: 'Maria Silva aceitou sua indicação e você ganhou 50 créditos!',
        data: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
        lida: false,
        dados: {
          nomeIndicado: 'Maria Silva',
          creditosRecebidos: 50,
        },
      },
      {
        id: '2',
        tipo: 'bonus_recebido',
        titulo: 'Bônus Desbloqueado! 🏆',
        descricao: 'Você atingiu 5 indicações aceitas e ganhou 25 créditos de bônus!',
        data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
        lida: false,
        dados: {
          creditosRecebidos: 25,
        },
      },
      {
        id: '3',
        tipo: 'indicacao_aceita',
        titulo: 'Nova Indicação Aceita',
        descricao: 'João Santos se cadastrou usando seu código!',
        data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
        lida: true,
        dados: {
          nomeIndicado: 'João Santos',
          creditosRecebidos: 50,
        },
      },
    ];

    setNotificacoes(notificacoesSimuladas);
  }, []);

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida);
  const notificacoesExibidas = (isTabView || mostrarTodas) ? notificacoes : notificacoes.slice(0, 3);

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => 
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  };

  const removerNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  };

  const getIconeNotificacao = (tipo: string) => {
    switch (tipo) {
      case 'indicacao_aceita':
        return <Gift className="h-4 w-4 text-green-600" />;
      case 'bonus_recebido':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (notificacoes.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent className={isTabView ? "p-6" : "p-4"}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h3 className={`font-semibold ${isTabView ? 'text-xl' : ''}`}>
              {isTabView ? 'Central de Notificações' : 'Notificações'}
            </h3>
            {notificacoesNaoLidas.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {notificacoesNaoLidas.length}
              </Badge>
            )}
          </div>
          
          {!isTabView && notificacoes.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarTodas(!mostrarTodas)}
            >
              {mostrarTodas ? 'Mostrar menos' : 'Ver todas'}
            </Button>
          )}
        </div>

        {/* Descrição para view de aba */}
        {isTabView && (
          <p className="text-muted-foreground mb-6">
            Acompanhe todas as atualizações sobre suas indicações, créditos recebidos e bônus desbloqueados.
          </p>
        )}

        <div className="space-y-3">
          {notificacoesExibidas.map((notificacao) => (
            <div
              key={notificacao.id}
              className={`p-3 rounded-lg border transition-colors ${
                notificacao.lida 
                  ? 'bg-muted/30 border-muted' 
                  : 'bg-primary/5 border-primary/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    {getIconeNotificacao(notificacao.tipo)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">
                        {notificacao.titulo}
                      </h4>
                      {!notificacao.lida && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {notificacao.descricao}
                    </p>
                    
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notificacao.data), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  {!notificacao.lida && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => marcarComoLida(notificacao.id)}
                      className="h-6 w-6 p-0"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removerNotificacao(notificacao.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notificacoesNaoLidas.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNotificacoes(prev => 
                  prev.map(n => ({ ...n, lida: true }))
                );
              }}
              className="w-full"
            >
              Marcar todas como lidas
            </Button>
          </div>
        )}

        {/* Estatísticas para view de aba */}
        {isTabView && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-3">📊 Resumo das Notificações</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{notificacoes.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{notificacoesNaoLidas.length}</div>
                <div className="text-xs text-muted-foreground">Não Lidas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {notificacoes.filter(n => n.tipo === 'indicacao_aceita').length}
                </div>
                <div className="text-xs text-muted-foreground">Indicações</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {notificacoes.filter(n => n.tipo === 'bonus_recebido').length}
                </div>
                <div className="text-xs text-muted-foreground">Bônus</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}