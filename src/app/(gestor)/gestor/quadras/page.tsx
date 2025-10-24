"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Edit2, Trash2, Users, Clock, Ban, Calendar, LayoutGrid, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCourts,
  useCreateCourt,
  useUpdateCourt,
  useDeleteCourt,
  useSchedules,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
  useCourtBlocks,
  useCreateCourtBlock,
  useDeleteCourtBlock,
} from "@/hooks/core/useCourts";
import type { Court } from "@/types/courts.types";
import { useConfirm } from "@/hooks/useConfirm";

export default function QuadrasPage() {
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  const { confirm, ConfirmDialog } = useConfirm();

  // Form states para criar/editar quadra
  const [formNome, setFormNome] = useState("");
  const [formTipo, setFormTipo] = useState<"society" | "beach_tennis" | "volei" | "futevolei">("society");
  const [formCapacidade, setFormCapacidade] = useState("");
  const [formStatus, setFormStatus] = useState<"ativa" | "manutencao" | "inativa">("ativa");
  const [formDescricao, setFormDescricao] = useState("");

  // Hooks
  const { data: courts, isLoading } = useCourts();
  const createCourtMutation = useCreateCourt();
  const updateCourtMutation = useUpdateCourt();
  const deleteCourtMutation = useDeleteCourt();

  // Auto-selecionar primeira quadra
  useEffect(() => {
    if (courts && courts.length > 0 && !selectedCourt) {
      setSelectedCourt(courts[0]);
    }
  }, [courts, selectedCourt]);

  const courtTypes: Record<string, string> = {
    society: "Futebol Society",
    beach_tennis: "Beach Tennis",
    volei: "Vôlei de Praia",
    futevolei: "Futevôlei"
  };

  // Handlers
  const openCreateDialog = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const openEditDialog = (court: Court) => {
    setFormNome(court.nome);
    setFormTipo(court.tipo as any);
    setFormCapacidade(court.capacidade_maxima?.toString() || "");
    setFormStatus(court.status);
    setFormDescricao(court.descricao || "");
    setEditingCourt(court);
  };

  const resetForm = () => {
    setFormNome("");
    setFormTipo("society");
    setFormCapacidade("");
    setFormStatus("ativa");
    setFormDescricao("");
  };

  const handleCreateCourt = async () => {
    if (!formNome || !formCapacidade) return;

    await createCourtMutation.mutateAsync({
      nome: formNome,
      tipo: formTipo,
      capacidade_maxima: parseInt(formCapacidade),
      status: formStatus,
      descricao: formDescricao || undefined,
    });

    setShowCreateDialog(false);
    resetForm();
  };

  const handleUpdateCourt = async () => {
    if (!editingCourt || !formNome || !formCapacidade) return;

    await updateCourtMutation.mutateAsync({
      id: editingCourt.id,
      data: {
        nome: formNome,
        tipo: formTipo,
        capacidade_maxima: parseInt(formCapacidade),
        status: formStatus,
        descricao: formDescricao || undefined,
      },
    });

    setEditingCourt(null);
    resetForm();
  };

  const handleDeleteCourt = async (court: Court) => {
    const confirmed = await confirm({
      title: 'Excluir Quadra',
      description: `Tem certeza que deseja excluir a quadra "${court.nome}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;

    await deleteCourtMutation.mutateAsync(court.id);

    if (selectedCourt?.id === court.id) {
      setSelectedCourt(courts && courts.length > 1 ? courts[0] : null);
    }
  };

  return (
    <div className="container-custom page-padding space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
            Gestão de Quadras
          </h1>
          <p className="body-medium text-muted-foreground">
            Gerencie quadras, horários e bloqueios
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2" disabled={isLoading}>
          <Plus className="w-5 h-5" />
          Nova Quadra
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-0 shadow-soft">
          <CardContent className="p-20 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando quadras...</p>
          </CardContent>
        </Card>
      ) : !courts || courts.length === 0 ? (
        <Card className="border-0 shadow-soft">
          <CardContent className="p-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="heading-3 mb-3">Nenhuma quadra cadastrada</CardTitle>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Comece criando sua primeira quadra para gerenciar horários e bloqueios
            </p>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="w-5 h-5" />
              Criar Primeira Quadra
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[340px_1fr] gap-8">
          {/* Sidebar - Lista de Quadras */}
          <Card className="border-0 shadow-soft h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="heading-4">Quadras</CardTitle>
                <Badge variant="secondary">{courts.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {courts.map((court) => (
                  <button
                    key={court.id}
                    onClick={() => setSelectedCourt(court)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${selectedCourt?.id === court.id
                      ? 'bg-primary/5 ring-2 ring-primary/20'
                      : 'hover:bg-muted'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{court.nome}</h3>
                        <p className="text-xs text-muted-foreground">
                          {courtTypes[court.tipo]}
                        </p>
                      </div>
                      <Badge
                        variant={
                          court.status === 'ativa' ? 'default' :
                            court.status === 'manutencao' ? 'secondary' : 'outline'
                        }
                      >
                        {court.status === 'ativa' ? 'Ativa' :
                          court.status === 'manutencao' ? 'Manutenção' : 'Inativa'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5 mr-1.5" />
                      <span>Até {court.capacidade_maxima} pessoas</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Area - Detalhes da Quadra Selecionada */}
          {selectedCourt && (
            <Card className="border-0 shadow-soft overflow-hidden">
              {/* Court Header */}
              <div className="bg-gradient-to-br from-primary via-primary to-primary/80 p-8 text-primary-foreground">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="heading-2 mb-3">{selectedCourt.nome}</h2>
                    <div className="flex items-center gap-6 text-primary-foreground/90">
                      <span className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {courtTypes[selectedCourt.tipo]}
                      </span>
                      <span className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        Capacidade: {selectedCourt.capacidade_maxima} pessoas
                      </span>
                    </div>
                    {selectedCourt.descricao && (
                      <p className="mt-4 text-primary-foreground/80 text-sm leading-relaxed max-w-2xl">
                        {selectedCourt.descricao}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditDialog(selectedCourt)}
                      variant="ghost"
                      size="sm"
                      className="text-primary-foreground hover:bg-primary-foreground/20 h-9 w-9 p-0"
                      disabled={updateCourtMutation.isPending}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteCourt(selectedCourt)}
                      variant="ghost"
                      size="sm"
                      className="text-primary-foreground hover:bg-destructive/20 h-9 w-9 p-0"
                      disabled={deleteCourtMutation.isPending}
                    >
                      {deleteCourtMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="schedules" className="w-full">
                <div className="px-8 pt-6">
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="schedules">
                      <Clock className="h-4 w-4 mr-2" />
                      Horários
                    </TabsTrigger>
                    <TabsTrigger value="blocks">
                      <Ban className="h-4 w-4 mr-2" />
                      Bloqueios
                    </TabsTrigger>
                    <TabsTrigger value="info">
                      <Calendar className="h-4 w-4 mr-2" />
                      Info
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8">
                  <TabsContent value="schedules" className="mt-0">
                    <HorariosTab quadraId={selectedCourt.id} quadraNome={selectedCourt.nome} />
                  </TabsContent>

                  <TabsContent value="blocks" className="mt-0">
                    <BloqueiosTab quadraId={selectedCourt.id} quadraNome={selectedCourt.nome} />
                  </TabsContent>

                  <TabsContent value="info" className="mt-0">
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="border border-border">
                          <CardContent className="p-5">
                            <p className="text-sm text-muted-foreground mb-1.5">Nome</p>
                            <p className="font-semibold text-foreground">{selectedCourt.nome}</p>
                          </CardContent>
                        </Card>

                        <Card className="border border-border">
                          <CardContent className="p-5">
                            <p className="text-sm text-muted-foreground mb-1.5">Tipo</p>
                            <p className="font-semibold text-foreground">
                              {courtTypes[selectedCourt.tipo]}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border border-border">
                          <CardContent className="p-5">
                            <p className="text-sm text-muted-foreground mb-1.5">Capacidade</p>
                            <p className="font-semibold text-foreground">
                              {selectedCourt.capacidade_maxima} pessoas
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border border-border">
                          <CardContent className="p-5">
                            <p className="text-sm text-muted-foreground mb-1.5">Status</p>
                            <p className="font-semibold text-foreground">
                              {selectedCourt.status === 'ativa' ? 'Ativa' :
                                selectedCourt.status === 'manutencao' ? 'Em Manutenção' : 'Inativa'}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {selectedCourt.descricao && (
                        <Card className="border border-border">
                          <CardContent className="p-5">
                            <p className="text-sm text-muted-foreground mb-1.5">Descrição</p>
                            <p className="text-foreground leading-relaxed">{selectedCourt.descricao}</p>
                          </CardContent>
                        </Card>
                      )}

                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => openEditDialog(selectedCourt)}
                          disabled={updateCourtMutation.isPending}
                        >
                          {updateCourtMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Edit2 className="h-4 w-4 mr-2" />
                          )}
                          Editar Informações
                        </Button>
                        <Button
                          onClick={() => handleDeleteCourt(selectedCourt)}
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10"
                          disabled={deleteCourtMutation.isPending}
                        >
                          {deleteCourtMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Excluir Quadra
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          )}
        </div>
      )}

      {/* Dialog Criar/Editar Quadra */}
      <Dialog open={showCreateDialog || !!editingCourt} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setEditingCourt(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {editingCourt ? "Editar Quadra" : "Nova Quadra"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome da Quadra *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Society 1"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo *</Label>
                <select
                  id="tipo"
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  value={formTipo}
                  onChange={(e) => setFormTipo(e.target.value as any)}
                >
                  <option value="society">Futebol Society</option>
                  <option value="beach_tennis">Beach Tennis</option>
                  <option value="volei">Vôlei de Praia</option>
                  <option value="futevolei">Futevôlei</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacidade">Capacidade Máxima *</Label>
                <Input
                  id="capacidade"
                  type="number"
                  min="1"
                  placeholder="Ex: 14"
                  value={formCapacidade}
                  onChange={(e) => setFormCapacidade(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                >
                  <option value="ativa">Ativa</option>
                  <option value="manutencao">Em Manutenção</option>
                  <option value="inativa">Inativa</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Detalhes sobre a quadra..."
                rows={3}
                value={formDescricao}
                onChange={(e) => setFormDescricao(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setEditingCourt(null);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={editingCourt ? handleUpdateCourt : handleCreateCourt}
              disabled={createCourtMutation.isPending || updateCourtMutation.isPending}
            >
              {(createCourtMutation.isPending || updateCourtMutation.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                editingCourt ? "Salvar Alterações" : "Criar Quadra"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
}

// Componente de Horários
function HorariosTab({ quadraId, quadraNome }: { quadraId: string; quadraNome: string }) {
  const { confirm, ConfirmDialog } = useConfirm();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState<any>(null);

  // Form states
  const [diaSemana, setDiaSemana] = useState<number>(1);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("09:00");
  const [preco, setPreco] = useState("");
  const [ativo, setAtivo] = useState(true);

  // Hooks
  const { data: horarios, isLoading } = useSchedules(quadraId);
  const createScheduleMutation = useCreateSchedule();
  const updateScheduleMutation = useUpdateSchedule();
  const deleteScheduleMutation = useDeleteSchedule();

  const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const horariosQuadra = horarios || [];

  const handleCreateHorario = async () => {
    if (!preco || parseFloat(preco) <= 0) return;

    await createScheduleMutation.mutateAsync({
      quadra_id: quadraId,
      dia_semana: diaSemana,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      valor_avulsa: parseFloat(preco),
      valor_mensalista: parseFloat(preco) * 0.8, // 20% de desconto para mensalistas
      ativo: true,
    });

    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleUpdateHorario = async () => {
    if (!editingHorario || !preco || parseFloat(preco) <= 0) return;

    await updateScheduleMutation.mutateAsync({
      id: editingHorario.id,
      data: {
        dia_semana: diaSemana,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        valor_avulsa: parseFloat(preco),
        ativo,
      },
    });

    setEditingHorario(null);
    resetForm();
  };

  const handleDeleteHorario = async (id: string) => {
    const confirmed = await confirm({
      title: 'Excluir Horário',
      description: 'Tem certeza que deseja excluir este horário? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;
    await deleteScheduleMutation.mutateAsync(id);
  };

  const handleToggleAtivo = async (horario: any) => {
    await updateScheduleMutation.mutateAsync({
      id: horario.id,
      data: { ativo: !horario.ativo },
    });
  };

  const openEditModal = (horario: any) => {
    setEditingHorario(horario);
    setDiaSemana(horario.dia_semana);
    setHoraInicio(horario.hora_inicio);
    setHoraFim(horario.hora_fim);
    setPreco(horario.valor_avulsa.toString());
    setAtivo(horario.ativo);
  };

  const resetForm = () => {
    setDiaSemana(1);
    setHoraInicio("08:00");
    setHoraFim("09:00");
    setPreco("");
    setAtivo(true);
  };

  const getHorariosPorDia = (dia: number) => {
    return horariosQuadra
      .filter((h: any) => h.dia_semana === dia)
      .sort((a: any, b: any) => a.hora_inicio.localeCompare(b.hora_inicio));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="heading-4">Grade de Horários</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Horário
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Carregando horários...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {diasSemana.map((dia, index) => {
            const horariasDia = getHorariosPorDia(index);

            return (
              <Card key={dia} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{dia}</h4>
                    <Badge variant="secondary">{horariasDia.length} horários</Badge>
                  </div>

                  {horariasDia.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum horário configurado
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {horariasDia.map((horario) => (
                        <div
                          key={horario.id}
                          className={`relative p-2 rounded text-center text-sm border transition-all ${
                            horario.ativo
                              ? 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                              : 'bg-muted/50 border-muted opacity-60'
                          }`}
                        >
                          <div className="font-medium text-xs mb-1">
                            {horario.hora_inicio} - {horario.hora_fim}
                          </div>
                          <div className="text-xs font-semibold text-primary mb-2">
                            R$ {horario.valor_avulsa.toFixed(2)}
                          </div>
                          <div className="flex gap-1 justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleToggleAtivo(horario)}
                              title={horario.ativo ? "Desativar" : "Ativar"}
                              disabled={updateScheduleMutation.isPending}
                            >
                              <Clock className={`w-3 h-3 ${horario.ativo ? 'text-green-600' : 'text-muted-foreground'}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => openEditModal(horario)}
                              title="Editar"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleDeleteHorario(horario.id)}
                              title="Excluir"
                              disabled={deleteScheduleMutation.isPending}
                            >
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Criar/Editar Horário */}
      <Dialog open={isCreateModalOpen || !!editingHorario} onOpenChange={(open) => {
        if (!open) {
          setIsCreateModalOpen(false);
          setEditingHorario(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {editingHorario ? "Editar Horário" : "Novo Horário"} - {quadraNome}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="diaSemana">Dia da Semana *</Label>
              <select
                id="diaSemana"
                className="w-full px-3 py-2 border border-border rounded-lg"
                value={diaSemana}
                onChange={(e) => setDiaSemana(parseInt(e.target.value))}
              >
                {diasSemana.map((dia, index) => (
                  <option key={index} value={index}>{dia}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horaInicio">Hora Início *</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="horaFim">Hora Fim *</Label>
                <Input
                  id="horaFim"
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="preco">Preço (R$) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />
            </div>

            {editingHorario && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="ativo" className="cursor-pointer">Horário ativo</Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateModalOpen(false);
              setEditingHorario(null);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button
              onClick={editingHorario ? handleUpdateHorario : handleCreateHorario}
              disabled={createScheduleMutation.isPending || updateScheduleMutation.isPending}
            >
              {(createScheduleMutation.isPending || updateScheduleMutation.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                editingHorario ? "Salvar Alterações" : "Criar Horário"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
}

// Componente de Bloqueios
function BloqueiosTab({ quadraId, quadraNome }: { quadraId: string; quadraNome: string }) {
  const { confirm, ConfirmDialog } = useConfirm();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("22:00");
  const [motivo, setMotivo] = useState("");
  const [tipo, setTipo] = useState<"manutencao" | "evento" | "clima" | "outro">("manutencao");
  const [activeTab, setActiveTab] = useState<"ativos" | "historico">("ativos");

  // Hooks
  const { data: bloqueios, isLoading } = useCourtBlocks(quadraId);
  const createBlockMutation = useCreateCourtBlock();
  const deleteBlockMutation = useDeleteCourtBlock();

  const bloqueiosAtivos = bloqueios?.filter((b: any) => new Date(b.data_fim) >= new Date()) || [];
  const bloqueiosFinalizados = bloqueios?.filter((b: any) => new Date(b.data_fim) < new Date()) || [];

  const getTipoBadge = (tipo: string) => {
    const variants = {
      manutencao: "bg-warning/10 text-warning",
      evento: "bg-primary/10 text-primary",
      clima: "bg-destructive/10 text-destructive",
      outro: "bg-muted text-muted-foreground"
    };
    return <Badge className={variants[tipo as keyof typeof variants]}>{tipo}</Badge>;
  };

  const handleCreateBloqueio = async () => {
    if (!dataInicio || !dataFim || !motivo) return;

    await createBlockMutation.mutateAsync({
      quadra_id: quadraId,
      data_inicio: dataInicio,
      data_fim: dataFim,
      horario_inicio: horaInicio || undefined,
      horario_fim: horaFim || undefined,
      motivo,
    });

    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleDeleteBloqueio = async (id: string) => {
    const confirmed = await confirm({
      title: 'Remover Bloqueio',
      description: 'Tem certeza que deseja remover este bloqueio?',
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;
    await deleteBlockMutation.mutateAsync(id);
  };

  const resetForm = () => {
    setDataInicio("");
    setDataFim("");
    setHoraInicio("08:00");
    setHoraFim("22:00");
    setMotivo("");
    setTipo("manutencao");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const renderBloqueioCard = (bloqueio: any, isHistorico: boolean = false) => (
    <Card key={bloqueio.id} className="border border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getTipoBadge(bloqueio.tipo)}
              {isHistorico && (
                <Badge variant="outline" className="text-xs">Finalizado</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{bloqueio.motivo}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDate(bloqueio.data_inicio)}
                {bloqueio.data_inicio !== bloqueio.data_fim && ` - ${formatDate(bloqueio.data_fim)}`}
              </span>
              {bloqueio.hora_inicio && bloqueio.hora_fim && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {bloqueio.hora_inicio} - {bloqueio.hora_fim}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteBloqueio(bloqueio.id)}
              title="Excluir bloqueio"
              disabled={deleteBlockMutation.isPending}
            >
              {deleteBlockMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-destructive" />
              ) : (
                <Trash2 className="w-4 h-4 text-destructive" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="heading-4">Bloqueios de {quadraNome}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Bloqueio
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando bloqueios...</p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "ativos" | "historico")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="ativos" className="gap-2">
              <Ban className="w-4 h-4" />
              Ativos
              {bloqueiosAtivos.length > 0 && (
                <Badge variant="secondary" className="ml-1">{bloqueiosAtivos.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="historico" className="gap-2">
              <Clock className="w-4 h-4" />
              Histórico
              {bloqueiosFinalizados.length > 0 && (
                <Badge variant="secondary" className="ml-1">{bloqueiosFinalizados.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ativos" className="mt-6">
            {bloqueiosAtivos.length === 0 ? (
              <div className="text-center py-12">
                <Ban className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum bloqueio ativo para esta quadra</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bloqueiosAtivos.map((bloqueio) => renderBloqueioCard(bloqueio, false))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="historico" className="mt-6">
            {bloqueiosFinalizados.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum bloqueio finalizado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bloqueiosFinalizados.map((bloqueio) => renderBloqueioCard(bloqueio, true))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-destructive" />
              Criar Bloqueio - {quadraNome}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataInicio">Data Início *</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dataFim">Data Fim *</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horaInicio">Hora Início</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="horaFim">Hora Fim</Label>
                <Input
                  id="horaFim"
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Bloqueio *</Label>
              <select
                id="tipo"
                className="w-full px-3 py-2 border border-border rounded-lg"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
              >
                <option value="manutencao">Manutenção</option>
                <option value="evento">Evento</option>
                <option value="clima">Condições Climáticas</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <Label htmlFor="motivo">Motivo do Bloqueio *</Label>
              <Textarea
                id="motivo"
                placeholder="Descreva o motivo do bloqueio..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
              />
            </div>

            <div className="p-4 bg-warning/10 rounded-lg">
              <p className="text-sm text-warning font-medium mb-1">⚠️ Atenção</p>
              <p className="text-sm text-muted-foreground">
                Reservas existentes neste período serão automaticamente canceladas e os clientes serão notificados.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateBloqueio}
              className="bg-destructive hover:bg-destructive/90"
              disabled={createBlockMutation.isPending}
            >
              {createBlockMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Bloqueio"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
}
