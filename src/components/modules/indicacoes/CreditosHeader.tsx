'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Coins, TrendingUp, Gift } from 'lucide-react';
import { useIndicacoes } from '@/hooks/useIndicacoes';
import Link from 'next/link';

export function CreditosHeader() {
  const { estatisticas, loading } = useIndicacoes();
  const [mostrarPopover, setMostrarPopover] = useState(false);

  if (loading || !estatisticas) {
    return null;
  }

  const creditosDisponiveis = estatisticas.creditos_disponiveis;

  if (creditosDisponiveis === 0) {
    return (
      <Link href="/cliente/indicacoes">
        <Button variant="outline" size="sm" className="gap-2">
          <Gift className="h-4 w-4" />
          <span className="hidden sm:inline">Ganhar Créditos</span>
        </Button>
      </Link>
    );
  }

  return (
    <Popover open={mostrarPopover} onOpenChange={setMostrarPopover}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Coins className="h-4 w-4 text-green-600" />
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            {creditosDisponiveis}
          </Badge>
          <span className="hidden sm:inline text-green-600">créditos</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Seus Créditos de Indicação</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {estatisticas.creditos_disponiveis}
              </div>
              <div className="text-xs text-green-600/80">Disponíveis</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {estatisticas.total_creditos_recebidos}
              </div>
              <div className="text-xs text-blue-600/80">Total Recebido</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Indicações aceitas:</span>
              <span className="font-medium">{estatisticas.indicacoes_aceitas}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Créditos utilizados:</span>
              <span className="font-medium">{estatisticas.creditos_utilizados}</span>
            </div>
          </div>
          
          <div className="pt-3 border-t space-y-2">
            <Link href="/cliente/indicacoes">
              <Button className="w-full" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Programa de Indicação
              </Button>
            </Link>
            
            <p className="text-xs text-muted-foreground text-center">
              💡 Use seus créditos para desconto em reservas
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}