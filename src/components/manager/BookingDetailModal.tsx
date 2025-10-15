import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

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

interface BookingDetailModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailModal({ booking, isOpen, onClose }: BookingDetailModalProps) {
  if (!booking) return null;

  const handleConfirm = () => {
    toast.success("Reserva confirmada!");
    onClose();
  };

  const handleCancel = () => {
    toast.error("Reserva cancelada");
    onClose();
  };

  const handleEdit = () => {
    toast.info("Funcionalidade de edição em breve!");
  };

  const handleDelete = () => {
    toast.error("Reserva excluída");
    onClose();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "avulsa":
        return "Avulsa";
      case "mensalista":
        return "Mensalista";
      case "recorrente":
        return "Recorrente";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success">Confirmado</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle>Detalhes da Reserva</DialogTitle>
              <DialogDescription>ID: #{booking.id}</DialogDescription>
            </div>
            {getStatusBadge(booking.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              Informações do Cliente
            </h3>
            <div className="space-y-2.5 bg-muted/30 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground min-w-[80px]">Nome:</span>
                <span className="font-medium text-sm flex-1">{booking.clientName}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground min-w-[80px]">Email:</span>
                <span className="font-medium text-sm flex-1 flex items-center gap-2">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  cliente@email.com
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground min-w-[80px]">Telefone:</span>
                <span className="font-medium text-sm flex-1 flex items-center gap-2">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  (11) 98765-4321
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              Informações da Reserva
            </h3>
            <div className="space-y-2.5 bg-muted/30 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground min-w-[80px]">Data:</span>
                <span className="font-medium text-sm flex-1">{formatDate(booking.date)}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground min-w-[80px]">Horário:</span>
                <span className="font-medium text-sm flex-1 flex items-center gap-2">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  {booking.startTime} - {booking.endTime}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground min-w-[80px]">Quadra:</span>
                <span className="font-medium text-sm flex-1 flex items-center gap-2">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  {booking.courtName}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground min-w-[80px]">Tipo:</span>
                <span className="flex-1">
                  <Badge variant="outline" className="text-xs">{getTypeLabel(booking.type)}</Badge>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground min-w-[80px]">Participantes:</span>
                <span className="font-medium text-sm flex-1">{booking.participants || 0} pessoas</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-primary" />
              Informações de Pagamento
            </h3>
            <div className="space-y-2.5 bg-muted/30 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground min-w-[80px]">Valor:</span>
                <span className="font-bold text-primary flex-1">R$ {booking.value.toFixed(2)}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground min-w-[80px]">Status:</span>
                <span className="flex-1">
                  <Badge className="bg-success text-xs">Pago</Badge>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground min-w-[80px]">Método:</span>
                <span className="font-medium text-sm flex-1">Cartão de Crédito</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <Separator />
          
          <div className="space-y-2">
            {booking.status === "pending" && (
              <Button onClick={handleConfirm} className="w-full bg-success hover:bg-success/90">
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirmar Reserva
              </Button>
            )}
            
            {booking.status !== "cancelled" && (
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleEdit} variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                
                <Button onClick={handleCancel} variant="destructive" className="w-full">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            )}
            
            <Button onClick={handleDelete} variant="ghost" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Reserva
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
