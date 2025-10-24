'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useConfirm } from '@/hooks/useConfirm';
import { useQuadras } from '@/hooks/core/useQuadrasHorarios';
import {
  useAllCourtBlocks,
  useCreateCourtBlock,
  useUpdateCourtBlock,
  useDeleteCourtBlock,
} from '@/hooks/core/useCourts';
import type { CourtBlock } from '@/types/courts.types';
import {
  Ban,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BloqueiosPage() {
  const { handleError, handleSuccess } = useErrorHandler();
  const { confirm, ConfirmDialog } = useConfirm();

  // Hooks
  const { data: bloqueios, isLoading: isLoadingBloqueios } = useAllCourtBlocks();
  const { data: quadras, isLoading: isLoadingQuadras } = useQuadras();
  const createBloqueioMutation = useCreateCourtBlock();
  const updateBloqueioMutation = useUpdateCourtBlock();
  const deleteBloqueioMutation = useDeleteCourtBlock();

  // Modal e filtros
  const [modalAberto, setModalAberto] = useState(false);
  const [bloqueioEditando, setBloqueioEditando] = useState<CourtBlock | null>(null);
  const [filtroQuadra, setFiltroQuadra] = useState<string>('todas');

  // Formulário
  const [quadraId, setQuadraId] = useState('');
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [motivo, setMotivo] = useState('');

  // Handlers
  const handleSalvar = async () => {
    if (!quadraId || !dataInicio || !motivo) {
      handleError(new Error('Preencha todos os campos obrigatórios'), 'BloqueiosPage');
      return;
    }

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const bloqueioData = {
      quadra_id: quadraId,
      data_inicio: formatDate(dataInicio),
      data_fim: dataFim ? formatDate(dataFim) : formatDate(dataInicio),
      hora_inicio: horaInicio || undefined,
      hora_fim: horaFim || undefined,
      motivo,
    };

    try {
      if (bloqueioEditando) {
        await updateBloqueioMutation.mutateAsync({
          id: bloqueioEditando.id,
          data: bloqueioData,
        });
      } else {
        await createBloqueioMutation.mutateAsync(bloqueioData);
      }
      handleFecharModal();
    } catch (error) {
      handleError(error, 'BloqueiosPage', bloqueioEditando ? 'Erro ao atualizar bloqueio' : 'Erro ao criar bloqueio');
    }
  };

  const handleEditar = (bloqueio: CourtBlock) => {
    setBloqueioEditando(bloqueio);
    setQuadraId(bloqueio.quadra_id);
    setDataInicio(new Date(bloqueio.data_inicio + 'T00:00:00'));
    setDataFim(new Date(bloqueio.data_fim + 'T00:00:00'));
    setHoraInicio(bloqueio.hora_inicio || '');
    setHoraFim(bloqueio.hora_fim || '');
    setMotivo(bloqueio.motivo);
    setModalAberto(true);
  };

  const handleExcluir = async (id: string) => {
    const confirmed = await confirm({
      title: 'Excluir Bloqueio',
      description: 'Tem certeza que deseja excluir este bloqueio? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await deleteBloqueioMutation.mutateAsync(id);
    } catch (error) {
      handleError(error, 'BloqueiosPage', 'Erro ao excluir bloqueio');
    }
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setBloqueioEditando(null);
    setQuadraId('');
    setDataInicio(undefined);
    setDataFim(undefined);
    setHoraInicio('');
    setHoraFim('');
    setMotivo('');
  };

  // Filtrar bloqueios
  const bloqueiosFiltrados = useMemo(() => {
    if (!bloqueios) return [];

    return bloqueios.filter(bloqueio => {
      const filtroQuadraOk = filtroQuadra === 'todas' || bloqueio.quadra_id === filtroQuadra;
      return filtroQuadraOk;
    });
  }, [bloqueios, filtroQuadra]);

  // Helper para encontrar nome da quadra
  const getQuadraNome = (quadraId: string) => {
    return quadras?.find(q => q.id === quadraId)?.nome || 'Quadra';
  };

  return (
    <div className="container-custom page-padding space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="heading-2 flex items-center gap-3">
            <Ban className="w-8 h-8 text-destructive" />
            Bloqueios de Horários
          </h1>
          <p className="body-medium text-muted-foreground">
            Gerencie bloqueios e indisponibilidades das quadras
          </p>
        </div>
        
        <Button onClick={() => setModalAberto(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Bloqueio
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Quadra</Label>
            <Select value={filtroQuadra} onValueChange={setFiltroQuadra}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as quadras</SelectItem>
                {quadras?.map(q => (
                  <SelectItem key={q.id} value={q.id}>{q.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Bloqueios */}
      {isLoadingBloqueios ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando bloqueios...</p>
          </CardContent>
        </Card>
      ) : bloqueiosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Ban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum bloqueio encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {filtroQuadra !== 'todas' ? 'Não há bloqueios para esta quadra.' : 'Não há bloqueios cadastrados.'}
            </p>
            <Button onClick={() => setModalAberto(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Bloqueio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bloqueiosFiltrados.map(bloqueio => {
            const parseDate = (dateStr: string) => {
              const [year, month, day] = dateStr.split('-');
              return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            };

            const dataInicio = parseDate(bloqueio.data_inicio);
            const dataFim = parseDate(bloqueio.data_fim);

            return (
              <Card key={bloqueio.id} className="border-l-4 border-l-destructive">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          {getQuadraNome(bloqueio.quadra_id)}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg">{bloqueio.motivo}</h3>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {format(dataInicio, 'dd/MM/yyyy', { locale: ptBR })}
                            {bloqueio.data_fim && bloqueio.data_fim !== bloqueio.data_inicio && (
                              ` até ${format(dataFim, 'dd/MM/yyyy', { locale: ptBR })}`
                            )}
                          </span>
                        </div>
                        {bloqueio.hora_inicio && bloqueio.hora_fim && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{bloqueio.hora_inicio} às {bloqueio.hora_fim}</span>
                          </div>
                        )}
                        {!bloqueio.hora_inicio && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Dia inteiro</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditar(bloqueio)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExcluir(bloqueio.id)}
                        disabled={deleteBloqueioMutation.isPending}
                      >
                        {deleteBloqueioMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Criação/Edição */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {bloqueioEditando ? 'Editar Bloqueio' : 'Novo Bloqueio'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Quadra *</Label>
                <Select value={quadraId} onValueChange={setQuadraId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a quadra" />
                  </SelectTrigger>
                  <SelectContent>
                    {quadras?.map(q => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.nome} ({q.tipo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Motivo *</Label>
                <Textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Descreva o motivo do bloqueio..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {dataInicio ? format(dataInicio, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataInicio}
                        onSelect={setDataInicio}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Data de Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {dataFim ? format(dataFim, 'dd/MM/yyyy', { locale: ptBR }) : 'Mesmo dia'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataFim}
                        onSelect={setDataFim}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Hora de Início (opcional)</Label>
                  <Input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    placeholder="Deixe em branco para dia inteiro"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Deixe em branco para bloquear o dia inteiro
                  </p>
                </div>

                <div>
                  <Label>Hora de Fim (opcional)</Label>
                  <Input
                    type="time"
                    value={horaFim}
                    onChange={(e) => setHoraFim(e.target.value)}
                    placeholder="Deixe em branco para dia inteiro"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleFecharModal}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSalvar}
                  disabled={createBloqueioMutation.isPending || updateBloqueioMutation.isPending}
                >
                  {(createBloqueioMutation.isPending || updateBloqueioMutation.isPending) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {bloqueioEditando ? 'Salvando...' : 'Criando...'}
                    </>
                  ) : (
                    bloqueioEditando ? 'Salvar Alterações' : 'Criar Bloqueio'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}