import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { WhatsAppTemplateManagement } from "./WhatsAppTemplateManagement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Clock,
  DollarSign,
  Users,
  Tag,
  XCircle,
  Shield,
  Plug,
  Database,
  FileText,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  Save,
  Settings as SettingsIcon,
  Bell,
  MessageSquare,
  CreditCard,
  Percent,
  Calendar,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface SystemSettingsProps {
  onBack?: () => void;
}

// Mock data - Operating Hours
const initialOperatingHours = [
  { day: "Segunda-feira", open: "06:00", close: "23:00", enabled: true },
  { day: "Terça-feira", open: "06:00", close: "23:00", enabled: true },
  { day: "Quarta-feira", open: "06:00", close: "23:00", enabled: true },
  { day: "Quinta-feira", open: "06:00", close: "23:00", enabled: true },
  { day: "Sexta-feira", open: "06:00", close: "23:00", enabled: true },
  { day: "Sábado", open: "08:00", close: "22:00", enabled: true },
  { day: "Domingo", open: "08:00", close: "20:00", enabled: true },
];

// Mock data - Pricing
const initialPricing = [
  { id: 1, period: "Manhã (06h-12h)", weekday: 100, weekend: 120, description: "Período matinal" },
  { id: 2, period: "Tarde (12h-18h)", weekday: 120, weekend: 150, description: "Período vespertino" },
  { id: 3, period: "Noite (18h-23h)", weekday: 150, weekend: 180, description: "Horário nobre" },
];

// Mock data - Booking Types
const initialBookingTypes = [
  { id: 1, name: "Avulsa", enabled: true, minAdvance: 2, maxAdvance: 30, cancelPolicy: "24h" },
  { id: 2, name: "Mensalista", enabled: true, minAdvance: 0, maxAdvance: 90, cancelPolicy: "48h" },
  { id: 3, name: "Recorrente", enabled: true, minAdvance: 0, maxAdvance: 90, cancelPolicy: "48h" },
];

// Mock data - Discounts
const initialDiscounts = [
  { id: 1, name: "Cliente VIP", type: "percentage", value: 15, enabled: true, conditions: "Mais de 20 reservas" },
  { id: 2, name: "Primeira Reserva", type: "percentage", value: 10, enabled: true, conditions: "Novos clientes" },
  { id: 3, name: "Pacote 4 Jogos", type: "fixed", value: 50, enabled: true, conditions: "Compra antecipada" },
];

// Mock data - Admins
const initialAdmins = [
  { id: 1, name: "Admin Principal", email: "admin@arenadona santa.com", role: "Super Admin", status: "active", lastLogin: "Hoje, 10:30" },
  { id: 2, name: "João Gestor", email: "joao@arenadona santa.com", role: "Gestor", status: "active", lastLogin: "Ontem, 18:45" },
  { id: 3, name: "Maria Atendente", email: "maria@arenadona santa.com", role: "Atendente", status: "active", lastLogin: "Hoje, 09:15" },
];

// Mock data - System Logs
const systemLogs = [
  { id: 1, timestamp: "14/10/2025 10:30", user: "Admin Principal", action: "Alterou preços", details: "Noite: R$150 → R$160", level: "info" },
  { id: 2, timestamp: "14/10/2025 09:15", user: "João Gestor", action: "Criou nova reserva", details: "Cliente: Carlos Silva", level: "info" },
  { id: 3, timestamp: "13/10/2025 22:10", user: "Sistema", action: "Backup automático", details: "Backup concluído com sucesso", level: "success" },
  { id: 4, timestamp: "13/10/2025 18:30", user: "Maria Atendente", action: "Cancelou reserva", details: "ID: #1234", level: "warning" },
  { id: 5, timestamp: "13/10/2025 15:20", user: "Sistema", action: "Falha no pagamento", details: "Cartão recusado - Cliente: Ana Paula", level: "error" },
];

