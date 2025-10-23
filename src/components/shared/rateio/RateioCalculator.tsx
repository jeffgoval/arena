"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Trash2, DollarSign, Percent, Calculator, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TipoRateio = "igual" | "personalizado" | "percentual";

export interface ParticipanteCalculo {
  id: string;
  nome: string;
  email?: string;
  valor?: number;
  percentual?: number;
}

interface RateioCalculatorProps {
  valorTotal: number;
  participantesIniciais?: ParticipanteCalculo[];
  onRateioCalculado?: (participantes: ParticipanteCalculo[], tipo: TipoRateio) => void;
  className?: string;
}

export function RateioCalculator({
  valorTotal,
  participantesIniciais = [],
  onRateioCalculado,
  className
}: RateioCalculatorProps) {
  const [tipoRateio, setTipoRateio] = useState<TipoRateio>("igual");
  const [participantes, setParticipantes] = useState<ParticipanteCalculo[]>(
    participantesIniciais.length > 0 
      ? participantesIniciais 
      : [{ id: "1", nome: "", email: "" }]
  );

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularRateio = () => {
    let participantesCalculados: ParticipanteCalculo[] = [];

    if (tipoRateio === "igual") {
      const valorPorPessoa = valorTotal / participantes.length;
      const percentualPorPessoa = 100 / participantes.length;
      
      participantesCalculados = participantes.map(p => ({
        ...p,
        valor: valorPorPessoa,
        percentual: percentualPorPessoa
      }));
    } else if (tipoRateio === "personalizado") {
      participantesCalculados = participantes.map(p => ({
        ...p,
        percentual: p.valor ? (p.valor / valorTotal) * 100 : 0
      }));
    } else if (tipoRateio === "percentual") {
      participantesCalculados = participantes.map(p => ({
        ...p,
        valor: p.percentual ? (valorTotal * p.percentual) / 100 : 0
      }));
    }

    setParticipantes(participantesCalculados);
    onRateioCalculado?.(participantesCalculados, tipoRateio);
  };

  useEffect(() => {
    calcularRateio();
  }, [tipoRateio, valorTotal]);

  const adicionarParticipante = () => {
    const novoId = String(participantes.length + 1);
    setParticipantes([
      ...participantes,
      { id: novoId, nome: "", email: "" }
    ]);
  };

  const removerParticipante = (id: string) => {
    if (participantes.length > 1) {
      setParticipantes(participantes.filter(p => p.id !== id));
    }
  };

  const atualizarParticipante = (id: string, campo: keyof ParticipanteCalculo, valor: any) => {
    setParticipantes(participantes.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    ));
  };

  const getTotalCalculado = () => {
    return participantes.reduce((sum, p) => sum + (p.valor || 0), 0);
  };

  const getTotalPercentual = () => {
    return participantes.reduce((sum, p) => sum + (p.percentual || 0), 0);
  };

  const isRateioValido = () => {
    if (tipoRateio === "personalizado") {
      const total = getTotalCalculado();
      return Math.abs(total - valorTotal) < 0.01;
    }
    if (tipoRateio === "percentual") {
      const total = getTotalPercentual();
      return Math.abs(total - 100) < 0.01;
    }
    return true;
  };

  const diferenca = tipoRateio === "personalizado" 
    ? getTotalCalculado() - valorTotal 
    : getTotalPercentual() - 100;

  return (
    <Card className={cn("border-0 shadow-soft", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Calculadora de Rateio
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Valor Total */}
        <div className="p-4 bg-primary/5 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
          <p className="text-3xl font-bold text-primary">
            {formatarValor(valorTotal)}
          </p>
        </div>

        {/* Tipo de Rateio */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Tipo de Divisão</Label>
          
          <div className="grid gap-2">
            <button
              onClick={() => setTipoRateio("igual")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left",
                tipoRateio === "igual" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <Users className={cn(
                "w-5 h-5",
                tipoRateio === "igual" ? "text-primary" : "text-muted-foreground"
              )} />
              <div className="flex-1">
                <p className="font-semibold text-sm">Divisão Igual</p>
                <p className="text-xs text-muted-foreground">
                  Divide o valor igualmente entre todos
                </p>
              </div>
            </button>

            <button
              onClick={() => setTipoRateio("personalizado")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left",
                tipoRateio === "personalizado" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <DollarSign className={cn(
                "w-5 h-5",
                tipoRateio === "personalizado" ? "text-primary" : "text-muted-foreground"
              )} />
              <div className="flex-1">
                <p className="font-semibold text-sm">Valores Personalizados</p>
                <p className="text-xs text-muted-foreground">
                  Define valor específico para cada pessoa
                </p>
              </div>
            </button>

            <button
              onClick={() => setTipoRateio("percentual")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left",
                tipoRateio === "percentual" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <Percent className={cn(
                "w-5 h-5",
                tipoRateio === "percentual" ? "text-primary" : "text-muted-foreground"
              )} />
              <div className="flex-1">
                <p className="font-semibold text-sm">Por Percentual</p>
                <p className="text-xs text-muted-foreground">
                  Define percentual para cada pessoa
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Lista de Participantes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Participantes</Label>
            <Badge variant="secondary">
              {participantes.length} {participantes.length === 1 ? 'pessoa' : 'pessoas'}
            </Badge>
          </div>

          <div className="space-y-3">
            {participantes.map((participante, index) => (
              <div
                key={participante.id}
                className="p-4 rounded-lg border-2 border-border space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <Input
                    placeholder="Nome do participante"
                    value={participante.nome}
                    onChange={(e) => atualizarParticipante(participante.id, "nome", e.target.value)}
                    className="flex-1"
                  />
                  {participantes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removerParticipante(participante.id)}
                      className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <Input
                  placeholder="Email (opcional)"
                  type="email"
                  value={participante.email}
                  onChange={(e) => atualizarParticipante(participante.id, "email", e.target.value)}
                />

                {tipoRateio === "personalizado" && (
                  <div>
                    <Label className="text-xs">Valor a pagar</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={participante.valor || ""}
                      onChange={(e) => atualizarParticipante(
                        participante.id, 
                        "valor", 
                        parseFloat(e.target.value) || 0
                      )}
                    />
                  </div>
                )}

                {tipoRateio === "percentual" && (
                  <div>
                    <Label className="text-xs">Percentual (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={participante.percentual || ""}
                      onChange={(e) => atualizarParticipante(
                        participante.id, 
                        "percentual", 
                        parseFloat(e.target.value) || 0
                      )}
                    />
                  </div>
                )}

                {tipoRateio === "igual" && participante.valor !== undefined && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor a pagar:</span>
                      <span className="font-bold text-primary">
                        {formatarValor(participante.valor)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={adicionarParticipante}
            className="w-full gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Participante
          </Button>
        </div>

        {/* Validação */}
        {!isRateioValido() && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-destructive">Rateio Inválido</p>
              <p className="text-muted-foreground">
                {tipoRateio === "personalizado" 
                  ? `Diferença: ${formatarValor(Math.abs(diferenca))} ${diferenca > 0 ? 'a mais' : 'a menos'}`
                  : `Diferença: ${Math.abs(diferenca).toFixed(1)}% ${diferenca > 0 ? 'a mais' : 'a menos'}`
                }
              </p>
            </div>
          </div>
        )}

        {/* Resumo */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total calculado:</span>
            <span className="font-semibold">
              {tipoRateio === "percentual" 
                ? `${getTotalPercentual().toFixed(1)}%`
                : formatarValor(getTotalCalculado())
              }
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Por pessoa (média):</span>
            <span className="font-semibold">
              {formatarValor(valorTotal / participantes.length)}
            </span>
          </div>
        </div>

        {/* Botão Calcular */}
        <Button
          onClick={calcularRateio}
          disabled={!isRateioValido()}
          className="w-full gap-2"
        >
          <Calculator className="w-4 h-4" />
          Recalcular Rateio
        </Button>
      </CardContent>
    </Card>
  );
}
