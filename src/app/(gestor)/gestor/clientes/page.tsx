"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Mail, Phone, Calendar, TrendingUp, Eye, Edit, Plus, DollarSign, AlertCircle, History, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClients, useClientReservas, useClientTransacoes, useCreateClient, useUpdateClient, useAdjustClientCredits } from "@/hooks/core/useClients";
import type { ClientWithStats } from "@/services/core/clients.service";
import { useDebounce } from "@/hooks/useDebounce";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClientesPage() {
  const { toast } = useToast();

  // Hooks de dados
  const { data: clientes, isLoading: isLoadingClientes } = useClients();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const adjustCreditsMutation = useAdjustClientCredits();

  // Estado local
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Modals
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClientWithStats | null>(null);

  // Dados do cliente selecionado
  const { data: clienteReservas, isLoading: isLoadingReservas } = useClientReservas(selectedCliente?.id || '');
  const { data: clienteTransacoes, isLoading: isLoadingTransacoes } = useClientTransacoes(selectedCliente?.id || '');

  // Payment form
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] = useState<"adicao" | "uso">("adicao");
  const [paymentMethod, setPaymentMethod] = useState("dinheiro");
  const [paymentDescription, setPaymentDescription] = useState("");

  // Create client form
  const [newClientData, setNewClientData] = useState({
    nome_completo: "",
    email: "",
    cpf: "",
    whatsapp: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  // Estatísticas
  const stats = useMemo(() => {
    if (!clientes) return [
      { title: "Total de Clientes", value: 0, icon: Users, color: "text-primary" },
      { title: "Clientes Ativos", value: 0, icon: TrendingUp, color: "text-success" },
      { title: "Novos este Mês", value: 0, icon: Calendar, color: "text-primary" },
      { title: "Com Saldo Devedor", value: 0, icon: AlertCircle, color: "text-destructive" },
    ];

    return [
      { title: "Total de Clientes", value: clientes.length, icon: Users, color: "text-primary" },
      { title: "Clientes Ativos", value: clientes.filter(c => c.status_cliente === "ativo").length, icon: TrendingUp, color: "text-success" },
      { title: "Novos este Mês", value: clientes.filter(c => c.status_cliente === "novo").length, icon: Calendar, color: "text-primary" },
      { title: "Com Saldo Devedor", value: clientes.filter(c => c.saldo_creditos < 0).length, icon: AlertCircle, color: "text-destructive" },
    ];
  }, [clientes]);

  // Filtros
  const filteredClientes = useMemo(() => {
    if (!clientes) return [];

    return clientes.filter(cliente => {
      const matchesSearch =
        cliente.nome_completo?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        cliente.whatsapp?.includes(debouncedSearchTerm) ||
        cliente.cpf?.includes(debouncedSearchTerm);

      const matchesStatus = statusFilter === "todos" || cliente.status_cliente === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clientes, debouncedSearchTerm, statusFilter]);

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

  const handleRegisterPayment = async () => {
    if (!selectedCliente || !paymentAmount) {
      toast({ title: "Erro", description: "Informe o valor", variant: "destructive" });
      return;
    }

    const amount = parseFloat(paymentAmount);

    try {
      await adjustCreditsMutation.mutateAsync({
        clientId: selectedCliente.id,
        valor: amount,
        tipo: paymentType,
        descricao: paymentDescription || `${paymentType === 'adicao' ? 'Crédito' : 'Débito'} via ${paymentMethod}`,
      });

      setIsPaymentModalOpen(false);
      setPaymentAmount("");
      setPaymentDescription("");
    } catch (error) {
      // Erro já tratado pelo hook
    }
  };

  const handleSaveCliente = async () => {
    // Modo criação
    if (isCreateModalOpen) {
      if (!newClientData.nome_completo || !newClientData.email) {
        toast({
          title: "Erro",
          description: "Nome e email são obrigatórios",
          variant: "destructive",
        });
        return;
      }

      try {
        await createClientMutation.mutateAsync(newClientData);
        setIsCreateModalOpen(false);
        setNewClientData({
          nome_completo: "",
          email: "",
          cpf: "",
          whatsapp: "",
          logradouro: "",
          numero: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
        });
      } catch (error) {
        // Erro já tratado pelo hook
      }
    }
    // Modo edição
    else if (selectedCliente) {
      try {
        await updateClientMutation.mutateAsync({
          id: selectedCliente.id,
          data: {
            // TODO: Implementar edição com valores reais do form
          },
        });

        setIsEditModalOpen(false);
      } catch (error) {
        // Erro já tratado pelo hook
      }
    }
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

      {/* Clients List */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Lista de Clientes ({filteredClientes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingClientes ? (
            <div className="p-12 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando clientes...</p>
            </div>
          ) : filteredClientes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum cliente encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClientes.map((cliente) => (
                <Card key={cliente.id} className="border border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Info Principal */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Nome e Status */}
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <h3 className="font-semibold text-base leading-tight truncate">
                                {cliente.nome_completo || 'Sem nome'}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {cliente.cpf || 'CPF não informado'}
                              </p>
                              <div className="mt-2">
                                {getStatusBadge(cliente.status_cliente)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contato */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate">{cliente.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm">{cliente.whatsapp || 'Não informado'}</span>
                          </div>
                        </div>

                        {/* Estatísticas */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Jogos</p>
                            <p className="text-lg font-bold text-primary">{cliente.total_jogos}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Saldo</p>
                            <p className={`text-lg font-bold ${
                              cliente.saldo_creditos > 0 ? 'text-success' :
                              cliente.saldo_creditos < 0 ? 'text-destructive' : 'text-muted-foreground'
                            }`}>
                              {formatCurrency(cliente.saldo_creditos)}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-muted-foreground">Último jogo</p>
                            <p className="text-sm font-medium">
                              {cliente.ultimo_jogo ? formatDate(cliente.ultimo_jogo) : 'Nunca jogou'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCliente(cliente);
                            setIsDetailsModalOpen(true);
                          }}
                          className="w-full"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Detalhes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCliente(cliente);
                            setIsEditModalOpen(true);
                          }}
                          className="w-full"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCliente(cliente);
                            setIsPaymentModalOpen(true);
                          }}
                          className="w-full"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Créditos
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                    <p className="font-semibold">{selectedCliente.nome_completo || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">CPF</Label>
                    <p className="font-semibold">{selectedCliente.cpf || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-semibold">{selectedCliente.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">WhatsApp</Label>
                    <p className="font-semibold">{selectedCliente.whatsapp || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Endereço</Label>
                    <p className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedCliente.logradouro ?
                        `${selectedCliente.logradouro}${selectedCliente.numero ? `, ${selectedCliente.numero}` : ''}${selectedCliente.bairro ? ` - ${selectedCliente.bairro}` : ''}${selectedCliente.cidade ? ` - ${selectedCliente.cidade}` : ''}` :
                        'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data de Cadastro</Label>
                    <p className="font-semibold">{formatDate(selectedCliente.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedCliente.status_cliente)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <Card className="border-0 shadow-soft">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{selectedCliente.total_jogos}</p>
                      <p className="text-xs text-muted-foreground">Total de Jogos</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-soft">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-success">
                        {selectedCliente.ultimo_jogo ? formatDate(selectedCliente.ultimo_jogo) : 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">Último Jogo</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-soft">
                    <CardContent className="p-4 text-center">
                      <p className={`text-2xl font-bold ${selectedCliente.saldo_creditos >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(selectedCliente.saldo_creditos)}
                      </p>
                      <p className="text-xs text-muted-foreground">Saldo Atual</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="historico" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Histórico de Reservas
                  </h3>
                  {isLoadingReservas ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Carregando reservas...</p>
                    </div>
                  ) : clienteReservas && clienteReservas.length > 0 ? (
                    <div className="space-y-2">
                      {clienteReservas.map((reserva) => (
                        <div key={reserva.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <p className="font-semibold text-sm">{reserva.quadra?.nome || 'Quadra'}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(reserva.data)} - {reserva.horario?.hora_inicio} às {reserva.horario?.hora_fim}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">{formatCurrency(reserva.valor_total)}</p>
                            <Badge variant="outline" className="text-xs">{reserva.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhuma reserva encontrada</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="financeiro" className="space-y-4 mt-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Saldo Atual</span>
                    <span className={`text-2xl font-bold ${selectedCliente.saldo_creditos >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(selectedCliente.saldo_creditos)}
                    </span>
                  </div>
                  {selectedCliente.saldo_creditos < 0 && (
                    <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                      <AlertCircle className="w-4 h-4" />
                      Cliente com saldo devedor
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Histórico de Transações
                  </h3>
                  {isLoadingTransacoes ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Carregando transações...</p>
                    </div>
                  ) : clienteTransacoes && clienteTransacoes.length > 0 ? (
                    <div className="space-y-2">
                      {clienteTransacoes.map((transacao) => (
                        <div key={transacao.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <p className="font-semibold text-sm">{transacao.descricao || transacao.tipo}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(transacao.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold text-sm ${transacao.tipo === 'adicao' || transacao.tipo === 'bonus_indicacao' ? 'text-success' : 'text-destructive'}`}>
                              {transacao.tipo === 'adicao' || transacao.tipo === 'bonus_indicacao' ? '+' : '-'} {formatCurrency(transacao.valor)}
                            </p>
                            <Badge variant="outline" className="text-xs">{transacao.tipo}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhuma transação encontrada</p>
                  )}
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
                  Cliente: <strong>{selectedCliente.nome_completo || 'N/A'}</strong>
                </p>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">Saldo Atual: <strong className={selectedCliente.saldo_creditos >= 0 ? 'text-success' : 'text-destructive'}>{formatCurrency(selectedCliente.saldo_creditos)}</strong></p>
                </div>
              </div>

              <div>
                <Label htmlFor="paymentType">Tipo de Operação *</Label>
                <select
                  id="paymentType"
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as "adicao" | "uso")}
                >
                  <option value="adicao">Crédito (Adicionar saldo)</option>
                  <option value="uso">Débito (Remover saldo)</option>
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
                      (paymentType === "adicao"
                        ? selectedCliente.saldo_creditos + parseFloat(paymentAmount)
                        : selectedCliente.saldo_creditos - parseFloat(paymentAmount)) >= 0
                        ? 'text-success'
                        : 'text-destructive'
                    }>
                      {formatCurrency(
                        paymentType === "adicao"
                          ? selectedCliente.saldo_creditos + parseFloat(paymentAmount)
                          : selectedCliente.saldo_creditos - parseFloat(paymentAmount)
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
                  <Input id="editNome" defaultValue={selectedCliente.nome_completo || ''} />
                </div>
                <div>
                  <Label htmlFor="editCpf">CPF *</Label>
                  <Input id="editCpf" defaultValue={selectedCliente.cpf || ''} />
                </div>
                <div>
                  <Label htmlFor="editEmail">Email *</Label>
                  <Input id="editEmail" type="email" defaultValue={selectedCliente.email} />
                </div>
                <div>
                  <Label htmlFor="editTelefone">WhatsApp *</Label>
                  <Input id="editTelefone" defaultValue={selectedCliente.whatsapp || ''} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="editEndereco">Logradouro</Label>
                  <Input id="editEndereco" defaultValue={selectedCliente.logradouro || ''} />
                </div>
                <div>
                  <Label htmlFor="editNumero">Número</Label>
                  <Input id="editNumero" defaultValue={selectedCliente.numero || ''} />
                </div>
                <div>
                  <Label htmlFor="editBairro">Bairro</Label>
                  <Input id="editBairro" defaultValue={selectedCliente.bairro || ''} />
                </div>
                <div>
                  <Label htmlFor="editCidade">Cidade</Label>
                  <Input id="editCidade" defaultValue={selectedCliente.cidade || ''} />
                </div>
                <div>
                  <Label htmlFor="editEstado">Estado</Label>
                  <Input id="editEstado" defaultValue={selectedCliente.estado || ''} />
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
                <Input
                  id="createNome"
                  placeholder="João Silva"
                  value={newClientData.nome_completo}
                  onChange={(e) => setNewClientData({ ...newClientData, nome_completo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="createCpf">CPF</Label>
                <Input
                  id="createCpf"
                  placeholder="000.000.000-00"
                  value={newClientData.cpf}
                  onChange={(e) => setNewClientData({ ...newClientData, cpf: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="createEmail">Email *</Label>
                <Input
                  id="createEmail"
                  type="email"
                  placeholder="cliente@email.com"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="createWhatsApp">WhatsApp</Label>
                <Input
                  id="createWhatsApp"
                  placeholder="(33) 99999-9999"
                  value={newClientData.whatsapp}
                  onChange={(e) => setNewClientData({ ...newClientData, whatsapp: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="createLogradouro">Logradouro</Label>
                <Input
                  id="createLogradouro"
                  placeholder="Rua Exemplo"
                  value={newClientData.logradouro}
                  onChange={(e) => setNewClientData({ ...newClientData, logradouro: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="createNumero">Número</Label>
                <Input
                  id="createNumero"
                  placeholder="123"
                  value={newClientData.numero}
                  onChange={(e) => setNewClientData({ ...newClientData, numero: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="createBairro">Bairro</Label>
                <Input
                  id="createBairro"
                  placeholder="Centro"
                  value={newClientData.bairro}
                  onChange={(e) => setNewClientData({ ...newClientData, bairro: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="createCidade">Cidade</Label>
                <Input
                  id="createCidade"
                  placeholder="Governador Valadares"
                  value={newClientData.cidade}
                  onChange={(e) => setNewClientData({ ...newClientData, cidade: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="createEstado">Estado</Label>
                <Input
                  id="createEstado"
                  placeholder="MG"
                  maxLength={2}
                  value={newClientData.estado}
                  onChange={(e) => setNewClientData({ ...newClientData, estado: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveCliente}
              disabled={createClientMutation.isPending}
            >
              {createClientMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                "Criar Cliente"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
