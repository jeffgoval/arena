'use client';

import { Star, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Avaliacao } from '@/types/avaliacoes.types';
import { cn } from '@/lib/utils';

interface AvaliacaoCardProps {
  avaliacao: Avaliacao;
}

export function AvaliacaoCard({ avaliacao }: AvaliacaoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">
                {avaliacao.user?.nome_completo || 'Usuário'}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(avaliacao.created_at)}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-4 h-4',
                  star <= avaliacao.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
        </div>

        {/* Quadra */}
        {avaliacao.reserva?.quadra && (
          <p className="text-sm text-muted-foreground">
            {avaliacao.reserva.quadra.nome}
          </p>
        )}

        {/* Comentário */}
        {avaliacao.comentario && (
          <p className="text-sm text-foreground leading-relaxed">
            {avaliacao.comentario}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
