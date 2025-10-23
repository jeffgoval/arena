"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Filter, Plus, X, DollarSign, MessageSquare, Clock, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Reserva {
  id: string;
  cliente: string;
  clienteEmail: string;
  clienteTelefone: string;
  quadra: string;
  data: string;
  horario: string;
  duracao: number;
  participantes: number;
  valor: number;
  status: "confirmada" | "pendente" | "cancelada" | "concluida";
  pagamento: "pago" | "pendente" | "parcial";
  valorPago: number;
  observacoes?: string;
  motivoCancelamento?: string;
}

export default function ReservasPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [pagamentoFilter, setPagamentoFilter] = useState("todos");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);

  // Form states
  const [cancelReason, setCancelReason] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("dinheiro");
  const [message, setMessage] = useState("");

  const [reservas, setReservas] = useState<Reserva[]>([
    {
      id: "R001",
      cliente: "João Silva",
      clienteEmail: "joao@email.com",
      clienteTelefone: "(33) 99999-1111",
      quadra: "Society 1",
      data: "2024-12-20",
      horario: "19:00",
      duracao: 60,
      participantes: 10,
      valor: 150.00,
      status: "confirmada",
      pagamento: "pago",
      valorPago: 150.00,
      observacoes: "Pelada dos amigos"
    },
    {
      id: "R002",
      cliente: "Maria Santos",
      clienteEmail: "maria@email.com",
      clienteTelefone: "(33) 99999-2222",
      quadra: "Futsal",
      data: "2024-12-21",
      horario: "20:00",
      duracao: 60,
      participantes: 12,
      valor: 180.00,
      status: "pendente",
      pagamento: "pendente",
      valorPago: 0
    },
    {
      id: "R003",
      cliente: "Pedro Costa",
      clienteEmail: "pedro@email.com",
      clienteTelefone: "(33) 99999-3333",
      quadra: "Society 2",
      data: "2024-12-19",
      horario: "18:00",
      duracao: 60,
      participantes: 8,
      valor: 150.00,
      status: "concluida",
      pagamento: "pago",
      valorPago: 150.00
    },
    {
      id: "R004",
      cliente: "Ana Oliveira",
      clienteEmail: "ana@email.com",
      clienteTelefone: "(33) 99999-4444",
      quadra: "Beach Tennis",
      data: "2024-12-22",
      horario: "15:00",
      duracao: 60,
      participantes: 4,
      valor: 100.00,
      status: "confirmada",
      pagamento: "parcial",
      valorPago: 50.00
    },
    {
      id: "R005",
      cliente: "Carlos Lima",
      clienteEmail: "carlos@email.com",
      clienteTelefone: "(33) 99999-5555",
      quadra: "Society 1",
      data: "2024-12-18",
      horario: "21:00",
      duracao: 60,
      participantes: 10,
      valor: 150.00,
      status: "cancelada",
      pagamento: "pendente",
      valorPago: 0,
      motivoCancelamento: "Cliente solicitou cancelamento por motivo pessoal"
    }
  ]);

  const stats = [
    { title: "Total de Reservas", value: reservas.length, color: "text-primary" },
    { title: "Confirmadas", value: reservas.filter(r => r.status === "confirmada").length, color: "text-success" },
    { title: "Pendentes", value: reservas.filter(r => r.status === "pendente").length, color: "text-warning" },
    { title: "Receita Total", value: `R$ ${reservas.reduce((acc, r) => acc + r.valorPago, 0).toFixed(2)}`, color: "text-primary" }
  ];

  const filteredReservas = reservas.filter(reserva => {
    const matchesSearch =
      reserva.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.quadra.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "todos" || reserva.status === statusFilter;
    const matchesPagamento = pagamentoFilter === "todos" || reserva.pagamento === pagamentoFilter;

    return matchesSearch && matchesStatus && matchesPagamento;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmada: "default",
      pendente: "secondary",
      cancelada: "destructive",
      concluida: "outline"
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

  const getPagamentoBadge = (pagamento: string) => {
    const colors = {
      pago: "bg-success/10 text-success",
      pendente: "bg-destructive/10 text-destructive",
      parcial: "bg-warning/10 text-warning"
    };
    return <Badge className={colors[pagamento as keyof typeof colors]}>{pagamento}</Badge>;
  };

  const handleCancelReserva = () => {
    if (!selectedReserva || !cancelReason.trim()) {
      toast({ title: "Erro", description: "Informe o motivo do cancelamento", variant: "destructive" });
      return;
    }

    setReservas(reservas.map(r =>
      r.id === selectedReserva.id
        ? { ...r, status: "cancelada", motivoCancelamento: cancelReason }
        : r
    ));

    toast({ title: "Sucesso", description: "Reserva cancelada com sucesso" });
    setIsCancelModalOpen(false);
    setCancelReason("");
    setSelectedReserva(null);
  };

  const handleRegisterPayment = () => {
    if (!selectedReserva || !paymentAmount) {
      toast({ title: "Erro", description: "Informe o valor do pagamento", variant: "destructive" });
      return;
    }

    const amount = parseFloat(paymentAmount);
    const newValorPago = selectedReserva.valorPago + amount;
    const newPagamento = newValorPago >= selectedReserva.valor ? "pago" : "parcial";

    setReservas(reservas.map(r =>
      r.id === selectedReserva.id
        ? { ...r, valorPago: newValorPago, pagamento: newPagamento }
        : r
    ));

    toast({ title: "Sucesso", description: `Pagamento de R$ ${amount.toFixed(2)} registrado` });
    setIsPaymentModalOpen(false);
    setPaymentAmount("");
    setSelectedReserva(null);
  };

  const handleSendMessage = () => {
    if (!selectedReserva || !message.trim()) {
      toast({ title: "Erro", description: "Digite uma mensagem", variant: "destructive" });
      return;
    }

    toast({
      title: "Mensagem Enviada",
      description: `Mensagem enviada para ${selectedReserva.cliente}`
    });
    setIsMessageModalOpen(false);
    setMessage("");
    setSelectedReserva(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="container-custom page-padding space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Gerenciar Reservas
          </h1>
          <p className="body-medium text-muted-foreground">
            Gerencie todas as reservas do sistema
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Reserva
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-soft">
            <CardContent className="p-6">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, ID ou quadra..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-border rounded-lg text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value="confirmada">Confirmada</option>
                <option value="pendente">Pendente</option>
                <option value="cancelada">Cancelada</option>
                <option value="concluida">Concluída</option>
              </select>
              <select
                className="px-3 py-2 border border-border rounded-lg text-sm"
                value={pagamentoFilter}
                onChange={(e) => setPagamentoFilter(e.target.value)}
              >
                <option value="todos">Todos pagamentos</option>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="parcial">Parcial</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Lista de Reservas ({filteredReservas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">ID</th>
                  <th className="text-left p-4 font-semibold">Cliente</th>
                  <th className="text-left p-4 font-semibold">Quadra</th>
                  <th className="text-left p-4 font-semibold">Data/Hora</th>
                  <th className="text-left p-4 font-semibold">Participantes</th>
                  <th className="text-left p-4 font-semibold">Valor</th>
                  <th className="text-left p-4 font-semibold">Pagamento</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservas.map((reserva) => (
                  <tr key={reserva.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 font-mono text-sm">{reserva.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{reserva.cliente}</p>
                        <p className="text-xs text-muted-foreground">{reserva.clienteTelefone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {reserva.quadra}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{formatDate(reserva.data)}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {reserva.horario} ({reserva.duracao}min)
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {reserva.participantes}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{formatCurrency(reserva.valor)}</p>
                        <p className="text-xs text-muted-foreground">
                          Pago: {formatCurrency(reserva.valorPago)}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">{getPagamentoBadge(reserva.pagamento)}</td>
                    <td className="p-4">{getStatusBadge(reserva.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {reserva.status !== "cancelada" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReserva(reserva);
                                setIsPaymentModalOpen(true);
                              }}
                              title="Registrar Pagamento"
                            >
                              <DollarSign className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReserva(reserva);
                                setIsMessageModalOpen(true);
                              }}
                              title="Enviar Mensagem"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedReserva(reserva);
                                setIsCancelModalOpen(true);
                              }}
                              title="Cancelar Reserva"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {reserva.status === "cancelada" && (
                          <Badge variant="outline" className="text-xs">
                            Cancelada
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReservas.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma reserva encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Reserva: <strong>{selectedReserva?.id}</strong> - {selectedReserva?.cliente}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedReserva?.quadra} - {selectedReserva && formatDate(selectedReserva.data)} às {selectedReserva?.horario}
              </p>
            </div>
            <div>
              <Label htmlFor="cancelReason">Motivo do Cancelamento *</Label>
              <Textarea
                id="cancelReason"
                placeholder="Descreva o motivo do cancelamento..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancelReserva}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Reserva: <strong>{selectedReserva?.id}</strong> - {selectedReserva?.cliente}
              </p>
              <div className="bg-muted p-3 rounded-lg space-y-1">
                <p className="text-sm">Valor Total: <strong>{selectedReserva && formatCurrency(selectedReserva.valor)}</strong></p>
                <p className="text-sm">Já Pago: <strong>{selectedReserva && formatCurrency(selectedReserva.valorPago)}</strong></p>
                <p className="text-sm text-destructive">Restante: <strong>{selectedReserva && formatCurrency(selectedReserva.valor - selectedReserva.valorPago)}</strong></p>
              </div>
            </div>
            <div>
              <Label htmlFor="paymentAmount">Valor do Pagamento *</Label>
              <Input
                id="paymentAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <select
                id="paymentMethod"
                className="w-full px-3 py-2 border border-border rounded-lg"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao">Cartão</option>
                <option value="transferencia">Transferência</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRegisterPayment}>
              Registrar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Mensagem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Para: <strong>{selectedReserva?.cliente}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Telefone: {selectedReserva?.clienteTelefone}
              </p>
              <p className="text-sm text-muted-foreground">
                Email: {selectedReserva?.clienteEmail}
              </p>
            </div>
            <div>
              <Label htmlFor="message">Mensagem *</Label>
              <Textarea
                id="message"
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 A mensagem será enviada via WhatsApp e Email
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendMessage} className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Enviar Mensagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Reservation Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Reserva Manual</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clienteNome">Nome do Cliente *</Label>
                <Input id="clienteNome" placeholder="João Silva" />
              </div>
              <div>
                <Label htmlFor="clienteTelefone">Telefone *</Label>
                <Input id="clienteTelefone" placeholder="(33) 99999-9999" />
              </div>
            </div>
            <div>
              <Label htmlFor="clienteEmail">Email</Label>
              <Input id="clienteEmail" type="email" placeholder="cliente@email.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quadra">Quadra *</Label>
                <select id="quadra" className="w-full px-3 py-2 border border-border rounded-lg">
                  <option>Society 1</option>
                  <option>Society 2</option>
                  <option>Futsal</option>
                  <option>Beach Tennis</option>
                </select>
              </div>
              <div>
                <Label htmlFor="data">Data *</Label>
                <Input id="data" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="horario">Horário *</Label>
                <Input id="horario" type="time" />
              </div>
              <div>
                <Label htmlFor="duracao">Duração (min)</Label>
                <Input id="duracao" type="number" defaultValue="60" />
              </div>
              <div>
                <Label htmlFor="participantes">Participantes</Label>
                <Input id="participantes" type="number" defaultValue="10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input id="valor" type="number" step="0.01" placeholder="150.00" />
              </div>
              <div>
                <Label htmlFor="statusReserva">Status</Label>
                <select id="statusReserva" className="w-full px-3 py-2 border border-border rounded-lg">
                  <option value="confirmada">Confirmada</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" placeholder="Informações adicionais..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({ title: "Sucesso", description: "Reserva criada com sucesso" });
              setIsCreateModalOpen(false);
            }}>
              Criar Reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
