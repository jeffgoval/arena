'use client';

import { useState } from 'react';
import { Star, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AvaliacaoCard } from './AvaliacaoCard';
import type { Avaliacao, AvaliacaoRating } from '@/types/avaliacoes.types';
import { cn } from '@/lib/utils';

interface AvaliacoesListProps {
  avaliacoes: Avaliacao[];
  loading?: boolean;
}

export function AvaliacoesList({ avaliacoes, loading }: AvaliacoesListProps) {
  const [filterRating, setFilterRating] = useState<AvaliacaoRating | 'all'>('all');

  const filteredAvaliacoes = avaliacoes.filter((avaliacao) => {
    if (filterRating === 'all') return true;
    return avaliacao.rating === filterRating;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avaliações Recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border border-border rounded-lg animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-2/3 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Avaliações Recentes
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-1">
              <Button
                variant={filterRating === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRating('all')}
              >
                Todas
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={filterRating === rating ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRating(rating as AvaliacaoRating)}
                  className="gap-1"
                >
                  {rating}
                  <Star className="w-3 h-3" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredAvaliacoes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {filterRating === 'all'
                ? 'Nenhuma avaliação encontrada'
                : `Nenhuma avaliação com ${filterRating} estrelas`}
            </p>
          </div>
        ) : (
          filteredAvaliacoes.map((avaliacao) => (
            <AvaliacaoCard key={avaliacao.id} avaliacao={avaliacao} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
