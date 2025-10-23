"use client";

import { CheckCircle2, Download, Share2, Calendar, Clock, CreditCard, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DadosComprovante {
  id: string;
  tipo: "reserva" | "recarga" | "mensalidade";
  status: "aprovado" | "pendente" | "cancelado";
  valor: number;
  metodoPagamento: string;
  data: string;
  hora: string;
  detalhes?: {
    quadra?: string;
    dataReserva?: string;
    horario?: string;
    cliente?: string;
  };
}

interface ComprovantePagamentoProps {
  dados: DadosComprovante;
  onBaixar?: () => void;
  onCompartilhar?: () => void;
  className?: string;
}

export function ComprovantePagamento({
  dados,
  onBaixar,
  onCompartilhar,
  className
}: ComprovantePagamentoProps) {
  
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      aprovado: {
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-500/10",
        label: "Pagamento Aprovado"
      },
      pendente: {
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-500/10",
        label: "Pagamento Pendente"
      },
      cancelado: {
        icon: Receipt,
        color: "text-red-600",
        bg: "bg-red-500/10",
        label: "Pagamento Cancelado"
      }
    };
    return configs[status as keyof typeof configs] || configs.aprovado;
  };

  const statusConfig = getStatusConfig(dados.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={cn("border-0 shadow-soft overflow-hidden", className)}>
      {/* Header com Status */}
      <div className={cn("p-8 text-center", statusConfig.bg)}>
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
          statusConfig.bg
        )}>
          <StatusIcon className={cn("w-10 h-10", statusConfig.color)} />
        </div>
        <h2 className="text-2xl font-bold mb-2">{statusConfig.label}</h2>
        <p className="text-muted-foreground">
          Transação realizada com sucesso
        </p>
      </div>

      <CardContent className="p-8 space-y-6">
        {/* Valor */}
        <div className="text-center py-6 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Valor Pago</p>
          <p className="text-4xl font-bold text-primary">{formatarValor(dados.valor)}</p>
        </div>

        <Separator />

        {/* Informações da Transação */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID da Transação</span>
            <span className="font-mono font-semibold">{dados.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Método de Pagamento</span>
            <span className="font-semibold">{dados.metodoPagamento}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Data</span>
            <span className="font-semibold">{dados.data}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Hora</span>
            <span className="font-semibold">{dados.hora}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo</span>
            <Badge variant="secondary">
              {dados.tipo === "reserva" ? "Reserva" : 
               dados.tipo === "recarga" ? "Recarga" : "Mensalidade"}
            </Badge>
          </div>
        </div>

        {/* Detalhes da Reserva (se aplicável) */}
        {dados.detalhes && dados.tipo === "reserva" && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold">Detalhes da Reserva</h3>
              
              {dados.detalhes.quadra && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quadra</span>
                  <span className="font-semibold">{dados.detalhes.quadra}</span>
                </div>
              )}

              {dados.detalhes.dataReserva && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Data da Reserva
                  </span>
                  <span className="font-semibold">{dados.detalhes.dataReserva}</span>
                </div>
              )}

              {dados.detalhes.horario && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Horário
                  </span>
                  <span className="font-semibold">{dados.detalhes.horario}</span>
                </div>
              )}
            </div>
          </>
        )}

        <Separator />

        {/* Ações */}
        <div className="flex gap-3">
          {onBaixar && (
            <Button
              variant="outline"
              onClick={onBaixar}
              className="flex-1 gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar PDF
            </Button>
          )}
          {onCompartilhar && (
            <Button
              variant="outline"
              onClick={onCompartilhar}
              className="flex-1 gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
          )}
        </div>

        {/* Nota de Rodapé */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          <p>Este comprovante é válido como recibo de pagamento</p>
          <p className="mt-1">Guarde-o para seus registros</p>
        </div>
      </CardContent>
    </Card>
  );
}
