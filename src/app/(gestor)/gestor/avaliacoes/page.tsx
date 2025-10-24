'use client';

import { Star } from 'lucide-react';
import { useAvaliacoes, useAvaliacoesStats } from '@/hooks/core/useAvaliacoes';
import {
  AvaliacaoStatsComponent,
  AvaliacoesList,
  QuadraAvaliacoes
} from '@/components/modules/core/avaliacoes';

export default function AvaliacoesPage() {
  const { data: avaliacoes, isLoading: loading } = useAvaliacoes({ limit: 50 });
  const { data: stats } = useAvaliacoesStats();

  return (
    <div className="space-y-6">
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
      {stats && <AvaliacaoStatsComponent stats={stats} />}

      {/* Avaliações por Quadra */}
      {stats && stats.porQuadra.length > 0 && (
        <QuadraAvaliacoes quadras={stats.porQuadra} />
      )}

      {/* Lista de Avaliações */}
      <AvaliacoesList avaliacoes={avaliacoes || []} loading={loading} />
    </div>
  );
}
