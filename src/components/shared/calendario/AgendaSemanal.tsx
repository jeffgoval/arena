"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface EventoAgenda {
  id: string;
  titulo: string;
  horaInicio: string;
  horaFim: string;
  data: Date;
  tipo: "reserva" | "bloqueio" | "manutencao";
  status?: "confirmada" | "pendente" | "cancelada";
  cliente?: string;
  quadra?: string;
}

interface AgendaSemanalProps {
  eventos: EventoAgenda[];
  onEventoClick?: (evento: EventoAgenda) => void;
  semanaInicial?: Date;
  className?: string;
}

export function AgendaSemanal({
  eventos,
  onEventoClick,
  semanaInicial = new Date(),
  className
}: AgendaSemanalProps) {
  const [semanaAtual, setSemanaAtual] = useState(getInicioSemana(semanaInicial));

  function getInicioSemana(data: Date): Date {
    const d = new Date(data);
    const dia = d.getDay();
    const diff = d.getDate() - dia;
    return new Date(d.setDate(diff));
  }

  const getDiasSemana = () => {
    const dias: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(semanaAtual);
      dia.setDate(semanaAtual.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  const semanaAnterior = () => {
    const novaSemana = new Date(semanaAtual);
    novaSemana.setDate(semanaAtual.getDate() - 7);
    setSemanaAtual(novaSemana);
  };

  const proximaSemana = () => {
    const novaSemana = new Date(semanaAtual);
    novaSemana.setDate(semanaAtual.getDate() + 7);
    setSemanaAtual(novaSemana);
  };

  const semanaAtualReal = () => {
    setSemanaAtual(getInicioSemana(new Date()));
  };

  const getEventosDoDia = (data: Date) => {
    return eventos.filter(evento => 
      evento.data.toDateString() === data.toDateString()
    ).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  };

  const isHoje = (data: Date) => {
    const hoje = new Date();
    return data.toDateString() === hoje.toDateString();
  };

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const getTipoColor = (tipo: string) => {
    const cores = {
      reserva: "bg-primary/10 text-primary border-primary/20",
      bloqueio: "bg-destructive/10 text-destructive border-destructive/20",
      manutencao: "bg-warning/10 text-warning border-warning/20"
    };
    return cores[tipo as keyof typeof cores] || cores.reserva;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const variants = {
      confirmada: "bg-green-500/10 text-green-700 border-green-500/20",
      pendente: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
      cancelada: "bg-red-500/10 text-red-700 border-red-500/20"
    };

    return (
      <Badge className={cn("text-xs", variants[status as keyof typeof variants])}>
        {status}
      </Badge>
    );
  };

  const diasSemana = getDiasSemana();
  const diasNomes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <Card className={cn("p-6 border-0 shadow-soft", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={semanaAnterior}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">
              {formatarData(diasSemana[0])} - {formatarData(diasSemana[6])}
            </h3>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={proximaSemana}
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={semanaAtualReal}
        >
          Hoje
        </Button>
      </div>

      {/* Grid Semanal */}
      <div className="grid grid-cols-7 gap-3">
        {diasSemana.map((dia, index) => {
          const eventosDia = getEventosDoDia(dia);
          const hoje = isHoje(dia);

          return (
            <div
              key={index}
              className={cn(
                "min-h-[200px] rounded-lg border-2 p-3 transition-all",
                hoje ? "border-primary bg-primary/5" : "border-border"
              )}
            >
              {/* Cabeçalho do Dia */}
              <div className="text-center mb-3 pb-2 border-b">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {diasNomes[index]}
                </div>
                <div className={cn(
                  "text-lg font-bold",
                  hoje ? "text-primary" : "text-foreground"
                )}>
                  {dia.getDate()}
                </div>
              </div>

              {/* Eventos do Dia */}
              <div className="space-y-2">
                {eventosDia.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Sem eventos
                  </p>
                ) : (
                  eventosDia.map((evento) => (
                    <button
                      key={evento.id}
                      onClick={() => onEventoClick?.(evento)}
                      className={cn(
                        "w-full text-left p-2 rounded-lg border transition-all",
                        "hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
                        getTipoColor(evento.tipo)
                      )}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-xs font-semibold truncate">
                          {evento.titulo}
                        </span>
                        {getStatusBadge(evento.status)}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{evento.horaInicio} - {evento.horaFim}</span>
                      </div>

                      {evento.cliente && (
                        <p className="text-xs text-muted-foreground truncate">
                          {evento.cliente}
                        </p>
                      )}

                      {evento.quadra && (
                        <p className="text-xs font-medium truncate mt-1">
                          {evento.quadra}
                        </p>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/10 border border-primary/20" />
          <span className="text-muted-foreground">Reserva</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/10 border border-destructive/20" />
          <span className="text-muted-foreground">Bloqueio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning/10 border border-warning/20" />
          <span className="text-muted-foreground">Manutenção</span>
        </div>
      </div>
    </Card>
  );
}
