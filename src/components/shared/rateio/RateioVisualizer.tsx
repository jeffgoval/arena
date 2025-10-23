"use client";

import { Users, DollarSign, Percent, User, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface ParticipanteRateio {
  id: string;
  nome: string;
  email?: string;
  valorPagar: number;
  percentual: number;
  statusPagamento?: "pago" | "pendente" | "atrasado";
  dataPagamento?: string;
}

export interface ConfiguracaoRateio {
  tipo: "igual" | "personalizado" | "percentual";
  valorTotal: number;
  participantes: ParticipanteRateio[];
  organizador?: {
    id: string;
    nome: string;
  };
}

interface RateioVisualizerProps {
  configuracao: ConfiguracaoRateio;
  mostrarStatus?: boolean;
  compacto?: boolean;
  className?: string;
}

export function RateioVisualizer({
  configuracao,
  mostrarStatus = false,
  compacto = false,
  className
}: RateioVisualizerProps) {
  
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getTipoLabel = (tipo: string) => {
    const labels = {
      igual: "Divisão Igual",
      personalizado: "Valores Personalizados",
      percentual: "Por Percentual"
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const getStatusConfig = (status?: string) => {
    const configs = {
      pago: {
        color: "text-green-600",
        bg: "bg-green-500/10",
        label: "Pago"
      },
      pendente: {
        color: "text-yellow-600",
        bg: "bg-yellow-500/10",
        label: "Pendente"
      },
      atrasado: {
        color: "text-red-600",
        bg: "bg-red-500/10",
        label: "Atrasado"
      }
    };
    return configs[status as keyof typeof configs];
  };

  const totalPago = configuracao.participantes
    .filter(p => p.statusPagamento === "pago")
    .reduce((sum, p) => sum + p.valorPagar, 0);

  const percentualPago = (totalPago / configuracao.valorTotal) * 100;

  if (compacto) {
    return (
      <Card className={cn("border-0 shadow-soft", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">
                {configuracao.participantes.length} participantes
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {getTipoLabel(configuracao.tipo)}
            </Badge>
          </div>

          <div className="space-y-2">
            {configuracao.participantes.map((participante) => (
              <div
                key={participante.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground truncate flex-1">
                  {participante.nome}
                </span>
                <span className="font-semibold ml-2">
                  {formatarValor(participante.valorPagar)}
                </span>
                {mostrarStatus && participante.statusPagamento && (
                  <Badge
                    variant="outline"
                    className={cn("ml-2 text-xs", getStatusConfig(participante.statusPagamento)?.bg)}
                  >
                    {getStatusConfig(participante.statusPagamento)?.label}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t flex justify-between items-center">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatarValor(configuracao.valorTotal)}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-0 shadow-soft", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Rateio da Reserva
          </CardTitle>
          <Badge variant="secondary">
            {getTipoLabel(configuracao.tipo)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Resumo Geral */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Valor Total</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatarValor(configuracao.valorTotal)}
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Participantes</span>
            </div>
            <p className="text-2xl font-bold">
              {configuracao.participantes.length}
            </p>
          </div>
        </div>

        {/* Progresso de Pagamento */}
        {mostrarStatus && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso de Pagamento</span>
              <span className="font-semibold">
                {formatarValor(totalPago)} / {formatarValor(configuracao.valorTotal)}
              </span>
            </div>
            <Progress value={percentualPago} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {percentualPago.toFixed(0)}% pago
            </p>
          </div>
        )}

        {/* Lista de Participantes */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Divisão por Participante</h4>
          
          {configuracao.participantes.map((participante) => {
            const statusConfig = getStatusConfig(participante.statusPagamento);
            const isOrganizador = configuracao.organizador?.id === participante.id;

            return (
              <div
                key={participante.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  statusConfig?.bg || "bg-muted/30",
                  participante.statusPagamento === "pago" 
                    ? "border-green-500/20" 
                    : "border-border"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      participante.statusPagamento === "pago" 
                        ? "bg-green-500/20" 
                        : "bg-muted"
                    )}>
                      {participante.statusPagamento === "pago" ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">
                          {participante.nome}
                        </p>
                        {isOrganizador && (
                          <Badge variant="outline" className="text-xs">
                            Organizador
                          </Badge>
                        )}
                      </div>
                      {participante.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {participante.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {mostrarStatus && statusConfig && (
                    <Badge className={cn("ml-2", statusConfig.bg, statusConfig.color)}>
                      {statusConfig.label}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Valor</p>
                      <p className="text-lg font-bold text-primary">
                        {formatarValor(participante.valorPagar)}
                      </p>
                    </div>
                    
                    {configuracao.tipo !== "igual" && (
                      <div>
                        <p className="text-xs text-muted-foreground">Percentual</p>
                        <p className="text-sm font-semibold flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          {participante.percentual.toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>

                  {participante.dataPagamento && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Pago em</p>
                      <p className="text-xs font-medium">{participante.dataPagamento}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Organizador */}
        {configuracao.organizador && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Organizado por</p>
            <p className="font-semibold">{configuracao.organizador.nome}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
