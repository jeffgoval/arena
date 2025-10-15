import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Clock, DollarSign, Copy, Star } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { mockCourtPrices, type CourtPrice } from "../../data/mockData";

interface WorkingHours {
  [key: string]: {
    enabled: boolean;
    open: string;
    close: string;
  };
}

interface CourtScheduleConfigProps {
  workingHours: WorkingHours;
  onWorkingHoursChange: (hours: WorkingHours) => void;
  courtId?: number;
}

const daysOfWeek = [
  { key: "monday", label: "Segunda-feira" },
  { key: "tuesday", label: "Terça-feira" },
  { key: "wednesday", label: "Quarta-feira" },
  { key: "thursday", label: "Quinta-feira" },
  { key: "friday", label: "Sexta-feira" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

const slotIntervals = [
  { value: "30", label: "30 minutos" },
  { value: "60", label: "1 hora" },
  { value: "90", label: "1 hora e 30 min" },
  { value: "120", label: "2 horas" },
];

export function CourtScheduleConfig({
  workingHours,
  onWorkingHoursChange,
  courtId,
}: CourtScheduleConfigProps) {
  const [slotInterval, setSlotInterval] = useState("60");
  const [showPricing, setShowPricing] = useState(false);
  
  // Get prices for this court
  const courtPrices = courtId
    ? mockCourtPrices.filter((p) => p.courtId === courtId)
    : [];

  const handleDayToggle = (day: string, enabled: boolean) => {
    onWorkingHoursChange({
      ...workingHours,
      [day]: {
        ...workingHours[day],
        enabled,
      },
    });
  };

  const handleTimeChange = (day: string, field: "open" | "close", value: string) => {
    onWorkingHoursChange({
      ...workingHours,
      [day]: {
        ...workingHours[day],
        [field]: value,
      },
    });
  };

  const handleCopyToAll = (day: string) => {
    const sourceDay = workingHours[day];
    const updatedHours = { ...workingHours };
    
    daysOfWeek.forEach(({ key }) => {
      if (key !== day) {
        updatedHours[key] = {
          ...sourceDay,
        };
      }
    });
    
    onWorkingHoursChange(updatedHours);
    toast.success("Horários copiados para todos os dias!");
  };

  // Calculate total slots per week
  const calculateTotalSlots = () => {
    let total = 0;
    const interval = parseInt(slotInterval);
    
    daysOfWeek.forEach(({ key }) => {
      const day = workingHours[key];
      if (day.enabled) {
        const openTime = parseInt(day.open.split(":")[0]);
        const closeTime = parseInt(day.close.split(":")[0]);
        const hours = closeTime - openTime;
        const slots = Math.floor((hours * 60) / interval);
        total += slots;
      }
    });
    
    return total;
  };

  return (
    <div className="space-y-6">
      {/* Slot Interval */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Intervalo de Slots
          </CardTitle>
          <CardDescription>
            Defina a duração padrão de cada horário de reserva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={slotInterval} onValueChange={setSlotInterval}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {slotIntervals.map((interval) => (
                  <SelectItem key={interval.value} value={interval.value}>
                    {interval.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Total de {calculateTotalSlots()} slots disponíveis por semana
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Horários de Funcionamento</CardTitle>
              <CardDescription>
                Configure os horários de abertura e fechamento por dia da semana
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3">
            {daysOfWeek.map(({ key, label }) => (
              <div key={key} className="grid grid-cols-[90px_1fr] gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`${key}-enabled`}
                    checked={workingHours[key].enabled}
                    onCheckedChange={(checked) => handleDayToggle(key, checked)}
                  />
                  <Label htmlFor={`${key}-enabled`} className="cursor-pointer text-sm">
                    {{
                      "Segunda-feira": "Seg",
                      "Terça-feira": "Ter",
                      "Quarta-feira": "Qua",
                      "Quinta-feira": "Qui",
                      "Sexta-feira": "Sex",
                      "Sábado": "Sáb",
                      "Domingo": "Dom"
                    }[label] || label}
                  </Label>
                </div>
                
                {workingHours[key].enabled ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-12">Abre:</span>
                      <Input
                        id={`${key}-open`}
                        type="time"
                        value={workingHours[key].open}
                        onChange={(e) => handleTimeChange(key, "open", e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-12">Fecha:</span>
                      <Input
                        id={`${key}-close`}
                        type="time"
                        value={workingHours[key].close}
                        onChange={(e) => handleTimeChange(key, "close", e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Fechado</span>
                )}
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const mondayHours = workingHours.monday;
                const updatedHours = { ...workingHours };
                daysOfWeek.forEach(({ key }) => {
                  updatedHours[key] = { ...mondayHours };
                });
                onWorkingHoursChange(updatedHours);
                toast.success("Horários de segunda-feira copiados para todos os dias!");
              }}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copiar Segunda para Todos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      {courtId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Configuração de Preços
                </CardTitle>
                <CardDescription>
                  Valores por horário (avulso vs mensalista)
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPricing(!showPricing)}
              >
                {showPricing ? "Ocultar" : "Mostrar"} Tabela
              </Button>
            </div>
          </CardHeader>
          {showPricing && (
            <CardContent>
              {courtPrices.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Horário</TableHead>
                        <TableHead className="text-right">Avulso</TableHead>
                        <TableHead className="text-right">Mensalista</TableHead>
                        <TableHead className="text-center">Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courtPrices.map((price) => (
                        <TableRow key={price.timeSlot}>
                          <TableCell className="font-medium">{price.timeSlot}</TableCell>
                          <TableCell className="text-right">
                            R$ {price.casual.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            R$ {price.monthly.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            {price.isPeak && (
                              <Badge variant="secondary" className="gap-1">
                                <Star className="h-3 w-3" />
                                Horário Nobre
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum preço configurado ainda
                </p>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview de Disponibilidade</CardTitle>
          <CardDescription>
            Resumo dos horários de funcionamento configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {daysOfWeek.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium">{label}:</span>
                <span className="text-sm text-muted-foreground">
                  {workingHours[key].enabled
                    ? `${workingHours[key].open} - ${workingHours[key].close}`
                    : "Fechado"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
