'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Users, Clock } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

import { useCourts, useCreateCourt, useUpdateCourt, useDeleteCourt } from '@/hooks/core/useCourts';
import { FormCourt } from '@/components/modules/core/quadras/FormCourt';
import { COURT_TYPE_LABELS } from '@/types/courts.types';
import type { Court } from '@/types/courts.types';
import type { CourtFormData } from '@/lib/validations/court.schema';

export const dynamic = 'force-dynamic';

export default function QuadrasPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  const { data: courts, isLoading } = useCourts();
  const createCourt = useCreateCourt();
  const updateCourt = useUpdateCourt();
  const deleteCourt = useDeleteCourt();

  const handleCreate = async (data: CourtFormData) => {
    await createCourt.mutateAsync(data);
    setDialogOpen(false);
  };

  const handleUpdate = async (data: CourtFormData) => {
    if (!editingCourt) return;
    await updateCourt.mutateAsync({ id: editingCourt.id, data });
    setDialogOpen(false);
    setEditingCourt(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta quadra?')) return;
    await deleteCourt.mutateAsync(id);
  };

  const openCreateDialog = () => {
    setEditingCourt(null);
    setDialogOpen(true);
  };

  const openEditDialog = (court: Court) => {
    setEditingCourt(court);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingCourt(null);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Carregando quadras...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quadras</h1>
          <p className="text-gray-600 mt-1">Gerencie as quadras da arena</p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-[#2D9F5D] hover:bg-[#258c4f]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Quadra
        </Button>
      </div>

      {/* Lista de Quadras */}
      {!courts || courts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma quadra cadastrada
            </h3>
            <p className="text-gray-600 mb-6">
              Comece adicionando sua primeira quadra
            </p>
            <Button
              onClick={openCreateDialog}
              className="bg-[#2D9F5D] hover:bg-[#258c4f]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Quadra
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <Card key={court.id} className={!court.ativa ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{court.nome}</CardTitle>
                    <CardDescription className="mt-1">
                      {COURT_TYPE_LABELS[court.tipo]}
                    </CardDescription>
                  </div>
                  <Badge variant={court.ativa ? 'default' : 'secondary'}>
                    {court.ativa ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {court.descricao && (
                  <p className="text-sm text-gray-600 mb-4">{court.descricao}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{court.capacidade_maxima} pessoas</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/gestor/quadras/${court.id}/horarios`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full" size="sm">
                      <Clock className="mr-2 h-4 w-4" />
                      Horários
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(court)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(court.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCourt ? 'Editar Quadra' : 'Nova Quadra'}
            </DialogTitle>
          </DialogHeader>
          <FormCourt
            court={editingCourt || undefined}
            onSubmit={editingCourt ? handleUpdate : handleCreate}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
