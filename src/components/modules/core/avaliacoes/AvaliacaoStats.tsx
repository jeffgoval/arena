'use client';

import { Star, TrendingUp, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AvaliacaoStats } from '@/types/avaliacoes.types';

interface AvaliacaoStatsProps {
  stats: AvaliacaoStats;
}

export function AvaliacaoStatsComponent({ stats }: AvaliacaoStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Média Geral */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-400/10 mb-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-yellow-400">
                  {stats.mediaGeral.toFixed(1)}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= Math.round(stats.mediaGeral)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold mb-1">Média Geral</p>
            <p className="text-sm text-muted-foreground">
              Baseado em {stats.totalAvaliacoes} avaliações
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Distribuição
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.distribuicao.map((item) => (
            <div key={item.rating}>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{item.rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </div>
                <Progress value={item.percentual} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {item.quantidade}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Resumo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Positivas */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-green-600">
                Positivas (4-5★)
              </span>
              <span className="text-sm font-bold text-green-600">
                {stats.distribuicao
                  .filter((d) => d.rating >= 4)
                  .reduce((sum, d) => sum + d.quantidade, 0)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.distribuicao
                .filter((d) => d.rating >= 4)
                .reduce((sum, d) => sum + d.percentual, 0)
                .toFixed(1)}% das avaliações
            </p>
          </div>

          {/* Neutras */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-yellow-600">
                Neutras (3★)
              </span>
              <span className="text-sm font-bold text-yellow-600">
                {stats.distribuicao.find((d) => d.rating === 3)?.quantidade || 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.distribuicao.find((d) => d.rating === 3)?.percentual.toFixed(1) || 0}% das avaliações
            </p>
          </div>

          {/* Negativas */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-red-600">
                Negativas (1-2★)
              </span>
              <span className="text-sm font-bold text-red-600">
                {stats.distribuicao
                  .filter((d) => d.rating <= 2)
                  .reduce((sum, d) => sum + d.quantidade, 0)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.distribuicao
                .filter((d) => d.rating <= 2)
                .reduce((sum, d) => sum + d.percentual, 0)
                .toFixed(1)}% das avaliações
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
