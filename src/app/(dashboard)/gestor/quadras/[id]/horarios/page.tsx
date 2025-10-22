'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModalSimples } from '@/components/ui/modal-simples';

import { useCourt, useSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '@/hooks/core/useCourts';
import { FormSchedule } from '@/components/modules/core/quadras/FormSchedule';
import { COURT_TYPE_LABELS, DIAS_SEMANA } from '@/types/courts.types';
import type { Schedule } from '@/types/courts.types';
import type { ScheduleFormData } from '@/lib/validations/court.schema';

export const dynamic = 'force-dynamic';

export default function HorariosPage() {
  const params = useParams();
  const router = useRouter();
  const courtId = params.id as string;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { data: court, isLoading: courtLoading } = useCourt(courtId);
  const { data: schedules, isLoading: schedulesLoading } = useSchedules(courtId);
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const handleCreate = async (data: ScheduleFormData) => {
    await createSchedule.mutateAsync(data);
    setModalOpen(false);
    setSelectedDay(null);
  };

  const handleUpdate = async (data: ScheduleFormData) => {
    if (!editingSchedule) return;
    await updateSchedule.mutateAsync({ id: editingSchedule.id, data });
    setModalOpen(false);
    setEditingSchedule(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este horário?')) return;
    await deleteSchedule.mutateAsync(id);
  };

  const openCreateModal = (diaSemana?: number) => {
    console.log('🚀 openCreateModal chamado:', { diaSemana, modalOpen });
    setEditingSchedule(null);
    setSelectedDay(diaSemana ?? null);
    setModalOpen(true);
    console.log('✅ setModalOpen(true) executado');
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setSelectedDay(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSchedule(null);
    setSelectedDay(null);
  };

  // Agrupar horários por dia da semana
  const schedulesByDay = DIAS_SEMANA.map((dia) => ({
    ...dia,
    schedules: schedules?.filter((s) => s.dia_semana === dia.value) || [],
  }));

  // Loading State
  if (courtLoading || schedulesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray/30 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-dark/60 font-medium">Carregando horários...</p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!court) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray/30 to-white flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-dark mb-2">Quadra não encontrada</h2>
            <p className="text-dark/60 mb-6">
              A quadra que você está procurando não existe ou foi removida.
            </p>
            <Button onClick={() => router.push('/gestor/quadras')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Quadras
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalSchedules = schedules?.length || 0;
  const activeSchedules = schedules?.filter(s => s.ativo).length || 0;

  console.log('📊 Estado atual:', { modalOpen, editingSchedule, selectedDay });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray/30 to-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header com Info da Quadra */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/gestor/quadras')}
            className="mb-6 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Quadras
          </Button>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-primary/20 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Info da Quadra */}
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-dark mb-2">{court.nome}</h1>
                    <p className="text-dark/60 font-medium mb-3">{COURT_TYPE_LABELS[court.tipo]}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={court.status === 'ativa' ? 'default' : 'secondary'}
                        className={`${
                          court.status === 'ativa'
                            ? 'bg-green-500 hover:bg-green-600'
                            : court.status === 'manutencao'
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-gray-500 hover:bg-gray-600'
                        } text-white`}
                      >
                        {court.status === 'ativa' ? 'Ativa' : court.status === 'manutencao' ? 'Manutenção' : 'Inativa'}
                      </Badge>
                      <Badge variant="outline" className="border-primary text-primary">
                        {totalSchedules} horário{totalSchedules !== 1 ? 's' : ''}
                      </Badge>
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        {activeSchedules} ativo{activeSchedules !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão Novo Horário */}
              <Button
                onClick={() => openCreateModal()}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="mr-2 h-5 w-5" />
                Novo Horário
              </Button>
            </div>
          </div>
        </div>

        {/* Grade de Horários por Dia da Semana */}
        <div className="space-y-6">
          {schedulesByDay.map((dia) => (
            <Card
              key={dia.value}
              className="border-2 border-dark/10 shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b-2 border-dark/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-dark text-xl">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      {dia.label}
                    </CardTitle>
                    <CardDescription className="mt-2 text-dark/60 font-medium">
                      {dia.schedules.length === 0
                        ? 'Nenhum horário configurado'
                        : `${dia.schedules.length} horário${dia.schedules.length !== 1 ? 's' : ''} configurado${dia.schedules.length !== 1 ? 's' : ''}`
                      }
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => openCreateModal(dia.value)}
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Horário
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {dia.schedules.length === 0 ? (
                  // Empty State
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-10 h-10 text-dark/30" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark mb-2">
                      Nenhum horário configurado
                    </h3>
                    <p className="text-dark/60 mb-6">
                      Configure os horários disponíveis para {dia.label.toLowerCase()}
                    </p>
                    <Button
                      onClick={() => openCreateModal(dia.value)}
                      variant="outline"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Primeiro Horário
                    </Button>
                  </div>
                ) : (
                  // Lista de Horários
                  <div className="grid gap-4">
                    {dia.schedules
                      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
                      .map((schedule) => (
                        <div
                          key={schedule.id}
                          className={`group relative bg-white border-2 rounded-xl p-4 transition-all hover:shadow-md ${
                            schedule.ativo
                              ? 'border-primary/30 hover:border-primary'
                              : 'border-dark/10 opacity-60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Horário */}
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                schedule.ativo ? 'bg-primary/10' : 'bg-gray'
                              }`}>
                                <Clock className={`w-6 h-6 ${
                                  schedule.ativo ? 'text-primary' : 'text-dark/30'
                                }`} />
                              </div>
                              <div>
                                <p className="text-lg font-bold text-dark">
                                  {schedule.hora_inicio} - {schedule.hora_fim}
                                </p>
                                <p className="text-sm text-dark/60">
                                  {schedule.ativo ? 'Disponível para reservas' : 'Horário desativado'}
                                </p>
                              </div>
                            </div>

                            {/* Valores */}
                            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <div>
                                  <p className="text-xs text-green-600 font-medium">Avulsa</p>
                                  <p className="text-sm font-bold text-green-700">
                                    R$ {schedule.valor_avulsa.toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                                <DollarSign className="w-4 h-4 text-blue-600" />
                                <div>
                                  <p className="text-xs text-blue-600 font-medium">Mensalista</p>
                                  <p className="text-sm font-bold text-blue-700">
                                    R$ {schedule.valor_mensalista.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                              {schedule.ativo ? (
                                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Ativo
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-gray-500 text-white">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Inativo
                                </Badge>
                              )}
                            </div>

                            {/* Ações */}
                            <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(schedule)}
                                className="border-2 border-primary/30 hover:border-primary hover:bg-primary/10"
                              >
                                <Edit className="h-4 w-4 text-primary" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(schedule.id)}
                                className="border-2 border-red-300 hover:border-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State Global */}
        {totalSchedules === 0 && (
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5 mt-8">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-dark mb-3">
                Configure os horários da quadra
              </h2>
              <p className="text-dark/60 max-w-md mx-auto mb-8">
                Adicione os horários disponíveis para reserva em cada dia da semana.
                Você pode definir valores diferentes para clientes avulsos e mensalistas.
              </p>
              <Button
                onClick={() => openCreateModal()}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Configurar Primeiro Horário
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* MODAL SIMPLES QUE FUNCIONA */}
      <ModalSimples
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingSchedule ? 'Editar Horário' : 'Novo Horário'}
      >
        <FormSchedule
          courtId={courtId}
          schedule={editingSchedule || undefined}
          onSubmit={editingSchedule ? handleUpdate : handleCreate}
          onCancel={closeModal}
          defaultDiaSemana={selectedDay || undefined}
        />
      </ModalSimples>
    </div>
  );
}
