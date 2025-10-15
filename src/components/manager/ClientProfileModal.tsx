import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  Edit,
  Ban,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Tag,
  FileText,
  TrendingUp,
  Activity,
  Users
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  balance: number;
  lastBooking: string;
  totalBookings: number;
  status: "active" | "blocked" | "vip";
  memberSince: string;
  tags: string[];
  notes?: string;
}

interface ClientProfileModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (client: Client) => void;
}

// Mock data for client bookings
const mockBookingHistory = [
  {
    id: "1",
    date: "2025-10-10",
    time: "18:00",
    court: "Quadra 1 - Society",
    type: "Avulsa",
    value: 120,
    status: "completed",
    participants: 10
  },
  {
    id: "2",
    date: "2025-10-08",
    time: "19:00",
    court: "Quadra 2 - Poliesportiva",
    type: "Mensalista",
    value: 100,
    status: "completed",
    participants: 12
  },
  {
    id: "3",
    date: "2025-10-05",
    time: "20:00",
    court: "Quadra 1 - Society",
    type: "Avulsa",
    value: 120,
    status: "cancelled",
    participants: 8
  },
  {
    id: "4",
    date: "2025-10-01",
    time: "18:00",
    court: "Quadra 3 - Beach Tennis",
    type: "Avulsa",
    value: 90,
    status: "completed",
    participants: 4
  }
];

const mockPaymentHistory = [
  {
    id: "1",
    date: "2025-10-10",
    description: "Reserva - Quadra 1",
    type: "debit",
    value: 120,
    method: "Cartão de Crédito"
  },
  {
    id: "2",
    date: "2025-10-08",
    description: "Crédito Adicionado",
    type: "credit",
    value: 200,
    method: "PIX"
  },
  {
    id: "3",
    date: "2025-10-08",
    description: "Reserva - Quadra 2",
    type: "debit",
    value: 100,
    method: "Saldo"
  }
];

const availableTags = [
  { value: "vip", label: "VIP", color: "bg-yellow-500" },
  { value: "mensalista", label: "Mensalista", color: "bg-blue-500" },
  { value: "regular", label: "Regular", color: "bg-green-500" },
  { value: "inadimplente", label: "Inadimplente", color: "bg-red-500" },
  { value: "novo", label: "Novo", color: "bg-purple-500" }
];

