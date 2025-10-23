"use client";

import { Receipt, Calendar, Clock, MapPin, Users, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ItemResumo {
  descricao: string;
  valor: number;
  quantidade?: number;
}

export interface DadosResumo {
  itens: ItemResumo[];
  subtotal: number;
  desconto?: number;
  taxas?: number;
  total: number;
  detalhesReserva?: {
    quadra: string;
    data: string;
    horario: string;
    duracao?: string;
    participantes?: number;
  };
  cupomAplicado?: {
    codigo: string;
    desconto: number;
  };
}

interface ResumoFinanceiroProps {
  dados: DadosResumo;
  mostrarDetalhes?: boolean;
  className?: string;
}

export function ResumoFinanceiro({
  dados,
  mostrarDetalhes = true,
  className
}: ResumoFinanceiroProps) {
  
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <Card className={cn("border-0 shadow-soft", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Resumo do Pedido
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Detalhes da Reserva */}
        {mostrarDetalhes && dados.detalhesReserva && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Quadra</p>
                <p className="font-semibold">{dados.detalhesReserva.quadra}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-semibold">{dados.detalhesReserva.data}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Horário</p>
                <p className="font-semibold">
                  {dados.detalhesReserva.horario}
                  {dados.detalhesReserva.duracao && (
                    <span className="text-muted-foreground text-sm ml-2">
                      ({dados.detalhesReserva.duracao})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {dados.detalhesReserva.participantes && (
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Participantes</p>
                  <p className="font-semibold">{dados.detalhesReserva.participantes} pessoas</p>
                </div>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Itens */}
        <div className="space-y-3">
          {dados.itens.map((item, index) => (
            <div key={index} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">{item.descricao}</p>
                {item.quantidade && item.quantidade > 1 && (
                  <p className="text-sm text-muted-foreground">
                    {item.quantidade}x {formatarValor(item.valor / item.quantidade)}
                  </p>
                )}
              </div>
              <p className="font-semibold">{formatarValor(item.valor)}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Cálculos */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatarValor(dados.subtotal)}</span>
          </div>

          {dados.desconto && dados.desconto > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Desconto
                {dados.cupomAplicado && (
                  <Badge variant="outline" className="ml-1 text-xs">
                    {dados.cupomAplicado.codigo}
                  </Badge>
                )}
              </span>
              <span className="font-medium text-green-600">
                -{formatarValor(dados.desconto)}
              </span>
            </div>
          )}

          {dados.taxas && dados.taxas > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxas</span>
              <span className="font-medium">{formatarValor(dados.taxas)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary">
            {formatarValor(dados.total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
