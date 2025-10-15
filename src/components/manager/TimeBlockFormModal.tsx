/**
 * Time Block Form Modal Component
 * Form for creating and editing time blocks
 */

import { useState, useEffect } from "react";
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
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Wrench, 
  PartyPopper, 
  Sun, 
  MoreHorizontal,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { mockCourts, type TimeBlock, type TimeBlockType, type RecurrenceType } from "../../data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimeBlockFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (blockData: Partial<TimeBlock>) => void;
  editingBlock?: TimeBlock | null;
}

const TIME_BLOCK_TYPES: { value: TimeBlockType; label: string; icon: typeof Wrench; description: string }[] = [
  { 
    value: "maintenance", 
    label: "Manutenção", 
    icon: Wrench,
    description: "Bloqueio para manutenção preventiva ou corretiva"
  },
  { 
    value: "private-event", 
    label: "Evento Privado", 
    icon: PartyPopper,
    description: "Bloqueio para eventos corporativos ou privados"
  },
  { 
    value: "holiday", 
    label: "Feriado", 
    icon: Sun,
    description: "Bloqueio por feriado ou data comemorativa"
  },
  { 
    value: "other", 
    label: "Outro", 
    icon: MoreHorizontal,
    description: "Bloqueio por outros motivos"
  },
];

const RECURRENCE_OPTIONS: { value: RecurrenceType; label: string; description: string }[] = [
  { value: "none", label: "Não se repete", description: "Bloqueio único" },
  { value: "daily", label: "Diariamente", description: "Repete todos os dias" },
  { value: "weekly", label: "Semanalmente", description: "Repete toda semana" },
  { value: "monthly", label: "Mensalmente", description: "Repete todo mês" },
];

export function TimeBlockFormModal({
  open,
  onOpenChange,
  onSave,
  editingBlock,
}: TimeBlockFormModalProps) {
  const [courtId, setCourtId] = useState<string>("");
  const [type, setType] = useState<TimeBlockType>("maintenance");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with editing block data
  useEffect(() => {
    if (editingBlock) {
      setCourtId(editingBlock.courtId.toString());
      setType(editingBlock.type);
      setStartDate(new Date(editingBlock.startDate));
      setEndDate(new Date(editingBlock.endDate));
      setStartTime(editingBlock.startTime);
      setEndTime(editingBlock.endTime);
      setReason(editingBlock.reason);
      setDescription(editingBlock.description || "");
      setRecurrence(editingBlock.recurrence);
    } else {
      resetForm();
    }
  }, [editingBlock, open]);

  const resetForm = () => {
    setCourtId("");
    setType("maintenance");
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("08:00");
    setEndTime("18:00");
    setReason("");
    setDescription("");
    setRecurrence("none");
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!courtId) {
      newErrors.courtId = "Selecione uma quadra";
    }

    if (!startDate) {
      newErrors.startDate = "Selecione a data de início";
    }

    if (!endDate) {
      newErrors.endDate = "Selecione a data de término";
    }

    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = "Data de término deve ser após a data de início";
    }

    if (!reason.trim()) {
      newErrors.reason = "Informe o motivo do bloqueio";
    }

    if (!startTime) {
      newErrors.startTime = "Informe o horário de início";
    }

    if (!endTime) {
      newErrors.endTime = "Informe o horário de término";
    }

    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = "Horário de término deve ser após o horário de início";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const court = mockCourts.find((c) => c.id === parseInt(courtId));
    if (!court) return;

    const blockData: Partial<TimeBlock> = {
      courtId: parseInt(courtId),
      courtName: court.name,
      type,
      startDate: format(startDate!, "yyyy-MM-dd"),
      endDate: format(endDate!, "yyyy-MM-dd"),
      startTime,
      endTime,
      reason: reason.trim(),
      description: description.trim() || undefined,
      recurrence,
    };

    onSave(blockData);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const selectedTypeConfig = TIME_BLOCK_TYPES.find((t) => t.value === type);
  const TypeIcon = selectedTypeConfig?.icon || Wrench;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingBlock ? "Editar Bloqueio" : "Novo Bloqueio de Horário"}
          </DialogTitle>
          <DialogDescription>
            {editingBlock
              ? "Atualize as informações do bloqueio de horário"
              : "Crie um novo bloqueio para manutenção, eventos ou feriados"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Court Selection */}
          <div className="space-y-2">
            <Label htmlFor="court">
              Quadra <span className="text-destructive">*</span>
            </Label>
            <Select value={courtId} onValueChange={setCourtId}>
              <SelectTrigger id="court" className={errors.courtId ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione a quadra" />
              </SelectTrigger>
              <SelectContent>
                {mockCourts.map((court) => (
                  <SelectItem key={court.id} value={court.id.toString()}>
                    {court.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.courtId && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.courtId}
              </p>
            )}
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <Label>
              Tipo de Bloqueio <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {TIME_BLOCK_TYPES.map((blockType) => {
                const Icon = blockType.icon;
                const isSelected = type === blockType.value;
                return (
                  <Card
                    key={blockType.value}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/30"
                    }`}
                    onClick={() => setType(blockType.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${
                            isSelected ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className={isSelected ? "text-primary" : ""}>
                            {blockType.label}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {blockType.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Data de Início <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left ${
                      errors.startDate ? "border-destructive" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span className="text-muted-foreground">Selecione</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Data de Término <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left ${
                      errors.endDate ? "border-destructive" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span className="text-muted-foreground">Selecione</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    locale={ptBR}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">
                Horário de Início <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={`pl-9 ${errors.startTime ? "border-destructive" : ""}`}
                />
              </div>
              {errors.startTime && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.startTime}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">
                Horário de Término <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`pl-9 ${errors.endTime ? "border-destructive" : ""}`}
                />
              </div>
              {errors.endTime && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.endTime}
                </p>
              )}
            </div>
          </div>

          {/* Recurrence */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Recorrência
            </Label>
            <Select value={recurrence} onValueChange={(value) => setRecurrence(value as RecurrenceType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECURRENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div>{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Motivo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reason"
              placeholder="Ex: Manutenção preventiva, Evento corporativo, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={errors.reason ? "border-destructive" : ""}
            />
            {errors.reason && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.reason}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Adicione detalhes adicionais sobre o bloqueio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary */}
          {courtId && startDate && endDate && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <TypeIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1 text-sm">
                    <p className="text-muted-foreground">Resumo do bloqueio:</p>
                    <p>
                      <strong>{mockCourts.find((c) => c.id === parseInt(courtId))?.name}</strong>{" "}
                      será bloqueada de{" "}
                      <strong>{format(startDate, "dd/MM/yyyy", { locale: ptBR })}</strong>
                      {startDate.getTime() !== endDate.getTime() && (
                        <> até <strong>{format(endDate, "dd/MM/yyyy", { locale: ptBR })}</strong></>
                      )}{" "}
                      das <strong>{startTime}</strong> às <strong>{endTime}</strong>
                      {recurrence !== "none" && (
                        <> ({RECURRENCE_OPTIONS.find((r) => r.value === recurrence)?.label.toLowerCase()})</>
                      )}
                      .
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingBlock ? "Atualizar Bloqueio" : "Criar Bloqueio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
