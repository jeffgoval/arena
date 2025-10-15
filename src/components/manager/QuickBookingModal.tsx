import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react";

interface QuickBookingModalProps {
  slot: { date: string; time: string; courtId: string } | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const courts = [
  { id: "1", name: "Quadra 1 - Society" },
  { id: "2", name: "Quadra 2 - Poliesportiva" },
  { id: "3", name: "Quadra 3 - Beach Tennis" }
];

const mockClients = [
  "Carlos Silva",
  "Ana Paula",
  "Roberto Santos",
  "Maria Oliveira",
  "João Santos",
  "Pedro Costa"
];

export function QuickBookingModal({ slot, isOpen, onClose, onConfirm }: QuickBookingModalProps) {
  const [clientName, setClientName] = useState("");
  const [bookingType, setBookingType] = useState<"avulsa" | "mensalista" | "recorrente">("avulsa");
  const [participants, setParticipants] = useState("10");
  const [value, setValue] = useState("120");
  const [duration, setDuration] = useState("1");
  const [selectedCourt, setSelectedCourt] = useState(slot?.courtId || "1");

  if (!slot) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateEndTime = (startTime: string, durationHours: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = (hours + parseInt(durationHours)) % 24;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
    // Reset form
    setClientName("");
    setBookingType("avulsa");
    setParticipants("10");
    setValue("120");
    setDuration("1");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Reserva Rápida</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova reserva
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Date and Time Info */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatDate(slot.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{slot.time} - {calculateEndTime(slot.time, duration)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {courts.find(c => c.id === selectedCourt)?.name}
                </span>
              </div>
            </div>

            {/* Court Selection */}
            <div className="space-y-2">
              <Label htmlFor="court">Quadra</Label>
              <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                <SelectTrigger id="court">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courts.map(court => (
                    <SelectItem key={court.id} value={court.id}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select value={clientName} onValueChange={setClientName}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map(client => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Booking Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Reserva</Label>
              <Select value={bookingType} onValueChange={(v) => setBookingType(v as any)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="avulsa">Avulsa</SelectItem>
                  <SelectItem value="mensalista">Mensalista</SelectItem>
                  <SelectItem value="recorrente">Recorrente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (horas)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hora</SelectItem>
                  <SelectItem value="2">2 horas</SelectItem>
                  <SelectItem value="3">3 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Participants */}
              <div className="space-y-2">
                <Label htmlFor="participants">Participantes</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="participants"
                    type="number"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    className="pl-9"
                    min="1"
                    max="50"
                  />
                </div>
              </div>

              {/* Value */}
              <div className="space-y-2">
                <Label htmlFor="value">Valor (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="value"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="pl-9"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90">
              Criar Reserva
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
