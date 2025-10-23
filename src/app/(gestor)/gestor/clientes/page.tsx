"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Mail, Phone, Calendar, TrendingUp, Eye, Edit, Plus, DollarSign, AlertCircle, History, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  cadastro: string;
  ultimoJogo: string;
  totalJogos: number;
  saldo: number;
  status: "ativo" | "devedor" | "novo" | "inativo";
  observacoes?: string;
}

interface Reserva {
  id: string;
  quadra: string;
  data: string;
  horario: string;
  valor: number;
  status: string;
}

interface Pagamento {
  id: string;
  data: string;
  valor: number;
  tipo: "credito" | "debito";
  metodo: string;
  descricao: string;
}

export default function ClientesPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  
  // Modals
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Payment form
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] = useState<"credito" | "debito">("credito");
  const [paymentMethod, setPaymentMethod] = useState("dinheiro");
  const [paymentDescription, setPaymentDescription] = useState("");

  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "(33) 99999-1111",
      cpf: "123.456.789-00",
      endereco: "Rua A, 123 - Centro",
      cadastro: "2024-01-15",
      ultimoJogo: "2024-12-18",
      totalJogos: 23,
      saldo: 45.50,
      status: "ativo",
      observacoes: "Cliente frequente, sempre pontual"
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria@email.com",
      telefone: "(33) 99999-2222",
      cpf: "987.654.321-00",
      endereco: "Av. B, 456 - Bairro X",
      cadastro: "2024-02-20",
      ultimoJogo: "2024-12-17",
      totalJogos: 15,
      saldo: -30.00,
      status: "devedor",
      observacoes: "Pendência de pagamento da última reserva"
    },
    {
      id: 3,
      nome: "Pedro Costa",
      email: "pedro@email.com",
      telefone: "(33) 99999-3333",
      cpf: "456.789.123-00",
      endereco: "Rua C, 789 - Vila Y",
      cadastro: "2024-03-10",
      ultimoJogo: "2024-12-16",
      totalJogos: 8,
      saldo: 120.00,
      status: "ativo"
    },
    {
      id: 4,
      nome: "Ana Oliveira",
      email: "ana@email.com",
      telefone: "(33) 99999-4444",
      cpf: "321.654.987-00",
      endereco: "Av. D, 321 - Centro",
      cadastro: "2024-11-01",
      ultimoJogo: "2024-12-15",
      totalJogos: 3,
      saldo: 0.00,
      status: "novo"
    },
    {
      id: 5,
      nome: "Carlos Lima",
      email: "carlos@email.com",
      telefone: "(33) 99999-5555",
      cpf: "789.123.456-00",
      endereco: "Rua E, 654 - Bairro Z",
      cadastro: "2024-01-05",
      ultimoJogo: "2024-11-20",
      totalJogos: 45,
      saldo: 25.00,
      status: "inativo",
      observacoes: "Não joga há mais de 30 dias"
    }
  ]);

  // Mock data para histórico
  const mockReservas: Reserva[] = [
    { id: "R001", quadra: "Society 1", data: "2024-12-18", horario: "19:00", valor: 150.00, status: "concluida" },
    { id: "R002", quadra: "Futsal", data: "2024-12-10", horario: "20:00", valor: 180.00, status: "concluida" },
    { id: "R003", quadra: "Society 2", data: "2024-12-05", horario: "18:00", valor: 150.00, status: "concluida" }
  ];

  const mockPagamentos: Pagamento[] = [
    { id: "P001", data: "2024-12-18", valor: 150.00, tipo: "debito", metodo: "PIX", descricao: "Pagamento reserva R001" },
    { id: "P002", data: "2024-12-01", valor: 200.00, tipo: "credito", metodo: "Dinheiro", descricao: "Crédito adicionado" }
  ];

  const stats = [
    { title: "Total de Clientes", value: clientes.length, icon: Users, color: "text-primary" },
    { title: "Clientes Ativos", value: clientes.filter(c => c.status === "ativo").length, icon: TrendingUp, color: "text-success" },
    { title: "Novos este Mês", value: clientes.filter(c => c.status === "novo").length, icon: Calendar, color: "text-primary" },
    { title: "Com Saldo Devedor", value: clientes.filter(c => c.saldo < 0).length, icon: AlertCircle, color: "text-destructive" },
  ];

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = 
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefone.includes(searchTerm) ||
      cliente.cpf.includes(searchTerm);
    
    const matchesStatus = statusFilter === "todos" || cliente.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-success/10 text-success">Ativo</Badge>;
      case "devedor":
        return <Badge variant="destructive">Devedor</Badge>;
      case "novo":
        return <Badge className="bg-primary/10 text-primary">Novo</Badge>;
      case "inativo":
        return <Badge variant="outline">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleRegisterPayment = () => {
    if (!selectedCliente || !paymentAmount) {
      toast({ title: "Erro", description: "Informe o valor", variant: "destructive" });
      return;
    }

    const amount = parseFloat(paymentAmount);
    const newSaldo = paymentType === "credito" 
      ? selectedCliente.saldo + amount 
      : selectedCliente.saldo - amount;

    setClientes(clientes.map(c => 
      c.id === selectedCliente.id 
        ? { ...c, saldo: newSaldo, status: newSaldo < 0 ? "devedor" : c.status }
        : c
    ));

    toast({ 
      title: "Sucesso", 
      description: `${paymentType === "credito" ? "Crédito" : "Débito"} de ${formatCurrency(amount)} registrado` 
    });
    
    setIsPaymentModalOpen(false);
    setPaymentAmount("");
    setPaymentDescription("");
  };

  const handleSaveCliente = () => {
    toast({ title: "Sucesso", description: "Cliente salvo com sucesso" });
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="container-custom page-padding space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Gestão de Clientes
          </h1>
          <p className="body-medium text-muted-foreground">
            Gerencie todos os clientes da arena
          </p>
        </div>
        
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email, telefone ou CPF..."
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
                <option value="ativo">Ativo</option>
                <option value="devedor">Devedor</option>
                <option value="novo">Novo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Lista de Clientes ({filteredClientes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Cliente</th>
                  <th className="text-left p-4 font-semibold">Contato</th>
                  <th className="text-left p-4 font-semibold">Cadastro</th>
                  <th className="text-left p-4 font-semibold">Último Jogo</th>
                  <th className="text-left p-4 font-semibold">Total Jogos</th>
                  <th className="text-left p-4 font-semibold">Saldo</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{cliente.nome}</p>
                        <p className="text-sm text-muted-foreground">CPF: {cliente.cpf}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {cliente.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {cliente.telefone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{formatDate(cliente.cadastro)}</td>
                    <td className="p-4 text-sm">{formatDate(cliente.ultimoJogo)}</td>
                    <td className="p-4 text-center font-semibold">{cliente.totalJogos}</td>
                    <td className="p-4">
                      <span className={`font-semibold ${
                        cliente.saldo > 0 ? 'text-success' : 
                        cliente.saldo < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatCurrency(cliente.saldo)}
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(cliente.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedCliente(cliente);
                            setIsDetailsModalOpen(true);
                          }}
                          title="Ver Detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedCliente(cliente);
                            setIsEditModalOpen(true);
                          }}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedCliente(cliente);
                            setIsPaymentModalOpen(true);
                          }}
                          title="Pagamento"
                        >
                          <DollarSign className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredClientes.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum cliente encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Detalhes do Cliente
            </DialogTitle>
          </DialogHeader>
          
          {selectedCliente && (
            <Tabs defaultValue="dados" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              </TabsList>

              <TabsContent value="dados" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Nome Completo</Label>
                    <p className="font-semibold">{selectedCliente.nome}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">CPF</Label>
                    <p className="font-semibold">{selectedCliente.cpf}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-semibold">{selectedCliente.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Telefone</Label>
                    <p className="font-semibold">{selectedCliente.telefone}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Endereço</Label>
                    <p className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedCliente.endereco}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data de Cadastro</Label>
                    <p className="font-semibold">{formatDate(selectedCliente.cadastro)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedCliente.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <Card className="border-0 shadow-soft">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{selectedCliente.totalJogos}</p>
                      <p className="text-xs text-muted-foreground">Total de Jogos</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-soft">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-success">{formatDate(selectedCliente.ultimoJogo)}</p>
                      <p className="text-xs text-muted-foreground">Último Jogo</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-soft">
                    <CardContent className="p-4 text-center">
                      <p className={`text-2xl font-bold ${selectedCliente.saldo >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(selectedCliente.saldo)}
                      </p>
                      <p className="text-xs text-muted-foreground">Saldo Atual</p>
                    </CardContent>
                  </Card>
                </div>

                {selectedCliente.observacoes && (
                  <div className="pt-4 border-t">
                    <Label className="text-muted-foreground">Observações</Label>
                    <p className="mt-2 text-sm bg-muted p-3 rounded-lg">{selectedCliente.observacoes}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="historico" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Histórico de Reservas
                  </h3>
                  <div className="space-y-2">
                    {mockReservas.map((reserva) => (
                      <div key={reserva.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-semibold text-sm">{reserva.quadra}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(reserva.data)} às {reserva.horario}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{formatCurrency(reserva.valor)}</p>
                          <Badge variant="outline" className="text-xs">{reserva.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financeiro" className="space-y-4 mt-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Saldo Atual</span>
                    <span className={`text-2xl font-bold ${selectedCliente.saldo >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(selectedCliente.saldo)}
                    </span>
                  </div>
                  {selectedCliente.saldo < 0 && (
                    <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                      <AlertCircle className="w-4 h-4" />
                      Cliente com saldo devedor
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Histórico de Pagamentos
                  </h3>
                  <div className="space-y-2">
                    {mockPagamentos.map((pagamento) => (
                      <div key={pagamento.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-semibold text-sm">{pagamento.descricao}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(pagamento.data)} - {pagamento.metodo}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-sm ${pagamento.tipo === 'credito' ? 'text-success' : 'text-destructive'}`}>
                            {pagamento.tipo === 'credito' ? '+' : '-'} {formatCurrency(pagamento.valor)}
                          </p>
                          <Badge variant="outline" className="text-xs">{pagamento.tipo}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Registrar Pagamento
            </DialogTitle>
          </DialogHeader>
          
          {selectedCliente && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Cliente: <strong>{selectedCliente.nome}</strong>
                </p>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">Saldo Atual: <strong className={selectedCliente.saldo >= 0 ? 'text-success' : 'text-destructive'}>{formatCurrency(selectedCliente.saldo)}</strong></p>
                </div>
              </div>

              <div>
                <Label htmlFor="paymentType">Tipo de Operação *</Label>
                <select 
                  id="paymentType"
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as "credito" | "debito")}
                >
                  <option value="credito">Crédito (Adicionar saldo)</option>
                  <option value="debito">Débito (Remover saldo)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="paymentAmount">Valor (R$) *</Label>
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

              <div>
                <Label htmlFor="paymentDescription">Descrição</Label>
                <Textarea
                  id="paymentDescription"
                  placeholder="Motivo do pagamento..."
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {paymentAmount && (
                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-sm">
                    Novo saldo: <strong className={
                      (paymentType === "credito" 
                        ? selectedCliente.saldo + parseFloat(paymentAmount) 
                        : selectedCliente.saldo - parseFloat(paymentAmount)) >= 0 
                        ? 'text-success' 
                        : 'text-destructive'
                    }>
                      {formatCurrency(
                        paymentType === "credito" 
                          ? selectedCliente.saldo + parseFloat(paymentAmount) 
                          : selectedCliente.saldo - parseFloat(paymentAmount)
                      )}
                    </strong>
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRegisterPayment}>
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          
          {selectedCliente && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editNome">Nome Completo *</Label>
                  <Input id="editNome" defaultValue={selectedCliente.nome} />
                </div>
                <div>
                  <Label htmlFor="editCpf">CPF *</Label>
                  <Input id="editCpf" defaultValue={selectedCliente.cpf} />
                </div>
                <div>
                  <Label htmlFor="editEmail">Email *</Label>
                  <Input id="editEmail" type="email" defaultValue={selectedCliente.email} />
                </div>
                <div>
                  <Label htmlFor="editTelefone">Telefone *</Label>
                  <Input id="editTelefone" defaultValue={selectedCliente.telefone} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="editEndereco">Endereço</Label>
                  <Input id="editEndereco" defaultValue={selectedCliente.endereco} />
                </div>
                <div>
                  <Label htmlFor="editStatus">Status</Label>
                  <select 
                    id="editStatus"
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    defaultValue={selectedCliente.status}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="devedor">Devedor</option>
                    <option value="novo">Novo</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="editObservacoes">Observações</Label>
                  <Textarea 
                    id="editObservacoes" 
                    defaultValue={selectedCliente.observacoes}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCliente}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="createNome">Nome Completo *</Label>
                <Input id="createNome" placeholder="João Silva" />
              </div>
              <div>
                <Label htmlFor="createCpf">CPF *</Label>
                <Input id="createCpf" placeholder="000.000.000-00" />
              </div>
              <div>
                <Label htmlFor="createEmail">Email *</Label>
                <Input id="createEmail" type="email" placeholder="cliente@email.com" />
              </div>
              <div>
                <Label htmlFor="createTelefone">Telefone *</Label>
                <Input id="createTelefone" placeholder="(33) 99999-9999" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="createEndereco">Endereço</Label>
                <Input id="createEndereco" placeholder="Rua, número - Bairro" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="createObservacoes">Observações</Label>
                <Textarea 
                  id="createObservacoes" 
                  placeholder="Informações adicionais sobre o cliente..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCliente}>
              Criar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
