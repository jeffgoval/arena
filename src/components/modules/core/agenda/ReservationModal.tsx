"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Trash2, 
  Edit3,
  Phone,
  Mail
} from "lucide-react";

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

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation?: Reservation | null;
  mode: "view" | "edit" | "create";
  onSave?: (reservation: Reservation) => void;
  onDelete?: (reservationId: string) => void;
  courts: string[];
  timeSlots: string[];
}

export function ReservationModal({
  isOpen,
  onClose,
  reservation,
  mode,
  onSave,
  onDelete,
  courts,
  timeSlots
}: ReservationModalProps) {
  const [formData, setFormData] = useState<Reservation>({
    court: reservation?.court || "",
    day: reservation?.day || 0,
    time: reservation?.time || "",
    organizer: reservation?.organizer || "",
    participants: reservation?.participants || 1,
    status: reservation?.status || "pendente",
    phone: reservation?.phone || "",
    email: reservation?.email || "",
    notes: reservation?.notes || "",
  });

  const [editMode, setEditMode] = useState(mode === "create" || mode === "edit");

  // Update form data when reservation or mode changes
  useEffect(() => {
    if (mode === "create") {
      // Para modo create, inicializar com valores padrão ou dados passados
      setFormData({
        court: reservation?.court || (courts.length > 0 ? courts[0] : ""),
        day: reservation?.day ?? 0,
        time: reservation?.time || (timeSlots.length > 0 ? timeSlots[0] : ""),
        organizer: reservation?.organizer || "",
        participants: reservation?.participants || 1,
        status: "pendente",
        phone: reservation?.phone || "",
        email: reservation?.email || "",
        notes: reservation?.notes || "",
      });
    } else if (reservation) {
      // Para view/edit, usar dados da reserva
      setFormData({
        court: reservation.court || "",
        day: reservation.day || 0,
        time: reservation.time || "",
        organizer: reservation.organizer || "",
        participants: reservation.participants || 1,
        status: reservation.status || "pendente",
        phone: reservation.phone || "",
        email: reservation.email || "",
        notes: reservation.notes || "",
      });
    }
    setEditMode(mode === "create" || mode === "edit");
  }, [reservation, mode, courts, timeSlots]);

  const handleSave = () => {
    if (onSave) {
      onSave({ ...formData, id: reservation?.id });
    }
    onClose();
  };

  const handleDelete = () => {
    if (reservation?.id && onDelete) {
      onDelete(reservation.id);
    }
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "bg-success text-success-foreground";
      case "pendente":
        return "bg-warning text-warning-foreground";
      case "cancelada":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getModalTitle = () => {
    if (mode === "create") return "Nova Reserva";
    if (editMode) return "Editar Reserva";
    return "Detalhes da Reserva";
  };

  const getDayName = (day: number) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return days[day];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge - apenas visualização */}
          {!editMode && reservation && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge className={getStatusColor(formData.status)}>
                {formData.status}
              </Badge>
            </div>
          )}

          {/* Organizador */}
          <div className="space-y-2">
            <Label htmlFor="organizer">Organizador</Label>
            {editMode ? (
              <Input
                id="organizer"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                placeholder="Nome do organizador"
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{formData.organizer}</span>
              </div>
            )}
          </div>

          {/* Quadra */}
          <div className="space-y-2">
            <Label htmlFor="court">Quadra</Label>
            {editMode ? (
              <Select
                value={formData.court}
                onValueChange={(value) => setFormData({ ...formData, court: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a quadra" />
                </SelectTrigger>
                <SelectContent>
                  {courts.map((court) => (
                    <SelectItem key={court} value={court}>
                      {court}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{formData.court}</span>
              </div>
            )}
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dia</Label>
              {editMode ? (
                <Select
                  value={formData.day.toString()}
                  onValueChange={(value) => setFormData({ ...formData, day: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 7 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {getDayName(i)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{getDayName(formData.day)}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Horário</Label>
              {editMode ? (
                <Select
                  value={formData.time}
                  onValueChange={(value) => setFormData({ ...formData, time: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{formData.time}</span>
                </div>
              )}
            </div>
          </div>

          {/* Participantes */}
          <div className="space-y-2">
            <Label htmlFor="participants">Número de Participantes</Label>
            {editMode ? (
              <Input
                id="participants"
                type="number"
                min="1"
                max="50"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 1 })}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{formData.participants} pessoas</span>
              </div>
            )}
          </div>

          {/* Status - apenas em modo de edição */}
          {editMode && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "confirmada" | "pendente" | "cancelada") => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Contato */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              {editMode ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              ) : formData.phone ? (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{formData.phone}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Não informado</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              {editMode ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              ) : formData.email ? (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{formData.email}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Não informado</span>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            {editMode ? (
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observações adicionais..."
                rows={3}
              />
            ) : formData.notes ? (
              <div className="p-2 bg-muted/50 rounded-md">
                <span className="text-sm">{formData.notes}</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Nenhuma observação</span>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {mode === "view" && !editMode && (
            <>
              <Button
                variant="outline"
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </Button>
              {reservation?.id && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </Button>
              )}
            </>
          )}

          {editMode && (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {mode === "create" ? "Criar Reserva" : "Salvar Alterações"}
              </Button>
            </>
          )}

          {mode === "view" && !editMode && (
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}