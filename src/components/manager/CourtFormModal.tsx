import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { toast } from "sonner@2.0.3";
import { Loader2 } from "lucide-react";
import { CourtScheduleConfig } from "./CourtScheduleConfig";
import type { Court, CourtType, CourtStatus } from "../../data/mockData";

interface CourtFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  court?: Court;
  onSave: (court: Partial<Court>) => void;
}

export function CourtFormModal({
  open,
  onOpenChange,
  court,
  onSave,
}: CourtFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<CourtType>("society");
  const [status, setStatus] = useState<CourtStatus>("active");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(10);
  
  // Features
  const [covered, setCovered] = useState(false);
  const [lighting, setLighting] = useState(false);
  const [lockerRoom, setLockerRoom] = useState(false);
  const [parking, setParking] = useState(false);
  
  // Working hours
  const [workingHours, setWorkingHours] = useState({
    monday: { enabled: true, open: "06:00", close: "23:00" },
    tuesday: { enabled: true, open: "06:00", close: "23:00" },
    wednesday: { enabled: true, open: "06:00", close: "23:00" },
    thursday: { enabled: true, open: "06:00", close: "23:00" },
    friday: { enabled: true, open: "06:00", close: "23:00" },
    saturday: { enabled: true, open: "07:00", close: "22:00" },
    sunday: { enabled: true, open: "07:00", close: "20:00" },
  });

  // Load court data when editing
  useEffect(() => {
    if (court) {
      setName(court.name);
      setType(court.type);
      setStatus(court.status);
      setDescription(court.description || "");
      setCapacity(court.capacity);
      setCovered(court.features.covered);
      setLighting(court.features.lighting);
      setLockerRoom(court.features.lockerRoom);
      setParking(court.features.parking);
      setWorkingHours(court.workingHours);
    } else {
      // Reset form
      setName("");
      setType("society");
      setStatus("active");
      setDescription("");
      setCapacity(10);
      setCovered(false);
      setLighting(false);
      setLockerRoom(false);
      setParking(false);
      setWorkingHours({
        monday: { enabled: true, open: "06:00", close: "23:00" },
        tuesday: { enabled: true, open: "06:00", close: "23:00" },
        wednesday: { enabled: true, open: "06:00", close: "23:00" },
        thursday: { enabled: true, open: "06:00", close: "23:00" },
        friday: { enabled: true, open: "06:00", close: "23:00" },
        saturday: { enabled: true, open: "07:00", close: "22:00" },
        sunday: { enabled: true, open: "07:00", close: "20:00" },
      });
    }
  }, [court]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast.error("Por favor, informe o nome da quadra");
      return;
    }
    
    if (capacity < 2 || capacity > 50) {
      toast.error("A capacidade deve estar entre 2 e 50 pessoas");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const courtData: Partial<Court> = {
        name: name.trim(),
        type,
        status,
        description: description.trim() || undefined,
        capacity,
        features: {
          covered,
          lighting,
          lockerRoom,
          parking,
        },
        workingHours,
      };

      onSave(courtData);
      setLoading(false);
      toast.success(court ? "Quadra atualizada com sucesso!" : "Quadra criada com sucesso!");
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] lg:w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{court ? "Editar Quadra" : "Nova Quadra"}</DialogTitle>
          <DialogDescription>
            {court
              ? "Atualize as informações da quadra"
              : "Preencha os dados para cadastrar uma nova quadra"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
              <TabsTrigger value="features">Características</TabsTrigger>
              <TabsTrigger value="schedule">Horários</TabsTrigger>
            </TabsList>

            {/* Basic Data */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Quadra *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Quadra 1 - Society"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select value={type} onValueChange={(value) => setType(value as CourtType)}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="society">Society</SelectItem>
                        <SelectItem value="poliesportiva">Poliesportiva</SelectItem>
                        <SelectItem value="beach-tennis">Beach Tennis</SelectItem>
                        <SelectItem value="volei">Vôlei</SelectItem>
                        <SelectItem value="futsal">Futsal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva as características da quadra..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidade (pessoas) *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="2"
                      max="50"
                      value={capacity}
                      onChange={(e) => setCapacity(parseInt(e.target.value) || 10)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value as CourtStatus)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativa</SelectItem>
                        <SelectItem value="inactive">Inativa</SelectItem>
                        <SelectItem value="maintenance">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Features */}
            <TabsContent value="features" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Características da Quadra</CardTitle>
                  <CardDescription>
                    Selecione os recursos disponíveis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="covered">Cobertura</Label>
                      <p className="text-sm text-muted-foreground">
                        Quadra coberta/protegida da chuva
                      </p>
                    </div>
                    <Switch id="covered" checked={covered} onCheckedChange={setCovered} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lighting">Iluminação</Label>
                      <p className="text-sm text-muted-foreground">
                        Iluminação para jogos noturnos
                      </p>
                    </div>
                    <Switch id="lighting" checked={lighting} onCheckedChange={setLighting} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lockerRoom">Vestiário</Label>
                      <p className="text-sm text-muted-foreground">
                        Vestiário com chuveiros
                      </p>
                    </div>
                    <Switch
                      id="lockerRoom"
                      checked={lockerRoom}
                      onCheckedChange={setLockerRoom}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="parking">Estacionamento</Label>
                      <p className="text-sm text-muted-foreground">
                        Estacionamento disponível
                      </p>
                    </div>
                    <Switch id="parking" checked={parking} onCheckedChange={setParking} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule */}
            <TabsContent value="schedule" className="mt-4">
              <CourtScheduleConfig
                workingHours={workingHours}
                onWorkingHoursChange={setWorkingHours}
                courtId={court?.id}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {court ? "Salvar Alterações" : "Criar Quadra"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
