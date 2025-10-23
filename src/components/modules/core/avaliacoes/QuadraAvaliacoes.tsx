'use client';

import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface QuadraAvaliacaoData {
  quadra_id: string;
  quadra_nome: string;
  media: number;
  total: number;
}

interface QuadraAvaliacoesProps {
  quadras: QuadraAvaliacaoData[];
}

export function QuadraAvaliacoes({ quadras }: QuadraAvaliacoesProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Avaliações por Quadra
        </h3>
        <div className="space-y-4">
          {quadras.map((quadra) => (
            <div key={quadra.quadra_id} className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium">{quadra.quadra_nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {quadra.total} avaliações
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">
                    {quadra.media.toFixed(1)}
                  </span>
                </div>
              </div>
              <Progress 
                value={(quadra.media / 5) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
