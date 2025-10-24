"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Loader2, Plus, X, DollarSign, MessageSquare, Clock, Users, MapPin, Eye, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useReservasGestor, useUpdateReservaGestor, useDeleteReservaGestor, useCreateReservaGestor, type ReservaGestor } from "@/hooks/core/useReservasGestor";
import { useQuadras, useHorarios } from "@/hooks/core/useQuadrasHorarios";
import { useDebounce } from "@/hooks/useDebounce";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useConfirm } from "@/hooks/useConfirm";

export default function ReservasPage() {
  const { toast } = useToast();
  const { handleError, handleSuccess } = useErrorHandler();
  const { confirm, ConfirmDialog } = useConfirm();

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [quadraFilter, setQuadraFilter] = useState("todas");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Modals
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<ReservaGestor | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Form states for create modal
  const [formQuadraId, setFormQuadraId] = useState("");
  const [formHorarioId, setFormHorarioId] = useState("");
  const [formData, setFormData] = useState("");
  const [formOrganizadorNome, setFormOrganizadorNome] = useState("");
  const [formOrganizadorTelefone, setFormOrganizadorTelefone] = useState("");
  const [formOrganizadorEmail, setFormOrganizadorEmail] = useState("");
  const [formParticipantes, setFormParticipantes] = useState("1");
  const [formStatus, setFormStatus] = useState<"pendente" | "confirmada">("pendente");
  const [formObservacoes, setFormObservacoes] = useState("");

  // Hooks - passar filtros para useReservasGestor
  const filtros = useMemo(() => {
    const f: any = {};
    if (dataInicio) f.data_inicio = dataInicio;
    if (dataFim) f.data_fim = dataFim;
    if (quadraFilter !== "todas") f.quadra_id = quadraFilter;
    if (statusFilter !== "todos") f.status = statusFilter;
    return f;
  }, [dataInicio, dataFim, quadraFilter, statusFilter]);

  const { data: reservas, isLoading } = useReservasGestor(filtros);
  const { data: quadras, isLoading: isLoadingQuadras } = useQuadras();
  const { data: horarios, isLoading: isLoadingHorarios } = useHorarios(formQuadraId);
  const updateReservaMutation = useUpdateReservaGestor();
  const deleteReservaMutation = useDeleteReservaGestor();
  const createReservaMutation = useCreateReservaGestor();

  // Filtrar reservas
  const filteredReservas = useMemo(() => {
    if (!reservas) return [];

    return reservas.filter(reserva => {
      const matchesSearch = !debouncedSearch ||
        reserva.organizador?.nome_completo?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        reserva.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        reserva.quadra?.nome?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus = statusFilter === "todos" || reserva.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reservas, debouncedSearch, statusFilter]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!reservas) return [
      { title: "Total de Reservas", value: 0, color: "text-primary" },
      { title: "Confirmadas", value: 0, color: "text-green-600" },
      { title: "Pendentes", value: 0, color: "text-amber-600" },
      { title: "Receita Total", value: "R$ 0,00", color: "text-primary" }
    ];

    const total = reservas.length;
    const confirmadas = reservas.filter(r => r.status === "confirmada").length;
    const pendentes = reservas.filter(r => r.status === "pendente").length;
    const receita = reservas
      .filter(r => r.status === "confirmada")
      .reduce((acc, r) => acc + (r.valor_total || 0), 0);

    return [
      { title: "Total de Reservas", value: total, color: "text-primary" },
      { title: "Confirmadas", value: confirmadas, color: "text-green-600" },
      { title: "Pendentes", value: pendentes, color: "text-amber-600" },
      { title: "Receita Total", value: `R$ ${receita.toFixed(2)}`, color: "text-primary" }
    ];
  }, [reservas]);

  // Handlers
  const handleCreateReserva = async () => {
    // Validar campos obrigatórios
    if (!formQuadraId || !formHorarioId || !formData || !formOrganizadorNome) {
      handleError(
        new Error("Preencha todos os campos obrigatórios"),
        "ReservasPage"
      );
      return;
    }

    try {
      await createReservaMutation.mutateAsync({
        quadra_id: formQuadraId,
        horario_id: formHorarioId,
        data: formData,
        organizador_nome: formOrganizadorNome,
        organizador_telefone: formOrganizadorTelefone || undefined,
        organizador_email: formOrganizadorEmail || undefined,
        participantes: parseInt(formParticipantes) || 1,
        status: formStatus,
        observacoes: formObservacoes || undefined,
      });

      handleSuccess("Reserva criada com sucesso");

      // Limpar form e fechar modal
      setIsCreateModalOpen(false);
      setFormQuadraId("");
      setFormHorarioId("");
      setFormData("");
      setFormOrganizadorNome("");
      setFormOrganizadorTelefone("");
      setFormOrganizadorEmail("");
      setFormParticipantes("1");
      setFormStatus("pendente");
      setFormObservacoes("");
    } catch (error) {
      handleError(error, "ReservasPage", "Erro ao criar reserva");
    }
  };

  const handleCancelReserva = async () => {
    if (!selectedReserva || !cancelReason.trim()) {
      handleError(new Error("Informe o motivo do cancelamento"), "ReservasPage");
      return;
    }

    try {
      await updateReservaMutation.mutateAsync({
        id: selectedReserva.id,
        status: "cancelada",
        observacoes: `Cancelada: ${cancelReason}`,
      });

      handleSuccess("Reserva cancelada com sucesso");
      setIsCancelModalOpen(false);
      setCancelReason("");
      setSelectedReserva(null);
    } catch (error) {
      handleError(error, "ReservasPage", "Erro ao cancelar reserva");
    }
  };

  const handleConfirmReserva = async (reserva: ReservaGestor) => {
    try {
      await updateReservaMutation.mutateAsync({
        id: reserva.id,
        status: "confirmada",
      });

      handleSuccess("Reserva confirmada com sucesso");
    } catch (error) {
      handleError(error, "ReservasPage", "Erro ao confirmar reserva");
    }
  };

  const handleDeleteReserva = async (reserva: ReservaGestor) => {
    const confirmed = await confirm({
      title: 'Excluir Reserva',
      description: `Tem certeza que deseja excluir a reserva de ${reserva.organizador?.nome_completo || 'Cliente'} para ${reserva.quadra?.nome || 'Quadra'}? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await deleteReservaMutation.mutateAsync(reserva.id);
      handleSuccess("Reserva excluída com sucesso");
    } catch (error) {
      handleError(error, "ReservasPage", "Erro ao excluir reserva");
    }
  };

  // Helper functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      confirmada: { className: "bg-green-100 text-green-700", label: "Confirmada" },
      pendente: { className: "bg-amber-100 text-amber-700", label: "Pendente" },
      cancelada: { className: "bg-red-100 text-red-700", label: "Cancelada" },
    };
    const { className, label } = config[status as keyof typeof config] || config.pendente;
    return <Badge className={className}>{label}</Badge>;
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
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Reserva
        </Button>
      </div>

      {/* Statistics */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="h-20 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
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
      )}

      {/* Filters */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, ID ou quadra..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <select
                className="px-3 py-2 border border-border rounded-lg text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                disabled={isLoading}
              >
                <option value="todos">Todos os status</option>
                <option value="confirmada">Confirmada</option>
                <option value="pendente">Pendente</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dataInicio" className="text-xs text-muted-foreground mb-1 block">
                  Data Início
                </Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="dataFim" className="text-xs text-muted-foreground mb-1 block">
                  Data Fim
                </Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="quadraFilter" className="text-xs text-muted-foreground mb-1 block">
                  Filtrar por Quadra
                </Label>
                <select
                  id="quadraFilter"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  value={quadraFilter}
                  onChange={(e) => setQuadraFilter(e.target.value)}
                  disabled={isLoading || isLoadingQuadras}
                >
                  <option value="todas">Todas as quadras</option>
                  {quadras?.map((quadra) => (
                    <option key={quadra.id} value={quadra.id}>
                      {quadra.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(dataInicio || dataFim || quadraFilter !== "todas" || statusFilter !== "todos" || searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("todos");
                  setQuadraFilter("todas");
                  setDataInicio("");
                  setDataFim("");
                }}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">
            Lista de Reservas ({filteredReservas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando reservas...</p>
            </div>
          ) : filteredReservas.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-semibold mb-2">
                Nenhuma reserva encontrada
              </p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "todos"
                  ? "Tente ajustar os filtros"
                  : "Ainda não há reservas no sistema"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold">Cliente</th>
                    <th className="text-left p-4 font-semibold">Quadra</th>
                    <th className="text-left p-4 font-semibold">Data/Hora</th>
                    <th className="text-left p-4 font-semibold">Participantes</th>
                    <th className="text-left p-4 font-semibold">Valor</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservas.map((reserva) => (
                    <tr key={reserva.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold">
                            {reserva.organizador?.nome_completo || "Cliente"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reserva.organizador?.telefone || "Sem telefone"}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {reserva.quadra?.nome || "Quadra"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold">{formatDate(reserva.data)}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {reserva.horario?.hora_inicio} - {reserva.horario?.hora_fim}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {reserva.participantes_count || 0}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">{formatCurrency(reserva.valor_total || 0)}</p>
                      </td>
                      <td className="p-4">{getStatusBadge(reserva.status)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReserva(reserva);
                              setIsDetailsModalOpen(true);
                            }}
                            title="Ver Detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {reserva.status === "pendente" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleConfirmReserva(reserva)}
                              disabled={updateReservaMutation.isPending}
                              title="Confirmar Reserva"
                            >
                              {updateReservaMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                "Confirmar"
                              )}
                            </Button>
                          )}
                          {reserva.status !== "cancelada" && (
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
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            {selectedReserva && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Cliente: <strong>{selectedReserva.organizador?.nome_completo}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedReserva.quadra?.nome} - {formatDate(selectedReserva.data)} às {selectedReserva.horario?.hora_inicio}
                </p>
              </div>
            )}
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
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelModalOpen(false);
                setCancelReason("");
                setSelectedReserva(null);
              }}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelReserva}
              disabled={updateReservaMutation.isPending}
            >
              {updateReservaMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Confirmar Cancelamento"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Reserva</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="createQuadra">Quadra *</Label>
                <select
                  id="createQuadra"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  value={formQuadraId}
                  onChange={(e) => {
                    setFormQuadraId(e.target.value);
                    setFormHorarioId(""); // Reset horário quando mudar quadra
                  }}
                  disabled={isLoadingQuadras}
                >
                  <option value="">Selecione uma quadra</option>
                  {quadras?.map((quadra) => (
                    <option key={quadra.id} value={quadra.id}>
                      {quadra.nome} ({quadra.tipo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="createHorario">Horário *</Label>
                <select
                  id="createHorario"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  value={formHorarioId}
                  onChange={(e) => setFormHorarioId(e.target.value)}
                  disabled={!formQuadraId || isLoadingHorarios}
                >
                  <option value="">Selecione um horário</option>
                  {horarios?.map((horario) => (
                    <option key={horario.id} value={horario.id}>
                      {horario.hora_inicio} - {horario.hora_fim} (R$ {horario.valor_avulsa.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="createData">Data *</Label>
              <Input
                id="createData"
                type="date"
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Dados do Organizador</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="createNome">Nome Completo *</Label>
                  <Input
                    id="createNome"
                    placeholder="Nome do organizador"
                    value={formOrganizadorNome}
                    onChange={(e) => setFormOrganizadorNome(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="createTelefone">Telefone/WhatsApp</Label>
                    <Input
                      id="createTelefone"
                      placeholder="(00) 00000-0000"
                      value={formOrganizadorTelefone}
                      onChange={(e) => setFormOrganizadorTelefone(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="createEmail">Email</Label>
                    <Input
                      id="createEmail"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formOrganizadorEmail}
                      onChange={(e) => setFormOrganizadorEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="createParticipantes">Número de Participantes</Label>
                <Input
                  id="createParticipantes"
                  type="number"
                  min="1"
                  value={formParticipantes}
                  onChange={(e) => setFormParticipantes(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="createStatus">Status Inicial</Label>
                <select
                  id="createStatus"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "pendente" | "confirmada")}
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmada">Confirmada</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="createObservacoes">Observações</Label>
              <Textarea
                id="createObservacoes"
                placeholder="Observações sobre a reserva..."
                value={formObservacoes}
                onChange={(e) => setFormObservacoes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormQuadraId("");
                setFormHorarioId("");
                setFormData("");
                setFormOrganizadorNome("");
                setFormOrganizadorTelefone("");
                setFormOrganizadorEmail("");
                setFormParticipantes("1");
                setFormStatus("pendente");
                setFormObservacoes("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateReserva}
              disabled={createReservaMutation.isPending}
            >
              {createReservaMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                "Criar Reserva"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details/Edit Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
          </DialogHeader>
          {selectedReserva && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">ID</p>
                  <p className="font-mono text-sm">{selectedReserva.id.substring(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedReserva.status)}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Quadra e Horário
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quadra</p>
                      <p className="font-semibold">{selectedReserva.quadra?.nome}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tipo</p>
                      <p>{selectedReserva.quadra?.tipo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data</p>
                      <p className="font-semibold">{formatDate(selectedReserva.data)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Horário</p>
                      <p>{selectedReserva.horario?.hora_inicio} - {selectedReserva.horario?.hora_fim}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Organizador
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Nome</p>
                      <p className="font-semibold">{selectedReserva.organizador?.nome_completo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p>{selectedReserva.organizador?.email || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Telefone</p>
                      <p>{selectedReserva.organizador?.telefone || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Participantes</p>
                      <p className="font-semibold">{selectedReserva.participantes_count || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Financeiro
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Tipo</p>
                      <p className="capitalize">{selectedReserva.tipo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valor Total</p>
                      <p className="font-semibold text-lg">{formatCurrency(selectedReserva.valor_total || 0)}</p>
                    </div>
                  </div>
                </div>

                {selectedReserva.observacoes && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Observações</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedReserva.observacoes}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Informações do Sistema</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <p>Criada em</p>
                      <p>{new Date(selectedReserva.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <p>Atualizada em</p>
                      <p>{new Date(selectedReserva.updated_at).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
