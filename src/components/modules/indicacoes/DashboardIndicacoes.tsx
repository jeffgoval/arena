'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Gift, TrendingUp, Clock } from 'lucide-react';
import type { EstatisticasIndicacao } from '@/types/indicacoes.types';

interface DashboardIndicacoesProps {
  estatisticas: EstatisticasIndicacao | null;
}

export function DashboardIndicacoes({ estatisticas }: DashboardIndicacoesProps) {
  if (!estatisticas) {
    return null;
  }

  const taxaConversao = estatisticas.total_indicacoes > 0 
    ? Math.round((estatisticas.indicacoes_aceitas / estatisticas.total_indicacoes) * 100)
    : 0;

  const cards = [
    {
      title: 'Total de Indicações',
      value: estatisticas.total_indicacoes,
      description: 'Amigos indicados',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Indicações Aceitas',
      value: estatisticas.indicacoes_aceitas,
      description: 'Cadastros confirmados',
      icon: Gift,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Taxa de Conversão',
      value: `${taxaConversao}%`,
      description: 'Indicações aceitas',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Pendentes',
      value: estatisticas.indicacoes_pendentes,
      description: 'Aguardando cadastro',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Dashboard de Indicações
        </CardTitle>
        <CardDescription>
          Acompanhe o desempenho do seu programa de indicação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`p-4 rounded-lg ${card.bgColor} border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${card.color}`} />
                  {card.title === 'Taxa de Conversão' && taxaConversao >= 50 && (
                    <Badge variant="secondary" className="text-xs">
                      Ótima!
                    </Badge>
                  )}
                </div>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </div>
                <div className={`text-sm ${card.color}/80`}>
                  {card.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dicas e Motivação */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">💡 Dicas para mais indicações:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Compartilhe seu código nas redes sociais</li>
            <li>• Convide amigos que praticam esportes</li>
            <li>• Explique os benefícios da Arena para seus amigos</li>
            <li>• Use o botão de compartilhamento para facilitar o envio</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}