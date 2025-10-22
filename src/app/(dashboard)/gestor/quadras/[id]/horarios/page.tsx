'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, ArrowLeft, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

import { useCourt, useSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '@/hooks/core/useCourts';
import { FormSchedule } from '@/components/modules/core/quadras/FormSchedule';
import { COURT_TYPE_LABELS, DIAS_SEMANA } from '@/types/courts.types';
import type { Schedule } from '@/types/courts.types';
import type { ScheduleFormData } from '@/lib/validations/court.schema';

export default function HorariosPage() {
  const params = useParams();
  const router = useRouter();
  const courtId = params.id as string;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { data: court, isLoading: courtLoading } = useCourt(courtId);
  const { data: schedules, isLoading: schedulesLoading } = useSchedules(courtId);
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const handleCreate = async (data: ScheduleFormData) => {
    await createSchedule.mutateAsync(data);
    setDialogOpen(false);
    setSelectedDay(null);
  };

  const handleUpdate = async (data: ScheduleFormData) => {
    if (!editingSchedule) return;
    await updateSchedule.mutateAsync({ id: editingSchedule.id, data });
    setDialogOpen(false);
    setEditingSchedule(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este horário?')) return;
    await deleteSchedule.mutateAsync(id);
  };

  const openCreateDialog = (diaSemana?: number) => {
    setEditingSchedule(null);
    setSelectedDay(diaSemana ?? null);
    setDialogOpen(true);
  };

  const openEditDialog = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setSelectedDay(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingSchedule(null);
    setSelectedDay(null);
  };

  // Agrupar horários por dia da semana
  const schedulesByDay = DIAS_SEMANA.map((dia) => ({
    ...dia,
    schedules: schedules?.filter((s) => s.dia_semana === dia.value) || [],
  }));

  if (courtLoading || schedulesLoading) {
    return (
      <div className="p-8">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="p-8">
        <p>Quadra não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/gestor/quadras')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Quadras
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{court.nome}</h1>
            <p className="text-gray-600 mt-1">{COURT_TYPE_LABELS[court.tipo]}</p>
            <Badge variant={court.ativa ? 'default' : 'secondary'} className="mt-2">
              {court.ativa ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>
          <Button
            onClick={() => openCreateDialog()}
            className="bg-[#2D9F5D] hover:bg-[#258c4f]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Horário
          </Button>
        </div>
      </div>

      {/* Grade de Horários por Dia da Semana */}
      <div className="space-y-6">
        {schedulesByDay.map((dia) => (
          <Card key={dia.value}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {dia.label}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {dia.schedules.length} horário(s) configurado(s)
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openCreateDialog(dia.value)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dia.schedules.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum horário configurado para este dia
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Horário</th>
                        <th className="text-left py-2 px-3">Valor Avulsa</th>
                        <th className="text-left py-2 px-3">Valor Mensalista</th>
                        <th className="text-center py-2 px-3">Status</th>
                        <th className="text-right py-2 px-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dia.schedules
                        .sort((a, b) => a.horario_inicio.localeCompare(b.horario_inicio))
                        .map((schedule) => (
                          <tr
                            key={schedule.id}
                            className={`border-b hover:bg-gray-50 ${
                              !schedule.ativa ? 'opacity-50' : ''
                            }`}
                          >
                            <td className="py-3 px-3 font-medium">
                              {schedule.horario_inicio} - {schedule.horario_fim}
                            </td>
                            <td className="py-3 px-3">
                              R$ {schedule.valor_avulsa.toFixed(2)}
                            </td>
                            <td className="py-3 px-3">
                              R$ {schedule.valor_mensalista.toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <Badge
                                variant={schedule.ativa ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {schedule.ativa ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(schedule)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(schedule.id)}
                                >
                                  <Trash2 className="h-3 w-3 text-red-600" />
                                </Button>
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
        ))}
      </div>

      {/* Dialog Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? 'Editar Horário' : 'Novo Horário'}
            </DialogTitle>
          </DialogHeader>
          <FormSchedule
            courtId={courtId}
            schedule={editingSchedule || undefined}
            onSubmit={editingSchedule ? handleUpdate : handleCreate}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