export function SystemSettings({ onBack }: SystemSettingsProps) {
  const [operatingHours, setOperatingHours] = useState(initialOperatingHours);
  const [pricing, setPricing] = useState(initialPricing);
  const [bookingTypes, setBookingTypes] = useState(initialBookingTypes);
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [admins, setAdmins] = useState(initialAdmins);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: number } | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [editingPricing, setEditingPricing] = useState<typeof initialPricing[0] | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<typeof initialDiscounts[0] | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<typeof initialAdmins[0] | null>(null);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    arenaName: "Arena Dona Santa",
    email: "contato@arenado nasanta.com",
    phone: "(11) 98765-4321",
    address: "Rua Exemplo, 123 - São Paulo, SP",
    cep: "01234-567",
    cnpj: "12.345.678/0001-90",
    billingDay: "10",
    minBookingHours: "2",
    maxBookingDays: "30",
  });

  // Integrations State
  const [integrations, setIntegrations] = useState({
    whatsapp: { enabled: true, number: "+5511987654321", apiKey: "••••••••••••" },
    email: { enabled: true, smtp: "smtp.gmail.com", port: "587" },
    payment: { enabled: true, gateway: "Mercado Pago", apiKey: "••••••••••••" },
    notifications: { enabled: true, pushEnabled: true, emailEnabled: true, smsEnabled: false },
  });

  // Cancel Policies State
  const [cancelPolicies, setCancelPolicies] = useState({
    fullRefund: "24",
    partialRefund: "12",
    refundPercentage: "50",
    noShowPenalty: "100",
  });

  const handleSaveGeneral = () => {
    toast.success("Configurações gerais salvas com sucesso!");
  };

  const handleSaveHours = () => {
    toast.success("Horários de funcionamento atualizados!");
  };

  const handleSavePricing = () => {
    toast.success("Preços atualizados com sucesso!");
  };

  const handleAddPricing = () => {
    setEditingPricing(null);
    setShowPricingModal(true);
  };

  const handleEditPricing = (price: typeof initialPricing[0]) => {
    setEditingPricing(price);
    setShowPricingModal(true);
  };

  const handleSavePricingModal = (data: { period: string; description: string; weekday: number; weekend: number }) => {
    if (editingPricing) {
      // Edit existing
      const updated = pricing.map(p => 
        p.id === editingPricing.id ? { ...p, ...data } : p
      );
      setPricing(updated);
      toast.success("Período atualizado com sucesso!");
    } else {
      // Add new
      const newPricing = {
        id: Math.max(...pricing.map(p => p.id)) + 1,
        ...data
      };
      setPricing([...pricing, newPricing]);
      toast.success("Período criado com sucesso!");
    }
    setShowPricingModal(false);
    setEditingPricing(null);
  };

  const handleSaveBookingTypes = () => {
    toast.success("Tipos de reserva atualizados!");
  };

  const handleAddDiscount = () => {
    setEditingDiscount(null);
    setShowDiscountModal(true);
  };

  const handleEditDiscount = (discount: typeof initialDiscounts[0]) => {
    setEditingDiscount(discount);
    setShowDiscountModal(true);
  };

  const handleSaveDiscountModal = (data: { name: string; type: string; value: number; conditions: string }) => {
    if (editingDiscount) {
      // Update existing
      const updated = discounts.map(d =>
        d.id === editingDiscount.id ? { ...d, ...data } : d
      );
      setDiscounts(updated);
      toast.success("Desconto atualizado com sucesso!");
    } else {
      // Add new
      const newDiscount = {
        id: Math.max(...discounts.map(d => d.id)) + 1,
        enabled: true,
        ...data
      };
      setDiscounts([...discounts, newDiscount]);
      toast.success("Desconto criado com sucesso!");
    }
    setShowDiscountModal(false);
    setEditingDiscount(null);
  };

  const handleSaveDiscounts = () => {
    toast.success("Descontos e promoções salvos!");
  };

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setShowAdminModal(true);
  };

  const handleEditAdmin = (admin: typeof initialAdmins[0]) => {
    setEditingAdmin(admin);
    setShowAdminModal(true);
  };

  const handleSaveAdminModal = (data: { name: string; email: string; role: string }) => {
    if (editingAdmin) {
      // Update existing
      const updated = admins.map(a =>
        a.id === editingAdmin.id ? { ...a, ...data } : a
      );
      setAdmins(updated);
      toast.success("Administrador atualizado com sucesso!");
    } else {
      // Add new
      const newAdmin = {
        id: Math.max(...admins.map(a => a.id)) + 1,
        status: "active" as const,
        lastLogin: "Nunca",
        ...data
      };
      setAdmins([...admins, newAdmin]);
      toast.success("Administrador criado com sucesso!");
    }
    setShowAdminModal(false);
    setEditingAdmin(null);
  };

  const handleSaveCancelPolicies = () => {
    toast.success("Políticas de cancelamento atualizadas!");
  };

  const handleSaveIntegrations = () => {
    toast.success("Integrações configuradas com sucesso!");
  };

  const handleBackup = () => {
    toast.loading("Gerando backup...");
    setTimeout(() => {
      toast.success("Backup gerado com sucesso! Iniciando download...");
    }, 2000);
  };

  const handleRestore = () => {
    toast.info("Funcionalidade de restauração será implementada em breve!");
  };

  const handleToggleHours = (index: number) => {
    const updated = [...operatingHours];
    updated[index].enabled = !updated[index].enabled;
    setOperatingHours(updated);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;

    switch (itemToDelete.type) {
      case "discount":
        setDiscounts(discounts.filter(d => d.id !== itemToDelete.id));
        toast.success("Desconto removido com sucesso!");
        break;
      case "admin":
        setAdmins(admins.filter(a => a.id !== itemToDelete.id));
        toast.success("Administrador removido com sucesso!");
        break;
    }
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "success":
        return "bg-success/10 text-success";
      case "warning":
        return "bg-warning/10 text-warning";
      case "error":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            Configurações do Sistema
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie todas as configurações administrativas da arena
          </p>
        </div>
        <Button variant="outline" onClick={handleBackup}>
          <Download className="h-4 w-4 mr-2" />
          Backup Completo
        </Button>
      </div>

      {/* Main Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-10 gap-1">
          <TabsTrigger value="general" className="text-xs lg:text-sm">Geral</TabsTrigger>
          <TabsTrigger value="hours" className="text-xs lg:text-sm">Horários</TabsTrigger>
          <TabsTrigger value="pricing" className="text-xs lg:text-sm">Preços</TabsTrigger>
          <TabsTrigger value="booking-types" className="text-xs lg:text-sm">Reservas</TabsTrigger>
          <TabsTrigger value="discounts" className="text-xs lg:text-sm">Descontos</TabsTrigger>
          <TabsTrigger value="cancel" className="text-xs lg:text-sm">Cancelamento</TabsTrigger>
          <TabsTrigger value="whatsapp" className="text-xs lg:text-sm">WhatsApp</TabsTrigger>
          <TabsTrigger value="admins" className="text-xs lg:text-sm">Admins</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs lg:text-sm">Integrações</TabsTrigger>
          <TabsTrigger value="system" className="text-xs lg:text-sm">Sistema</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Arena</CardTitle>
              <CardDescription>Dados gerais do estabelecimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arenaName">Nome da Arena</Label>
                  <Input
                    id="arenaName"
                    value={generalSettings.arenaName}
                    onChange={(e) => setGeneralSettings({...generalSettings, arenaName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={generalSettings.cnpj}
                    onChange={(e) => setGeneralSettings({...generalSettings, cnpj: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={generalSettings.cep}
                    onChange={(e) => setGeneralSettings({...generalSettings, cep: e.target.value})}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingDay">Dia de Vencimento</Label>
                  <Select value={generalSettings.billingDay} onValueChange={(value) => setGeneralSettings({...generalSettings, billingDay: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          Dia {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minBooking">Antecedência Mínima (horas)</Label>
                  <Input
                    id="minBooking"
                    type="number"
                    value={generalSettings.minBookingHours}
                    onChange={(e) => setGeneralSettings({...generalSettings, minBookingHours: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxBooking">Antecedência Máxima (dias)</Label>
                  <Input
                    id="maxBooking"
                    type="number"
                    value={generalSettings.maxBookingDays}
                    onChange={(e) => setGeneralSettings({...generalSettings, maxBookingDays: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operating Hours */}
        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Horários de Funcionamento
              </CardTitle>
              <CardDescription>
                Configure os horários de abertura e fechamento por dia da semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {operatingHours.map((hour, index) => (
                  <div key={hour.day} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Switch
                      checked={hour.enabled}
                      onCheckedChange={() => handleToggleHours(index)}
                    />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <span className="font-medium">{hour.day}</span>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Abertura:</Label>
                        <Input
                          type="time"
                          value={hour.open}
                          disabled={!hour.enabled}
                          className="w-auto"
                          onChange={(e) => {
                            const updated = [...operatingHours];
                            updated[index].open = e.target.value;
                            setOperatingHours(updated);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Fechamento:</Label>
                        <Input
                          type="time"
                          value={hour.close}
                          disabled={!hour.enabled}
                          className="w-auto"
                          onChange={(e) => {
                            const updated = [...operatingHours];
                            updated[index].close = e.target.value;
                            setOperatingHours(updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveHours}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Horários
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Tabela de Preços
                  </CardTitle>
                  <CardDescription>
                    Configure os preços por período e dia da semana
                  </CardDescription>
                </div>
                <Button size="sm" onClick={handleAddPricing}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Período
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-center">Dias de Semana</TableHead>
                    <TableHead className="text-center">Fins de Semana</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricing.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell className="font-medium">{price.period}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{price.description}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm">R$</span>
                          <Input
                            type="number"
                            value={price.weekday}
                            className="w-20 text-center"
                            onChange={(e) => {
                              const updated = pricing.map(p =>
                                p.id === price.id ? { ...p, weekday: parseInt(e.target.value) } : p
                              );
                              setPricing(updated);
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm">R$</span>
                          <Input
                            type="number"
                            value={price.weekend}
                            className="w-20 text-center"
                            onChange={(e) => {
                              const updated = pricing.map(p =>
                                p.id === price.id ? { ...p, weekend: parseInt(e.target.value) } : p
                              );
                              setPricing(updated);
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditPricing(price)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSavePricing}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Preços
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Types */}
        <TabsContent value="booking-types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Tipos de Reserva
              </CardTitle>
              <CardDescription>
                Configure regras e limites para cada tipo de reserva
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingTypes.map((type) => (
                  <div key={type.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={type.enabled}
                          onCheckedChange={(checked) => {
                            const updated = bookingTypes.map(t =>
                              t.id === type.id ? { ...t, enabled: checked } : t
                            );
                            setBookingTypes(updated);
                          }}
                        />
                        <div>
                          <p className="font-medium">{type.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Política de cancelamento: {type.cancelPolicy} de antecedência
                          </p>
                        </div>
                      </div>
                      <Badge variant={type.enabled ? "default" : "secondary"}>
                        {type.enabled ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Antecedência Mínima (horas)</Label>
                        <Input 
                          type="number" 
                          value={type.minAdvance} 
                          className="h-9"
                          onChange={(e) => {
                            const updated = bookingTypes.map(t =>
                              t.id === type.id ? { ...t, minAdvance: parseInt(e.target.value) || 0 } : t
                            );
                            setBookingTypes(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Antecedência Máxima (dias)</Label>
                        <Input 
                          type="number" 
                          value={type.maxAdvance} 
                          className="h-9"
                          onChange={(e) => {
                            const updated = bookingTypes.map(t =>
                              t.id === type.id ? { ...t, maxAdvance: parseInt(e.target.value) || 0 } : t
                            );
                            setBookingTypes(updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveBookingTypes}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discounts */}
        <TabsContent value="discounts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-primary" />
                    Descontos e Promoções
                  </CardTitle>
                  <CardDescription>
                    Configure descontos automáticos e promoções especiais
                  </CardDescription>
                </div>
                <Button size="sm" onClick={handleAddDiscount}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Desconto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {discounts.map((discount) => (
                  <motion.div
                    key={discount.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={discount.enabled}
                          onCheckedChange={(checked) => {
                            const updated = discounts.map(d =>
                              d.id === discount.id ? { ...d, enabled: checked } : d
                            );
                            setDiscounts(updated);
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{discount.name}</p>
                            <Badge variant="outline">
                              {discount.type === "percentage" 
                                ? `${discount.value}%` 
                                : `R$ ${discount.value}`
                              }
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {discount.conditions}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditDiscount(discount)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setItemToDelete({ type: "discount", id: discount.id });
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveDiscounts}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Descontos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cancel Policies */}
        <TabsContent value="cancel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-primary" />
                Políticas de Cancelamento
              </CardTitle>
              <CardDescription>
                Configure regras de cancelamento e reembolso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reembolso Total (horas de antecedência)</Label>
                  <Input
                    type="number"
                    value={cancelPolicies.fullRefund}
                    onChange={(e) => setCancelPolicies({...cancelPolicies, fullRefund: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    Cancelamentos com mais de {cancelPolicies.fullRefund}h recebem 100% do valor
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Reembolso Parcial (horas de antecedência)</Label>
                  <Input
                    type="number"
                    value={cancelPolicies.partialRefund}
                    onChange={(e) => setCancelPolicies({...cancelPolicies, partialRefund: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    Cancelamentos entre {cancelPolicies.partialRefund}h e {cancelPolicies.fullRefund}h recebem reembolso parcial
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Percentual de Reembolso Parcial (%)</Label>
                  <Input
                    type="number"
                    value={cancelPolicies.refundPercentage}
                    onChange={(e) => setCancelPolicies({...cancelPolicies, refundPercentage: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    {cancelPolicies.refundPercentage}% do valor será devolvido
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Multa por No-Show (%)</Label>
                  <Input
                    type="number"
                    value={cancelPolicies.noShowPenalty}
                    onChange={(e) => setCancelPolicies({...cancelPolicies, noShowPenalty: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    Clientes que faltam sem avisar perdem {cancelPolicies.noShowPenalty}% do valor
                  </p>
                </div>
              </div>
              <Separator />
              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Resumo das Políticas
                </h4>
                <ul className="text-sm space-y-1 ml-6">
                  <li>• Mais de {cancelPolicies.fullRefund}h: Reembolso de <strong>100%</strong></li>
                  <li>• Entre {cancelPolicies.partialRefund}h e {cancelPolicies.fullRefund}h: Reembolso de <strong>{cancelPolicies.refundPercentage}%</strong></li>
                  <li>• Menos de {cancelPolicies.partialRefund}h: <strong>Sem reembolso</strong></li>
                  <li>• No-Show: Multa de <strong>{cancelPolicies.noShowPenalty}%</strong></li>
                </ul>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveCancelPolicies}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Políticas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admins */}
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Administradores
                  </CardTitle>
                  <CardDescription>
                    Gerencie usuários com acesso ao painel administrativo
                  </CardDescription>
                </div>
                <Button size="sm" onClick={handleAddAdmin}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Admin
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant={admin.role === "Super Admin" ? "default" : "secondary"}>
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {admin.lastLogin}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-success">Ativo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditAdmin(admin)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {admin.role !== "Super Admin" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setItemToDelete({ type: "admin", id: admin.id });
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Templates */}
        <TabsContent value="whatsapp" className="space-y-4">
          <WhatsAppTemplateManagement />
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    WhatsApp Business
                  </CardTitle>
                  <Switch 
                    checked={integrations.whatsapp.enabled}
                    onCheckedChange={(checked) => setIntegrations({
                      ...integrations,
                      whatsapp: { ...integrations.whatsapp, enabled: checked }
                    })}
                  />
                </div>
                <CardDescription>
                  Envie confirmações e lembretes via WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input 
                    value={integrations.whatsapp.number}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      whatsapp: { ...integrations.whatsapp, number: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input 
                    type="password" 
                    value={integrations.whatsapp.apiKey}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      whatsapp: { ...integrations.whatsapp, apiKey: e.target.value }
                    })}
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Testar Conexão
                </Button>
              </CardContent>
            </Card>

            {/* Payment Gateway */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Gateway de Pagamento
                  </CardTitle>
                  <Switch 
                    checked={integrations.payment.enabled}
                    onCheckedChange={(checked) => setIntegrations({
                      ...integrations,
                      payment: { ...integrations.payment, enabled: checked }
                    })}
                  />
                </div>
                <CardDescription>
                  Configure o processador de pagamentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Gateway</Label>
                  <Select 
                    value={integrations.payment.gateway}
                    onValueChange={(value) => setIntegrations({
                      ...integrations,
                      payment: { ...integrations.payment, gateway: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mercado Pago">Mercado Pago</SelectItem>
                      <SelectItem value="PagSeguro">PagSeguro</SelectItem>
                      <SelectItem value="Stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input 
                    type="password" 
                    value={integrations.payment.apiKey}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      payment: { ...integrations.payment, apiKey: e.target.value }
                    })}
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Testar Conexão
                </Button>
              </CardContent>
            </Card>

            {/* Email */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Email (SMTP)
                  </CardTitle>
                  <Switch 
                    checked={integrations.email.enabled}
                    onCheckedChange={(checked) => setIntegrations({
                      ...integrations,
                      email: { ...integrations.email, enabled: checked }
                    })}
                  />
                </div>
                <CardDescription>
                  Configure servidor de envio de emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Servidor SMTP</Label>
                  <Input 
                    value={integrations.email.smtp}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      email: { ...integrations.email, smtp: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Porta</Label>
                  <Input 
                    value={integrations.email.port}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      email: { ...integrations.email, port: e.target.value }
                    })}
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Testar Conexão
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Configure canais de notificação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label>Notificações Push</Label>
                  <Switch 
                    checked={integrations.notifications.pushEnabled}
                    onCheckedChange={(checked) => setIntegrations({
                      ...integrations,
                      notifications: { ...integrations.notifications, pushEnabled: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label>Notificações por Email</Label>
                  <Switch 
                    checked={integrations.notifications.emailEnabled}
                    onCheckedChange={(checked) => setIntegrations({
                      ...integrations,
                      notifications: { ...integrations.notifications, emailEnabled: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label>Notificações por SMS</Label>
                  <Switch 
                    checked={integrations.notifications.smsEnabled}
                    onCheckedChange={(checked) => setIntegrations({
                      ...integrations,
                      notifications: { ...integrations.notifications, smsEnabled: checked }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveIntegrations}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Integrações
            </Button>
          </div>
        </TabsContent>

        {/* System */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Backup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Backup e Restauração
                </CardTitle>
                <CardDescription>
                  Gerencie backups dos dados do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Último Backup</p>
                  <p className="text-xs text-muted-foreground">
                    13/10/2025 às 22:10 (Automático)
                  </p>
                  <p className="text-xs">
                    <strong>Tamanho:</strong> 45.2 MB
                  </p>
                </div>
                <Button variant="outline" className="w-full" onClick={handleBackup}>
                  <Download className="h-4 w-4 mr-2" />
                  Fazer Backup Agora
                </Button>
                <Button variant="outline" className="w-full" onClick={handleRestore}>
                  <Upload className="h-4 w-4 mr-2" />
                  Restaurar Backup
                </Button>
                <Separator />
                <div className="space-y-2">
                  <Label>Backup Automático</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Informações do Sistema
                </CardTitle>
                <CardDescription>
                  Detalhes técnicos e status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border-b">
                    <span className="text-sm text-muted-foreground">Versão</span>
                    <span className="text-sm font-medium">1.5.3</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border-b">
                    <span className="text-sm text-muted-foreground">Ambiente</span>
                    <Badge>Produção</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border-b">
                    <span className="text-sm text-muted-foreground">Banco de Dados</span>
                    <span className="text-sm font-medium">PostgreSQL</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border-b">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="text-sm font-medium">45 dias</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border-b">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className="bg-success">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm text-muted-foreground">Última Atualização</span>
                    <span className="text-sm font-medium">14/10/2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Logs do Sistema
              </CardTitle>
              <CardDescription>
                Histórico de ações e eventos do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="mt-0.5">{getLevelIcon(log.level)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{log.action}</span>
                        <Badge variant="outline" className="text-xs">
                          {log.user}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm">
                  Ver Todos os Logs
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pricing Period Modal */}
      <PricingPeriodModal
        open={showPricingModal}
        onOpenChange={setShowPricingModal}
        onSave={handleSavePricingModal}
        editingPricing={editingPricing}
      />

      {/* Discount Modal */}
      <DiscountModal
        open={showDiscountModal}
        onOpenChange={setShowDiscountModal}
        onSave={handleSaveDiscountModal}
        editingDiscount={editingDiscount}
      />

      {/* Admin Modal */}
      <AdminModal
        open={showAdminModal}
        onOpenChange={setShowAdminModal}
        onSave={handleSaveAdminModal}
        editingAdmin={editingAdmin}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir este item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Pricing Period Modal Component
interface PricingPeriodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { period: string; description: string; weekday: number; weekend: number }) => void;
  editingPricing: typeof initialPricing[0] | null;
}

function PricingPeriodModal({ open, onOpenChange, onSave, editingPricing }: PricingPeriodModalProps) {
  const [formData, setFormData] = useState({
    period: "",
    description: "",
    weekday: 0,
    weekend: 0,
  });

  // Reset form when opening or editing changes
  useEffect(() => {
    if (open) {
      if (editingPricing) {
        setFormData({
          period: editingPricing.period,
          description: editingPricing.description,
          weekday: editingPricing.weekday,
          weekend: editingPricing.weekend,
        });
      } else {
        setFormData({
          period: "",
          description: "",
          weekday: 0,
          weekend: 0,
        });
      }
    }
  }, [open, editingPricing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingPricing ? "Editar Período" : "Novo Período de Preço"}
          </DialogTitle>
          <DialogDescription>
            Configure os valores para dias de semana e fins de semana
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="period">Período <span className="text-destructive">*</span></Label>
            <Input
              id="period"
              placeholder="Ex: Manhã (06h-12h)"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Período matinal"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekday">Dias de Semana (R$) <span className="text-destructive">*</span></Label>
              <Input
                id="weekday"
                type="number"
                min="0"
                step="0.01"
                placeholder="100.00"
                value={formData.weekday || ""}
                onChange={(e) => setFormData({ ...formData, weekday: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekend">Fins de Semana (R$) <span className="text-destructive">*</span></Label>
              <Input
                id="weekend"
                type="number"
                min="0"
                step="0.01"
                placeholder="120.00"
                value={formData.weekend || ""}
                onChange={(e) => setFormData({ ...formData, weekend: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {editingPricing ? "Salvar Alterações" : "Criar Período"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Discount Modal Component
interface DiscountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; type: string; value: number; conditions: string }) => void;
  editingDiscount: typeof initialDiscounts[0] | null;
}

function DiscountModal({ open, onOpenChange, onSave, editingDiscount }: DiscountModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "percentage",
    value: 0,
    conditions: "",
  });

  // Reset form when opening or editing changes
  useEffect(() => {
    if (open) {
      if (editingDiscount) {
        setFormData({
          name: editingDiscount.name,
          type: editingDiscount.type,
          value: editingDiscount.value,
          conditions: editingDiscount.conditions,
        });
      } else {
        setFormData({
          name: "",
          type: "percentage",
          value: 0,
          conditions: "",
        });
      }
    }
  }, [open, editingDiscount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingDiscount ? "Editar Desconto" : "Novo Desconto"}
          </DialogTitle>
          <DialogDescription>
            Configure um desconto ou promoção especial
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="discount-name">Nome do Desconto <span className="text-destructive">*</span></Label>
            <Input
              id="discount-name"
              placeholder="Ex: Desconto Cliente Fidelidade"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount-type">Tipo de Desconto <span className="text-destructive">*</span></Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger id="discount-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentual (%)</SelectItem>
                <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount-value">
              Valor {formData.type === "percentage" ? "(%)" : "(R$)"} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="discount-value"
              type="number"
              min="0"
              step={formData.type === "percentage" ? "1" : "0.01"}
              max={formData.type === "percentage" ? "100" : undefined}
              placeholder={formData.type === "percentage" ? "10" : "50.00"}
              value={formData.value || ""}
              onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount-conditions">Condições de Aplicação</Label>
            <Textarea
              id="discount-conditions"
              placeholder="Ex: Válido para reservas acima de 5 horas"
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {editingDiscount ? "Salvar Alterações" : "Criar Desconto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Admin Modal Component
interface AdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; email: string; role: string }) => void;
  editingAdmin: typeof initialAdmins[0] | null;
}

function AdminModal({ open, onOpenChange, onSave, editingAdmin }: AdminModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Atendente",
  });

  // Reset form when opening or editing changes
  useEffect(() => {
    if (open) {
      if (editingAdmin) {
        setFormData({
          name: editingAdmin.name,
          email: editingAdmin.email,
          role: editingAdmin.role,
        });
      } else {
        setFormData({
          name: "",
          email: "",
          role: "Atendente",
        });
      }
    }
  }, [open, editingAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingAdmin ? "Editar Administrador" : "Novo Administrador"}
          </DialogTitle>
          <DialogDescription>
            Configure as informações e permissões do administrador
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-name">Nome Completo <span className="text-destructive">*</span></Label>
            <Input
              id="admin-name"
              placeholder="Ex: João Silva"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-email">E-mail <span className="text-destructive">*</span></Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="joao@arenadona santa.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-role">Função <span className="text-destructive">*</span></Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger id="admin-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Gestor">Gestor</SelectItem>
                <SelectItem value="Atendente">Atendente</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.role === "Super Admin" && "Acesso total ao sistema"}
              {formData.role === "Gestor" && "Pode gerenciar reservas e clientes"}
              {formData.role === "Atendente" && "Pode criar e editar reservas"}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {editingAdmin ? "Salvar Alterações" : "Criar Administrador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
