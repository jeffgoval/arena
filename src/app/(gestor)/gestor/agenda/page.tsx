"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReservationModal } from "@/components/modules/core/agenda/ReservationModal";
import { useReservasGestor, useCreateReservaGestor, useUpdateReservaGestor, useDeleteReservaGestor } from "@/hooks/core/useReservasGestor";
import { useQuadras, useAllHorarios } from "@/hooks/core/useQuadrasHorarios";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";

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
  const { toast } = useToast();
  const { handleError, handleSuccess } = useErrorHandler();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("semana");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");

  const today = new Date();
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    // Ajustar para segunda-feira ser o primeiro dia (0)
    const dayOfWeek = currentDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Se domingo (0), volta 6 dias; senão, vai para segunda
    date.setDate(currentDate.getDate() + mondayOffset + i);
    return date;
  });

  // Calcular filtros de data baseado no período
  const dateFilters = useMemo(() => {
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    switch (selectedPeriod) {
      case "dia":
        return {
          data_inicio: formatDate(currentDate),
          data_fim: formatDate(currentDate),
        };
      case "semana":
        return {
          data_inicio: formatDate(currentWeek[0]),
          data_fim: formatDate(currentWeek[6]),
        };
      case "mes":
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        return {
          data_inicio: formatDate(firstDay),
          data_fim: formatDate(lastDay),
        };
      default:
        return {};
    }
  }, [selectedPeriod, currentDate, currentWeek]);

  // Buscar dados reais
  const { data: quadrasData, isLoading: isLoadingQuadras } = useQuadras();
  const { data: reservasData, isLoading: isLoadingReservas } = useReservasGestor(dateFilters);
  const { data: horariosData, isLoading: isLoadingHorarios } = useAllHorarios();

  const isLoading = isLoadingQuadras || isLoadingReservas || isLoadingHorarios;

  // Mapear quadras para array de strings
  const courts = useMemo(() => {
    return quadrasData?.map(q => q.nome) || [];
  }, [quadrasData]);

  // Gerar time slots baseado nos horários reais
  const timeSlots = useMemo(() => {
    if (!horariosData || horariosData.length === 0) {
      return [
        "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
        "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
      ];
    }

    // Extrair todos os horários únicos e ordenar
    const horariosUnicos = new Set<string>();
    horariosData.forEach(h => {
      horariosUnicos.add(h.hora_inicio);
    });

    return Array.from(horariosUnicos).sort();
  }, [horariosData]);

  // Mapear reservas para formato compatível com a UI
  const reservations = useMemo(() => {
    if (!reservasData) return [];

    return reservasData.map(r => {
      const reservaDate = new Date(r.data + 'T00:00:00');
      const dayOfWeek = reservaDate.getDay();

      return {
        id: r.id,
        court: r.quadra?.nome || '',
        day: dayOfWeek,
        time: r.horario?.hora_inicio || '',
        organizer: r.organizador?.nome_completo || 'Sem nome',
        participants: r.participantes_count || 0,
        status: r.status,
        phone: r.organizador?.telefone || '',
        email: r.organizador?.email || '',
        notes: r.observacoes || '',
        // Dados extras para integração
        realData: r, // Guardar dados originais
      };
    }) as Reservation[];
  }, [reservasData]);

  const getReservation = (court: string, day: number, time: string) => {
    return reservations.find(r => r.court === court && r.day === day && r.time === time);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  };

  // Modal functions
  const openReservationModal = (reservation: Reservation) => {
    console.log("openReservationModal called with:", reservation);
    setSelectedReservation(reservation);
    setModalMode("view");
    setIsModalOpen(true);
    console.log("Modal state set - isOpen:", true, "mode:", "view");
  };

  const openCreateModal = (court: string, day: number, time: string) => {
    console.log("openCreateModal called with:", { court, day, time });
    const newReservation: Reservation = {
      court,
      day,
      time,
      organizer: "",
      participants: 1,
      status: "pendente",
      phone: "",
      email: "",
      notes: ""
    };

    console.log("New reservation created:", newReservation);
    setSelectedReservation(newReservation);
    setModalMode("create");
    setIsModalOpen(true);
    console.log("Modal state set - isOpen:", true, "mode:", "create");
  };

  const createReservaMutation = useCreateReservaGestor();
  const updateReservaMutation = useUpdateReservaGestor();
  const deleteReservaMutation = useDeleteReservaGestor();

  const handleSaveReservation = async (reservation: Reservation) => {
    try {
      if (modalMode === "create") {
        // TODO: Integrar com hook real de criação
        handleSuccess("Funcionalidade de criação será implementada em breve");
      } else {
        // TODO: Integrar com hook real de atualização
        handleSuccess("Funcionalidade de edição será implementada em breve");
      }
      closeModal();
    } catch (error) {
      handleError(error, 'AgendaPage', 'Erro ao salvar reserva');
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
    try {
      await deleteReservaMutation.mutateAsync(reservationId);
      handleSuccess("Reserva excluída com sucesso");
      closeModal();
    } catch (error) {
      handleError(error, 'AgendaPage', 'Erro ao excluir reserva');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };

  // Função para verificar se uma data/hora já passou
  const isPastDateTime = (date: Date, time?: string) => {
    const now = new Date();
    const checkDate = new Date(date);
    
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      checkDate.setHours(hours, minutes, 0, 0);
    } else {
      // Se não tem horário específico, considera o final do dia
      checkDate.setHours(23, 59, 59, 999);
    }
    
    return checkDate < now;
  };

  // Função para obter classes CSS baseadas no estado da data/hora
  const getSlotClasses = (date: Date, time?: string, hasReservation?: boolean) => {
    const isPast = isPastDateTime(date, time);
    const baseClasses = "rounded text-xs transition-all duration-200";
    
    if (isPast) {
      // Horários/datas passados - não clicáveis, com visual diferenciado
      return `${baseClasses} bg-muted/30 text-muted-foreground/50 cursor-not-allowed opacity-60 ${hasReservation ? 'line-through' : ''} relative after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-muted-foreground/10 after:to-muted-foreground/20 after:pointer-events-none`;
    }
    
    if (hasReservation) {
      // Reservas futuras - clicáveis
      return `${baseClasses} cursor-pointer hover:scale-105 hover:shadow-sm`;
    }
    
    // Horários disponíveis futuros - clicáveis
    return `${baseClasses} bg-muted/50 border border-border hover:bg-muted hover:border-primary/30 hover:shadow-sm cursor-pointer`;
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
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1 relative z-10">
            <button
              onClick={() => setSelectedPeriod("dia")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${selectedPeriod === "dia"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
            >
              Dia
            </button>
            <button
              onClick={() => setSelectedPeriod("semana")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${selectedPeriod === "semana"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
            >
              Semana
            </button>
            <button
              onClick={() => setSelectedPeriod("mes")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${selectedPeriod === "mes"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
            >
              Mês
            </button>
          </div>


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

          {/* Loading State */}
          {isLoading && (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando agenda...</p>
              </CardContent>
            </Card>
          )}

          {/* Calendar Grid */}
          {!isLoading && (
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

                                  const currentSlotDate = selectedPeriod === "dia" ? currentDate : periodData.columns[columnIndex];
                                  const isPast = isPastDateTime(currentSlotDate, selectedPeriod === "mes" ? undefined : time);
                                  
                                  return (
                                    <div
                                      key={court}
                                      onClick={() => {
                                        console.log("Slot clicked:", { court, time, reservation, isPast, selectedPeriod });
                                        if (isPast) return; // Não permite clique em horários passados
                                        
                                        if (reservation) {
                                          console.log("Opening reservation modal for:", reservation);
                                          openReservationModal(reservation);
                                        } else if (selectedPeriod !== "mes") {
                                          const dayToUse = selectedPeriod === "dia" ? currentDate.getDay() : columnIndex;
                                          console.log("Opening create modal for:", { court, dayToUse, time });
                                          openCreateModal(court, dayToUse, time);
                                        }
                                      }}
                                      className={`${selectedPeriod === "mes" ? "p-1" : "p-2"} ${
                                        selectedPeriod === "mes" ? "" :
                                        isPast ? getSlotClasses(currentSlotDate, time, !!reservation) :
                                        reservation
                                          ? reservation.status === 'confirmada'
                                            ? 'bg-success/10 border border-success/20 hover:bg-success/20 hover:scale-105 cursor-pointer rounded text-xs transition-all duration-200'
                                            : reservation.status === 'pendente'
                                            ? 'bg-warning/10 border border-warning/20 hover:bg-warning/20 hover:scale-105 cursor-pointer rounded text-xs transition-all duration-200'
                                            : 'bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 hover:scale-105 cursor-pointer rounded text-xs transition-all duration-200'
                                          : getSlotClasses(currentSlotDate, time, false)
                                      }`}
                                      title={
                                        isPast ? "Horário já passou" :
                                        reservation ?
                                        `${reservation.organizer} - ${reservation.participants} pessoas - ${reservation.status}` :
                                        `Clique para agendar ${court} às ${time}`
                                      }
                                    >
                                      {reservation ? (
                                        <div className={isPast ? "relative" : ""}>
                                          <div className="font-medium truncate">{selectedPeriod === "dia" ? court : court}</div>
                                          <div className="truncate">{reservation.organizer}</div>
                                          <div className="flex items-center gap-1 mt-1">
                                            <Users className="w-3 h-3" />
                                            <span>{reservation.participants}</span>
                                          </div>
                                          {isPast && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                              <div className="w-full h-0.5 bg-muted-foreground/40 rotate-12 transform"></div>
                                            </div>
                                          )}
                                        </div>
                                      ) : selectedPeriod === "mes" ? (
                                        (() => {
                                          // Calcular taxa de ocupação real
                                          const periodReservations = reservations.filter(r => r.court === court);
                                          const totalSlots = timeSlots.length * 30; // Aproximadamente 30 dias
                                          const occupancyRate = totalSlots > 0
                                            ? Math.floor((periodReservations.length / totalSlots) * 100)
                                            : 0;

                                          const getOccupancyColor = (rate: number) => {
                                            if (rate >= 80) return 'bg-success/20 border-success/30 text-success';
                                            if (rate >= 50) return 'bg-warning/20 border-warning/30 text-warning';
                                            return 'bg-muted border-border text-muted-foreground';
                                          };

                                          return (
                                            <div className={`text-center p-3 rounded-lg ${getOccupancyColor(occupancyRate)}`}>
                                              <div className="text-2xl font-bold mb-1">{occupancyRate}%</div>
                                              <div className="text-xs">ocupação</div>
                                              <div className="text-xs text-muted-foreground mt-1">
                                                {periodReservations.length} reservas
                                              </div>
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
          )}

          {/* Current Day Reservations */}
          {!isLoading && (
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
          )}
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

          {/* Loading State */}
          {isLoading && (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando agenda...</p>
              </CardContent>
            </Card>
          )}

          {/* Courts Calendar Grid */}
          {!isLoading && (
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

                          const isPastDay = isPastDateTime(date);

                          return (
                            <div key={courtIndex} className="p-3 min-h-[80px] flex items-center">
                              <div
                                onClick={() => {
                                  console.log("Week view slot clicked:", { court, dayIndex, dayReservations, isPastDay });
                                  if (isPastDay) return; // Não permite clique em dias passados
                                  
                                  if (dayReservations.length === 1 && dayReservations[0]) {
                                    console.log("Opening single reservation:", dayReservations[0]);
                                    openReservationModal(dayReservations[0]);
                                  } else if (dayReservations.length > 1 && dayReservations[0]) {
                                    console.log("Opening first of multiple reservations:", dayReservations[0]);
                                    openReservationModal(dayReservations[0]);
                                  } else {
                                    const firstAvailableTime = timeSlots.find(time =>
                                      !getReservation(court, dayIndex, time)
                                    ) || timeSlots[0];
                                    console.log("Opening create modal for week view:", { court, dayIndex, firstAvailableTime });
                                    openCreateModal(court, dayIndex, firstAvailableTime);
                                  }
                                }}
                                className={`w-full p-3 rounded-lg text-sm transition-all duration-200 ${
                                  isPastDay 
                                    ? 'bg-muted/30 text-muted-foreground/50 cursor-not-allowed opacity-60 relative after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-muted-foreground/10 after:to-muted-foreground/20 after:pointer-events-none'
                                    : dayReservations.length > 0
                                      ? dayReservations[0]?.status === 'confirmada'
                                        ? 'bg-success/10 border border-success/20 hover:bg-success/20 hover:scale-105 cursor-pointer'
                                        : dayReservations[0]?.status === 'pendente'
                                        ? 'bg-warning/10 border border-warning/20 hover:bg-warning/20 hover:scale-105 cursor-pointer'
                                        : 'bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 hover:scale-105 cursor-pointer'
                                      : 'bg-muted/50 border border-border hover:bg-muted hover:border-primary/30 hover:shadow-sm cursor-pointer'
                                }`}
                                title={
                                  isPastDay ? "Data já passou" :
                                  dayReservations.length > 0 ?
                                  `${dayReservations.length} reserva(s) - ${dayReservations[0]?.organizer}${dayReservations.length > 1 ? ` +${dayReservations.length - 1}` : ''}` :
                                  `Clique para agendar ${court} - ${getDayName(date)}`
                                }
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
                            // Calcular reservas reais da quadra
                            const weekReservations = reservations.filter(r => r.court === court).length;
                            const possibleReservations = timeSlots.length * 7; // 7 dias x horários
                            const occupancyRate = possibleReservations > 0
                              ? Math.floor((weekReservations / possibleReservations) * 100)
                              : 0;

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
                                onClick={() => {
                                  console.log("Month/Day view slot clicked:", { court, time, reservation, selectedPeriod });
                                  if (selectedPeriod === "dia") {
                                    const isPast = isPastDateTime(currentDate, time);
                                    if (isPast) return; // Não permite clique em horários passados
                                  }
                                  
                                  if (reservation) {
                                    console.log("Opening reservation from month/day view:", reservation);
                                    openReservationModal(reservation);
                                  } else if (selectedPeriod === "dia") {
                                    console.log("Opening create modal from day view:", { court, day: currentDate.getDay(), time });
                                    openCreateModal(court, currentDate.getDay(), time);
                                  }
                                }}
                                className={`w-full p-3 rounded-lg text-sm transition-all duration-200 ${
                                  selectedPeriod === "dia" && isPastDateTime(currentDate, time)
                                    ? 'bg-muted/30 text-muted-foreground/50 cursor-not-allowed opacity-60 relative after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-muted-foreground/10 after:to-muted-foreground/20 after:pointer-events-none'
                                    : reservation || displayContent
                                      ? reservation?.status === 'confirmada'
                                        ? 'bg-success/10 border border-success/20 hover:bg-success/20 hover:scale-105 cursor-pointer'
                                        : reservation?.status === 'pendente'
                                        ? 'bg-warning/10 border border-warning/20 hover:bg-warning/20 hover:scale-105 cursor-pointer'
                                        : 'bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 hover:scale-105 cursor-pointer'
                                      : 'bg-muted/50 border border-border hover:bg-muted hover:border-primary/30 hover:shadow-sm cursor-pointer'
                                }`}
                                title={
                                  selectedPeriod === "dia" && isPastDateTime(currentDate, time) ? "Horário já passou" :
                                  reservation ?
                                  `${reservation.organizer} - ${reservation.participants} pessoas - ${reservation.status}` :
                                  selectedPeriod === "dia" ? `Clique para agendar ${court} às ${time}` : "Clique para ver detalhes"
                                }
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
          )}

          {/* Courts Summary */}
          {!isLoading && (
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
          )}
        </TabsContent>
      </Tabs>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        reservation={selectedReservation}
        mode={modalMode}
        onSave={handleSaveReservation}
        onDelete={handleDeleteReservation}
        courts={courts}
        timeSlots={timeSlots}
      />
    </div>
  );
}