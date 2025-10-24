"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Plus, Clock, MapPin, Users, Filter, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReservas } from "@/hooks/core/useReservas";
import { ReservaSkeletonList } from "@/components/shared/loading/ReservaSkeleton";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type FiltroType = "todas" | "futuras" | "passadas";

export default function ReservasPage() {
  const [filtro, setFiltro] = useState<FiltroType>("futuras");
  const { data: reservasData, isLoading } = useReservas();

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const filtros = [
    { key: "futuras", label: "Futuras" },
    { key: "passadas", label: "Passadas" },
    { key: "todas", label: "Todas" },
  ];

  // Filter reservations based on selected filter
  const reservas = reservasData?.filter((reserva: any) => {
    const dataReserva = parseISO(reserva.data);
    dataReserva.setHours(0, 0, 0, 0);

    if (filtro === "futuras") {
      return dataReserva >= hoje;
    } else if (filtro === "passadas") {
      return dataReserva < hoje;
    }
    return true; // "todas"
  }).sort((a: any, b: any) => {
    // Sort futuras ascending, passadas descending
    const dateA = parseISO(a.data).getTime();
    const dateB = parseISO(b.data).getTime();
    return filtro === "passadas" ? dateB - dateA : dateA - dateB;
  }) || [];

  if (isLoading) {
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

        {/* Skeleton Loading */}
        <ReservaSkeletonList count={5} />
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
          {reservas.map((reserva: any) => {
            const dataReserva = parseISO(reserva.data);
            const diaSemana = format(dataReserva, "EEE", { locale: ptBR }).toUpperCase().substring(0, 3);
            const dia = format(dataReserva, "dd");
            const mes = format(dataReserva, "MMM", { locale: ptBR }).toUpperCase().substring(0, 3);

            const totalParticipantes = reserva.reserva_participantes?.length || 0;

            // Get status badge variant
            const getStatusVariant = (status: string) => {
              switch (status) {
                case 'confirmada': return 'default';
                case 'pendente': return 'secondary';
                case 'cancelada': return 'destructive';
                default: return 'secondary';
              }
            };

            return (
              <Link key={reserva.id} href={`/cliente/reservas/${reserva.id}`}>
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
                            <h3 className="heading-4 mb-1">{reserva.quadra?.nome || 'Quadra'}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{reserva.horario?.hora_inicio} - {reserva.horario?.hora_fim}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span className="capitalize">{reserva.quadra?.tipo?.replace('_', ' ')}</span>
                              </div>
                              {totalParticipantes > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{totalParticipantes} participante{totalParticipantes !== 1 ? 's' : ''}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Status and Value */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary mb-1">R$ {reserva.valor_total?.toFixed(2) || '0,00'}</p>
                            <Badge variant={getStatusVariant(reserva.status)} className="capitalize">
                              {reserva.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Team - if associated */}
                        {reserva.turma && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg text-sm font-semibold">
                            <Users className="w-4 h-4" />
                            {reserva.turma.nome}
                          </div>
                        )}
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
