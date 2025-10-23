"use client";

import { useState } from "react";
import { Plus, MapPin, Edit2, Trash2, Users, Clock, Ban, Calendar, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function QuadrasPage() {
  const { toast } = useToast();
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourt, setEditingCourt] = useState<any>(null);
  const [isEditingCapacity, setIsEditingCapacity] = useState(false);
  const [newCapacity, setNewCapacity] = useState("");

  // Simulação de dados
  const courts = [
    {
      id: 1,
      nome: "Quadra Society 1",
      tipo: "society",
      capacidade_maxima: 14,
      status: "ativa",
      descricao: "Quadra de futebol society com grama sintética de alta qualidade"
    },
    {
      id: 2,
      nome: "Quadra Futsal",
      tipo: "futsal",
      capacidade_maxima: 10,
      status: "ativa",
      descricao: "Quadra de futsal coberta com piso oficial"
    },
    {
      id: 3,
      nome: "Quadra Society 2",
      tipo: "society",
      capacidade_maxima: 14,
      status: "manutencao",
      descricao: "Quadra em manutenção - troca da grama sintética"
    }
  ];

  const courtTypes: Record<string, string> = {
    society: "Futebol Society",
    futsal: "Futsal",
    beach_tennis: "Beach Tennis",
    volei: "Vôlei de Praia"
  };

  const handleDeleteCourt = (court: any) => {
    if (!confirm(`Tem certeza que deseja excluir a quadra "${court.nome}"?`)) return;
    // Simula exclusão
    toast({ title: "Sucesso", description: "Quadra excluída com sucesso" });
  };

  const handleUpdateCapacity = () => {
    if (!newCapacity || parseInt(newCapacity) <= 0) {
      toast({ title: "Erro", description: "Informe uma capacidade válida", variant: "destructive" });
      return;
    }
    
    // Atualiza a capacidade (em produção, faria uma chamada à API)
    if (selectedCourt) {
      selectedCourt.capacidade_maxima = parseInt(newCapacity);
      toast({ title: "Sucesso", description: "Capacidade atualizada com sucesso" });
      setIsEditingCapacity(false);
      setNewCapacity("");
    }
  };

  // Auto-select first court
  if (!selectedCourt && courts.length > 0) {
    setSelectedCourt(courts[0]);
  }

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
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          Nova Quadra
        </Button>
      </div>

      {!courts || courts.length === 0 ? (
        <Card className="border-0 shadow-soft">
          <CardContent className="p-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="heading-3 mb-3">Nenhuma quadra cadastrada</CardTitle>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Comece criando sua primeira quadra para gerenciar horários e bloqueios
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
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
                      onClick={() => setEditingCourt(selectedCourt)}
                      variant="ghost"
                      size="sm"
                      className="text-primary-foreground hover:bg-primary-foreground/20 h-9 w-9 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteCourt(selectedCourt)}
                      variant="ghost"
                      size="sm"
                      className="text-primary-foreground hover:bg-destructive/20 h-9 w-9 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
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
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-sm text-muted-foreground">Capacidade</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  setIsEditingCapacity(true);
                                  setNewCapacity(selectedCourt.capacidade_maxima.toString());
                                }}
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                            </div>
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
                        <Button onClick={() => setEditingCourt(selectedCourt)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Editar Informações
                        </Button>
                        <Button
                          onClick={() => handleDeleteCourt(selectedCourt)}
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
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
    </div>
  );
}

