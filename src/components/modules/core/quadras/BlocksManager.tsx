'use client';

import { useState } from 'react';
import { Plus, Trash2, Ban, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCourtBlocks, useCreateCourtBlock, useDeleteCourtBlock } from '@/hooks/core/useCourts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CourtBlock } from '@/types/courts.types';
import { useUser } from '@/hooks/auth/useUser';

interface BlocksManagerProps {
  courtId: string;
}

export function BlocksManager({ courtId }: BlocksManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    data_inicio: '',
    data_fim: '',
    hora_inicio: '',
    hora_fim: '',
    motivo: '',
  });

  const { data: user } = useUser();
  const { data: blocks, isLoading } = useCourtBlocks(courtId);
  const createBlock = useCreateCourtBlock();
  const deleteBlock = useDeleteCourtBlock();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBlock.mutateAsync({
      quadra_id: courtId,
      data_inicio: formData.data_inicio,
      data_fim: formData.data_fim,
      horario_inicio: formData.hora_inicio || undefined,
      horario_fim: formData.hora_fim || undefined,
      motivo: formData.motivo,
      created_by: user?.id,
    });
    setShowCreateDialog(false);
    setFormData({
      data_inicio: '',
      data_fim: '',
      hora_inicio: '',
      hora_fim: '',
      motivo: '',
    });
  };

  const handleDelete = async (block: CourtBlock) => {
    if (!confirm('Tem certeza que deseja remover este bloqueio?')) return;
    await deleteBlock.mutateAsync(block.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-3"></div>
          <p className="text-gray-500 text-sm">Carregando bloqueios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bloqueios de Horários</h3>
          <p className="text-sm text-gray-500 mt-1">
            Bloqueie períodos em que a quadra não estará disponível
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-primary hover:bg-primary/90 rounded-lg h-10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Bloqueio
        </Button>
      </div>

      {!blocks || blocks.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-5">
            <Ban className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum bloqueio configurado
          </h4>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Crie bloqueios para manutenção ou eventos especiais
          </p>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-primary hover:bg-primary/90 rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Bloqueio
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks
            .sort((a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime())
            .map((block) => {
              const isActive =
                new Date(block.data_fim) >= new Date() &&
                new Date(block.data_inicio) <= new Date();
              const isFuture = new Date(block.data_inicio) > new Date();
              const isPast = new Date(block.data_fim) < new Date();

              return (
                <div
                  key={block.id}
                  className={`bg-white rounded-xl shadow-sm p-5 transition-all hover:shadow-md ${
                    isPast ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            isActive
                              ? 'bg-yellow-50 text-yellow-700'
                              : isFuture
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {isActive ? 'Ativo Agora' : isFuture ? 'Futuro' : 'Passado'}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Período</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {format(new Date(block.data_inicio), 'dd/MM/yyyy', { locale: ptBR })}
                              {' → '}
                              {format(new Date(block.data_fim), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                        {block.hora_inicio && block.hora_fim && (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Clock className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Horário</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {block.hora_inicio} - {block.hora_fim}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Ban className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Motivo</p>
                            <p className="text-sm text-gray-900">{block.motivo}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(block)}
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Dialog Criar Bloqueio */}
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
              <h2 className="text-xl font-bold text-gray-900 mb-6">Novo Bloqueio</h2>
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_inicio" className="text-sm font-medium text-gray-700">
                      Data Início *
                    </Label>
                    <Input
                      id="data_inicio"
                      type="date"
                      value={formData.data_inicio}
                      onChange={(e) =>
                        setFormData({ ...formData, data_inicio: e.target.value })
                      }
                      className="mt-1.5 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="data_fim" className="text-sm font-medium text-gray-700">
                      Data Fim *
                    </Label>
                    <Input
                      id="data_fim"
                      type="date"
                      value={formData.data_fim}
                      onChange={(e) =>
                        setFormData({ ...formData, data_fim: e.target.value })
                      }
                      className="mt-1.5 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hora_inicio" className="text-sm font-medium text-gray-700">
                      Hora Início (opcional)
                    </Label>
                    <Input
                      id="hora_inicio"
                      type="time"
                      value={formData.hora_inicio}
                      onChange={(e) =>
                        setFormData({ ...formData, hora_inicio: e.target.value })
                      }
                      className="mt-1.5 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hora_fim" className="text-sm font-medium text-gray-700">
                      Hora Fim (opcional)
                    </Label>
                    <Input
                      id="hora_fim"
                      type="time"
                      value={formData.hora_fim}
                      onChange={(e) =>
                        setFormData({ ...formData, hora_fim: e.target.value })
                      }
                      className="mt-1.5 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="motivo" className="text-sm font-medium text-gray-700">
                    Motivo do Bloqueio *
                  </Label>
                  <Textarea
                    id="motivo"
                    value={formData.motivo}
                    onChange={(e) =>
                      setFormData({ ...formData, motivo: e.target.value })
                    }
                    placeholder="Ex: Manutenção da grama sintética"
                    rows={3}
                    className="mt-1.5 rounded-lg"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    className="flex-1 rounded-lg h-11"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createBlock.isPending}
                    className="flex-1 bg-primary hover:bg-primary/90 rounded-lg h-11"
                  >
                    {createBlock.isPending ? 'Criando...' : 'Criar Bloqueio'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
