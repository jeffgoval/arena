"use client";

import { useState } from "react";
import { Plus, MapPin, Edit2, Trash2, Users, Clock, Ban, Calendar, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function QuadrasPage() {
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

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
    alert("Quadra excluída com sucesso!");
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
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedCourt?.id === court.id
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
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="heading-4">Grade de Horários</h3>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Novo Horário
                        </Button>
                      </div>
                      
                      <div className="grid gap-4">
                        {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((day, index) => (
                          <Card key={day} className="border border-border">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold">{day}</h4>
                                <Button variant="ghost" size="sm">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {index < 5 ? ( // Dias úteis
                                  <>
                                    <div className="p-2 bg-muted rounded text-center text-sm">
                                      <div className="font-medium">19:00-20:00</div>
                                      <div className="text-xs text-muted-foreground">R$ 80</div>
                                    </div>
                                    <div className="p-2 bg-muted rounded text-center text-sm">
                                      <div className="font-medium">20:00-21:00</div>
                                      <div className="text-xs text-muted-foreground">R$ 80</div>
                                    </div>
                                    <div className="p-2 bg-muted rounded text-center text-sm">
                                      <div className="font-medium">21:00-22:00</div>
                                      <div className="text-xs text-muted-foreground">R$ 80</div>
                                    </div>
                                  </>
                                ) : ( // Fins de semana
                                  <>
                                    <div className="p-2 bg-muted rounded text-center text-sm">
                                      <div className="font-medium">08:00-09:00</div>
                                      <div className="text-xs text-muted-foreground">R$ 60</div>
                                    </div>
                                    <div className="p-2 bg-muted rounded text-center text-sm">
                                      <div className="font-medium">09:00-10:00</div>
                                      <div className="text-xs text-muted-foreground">R$ 60</div>
                                    </div>
                                    <div className="p-2 bg-muted rounded text-center text-sm">
                                      <div className="font-medium">10:00-11:00</div>
                                      <div className="text-xs text-muted-foreground">R$ 60</div>
                                    </div>
                                    <div className="p-2 bg-muted rounded text-center text-sm">
                                      <div className="font-medium">14:00-15:00</div>
                                      <div className="text-xs text-muted-foreground">R$ 70</div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="blocks" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="heading-4">Bloqueios Ativos</h3>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Novo Bloqueio
                        </Button>
                      </div>
                      
                      <div className="text-center py-12">
                        <Ban className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhum bloqueio ativo</p>
                      </div>
                    </div>
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