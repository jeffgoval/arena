'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, DollarSign } from 'lucide-react';
import { useSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '@/hooks/core/useCourts';
import { Button } from '@/components/ui/button';
import { DIAS_SEMANA } from '@/types/courts.types';
import type { Schedule } from '@/types/courts.types';
import { FormSchedule } from './FormSchedule';

interface SchedulesManagerProps {
  courtId: string;
}

export function SchedulesManager({ courtId }: SchedulesManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const { data: schedules, isLoading } = useSchedules(courtId);
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const handleCreate = async (data: any) => {
    await createSchedule.mutateAsync({ ...data, quadra_id: courtId });
    setShowCreateDialog(false);
  };

  const handleUpdate = async (data: any) => {
    if (!editingSchedule) return;
    await updateSchedule.mutateAsync({ id: editingSchedule.id, data });
    setEditingSchedule(null);
  };

  const handleDelete = async (schedule: Schedule) => {
    if (!confirm('Tem certeza que deseja excluir este horário?')) return;
    await deleteSchedule.mutateAsync(schedule.id);
  };

  // Group schedules by day
  const schedulesByDay = schedules?.reduce((acc, schedule) => {
    if (!acc[schedule.dia_semana]) {
      acc[schedule.dia_semana] = [];
    }
    acc[schedule.dia_semana].push(schedule);
    return acc;
  }, {} as Record<number, Schedule[]>) || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-3"></div>
          <p className="text-gray-500 text-sm">Carregando horários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Horários da Quadra</h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure os horários disponíveis e valores
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-primary hover:bg-primary/90 rounded-lg h-10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Horário
        </Button>
      </div>

      {!schedules || schedules.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-5">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum horário configurado
          </h4>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Adicione horários para que a quadra possa ser reservada
          </p>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-primary hover:bg-primary/90 rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Horário
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {DIAS_SEMANA.map((dia) => {
            const daySchedules = schedulesByDay[dia.value] || [];
            if (daySchedules.length === 0) return null;

            return (
              <div key={dia.value}>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  {dia.label}
                </h4>
                <div className="space-y-3">
                  {daySchedules
                    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
                    .map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`bg-white rounded-xl shadow-sm p-5 transition-all hover:shadow-md ${
                          !schedule.ativo ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                                <Clock className="h-5 w-5 text-primary" />
                                {schedule.hora_inicio} - {schedule.hora_fim}
                              </div>
                              {!schedule.ativo && (
                                <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-lg">
                                  Inativo
                                </span>
                              )}
                            </div>
                            <div className="flex gap-8">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Avulsa</p>
                                  <p className="font-semibold text-gray-900">
                                    R$ {schedule.valor_avulsa.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                  <DollarSign className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Mensalista</p>
                                  <p className="font-semibold text-gray-900">
                                    R$ {schedule.valor_mensalista.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setEditingSchedule(schedule)}
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 hover:bg-gray-100"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(schedule)}
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog Criar Horário */}
      {showCreateDialog && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateDialog(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Novo Horário</h2>
              <FormSchedule
                courtId={courtId}
                onSubmit={handleCreate}
                onCancel={() => setShowCreateDialog(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Dialog Editar Horário */}
      {editingSchedule && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setEditingSchedule(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Editar Horário</h2>
              <FormSchedule
                courtId={courtId}
                schedule={editingSchedule}
                onSubmit={handleUpdate}
                onCancel={() => setEditingSchedule(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
