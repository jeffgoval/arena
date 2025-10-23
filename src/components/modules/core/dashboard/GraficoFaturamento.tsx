"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GraficoFaturamentoProps {
  faturamentoMes: number;
  faturamentoMesAnterior: number;
  mediaPorReserva: number;
}

export function GraficoFaturamento({
  faturamentoMes,
  faturamentoMesAnterior,
  mediaPorReserva,
}: GraficoFaturamentoProps) {
  const variacao = faturamentoMesAnterior > 0
    ? ((faturamentoMes - faturamentoMesAnterior) / faturamentoMesAnterior) * 100
    : 0;
  
  const isPositivo = variacao >= 0;
  const percentualAtual = faturamentoMesAnterior > 0
    ? (faturamentoMes / faturamentoMesAnterior) * 100
    : 100;

  return (
    <Card className="border-0 shadow-soft">
      <CardHeader>
        <CardTitle className="heading-4">Comparativo de Faturamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barras Comparativas */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Mês Atual</span>
              <span className="text-sm font-bold text-primary">
                R$ {faturamentoMes.toFixed(2)}
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(percentualAtual, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-muted-foreground">Mês Anterior</span>
              <span className="text-sm font-bold text-muted-foreground">
                R$ {faturamentoMesAnterior.toFixed(2)}
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-muted-foreground/30 rounded-full"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Variação */}
        <div className={`flex items-center justify-center gap-2 p-4 rounded-xl ${
          isPositivo ? 'bg-green-50' : 'bg-red-50'
        }`}>
          {isPositivo ? (
            <TrendingUp className="w-5 h-5 text-green-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600" />
          )}
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              isPositivo ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositivo ? '+' : ''}{variacao.toFixed(1)}%
            </p>
            <p className={`text-xs ${
              isPositivo ? 'text-green-700' : 'text-red-700'
            }`}>
              em relação ao mês anterior
            </p>
          </div>
        </div>

        {/* Média por Reserva */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Média por Reserva</span>
            <span className="text-lg font-bold text-foreground">
              R$ {mediaPorReserva.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