export function ClientProfileModal({ client, isOpen, onClose, onUpdate }: ClientProfileModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState(client?.notes || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(client?.tags || []);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!client) return null;

  const handleSaveNotes = () => {
    const updatedClient = { ...client, notes };
    onUpdate(updatedClient);
    setIsEditingNotes(false);
    toast.success("Notas salvas com sucesso!");
  };

  const handleToggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    const updatedClient = { ...client, tags: newTags };
    onUpdate(updatedClient);
    toast.success("Tag atualizada!");
  };

  const handleBlockClient = () => {
    const newStatus = client.status === "blocked" ? "active" : "blocked";
    const updatedClient = { ...client, status: newStatus as any };
    onUpdate(updatedClient);
    toast.success(
      newStatus === "blocked" 
        ? "Cliente bloqueado com sucesso!" 
        : "Cliente desbloqueado com sucesso!"
    );
  };

  const handleSendMessage = () => {
    toast.success("Mensagem enviada via WhatsApp!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success">Ativo</Badge>;
      case "blocked":
        return <Badge variant="destructive">Bloqueado</Badge>;
      case "vip":
        return <Badge className="bg-yellow-500">VIP</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelado</Badge>;
      case "pending":
        return <Badge className="bg-warning">Pendente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalSpent = mockPaymentHistory
    .filter(p => p.type === "debit")
    .reduce((sum, p) => sum + p.value, 0);

  const completedBookings = mockBookingHistory.filter(b => b.status === "completed").length;
  const cancelledBookings = mockBookingHistory.filter(b => b.status === "cancelled").length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[800px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-3">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-primary">
                  {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl truncate">{client.name}</DialogTitle>
                <DialogDescription className="sr-only">
                  Perfil completo do cliente com informações de contato, histórico de reservas, pagamentos e notas internas
                </DialogDescription>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {getStatusBadge(client.status)}
                  {selectedTags.slice(0, 3).map(tag => {
                    const tagData = availableTags.find(t => t.value === tag);
                    return tagData ? (
                      <Badge key={tag} className={tagData.color}>
                        {tagData.label}
                      </Badge>
                    ) : null;
                  })}
                  {selectedTags.length > 3 && (
                    <Badge variant="secondary">+{selectedTags.length - 3}</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleSendMessage}>
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                variant={client.status === "blocked" ? "default" : "destructive"} 
                size="sm"
                onClick={handleBlockClient}
              >
                {client.status === "blocked" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Desbloquear
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4 mr-2" />
                    Bloquear
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 overflow-y-auto flex-1 pr-2">
            
            {/* Top Row: Stats + Balance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Stats - 2/3 width */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-3">
                  {/* Stat Card 1 */}
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Card className="border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Activity className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">Total de Reservas</p>
                            <p className="text-2xl font-bold">{client.totalBookings}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Stat Card 2 */}
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Card className="border-success/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-success" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">Concluídas</p>
                            <p className="text-2xl font-bold">{completedBookings}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Stat Card 3 */}
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Card className="border-destructive/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">Canceladas</p>
                            <p className="text-2xl font-bold">{cancelledBookings}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Stat Card 4 */}
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Card className="border-accent/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="h-5 w-5 text-accent" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">Total Gasto</p>
                            <p className="text-2xl font-bold">R$ {totalSpent}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>

              {/* Balance Card - 1/3 width */}
              <Card className={`border-2 ${client.balance >= 0 ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                <CardContent className="p-4 h-full flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      client.balance >= 0 ? 'bg-success/20' : 'bg-destructive/20'
                    }`}>
                      <DollarSign className={`h-6 w-6 ${
                        client.balance >= 0 ? 'text-success' : 'text-destructive'
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Saldo Atual</p>
                      <p className={`text-2xl font-bold ${client.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                        R$ {client.balance.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {client.balance >= 0 ? '✓ Positivo' : '⚠ Devedor'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">Informações de Contato</h4>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="text-xs">Email</span>
                    </div>
                    <p className="text-sm font-medium truncate" title={client.email}>{client.email}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Phone className="h-3.5 w-3.5" />
                      <span className="text-xs">Telefone</span>
                    </div>
                    <p className="text-sm font-medium">{client.phone}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-xs">Membro desde</span>
                    </div>
                    <p className="text-sm font-medium">{client.memberSince}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">Última reserva</span>
                    </div>
                    <p className="text-sm font-medium">{client.lastBooking}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">Tags e Categorias</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <Button
                      key={tag.value}
                      variant={selectedTags.includes(tag.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleTag(tag.value)}
                      className={`${selectedTags.includes(tag.value) ? tag.color : ""} transition-all h-8`}
                    >
                      {selectedTags.includes(tag.value) && <CheckCircle className="h-3 w-3 mr-1.5" />}
                      {tag.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="overflow-y-auto flex-1 pr-2">
            <div className="space-y-3">
              {mockBookingHistory.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {new Date(booking.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.time}</span>
                            </div>
                            {getBookingStatusBadge(booking.status)}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{booking.court}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 flex-wrap">
                            <Badge variant="outline" className="gap-1">
                              <Users className="h-3 w-3" />
                              {booking.participants} pessoas
                            </Badge>
                            <Badge variant="outline">{booking.type}</Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">R$ {booking.value}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="overflow-y-auto flex-1 pr-2">
            <div className="space-y-3">
              {mockPaymentHistory.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className={payment.type === "credit" ? "border-success/30" : "border-destructive/30"}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge className={payment.type === "credit" ? "bg-success" : "bg-destructive"}>
                              {payment.type === "credit" ? "Crédito" : "Débito"}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(payment.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          
                          <div className="font-medium">{payment.description}</div>
                          
                          <div className="text-sm text-muted-foreground">
                            Método: {payment.method}
                          </div>
                        </div>
                        
                        <div className={`text-3xl font-bold ${
                          payment.type === "credit" ? "text-success" : "text-destructive"
                        }`}>
                          {payment.type === "credit" ? "+" : "-"}R$ {payment.value}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="overflow-y-auto flex-1 pr-2">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Notas Internas
                  </h3>
                  {!isEditingNotes && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>

                {isEditingNotes ? (
                  <div className="space-y-4">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Adicione notas sobre este cliente..."
                      className="min-h-[300px] resize-none"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveNotes} className="bg-success hover:bg-success/90">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Salvar Notas
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditingNotes(false);
                          setNotes(client.notes || "");
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-muted/50 rounded-lg min-h-[300px]">
                    {notes ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{notes}</p>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground italic">
                          Nenhuma nota adicionada ainda.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Clique em "Editar" para adicionar notas sobre este cliente.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
