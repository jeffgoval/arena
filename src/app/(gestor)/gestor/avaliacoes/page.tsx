'use client';

import { Star, Loader2 } from 'lucide-react';
import { useAvaliacoes, useAvaliacoesStats } from '@/hooks/core/useAvaliacoes';
import {
  AvaliacaoStatsComponent,
  AvaliacoesList,
  QuadraAvaliacoes
} from '@/components/modules/core/avaliacoes';
import { Card, CardContent } from '@/components/ui/card';

function AvaliacaoStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center animate-pulse">
              <div className="w-24 h-24 rounded-full bg-muted mb-4" />
              <div className="h-5 w-32 bg-muted rounded mb-2" />
              <div className="h-4 w-40 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AvaliacoesPage() {
  const { data: avaliacoes, isLoading: loadingAvaliacoes } = useAvaliacoes({ limit: 50 });
  const { data: stats, isLoading: loadingStats } = useAvaliacoesStats();

  return (
    <div className="container-custom page-padding space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Star className="w-8 h-8 text-yellow-400" />
          Avaliações
        </h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe a satisfação dos seus clientes
        </p>
      </div>

      {/* Estatísticas */}
      {loadingStats ? (
        <AvaliacaoStatsSkeleton />
      ) : stats ? (
        <AvaliacaoStatsComponent stats={stats} />
      ) : null}

      {/* Avaliações por Quadra */}
      {!loadingStats && stats && stats.porQuadra.length > 0 && (
        <QuadraAvaliacoes quadras={stats.porQuadra} />
      )}

      {/* Lista de Avaliações */}
      <AvaliacoesList avaliacoes={avaliacoes || []} loading={loadingAvaliacoes} />
    </div>
  );
}
