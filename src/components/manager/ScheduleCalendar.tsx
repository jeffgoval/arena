import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Download,
  Filter,
  Clock,
  Users,
  MapPin
} from "lucide-react";
import { BookingDetailModal } from "./BookingDetailModal";
import { QuickBookingModal } from "./QuickBookingModal";
import { TimeBlockFormModal } from "./TimeBlockFormModal";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

// Month View Component
interface MonthViewProps {
  currentDate: Date;
  bookings: Booking[];
  selectedCourt: string;
  onDayClick: (date: Date) => void;
  onBookingClick: (booking: Booking) => void;
}

function MonthView({ currentDate, bookings, selectedCourt, onDayClick, onBookingClick }: MonthViewProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getBookingsForDay = (date: Date | null) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(b => 
      b.date === dateString && 
      (selectedCourt === "all" || b.courtId === selectedCourt)
    );
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Card>
      <CardContent className="p-6">
        {/* Month Name */}
        <div className="text-center mb-6">
          <h3 className="capitalize">{monthName}</h3>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayBookings = getBookingsForDay(day);
            const isToday = day && day.getTime() === today.getTime();
            const isPast = day && day < today;
            
            return (
              <motion.button
                key={index}
                whileHover={day ? { scale: 1.02 } : undefined}
                whileTap={day ? { scale: 0.98 } : undefined}
                onClick={() => day && onDayClick(day)}
                disabled={!day}
                className={`
                  relative min-h-[100px] p-2 rounded-lg border transition-all
                  ${!day ? "invisible" : ""}
                  ${isToday ? "border-primary bg-primary/5" : "border-border"}
                  ${isPast && !isToday ? "opacity-50" : ""}
                  ${day && !isPast ? "hover:bg-muted/50 cursor-pointer" : ""}
                  ${!day ? "" : ""}
                `}
              >
                {day && (
                  <>
                    {/* Day Number */}
                    <div className={`
                      text-sm font-medium mb-1
                      ${isToday ? "text-primary" : ""}
                    `}>
                      {day.getDate()}
                    </div>

                    {/* Bookings */}
                    <div className="space-y-1">
                      {dayBookings.slice(0, 3).map((booking) => (
                        <div
                          key={booking.id}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookingClick(booking);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              onBookingClick(booking);
                            }
                          }}
                          className={`
                            w-full text-left px-1.5 py-0.5 rounded text-xs truncate cursor-pointer
                            ${booking.type === "avulsa" ? "bg-primary/20 text-primary" : ""}
                            ${booking.type === "mensalista" ? "bg-accent/20 text-accent" : ""}
                            ${booking.type === "recorrente" ? "bg-info/20 text-info" : ""}
                            hover:opacity-80 transition-opacity
                          `}
                        >
                          {booking.startTime} {booking.clientName.split(' ')[0]}
                        </div>
                      ))}
                      
                      {dayBookings.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{dayBookings.length - 3} mais
                        </div>
                      )}
                    </div>

                    {/* Booking Count Badge */}
                    {dayBookings.length > 0 && (
                      <div className="absolute top-1 right-1">
                        <Badge variant="secondary" className="text-xs h-5 w-5 flex items-center justify-center p-0">
                          {dayBookings.length}
                        </Badge>
                      </div>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-primary/20" />
            <span>Avulsa</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-accent/20" />
            <span>Mensalista</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-info/20" />
            <span>Recorrente</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "avulsa" | "mensalista" | "recorrente";
  status: "confirmed" | "pending" | "cancelled";
  value: number;
  participants?: number;
}

interface ScheduleCalendarProps {
  selectedCourt: string;
  onCourtChange: (court: string) => void;
}

// Mock data
const mockBookings: Booking[] = [
  {
    id: "1",
    courtId: "1",
    courtName: "Quadra 1 - Society",
    clientName: "Carlos Silva",
    date: "2025-10-13",
    startTime: "08:00",
    endTime: "09:00",
    type: "avulsa",
    status: "confirmed",
    value: 120,
    participants: 10
  },
  {
    id: "2",
    courtId: "1",
    courtName: "Quadra 1 - Society",
    clientName: "Ana Paula",
    date: "2025-10-13",
    startTime: "10:00",
    endTime: "11:00",
    type: "mensalista",
    status: "confirmed",
    value: 100,
    participants: 8
  },
  {
    id: "3",
    courtId: "2",
    courtName: "Quadra 2 - Poliesportiva",
    clientName: "Roberto Santos",
    date: "2025-10-13",
    startTime: "14:00",
    endTime: "15:00",
    type: "avulsa",
    status: "pending",
    value: 80,
    participants: 12
  },
  {
    id: "4",
    courtId: "1",
    courtName: "Quadra 1 - Society",
    clientName: "Maria Oliveira",
    date: "2025-10-14",
    startTime: "18:00",
    endTime: "19:00",
    type: "recorrente",
    status: "confirmed",
    value: 150,
    participants: 10
  },
  {
    id: "5",
    courtId: "3",
    courtName: "Quadra 3 - Beach Tennis",
    clientName: "João Santos",
    date: "2025-10-14",
    startTime: "16:00",
    endTime: "17:00",
    type: "avulsa",
    status: "confirmed",
    value: 90,
    participants: 4
  }
];

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const courts = [
  { id: "all", name: "Todas as Quadras" },
  { id: "1", name: "Quadra 1 - Society" },
  { id: "2", name: "Quadra 2 - Poliesportiva" },
  { id: "3", name: "Quadra 3 - Beach Tennis" }
];

export function ScheduleCalendar({ selectedCourt, onCourtChange }: ScheduleCalendarProps) {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [showQuickBooking, setShowQuickBooking] = useState(false);
  const [quickBookingSlot, setQuickBookingSlot] = useState<{ date: string; time: string; courtId: string } | null>(null);
  const [showTimeBlockModal, setShowTimeBlockModal] = useState(false);

  // Get current week dates
  const getWeekDates = (date: Date) => {
    const week = [];
    const current = new Date(date);
    const day = current.getDay();
    const diff = current.getDate() - day;
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(current.setDate(diff + i));
      week.push({
        date: weekDate,
        dateString: weekDate.toISOString().split('T')[0],
        dayName: weekDays[weekDate.getDay()],
        dayNumber: weekDate.getDate()
      });
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);

  // Navigate weeks
  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  // Navigate days
  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  // Get bookings for a specific date and time
  const getBookingForSlot = (dateString: string, time: string, courtId: string) => {
    return mockBookings.find(
      b => b.date === dateString && 
           b.startTime === time && 
           (selectedCourt === "all" || b.courtId === selectedCourt || b.courtId === courtId)
    );
  };

  // Handle booking click
  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingDetail(true);
  };

  // Handle empty slot click (create quick booking)
  const handleEmptySlotClick = (dateString: string, time: string, courtId: string) => {
    setQuickBookingSlot({ date: dateString, time, courtId });
    setShowQuickBooking(true);
  };

  // Filter bookings by search
  const filteredBookings = mockBookings.filter(booking => 
    booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.courtName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get booking color by type
  const getBookingColor = (type: Booking["type"]) => {
    switch (type) {
      case "avulsa":
        return "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30";
      case "mensalista":
        return "bg-accent/20 text-accent border-accent/30 hover:bg-accent/30";
      case "recorrente":
        return "bg-info/20 text-info border-info/30 hover:bg-info/30";
      default:
        return "bg-muted";
    }
  };

  // Get status badge
  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-xs">Confirmado</Badge>;
      case "pending":
        return <Badge variant="secondary" className="text-xs">Pendente</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="text-xs">Cancelado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Agenda</h2>
          <p className="text-muted-foreground">
            {viewMode === "day" && currentDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {viewMode === "week" && `${weekDates[0].date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${weekDates[6].date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`}
            {viewMode === "month" && currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar reservas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[200px]"
            />
          </div>

          {/* Court Filter */}
          <Select value={selectedCourt} onValueChange={onCourtChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione a quadra" />
            </SelectTrigger>
            <SelectContent>
              {courts.map(court => (
                <SelectItem key={court.id} value={court.id}>
                  {court.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button variant="outline" onClick={() => toast.success("Exportando agenda...")}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>

          {/* Block Time Button */}
          <Button className="bg-accent hover:bg-accent/90" onClick={() => setShowTimeBlockModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Bloquear Horário
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList>
                <TabsTrigger value="day">Dia</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mês</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (viewMode === "day") navigateDay("prev");
                  else if (viewMode === "week") navigateWeek("prev");
                  else navigateMonth("prev");
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (viewMode === "day") navigateDay("next");
                  else if (viewMode === "week") navigateWeek("next");
                  else navigateMonth("next");
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="flex flex-wrap gap-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-available" />
            <span className="text-sm">Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-primary" />
            <span className="text-sm">Avulsa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-accent" />
            <span className="text-sm">Mensalista</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-info" />
            <span className="text-sm">Recorrente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-blocked" />
            <span className="text-sm">Bloqueado</span>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <AnimatePresence mode="wait">
        {viewMode === "week" && (
          <motion.div
            key="week"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <div className="min-w-[1000px]">
                    {/* Header */}
                    <div className="grid grid-cols-8 border-b bg-muted/50 sticky top-0 z-10">
                      <div className="p-4 font-medium">Horário</div>
                      {weekDates.map((day) => (
                        <div key={day.dateString} className="p-4 text-center border-l">
                          <div className="font-medium">{day.dayName}</div>
                          <div className="text-sm text-muted-foreground">
                            {day.dayNumber}/{currentDate.getMonth() + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Time Slots */}
                    {timeSlots.map((time) => {
                      // Get all bookings for this time slot across all days
                      const slotBookings = weekDates.map(day => ({
                        day,
                        booking: getBookingForSlot(day.dateString, time, selectedCourt !== "all" ? selectedCourt : "1")
                      }));
                      
                      return (
                        <div key={time} className="grid grid-cols-8 border-b hover:bg-muted/30 transition-colors min-h-[72px]">
                          <div className="p-4 font-medium bg-muted/30 flex items-center text-sm">
                            {time}
                          </div>
                          {slotBookings.map(({ day, booking }) => (
                            <div 
                              key={`${day.dateString}-${time}`} 
                              className="p-2 border-l flex flex-col gap-1"
                            >
                              {booking ? (
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => handleBookingClick(booking)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      handleBookingClick(booking);
                                    }
                                  }}
                                  className={`
                                    w-full px-2 py-1.5 rounded text-xs truncate cursor-pointer
                                    transition-all hover:opacity-80
                                    ${booking.type === "avulsa" ? "bg-primary/20 text-primary border border-primary/30" : ""}
                                    ${booking.type === "mensalista" ? "bg-accent/20 text-accent border border-accent/30" : ""}
                                    ${booking.type === "recorrente" ? "bg-info/20 text-info border border-info/30" : ""}
                                  `}
                                >
                                  <div className="font-medium truncate">
                                    {booking.clientName.split(' ')[0]}
                                  </div>
                                  <div className="text-[10px] opacity-80 flex items-center gap-1 mt-0.5">
                                    <Users className="h-2.5 w-2.5" />
                                    {booking.participants || 0}
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEmptySlotClick(day.dateString, time, selectedCourt !== "all" ? selectedCourt : "1")}
                                  className="w-full h-full rounded flex items-center justify-center bg-available/5 hover:bg-available/15 transition-all border border-dashed border-available/20 group min-h-[56px]"
                                >
                                  <Plus className="h-3.5 w-3.5 text-available opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {viewMode === "day" && (
          <motion.div
            key="day"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 space-y-2">
                {timeSlots.map((time) => {
                  const dateString = currentDate.toISOString().split('T')[0];
                  const booking = getBookingForSlot(dateString, time, selectedCourt !== "all" ? selectedCourt : "1");
                  
                  return (
                    <div key={time} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-20 font-medium text-sm text-muted-foreground">{time}</div>
                      <div className="flex-1">
                        {booking ? (
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => handleBookingClick(booking)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleBookingClick(booking);
                              }
                            }}
                            className={`
                              w-full p-4 rounded-lg flex items-center justify-between border cursor-pointer
                              transition-all hover:opacity-90
                              ${booking.type === "avulsa" ? "bg-primary/20 text-primary border-primary/30" : ""}
                              ${booking.type === "mensalista" ? "bg-accent/20 text-accent border-accent/30" : ""}
                              ${booking.type === "recorrente" ? "bg-info/20 text-info border-info/30" : ""}
                            `}
                          >
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="font-medium">{booking.clientName}</div>
                                <div className="text-sm opacity-80 flex items-center gap-4 mt-1">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {booking.courtName}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {booking.participants} pessoas
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {booking.startTime} - {booking.endTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">R$ {booking.value}</div>
                              {getStatusBadge(booking.status)}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEmptySlotClick(dateString, time, selectedCourt !== "all" ? selectedCourt : "1")}
                            className="w-full p-4 rounded-lg flex items-center justify-center border border-dashed border-available/30 bg-available/5 hover:bg-available/10 transition-all group"
                          >
                            <Plus className="h-4 w-4 text-available mr-2" />
                            <span className="text-sm text-available">Criar reserva rápida</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {viewMode === "month" && (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MonthView 
              currentDate={currentDate}
              bookings={mockBookings}
              selectedCourt={selectedCourt}
              onDayClick={(date) => {
                setCurrentDate(date);
                setViewMode("day");
              }}
              onBookingClick={handleBookingClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={showBookingDetail}
        onClose={() => setShowBookingDetail(false)}
      />

      <QuickBookingModal
        slot={quickBookingSlot}
        isOpen={showQuickBooking}
        onClose={() => setShowQuickBooking(false)}
        onConfirm={() => {
          toast.success("Reserva criada com sucesso!");
          setShowQuickBooking(false);
        }}
      />

      {/* Time Block Modal */}
      <TimeBlockFormModal
        open={showTimeBlockModal}
        onOpenChange={setShowTimeBlockModal}
        onSave={(blockData) => {
          toast.success("Bloqueio de horário criado com sucesso!");
          setShowTimeBlockModal(false);
        }}
      />
    </div>
  );
}
