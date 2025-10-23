"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Users, Trophy } from "lucide-react";
import { ResponsiveCard, ResponsiveGrid, ResponsiveList } from "@/components/shared/layout/ResponsiveCard";
import { MobileModal, useMobileModal } from "@/components/shared/layout/MobileModal";
import { 
  ResponsiveForm, 
  ResponsiveInput, 
  ResponsiveTextarea,
  ResponsiveSelect,
  ResponsiveButton,
  ResponsiveButtonGroup 
} from "@/components/shared/forms/ResponsiveForm";
import { SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Item {
  id: string;
  title: string;
  description: string;
  type: 'reserva' | 'turma' | 'jogo';
  date: string;
  status: 'ativo' | 'pendente' | 'concluido';
}

export default function ExemploResponsivoPage() {
  const [items, setItems] = useState<Item[]>([
    {
      id: '1',
      title: 'Reserva Quadra A',
      description: 'Jogo de futebol com os amigos',
      type: 'reserva',
      date: '2024-10-25',
      status: 'ativo'
    },
    {
      id: '2',
      title: 'Turma de Vôlei',
      description: 'Aula semanal de vôlei para iniciantes',
      type: 'turma',
      date: '2024-10-26',
      status: 'pendente'
    },
    {
      id: '3',
      title: 'Campeonato de Tênis',
      description: 'Participação no torneio mensal',
      type: 'jogo',
      date: '2024-10-27',
      status: 'concluido'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'reserva' as const,
    date: '',
    status: 'ativo' as const
  });

  const { isOpen, open, close } = useMobileModal();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setItems(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      const newItem: Item = {
        id: Date.now().toString(),
        ...formData
      };
      setItems(prev => [...prev, newItem]);
    }
    
    resetForm();
    close();
  };

  const handleEdit = (item: Item) => {
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
      date: item.date,
      status: item.status
    });
    setEditingId(item.id);
    open();
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'reserva',
      date: '',
      status: 'ativo'
    });
    setEditingId(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reserva': return Calendar;
      case 'turma': return Users;
      case 'jogo': return Trophy;
      default: return Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mobile-padding py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="mobile-heading">Exemplo Responsivo</h1>
          <p className="mobile-body text-muted-foreground">
            Demonstração dos componentes responsivos do sistema
          </p>
        </div>
        
        <ResponsiveButton 
          onClick={() => {
            resetForm();
            open();
          }}
          className="md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </ResponsiveButton>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid columns={{ mobile: 1, tablet: 3, desktop: 3 }} gap="md">
        <ResponsiveCard variant="elevated" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {items.filter(item => item.type === 'reserva').length}
              </p>
              <p className="mobile-body text-muted-foreground">Reservas</p>
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard variant="elevated" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {items.filter(item => item.type === 'turma').length}
              </p>
              <p className="mobile-body text-muted-foreground">Turmas</p>
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard variant="elevated" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {items.filter(item => item.type === 'jogo').length}
              </p>
              <p className="mobile-body text-muted-foreground">Jogos</p>
            </div>
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Items List */}
      <ResponsiveCard>
        <div className="space-y-4">
          <h2 className="mobile-subheading">Meus Itens</h2>
          
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="mobile-body text-muted-foreground">
                Nenhum item encontrado. Clique em "Novo Item" para começar.
              </p>
            </div>
          ) : (
            <ResponsiveList spacing="md">
              {items.map((item) => {
                const Icon = getTypeIcon(item.type);
                
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{item.title}</h3>
                          <p className="mobile-body text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 flex-shrink-0">
                          <ResponsiveButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="w-4 h-4" />
                            <span className="hidden md:inline ml-2">Editar</span>
                          </ResponsiveButton>
                          
                          <ResponsiveButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden md:inline ml-2">Excluir</span>
                          </ResponsiveButton>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ResponsiveList>
          )}
        </div>
      </ResponsiveCard>

      {/* Modal */}
      <MobileModal
        isOpen={isOpen}
        onClose={close}
        title={editingId ? 'Editar Item' : 'Novo Item'}
        showBackButton={true}
      >
        <div className="p-4">
          <ResponsiveForm onSubmit={handleSubmit}>
            <ResponsiveInput
              label="Título"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título"
              required
            />

            <ResponsiveTextarea
              label="Descrição"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Digite a descrição"
              rows={3}
            />

            <ResponsiveSelect
              label="Tipo"
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              required
            >
              <SelectItem value="reserva">Reserva</SelectItem>
              <SelectItem value="turma">Turma</SelectItem>
              <SelectItem value="jogo">Jogo</SelectItem>
            </ResponsiveSelect>

            <ResponsiveInput
              label="Data"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />

            <ResponsiveSelect
              label="Status"
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              required
            >
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
            </ResponsiveSelect>

            <ResponsiveButtonGroup>
              <ResponsiveButton
                type="button"
                variant="outline"
                onClick={close}
              >
                Cancelar
              </ResponsiveButton>
              
              <ResponsiveButton type="submit">
                {editingId ? 'Atualizar' : 'Criar'}
              </ResponsiveButton>
            </ResponsiveButtonGroup>
          </ResponsiveForm>
        </div>
      </MobileModal>
    </div>
  );
}