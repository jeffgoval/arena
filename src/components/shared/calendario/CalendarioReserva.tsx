"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalendarioReservaProps {
  dataSelecionada?: Date;
  onDataSelecionada: (data: Date) => void;
  datasIndisponiveis?: Date[];
  dataMinima?: Date;
  dataMaxima?: Date;
  className?: string;
}

export function CalendarioReserva({
  dataSelecionada,
  onDataSelecionada,
  datasIndisponiveis = [],
  dataMinima = new Date(),
  dataMaxima,
  className
}: CalendarioReservaProps) {
  const [mesAtual, setMesAtual] = useState(new Date());

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const getDiasDoMes = (data: Date) => {
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaSemanaInicio = primeiroDia.getDay();

    const dias: (Date | null)[] = [];

    // Preenche dias vazios do início
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }

    // Preenche os dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      dias.push(new Date(ano, mes, dia));
    }

    return dias;
  };

  const mesAnterior = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1));
  };

  const proximoMes = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1));
  };

  const isDataIndisponivel = (data: Date) => {
    return datasIndisponiveis.some(d => 
      d.toDateString() === data.toDateString()
    );
  };

  const isDataDesabilitada = (data: Date) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (data < dataMinima) return true;
    if (dataMaxima && data > dataMaxima) return true;
    
    return false;
  };

  const isDataSelecionada = (data: Date) => {
    return dataSelecionada?.toDateString() === data.toDateString();
  };

  const isHoje = (data: Date) => {
    const hoje = new Date();
    return data.toDateString() === hoje.toDateString();
  };

  const handleDataClick = (data: Date) => {
    if (isDataDesabilitada(data) || isDataIndisponivel(data)) return;
    onDataSelecionada(data);
  };

  const dias = getDiasDoMes(mesAtual);

  return (
    <Card className={cn("p-6 border-0 shadow-soft", className)}>
      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={mesAnterior}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">
            {meses[mesAtual.getMonth()]} {mesAtual.getFullYear()}
          </h3>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={proximoMes}
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {diasSemana.map((dia) => (
          <div
            key={dia}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Grid de Dias */}
      <div className="grid grid-cols-7 gap-2">
        {dias.map((data, index) => {
          if (!data) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const desabilitada = isDataDesabilitada(data);
          const indisponivel = isDataIndisponivel(data);
          const selecionada = isDataSelecionada(data);
          const hoje = isHoje(data);

          return (
            <button
              key={index}
              onClick={() => handleDataClick(data)}
              disabled={desabilitada || indisponivel}
              className={cn(
                "aspect-square rounded-lg text-sm font-medium transition-all",
                "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20",
                {
                  "bg-primary text-primary-foreground hover:bg-primary/90": selecionada,
                  "bg-muted/50 text-muted-foreground cursor-not-allowed hover:bg-muted/50": 
                    desabilitada || indisponivel,
                  "ring-2 ring-primary/30": hoje && !selecionada,
                  "text-foreground": !selecionada && !desabilitada && !indisponivel
                }
              )}
            >
              {data.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-muted-foreground">Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded ring-2 ring-primary/30" />
          <span className="text-muted-foreground">Hoje</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted/50" />
          <span className="text-muted-foreground">Indisponível</span>
        </div>
      </div>
    </Card>
  );
}
