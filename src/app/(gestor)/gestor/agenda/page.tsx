"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReservationModal } from "@/components/modules/core/agenda/ReservationModal";

type PeriodType = "dia" | "semana" | "mes";

interface Reservation {
  id?: string;
  court: string;
  day: number;
  time: string;
  organizer: string;
  participants: number;
  status: "confirmada" | "pendente" | "cancelada";
  phone?: string;
  email?: string;
  notes?: string;
}

export default function AgendaPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("semana");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    court: string;
    date: Date;
    time: string;
  } | null>(null);

  const today = new Date();
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - currentDate.getDay() + i);
    return date;
  });

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  const courts = ["Society 1", "Society 2", "Futsal", "Beach Tennis"];

  // Simulação de reservas
  const reservations = [
    { court: "Society 1", day: 1, time: "19:00", organizer: "João Silva", participants: 8, status: "confirmada" },
    { court: "Society 1", day: 1, time: "20:00", organizer: "Maria Santos", participants: 6, status: "pendente" },
    { court: "Futsal", day: 2, time: "19:00", organizer: "Pedro Costa", participants: 10, status: "confirmada" },
    { court: "Society 2", day: 3, time: "20:00", organizer: "Ana Silva", participants: 12, status: "confirmada" },
    { court: "Society 1", day: 4, time: "19:00", organizer: "Carlos Lima", participants: 8, status: "confirmada" },
    { court: "Society 1", day: 5, time: "21:00", organizer: "Bruno Santos", participants: 14, status: "pendente" },
  ];

  const getReservation = (court: string, day: number, time: string) => {
    return reservations.find(r => r.court === court && r.day === day && r.time === time);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "dia":
        return currentDate.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: 'short'
        });
      case "semana":
        return `${formatDate(currentWeek[0])} - ${formatDate(currentWeek[6])}`;
      case "mes":
        return currentDate.toLocaleDateString('pt-BR', {
          month: 'long',
          year: 'numeric'
        });
      default:
        return "";
    }
  };

  // Funções de navegação
  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (selectedPeriod) {
      case "dia":
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case "semana":
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case "mes":
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleSlotClick = (court: string, date: Date, time: string) => {
    setSelectedSlot({ court, date, time });
    setIsModalOpen(true);
  };

  const handleNewReservation = () => {
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  // Gerar dados baseados no período selecionado
  const getPeriodData = () => {
    switch (selectedPeriod) {
      case "dia":
        return {
          columns: [currentDate],
          gridCols: "grid-cols-2", // Horário + 1 dia
          showAllCourts: true
        };
      case "semana":
        return {
          columns: currentWeek,
          gridCols: "grid-cols-8", // Horário + 7 dias
          showAllCourts: false
        };
      case "mes":
        // Para mês, vamos mostrar uma visão resumida por semana
        const monthWeeks = Array.from({ length: 4 }, (_, i) => {
          const weekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 + (i * 7));
          return weekStart;
        });
        return {
          columns: monthWeeks,
          gridCols: "grid-cols-5", // Horário + 4 semanas
          showAllCourts: false
        };
      default:
        return {
          columns: currentWeek,
          gridCols: "grid-cols-8",
          showAllCourts: false
        };
    }
  };

  const periodData = getPeriodData();

  return (
    <div className="container-custom page-padding space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="heading-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Agenda Geral
          </h1>
          <p className="body-medium text-muted-foreground">
            Visualize todas as reservas das quadras
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation chevrons with period indicator in the middle */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => navigatePeriod('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div 
              className="text-center min-w-[180px] px-3 cursor-pointer hover:bg-muted/50 rounded-md py-1 transition-colors"
              onClick={goToToday}
              title="Clique para voltar para hoje"
            >
              <p className="text-sm font-semibold text-foreground">
                {getPeriodLabel()}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedPeriod === "dia" && "Visualização diária"}
                {selectedPeriod === "semana" && "Visualização semanal"}
                {selectedPeriod === "mes" && "Visualização mensal"}
              </p>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => navigatePeriod('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={selectedPeriod === "dia" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod("dia")}
              className={selectedPeriod === "dia" ? "bg-background shadow-sm" : ""}
            >
              Dia
            </Button>
            <Button
              variant={selectedPeriod === "semana" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod("semana")}
              className={selectedPeriod === "semana" ? "bg-background shadow-sm" : ""}
            >
              Semana
            </Button>
            <Button
              variant={selectedPeriod === "mes" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod("mes")}
              className={selectedPeriod === "mes" ? "bg-background shadow-sm" : ""}
            >
              Mês
            </Button>
          </div>

          <Button onClick={handleNewReservation}>Nova Reserva</Button>
        </div>
      </div>



      <Tabs defaultValue="semanal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="semanal">Visão por Data</TabsTrigger>
          <TabsTrigger value="quadras">Visão por Quadras</TabsTrigger>
        </TabsList>

        <TabsContent value="semanal" className="space-y-6 mt-6">
          {/* Legend */}
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-success rounded"></div>
                  <span className="text-sm">Confirmada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-warning rounded"></div>
                  <span className="text-sm">Pendente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-destructive rounded"></div>
                  <span className="text-sm">Cancelada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted border-2 border-border rounded"></div>
                  <span className="text-sm">Disponível</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Grid */}
          <Card className="border-0 shadow-soft overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header with period columns */}
                  <div className={`grid ${periodData.gridCols} border-b border-border`} style={{ gridTemplateColumns: `100px repeat(${periodData.columns.length}, 1fr)` }}>
                    <div className="p-3 bg-muted font-semibold text-sm">Horário</div>
                    {periodData.columns.map((date, index) => (
                      <div key={index} className="p-4 bg-muted text-center">
                        <div className="font-semibold text-sm">
                          {selectedPeriod === "dia" ? getDayName(date) :
                            selectedPeriod === "semana" ? getDayName(date) :
                              `Sem ${index + 1}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {selectedPeriod === "mes" ?
                            `${formatDate(date)} - ${formatDate(new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000))}` :
                            formatDate(date)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time slots */}
                  {(selectedPeriod === "dia" ? timeSlots : selectedPeriod === "mes" ? ["Manhã", "Tarde", "Noite"] : timeSlots).map((time) => (
                    <div key={time} className={`grid ${periodData.gridCols} border-b border-border`} style={{ gridTemplateColumns: `100px repeat(${periodData.columns.length}, 1fr)` }}>
                      <div className="p-3 bg-muted/50 font-medium text-sm flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span className="text-xs">{time}</span>
                      </div>
                      {periodData.columns.map((_, columnIndex) => (
                        <div key={columnIndex} className="p-2 min-h-[80px]">
                          <div className="space-y-1">
                            {(selectedPeriod === "dia" ? courts :
                              selectedPeriod === "mes" ? ["Resumo"] :
                                courts).map((court) => {

                                  let reservation = null;
                                  if (selectedPeriod === "dia" || selectedPeriod === "semana") {
                                    reservation = getReservation(court, columnIndex, time);
                                  }

                                  return (
                                    <div
                                      key={court}
                                      className={`${selectedPeriod === "mes" ? "p-1" : "p-2"} rounded text-xs cursor-pointer transition-colors ${selectedPeriod === "mes" ? "" :
                                        reservation
                                          ? reservation.status === 'confirmada'
                                            ? 'bg-success/10 border border-success/20 hover:bg-success/20'
                                            : 'bg-warning/10 border border-warning/20 hover:bg-warning/20'
                                          : 'bg-muted/50 border border-border hover:bg-muted'
                                        }`}
                                    >
                                      {reservation ? (
                                        <div>
                                          <div className="font-medium truncate">{selectedPeriod === "dia" ? court : court}</div>
                                          <div className="truncate">{reservation.organizer}</div>
                                          <div className="flex items-center gap-1 mt-1">
                                            <Users className="w-3 h-3" />
                                            <span>{reservation.participants}</span>
                                          </div>
                                        </div>
                                      ) : selectedPeriod === "mes" ? (
                                        (() => {
                                          const occupancyRate = Math.floor(Math.random() * 100);
                                          const getOccupancyColor = (rate: number) => {
                                            if (rate >= 80) return 'bg-success/20 border-success/30 text-success';
                                            if (rate >= 50) return 'bg-warning/20 border-warning/30 text-warning';
                                            return 'bg-muted border-border text-muted-foreground';
                                          };

                                          return (
                                            <div className={`text-center p-3 rounded-lg ${getOccupancyColor(occupancyRate)}`}>
                                              <div className="text-2xl font-bold mb-1">{occupancyRate}%</div>
                                              <div className="text-xs">ocupação</div>
                                            </div>
                                          );
                                        })()
                                      ) : (
                                        <div className="text-muted-foreground">{court}</div>
                                      )}
                                    </div>
                                  );
                                })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Day Reservations */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3">
                {selectedPeriod === "dia" ? "Reservas do Dia" : "Reservas de Hoje"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservations.filter(r => r.day === (selectedPeriod === "dia" ? currentDate.getDay() : today.getDay())).map((reservation, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{reservation.time}</p>
                      <p className="text-xs text-muted-foreground">{reservation.court}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{reservation.organizer}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {reservation.participants} participantes
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {reservation.court}
                        </span>
                      </div>
                    </div>
                    <Badge variant={reservation.status === "confirmada" ? "default" : "secondary"}>
                      {reservation.status}
                    </Badge>
                  </div>
                ))}

                {reservations.filter(r => r.day === (selectedPeriod === "dia" ? currentDate.getDay() : today.getDay())).length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {selectedPeriod === "dia" ? "Nenhuma reserva para este dia" : "Nenhuma reserva para hoje"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quadras" className="space-y-6 mt-6">
          {/* Legend */}
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-success rounded"></div>
                  <span className="text-sm">Confirmada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-warning rounded"></div>
                  <span className="text-sm">Pendente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-destructive rounded"></div>
                  <span className="text-sm">Cancelada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted border-2 border-border rounded"></div>
                  <span className="text-sm">Disponível</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courts Calendar Grid */}
          <Card className="border-0 shadow-soft overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header with courts */}
                  <div className="grid grid-cols-5 border-b border-border" style={{ gridTemplateColumns: `120px repeat(4, 1fr)` }}>
                    <div className="p-3 bg-muted font-semibold text-sm">
                      {selectedPeriod === "semana" ? "Dia" :
                        selectedPeriod === "mes" ? "Semana" : "Horário"}
                    </div>
                    {courts.map((court, index) => (
                      <div key={index} className="p-4 bg-muted text-center">
                        <div className="font-semibold text-sm flex items-center justify-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          {court}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {court.includes('Society') ? 'Society' : court.includes('Futsal') ? 'Futsal' : 'Beach Tennis'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Rows based on period type */}
                  {selectedPeriod === "semana" ? (
                    // Para semana: dias da semana nas linhas, quadras nas colunas
                    currentWeek.map((date, dayIndex) => (
                      <div key={dayIndex} className="grid grid-cols-5 border-b border-border" style={{ gridTemplateColumns: `120px repeat(4, 1fr)` }}>
                        <div className="p-3 bg-muted/50 font-medium text-sm flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                          <div>
                            <div className="text-xs font-semibold">{getDayName(date)}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(date)}</div>
                          </div>
                        </div>
                        {courts.map((court, courtIndex) => {
                          // Buscar todas as reservas deste dia para esta quadra
                          const dayReservations = timeSlots.map(time =>
                            getReservation(court, dayIndex, time)
                          ).filter(Boolean);

                          return (
                            <div key={courtIndex} className="p-3 min-h-[80px] flex items-center">
                              <div
                                className={`w-full p-3 rounded-lg text-sm cursor-pointer transition-colors ${dayReservations.length > 0
                                  ? 'bg-success/10 border border-success/20 hover:bg-success/20'
                                  : 'bg-muted/50 border border-border hover:bg-muted'
                                  }`}
                              >
                                {dayReservations.length > 0 ? (
                                  <div className="text-center">
                                    <div className="font-semibold text-base mb-2">{dayReservations.length} reserva(s)</div>
                                    <div className="text-xs text-muted-foreground mb-2">
                                      {dayReservations.map(r => r?.time).filter(Boolean).join(", ")}
                                    </div>
                                    <div className="text-xs">
                                      {dayReservations[0]?.organizer}
                                      {dayReservations.length > 1 && ` +${dayReservations.length - 1}`}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center text-muted-foreground">
                                    <div className="text-sm">Disponível</div>
                                    <div className="text-xs mt-1">Todo o dia livre</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  ) : (
                    // Para dia e mês: horários nas linhas (lógica original)
                    (selectedPeriod === "dia" ? timeSlots : ["Semana 1", "Semana 2", "Semana 3", "Semana 4"]).map((time) => (
                      <div key={time} className="grid grid-cols-5 border-b border-border" style={{ gridTemplateColumns: `120px repeat(4, 1fr)` }}>
                        <div className="p-3 bg-muted/50 font-medium text-sm flex items-center">
                          {selectedPeriod === "mes" ? (
                            <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                          ) : (
                            <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                          )}
                          <span className="text-xs">{time}</span>
                        </div>
                        {courts.map((court, courtIndex) => {
                          // Buscar reserva baseada no período selecionado
                          let reservation = null;
                          let displayContent = null;

                          if (selectedPeriod === "dia") {
                            reservation = getReservation(court, today.getDay(), time);
                          } else if (selectedPeriod === "mes") {
                            // Para mês, mostrar estatísticas por semana
                            const weekReservations = Math.floor(Math.random() * 15) + 3;
                            const occupancyRate = Math.floor((weekReservations / 21) * 100); // 21 = 7 dias × 3 turnos

                            displayContent = (
                              <div className="text-center">
                                <div className="font-semibold text-lg mb-1">{weekReservations}</div>
                                <div className="text-xs text-muted-foreground mb-1">reservas</div>
                                <div className={`text-xs px-2 py-1 rounded ${occupancyRate >= 70 ? 'bg-success/20 text-success' :
                                  occupancyRate >= 40 ? 'bg-warning/20 text-warning' :
                                    'bg-muted text-muted-foreground'
                                  }`}>
                                  {occupancyRate}% ocupação
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={courtIndex} className="p-3 min-h-[80px] flex items-center">
                              <div
                                className={`w-full p-3 rounded-lg text-sm cursor-pointer transition-colors ${reservation || displayContent
                                  ? 'bg-success/10 border border-success/20 hover:bg-success/20'
                                  : 'bg-muted/50 border border-border hover:bg-muted'
                                  }`}
                              >
                                {reservation ? (
                                  <div className="text-center">
                                    <div className="font-semibold text-base mb-2">{reservation.organizer}</div>
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                      <Users className="w-4 h-4" />
                                      <span>{reservation.participants} pessoas</span>
                                    </div>
                                    <Badge
                                      variant={reservation.status === 'confirmada' ? 'default' : 'secondary'}
                                      className="mt-2"
                                    >
                                      {reservation.status}
                                    </Badge>
                                  </div>
                                ) : displayContent ? (
                                  displayContent
                                ) : (
                                  <div className="text-center text-muted-foreground">
                                    <div className="text-sm">Disponível</div>
                                    <div className="text-xs mt-1">
                                      {selectedPeriod === "dia" ? "Clique para reservar" : "Período livre"}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courts Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courts.map((court, index) => {
              const courtReservations = reservations.filter(r => r.court === court);
              const confirmedCount = courtReservations.filter(r => r.status === 'confirmada').length;
              const pendingCount = courtReservations.filter(r => r.status === 'pendente').length;

              return (
                <Card key={index} className="border-0 shadow-soft">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {court}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Confirmadas</span>
                        <Badge variant="default" className="bg-success hover:bg-success">
                          {confirmedCount}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Pendentes</span>
                        <Badge variant="secondary" className="bg-warning/20 text-warning hover:bg-warning/30">
                          {pendingCount}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <Badge variant="outline">
                          {courtReservations.length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}