// Componente de Horários
function HorariosTab({ quadraId, quadraNome }: { quadraId: number; quadraNome: string }) {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState<any>(null);
  
  // Form states
  const [diaSemana, setDiaSemana] = useState<number>(1);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("09:00");
  const [preco, setPreco] = useState("");
  const [ativo, setAtivo] = useState(true);

  interface Horario {
    id: string;
    quadraId: number;
    diaSemana: number; // 0=Domingo, 1=Segunda, etc
    horaInicio: string;
    horaFim: string;
    preco: number;
    ativo: boolean;
  }

  const [horarios, setHorarios] = useState<Horario[]>([
    // Horários mockados iniciais
    { id: "H001", quadraId: 1, diaSemana: 1, horaInicio: "19:00", horaFim: "20:00", preco: 80, ativo: true },
    { id: "H002", quadraId: 1, diaSemana: 1, horaInicio: "20:00", horaFim: "21:00", preco: 80, ativo: true },
    { id: "H003", quadraId: 1, diaSemana: 6, horaInicio: "08:00", horaFim: "09:00", preco: 60, ativo: true },
  ]);

  const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const horariosQuadra = horarios.filter(h => h.quadraId === quadraId);

  const handleCreateHorario = () => {
    if (!preco || parseFloat(preco) <= 0) {
      toast({ title: "Erro", description: "Informe um preço válido", variant: "destructive" });
      return;
    }

    const novoHorario: Horario = {
      id: `H${String(horarios.length + 1).padStart(3, '0')}`,
      quadraId,
      diaSemana,
      horaInicio,
      horaFim,
      preco: parseFloat(preco),
      ativo: true
    };

    setHorarios([...horarios, novoHorario]);
    toast({ title: "Sucesso", description: "Horário criado com sucesso" });
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleUpdateHorario = () => {
    if (!editingHorario) return;
    
    if (!preco || parseFloat(preco) <= 0) {
      toast({ title: "Erro", description: "Informe um preço válido", variant: "destructive" });
      return;
    }

    setHorarios(horarios.map(h => 
      h.id === editingHorario.id 
        ? { ...h, diaSemana, horaInicio, horaFim, preco: parseFloat(preco), ativo }
        : h
    ));
    
    toast({ title: "Sucesso", description: "Horário atualizado com sucesso" });
    setEditingHorario(null);
    resetForm();
  };

  const handleDeleteHorario = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este horário?")) return;
    setHorarios(horarios.filter(h => h.id !== id));
    toast({ title: "Sucesso", description: "Horário excluído" });
  };

  const handleToggleAtivo = (id: string) => {
    setHorarios(horarios.map(h => 
      h.id === id ? { ...h, ativo: !h.ativo } : h
    ));
    toast({ title: "Sucesso", description: "Status atualizado" });
  };

  const openEditModal = (horario: Horario) => {
    setEditingHorario(horario);
    setDiaSemana(horario.diaSemana);
    setHoraInicio(horario.horaInicio);
    setHoraFim(horario.horaFim);
    setPreco(horario.preco.toString());
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
      .filter(h => h.diaSemana === dia)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="heading-4">Grade de Horários</h3>
        <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Horário
        </Button>
      </div>

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
                          {horario.horaInicio} - {horario.horaFim}
                        </div>
                        <div className="text-xs font-semibold text-primary mb-2">
                          R$ {horario.preco.toFixed(2)}
                        </div>
                        <div className="flex gap-1 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleToggleAtivo(horario.id)}
                            title={horario.ativo ? "Desativar" : "Ativar"}
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
            <Button onClick={editingHorario ? handleUpdateHorario : handleCreateHorario}>
              {editingHorario ? "Salvar Alterações" : "Criar Horário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente de Bloqueios
function BloqueiosTab({ quadraId, quadraNome }: { quadraId: number; quadraNome: string }) {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("22:00");
  const [motivo, setMotivo] = useState("");
  const [tipo, setTipo] = useState<"manutencao" | "evento" | "clima" | "outro">("manutencao");

  interface Bloqueio {
    id: string;
    dataInicio: string;
    dataFim: string;
    horaInicio: string;
    horaFim: string;
    motivo: string;
    tipo: "manutencao" | "evento" | "clima" | "outro";
    status: "ativo" | "finalizado";
    criadoEm: string;
  }

  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [activeTab, setActiveTab] = useState<"ativos" | "historico">("ativos");

  const bloqueiosAtivos = bloqueios.filter(b => b.status === "ativo");
  const bloqueiosFinalizados = bloqueios.filter(b => b.status === "finalizado");

  const getTipoBadge = (tipo: string) => {
    const variants = {
      manutencao: "bg-warning/10 text-warning",
      evento: "bg-primary/10 text-primary",
      clima: "bg-destructive/10 text-destructive",
      outro: "bg-muted text-muted-foreground"
    };
    return <Badge className={variants[tipo as keyof typeof variants]}>{tipo}</Badge>;
  };

  const handleCreateBloqueio = () => {
    if (!dataInicio || !dataFim || !motivo) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    const novoBloqueio: Bloqueio = {
      id: `B${String(bloqueios.length + 1).padStart(3, '0')}`,
      dataInicio,
      dataFim,
      horaInicio,
      horaFim,
      motivo,
      tipo,
      status: "ativo",
      criadoEm: new Date().toISOString().split('T')[0]
    };

    setBloqueios([novoBloqueio, ...bloqueios]);
    toast({ title: "Sucesso", description: "Bloqueio criado com sucesso" });
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleDeleteBloqueio = (id: string) => {
    setBloqueios(bloqueios.filter(b => b.id !== id));
    toast({ title: "Sucesso", description: "Bloqueio removido" });
  };

  const handleFinalizarBloqueio = (id: string) => {
    setBloqueios(bloqueios.map(b =>
      b.id === id ? { ...b, status: "finalizado" as const } : b
    ));
    toast({ title: "Sucesso", description: "Bloqueio finalizado" });
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

  const renderBloqueioCard = (bloqueio: Bloqueio, isHistorico: boolean = false) => (
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
                {formatDate(bloqueio.dataInicio)}
                {bloqueio.dataInicio !== bloqueio.dataFim && ` - ${formatDate(bloqueio.dataFim)}`}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {bloqueio.horaInicio} - {bloqueio.horaFim}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {!isHistorico && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFinalizarBloqueio(bloqueio.id)}
                title="Finalizar bloqueio"
              >
                <Clock className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteBloqueio(bloqueio.id)}
              title="Excluir bloqueio"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
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
        <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Bloqueio
        </Button>
      </div>

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
            <Button onClick={handleCreateBloqueio} className="bg-destructive hover:bg-destructive/90">
              Criar Bloqueio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
