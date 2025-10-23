"use client";

import { Clock, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Horario {
  id: string;
  horaInicio: string;
  horaFim: string;
  preco: number;
  disponivel: boolean;
  vagasDisponiveis?: number;
  capacidadeTotal?: number;
}

interface HorarioSelectorProps {
  horarios: Horario[];
  horarioSelecionado?: string;
  onHorarioSelecionado: (horarioId: string) => void;
  mostrarVagas?: boolean;
  className?: string;
}

export function HorarioSelector({
  horarios,
  horarioSelecionado,
  onHorarioSelecionado,
  mostrarVagas = false,
  className
}: HorarioSelectorProps) {
  
  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  if (horarios.length === 0) {
    return (
      <Card className={cn("p-8 text-center border-0 shadow-soft", className)}>
        <Clock className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
        <p className="text-muted-foreground">
          Nenhum horário disponível para esta data
        </p>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Horários Disponíveis
        </h3>
        <Badge variant="secondary">
          {horarios.filter(h => h.disponivel).length} disponíveis
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {horarios.map((horario) => {
          const selecionado = horarioSelecionado === horario.id;
          const disponivel = horario.disponivel;
          const vagasLimitadas = horario.vagasDisponiveis && 
            horario.capacidadeTotal && 
            horario.vagasDisponiveis <= horario.capacidadeTotal * 0.3;

          return (
            <button
              key={horario.id}
              onClick={() => disponivel && onHorarioSelecionado(horario.id)}
              disabled={!disponivel}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all text-left",
                "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20",
                {
                  "border-primary bg-primary/5 shadow-sm": selecionado && disponivel,
                  "border-border hover:border-primary/50": !selecionado && disponivel,
                  "border-muted bg-muted/30 cursor-not-allowed opacity-60": !disponivel
                }
              )}
            >
              {/* Horário */}
              <div className="flex items-center gap-2 mb-2">
                <Clock className={cn(
                  "w-4 h-4",
                  selecionado ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="font-semibold text-sm">
                  {horario.horaInicio} - {horario.horaFim}
                </span>
              </div>

              {/* Preço */}
              <div className="text-lg font-bold text-primary mb-2">
                {formatarPreco(horario.preco)}
              </div>

              {/* Vagas (se habilitado) */}
              {mostrarVagas && horario.vagasDisponiveis !== undefined && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className={cn(
                    "font-medium",
                    vagasLimitadas ? "text-warning" : "text-muted-foreground"
                  )}>
                    {horario.vagasDisponiveis} {horario.vagasDisponiveis === 1 ? 'vaga' : 'vagas'}
                  </span>
                </div>
              )}

              {/* Badge de status */}
              {!disponivel && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 right-2 text-xs"
                >
                  Esgotado
                </Badge>
              )}

              {vagasLimitadas && disponivel && (
                <Badge 
                  variant="outline" 
                  className="absolute top-2 right-2 text-xs border-warning text-warning"
                >
                  Últimas vagas
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
