"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Plus, Clock, MapPin, Users, Filter, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type FiltroType = "todas" | "futuras" | "passadas";

export default function ReservasPage() {
  const [filtro, setFiltro] = useState<FiltroType>("futuras");
  
  // Simulação de dados - em produção viria de hooks/API
  const reservas: any[] = [];
  const isLoading = false;

  const filtros = [
    { key: "futuras", label: "Futuras" },
    { key: "passadas", label: "Passadas" },
    { key: "todas", label: "Todas" },
  ];

  if (isLoading) {
    return (
      <div className="container-custom page-padding flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-semibold">Carregando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom page-padding space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="heading-2">Minhas Reservas</h1>
          <p className="body-medium text-muted-foreground">Gerencie suas reservas de quadras</p>
        </div>
        <Link href="/cliente/reservas/nova">
          <Button className="gap-2">
            <Plus className="w-5 h-5" />
            Nova Reserva
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-2">
              {filtros.map((f) => (
                <Button
                  key={f.key}
                  variant={filtro === f.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltro(f.key as FiltroType)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations List */}
      {!reservas || reservas.length === 0 ? (
        <Card className="border-0 shadow-soft">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
            <CardTitle className="heading-3 mb-2">Nenhuma reserva encontrada</CardTitle>
            <CardDescription className="body-medium mb-6">
              {filtro === "futuras" && "Você não tem reservas futuras no momento"}
              {filtro === "passadas" && "Você ainda não tem histórico de reservas"}
              {filtro === "todas" && "Comece criando sua primeira reserva"}
            </CardDescription>
            <Link href="/cliente/reservas/nova">
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                Criar Primeira Reserva
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva, index) => {
            // Simulação de dados da reserva
            const dataReserva = new Date();
            const diaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][dataReserva.getDay()];
            const dia = dataReserva.getDate();
            const mes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][dataReserva.getMonth()];

            return (
              <Link key={index} href={`/cliente/reservas/${index + 1}`}>
                <Card className="card-interactive border-0 shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Date */}
                      <div className="w-20 h-20 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                        <p className="text-xs font-semibold text-primary uppercase">{diaSemana}</p>
                        <p className="text-2xl font-bold text-primary">{dia}</p>
                        <p className="text-xs font-semibold text-primary uppercase">{mes}</p>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="heading-4 mb-1">Quadra Society 1</h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>19:00 - 20:00</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>Society</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>8 participantes</span>
                              </div>
                            </div>
                          </div>

                          {/* Status and Value */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary mb-1">R$ 80,00</p>
                            <Badge variant="secondary">Confirmada</Badge>
                          </div>
                        </div>

                        {/* Team */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg text-sm font-semibold">
                          <Users className="w-4 h-4" />
                          Time dos Amigos
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      {reservas && reservas.length > 0 && (
        <Card className="border-info/20 bg-info/5 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-info font-semibold mb-1">Dica</p>
                <p className="text-sm text-info/80">
                  Clique em uma reserva para gerenciar participantes, configurar rateio e ver todos os detalhes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
