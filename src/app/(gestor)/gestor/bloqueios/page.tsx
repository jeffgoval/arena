'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Ban, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  AlertTriangle,
  Settings,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Bloqueio {
  id: string;
  quadra: string;
  dataInicio: Date;
  dataFim: Date;
  horaInicio: string;
  horaFim: string;
  motivo: string;
  tipo: 'manutencao' | 'evento' | 'limpeza' | 'outros';
  ativo: boolean;
  recorrente: boolean;
  diasSemana?: string[];
}

export default function BloqueiosPage() {
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([
    {
      id: '1',
      quadra: 'Quadra A',
      dataInicio: new Date('2024-10-25'),
      dataFim: new Date('2024-10-25'),
      horaInicio: '14:00',
      horaFim: '16:00',
      motivo: 'Manutenção da grama sintética',
      tipo: 'manutencao',
      ativo: true,
      recorrente: false
    },
    {
      id: '2',
      quadra: 'Quadra B',
      dataInicio: new Date('2024-10-26'),
      dataFim: new Date('2024-10-26'),
      horaInicio: '10:00',
      horaFim: '12:00',
      motivo: 'Evento corporativo - Empresa XYZ',
      tipo: 'evento',
      ativo: true,
      recorrente: false
    },
    {
      id: '3',
      quadra: 'Todas',
      dataInicio: new Date('2024-10-27'),
      dataFim: new Date('2024-10-27'),
      horaInicio: '06:00',
      horaFim: '08:00',
      motivo: 'Limpeza geral das quadras',
      tipo: 'limpeza',
      ativo: true,
      recorrente: true,
      diasSemana: ['domingo']
    }
  ]);

  const [modalAberto, setModalAberto] = useState(false);
  const [bloqueioEditando, setBloqueioEditando] = useState<Bloqueio | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroQuadra, setFiltroQuadra] = useState<string>('todas');

  // Formulário
  const [quadra, setQuadra] = useState('');
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [motivo, setMotivo] = useState('');
  const [tipo, setTipo] = useState<'manutencao' | 'evento' | 'limpeza' | 'outros'>('manutencao');
  const [recorrente, setRecorrente] = useState(false);
  const [diasSemana, setDiasSemana] = useState<string[]>([]);

  const quadras = ['Quadra A', 'Quadra B', 'Quadra C', 'Todas'];
  const tiposBloqueio = [
    { value: 'manutencao', label: 'Manutenção', color: 'bg-orange-100 text-orange-800' },
    { value: 'evento', label: 'Evento', color: 'bg-blue-100 text-blue-800' },
    { value: 'limpeza', label: 'Limpeza', color: 'bg-green-100 text-green-800' },
    { value: 'outros', label: 'Outros', color: 'bg-gray-100 text-gray-800' }
  ];

  const diasDaSemana = [
    { value: 'domingo', label: 'Dom' },
    { value: 'segunda', label: 'Seg' },
    { value: 'terca', label: 'Ter' },
    { value: 'quarta', label: 'Qua' },
    { value: 'quinta', label: 'Qui' },
    { value: 'sexta', label: 'Sex' },
    { value: 'sabado', label: 'Sáb' }
  ];

  const handleSalvar = () => {
    if (!quadra || !dataInicio || !horaInicio || !horaFim || !motivo) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const novoBloqueio: Bloqueio = {
      id: bloqueioEditando?.id || Date.now().toString(),
      quadra,
      dataInicio,
      dataFim: dataFim || dataInicio,
      horaInicio,
      horaFim,
      motivo,
      tipo,
      ativo: true,
      recorrente,
      diasSemana: recorrente ? diasSemana : undefined
    };

    if (bloqueioEditando) {
      setBloqueios(prev => prev.map(b => b.id === bloqueioEditando.id ? novoBloqueio : b));
    } else {
      setBloqueios(prev => [...prev, novoBloqueio]);
    }

    handleFecharModal();
  };

  const handleEditar = (bloqueio: Bloqueio) => {
    setBloqueioEditando(bloqueio);
    setQuadra(bloqueio.quadra);
    setDataInicio(bloqueio.dataInicio);
    setDataFim(bloqueio.dataFim);
    setHoraInicio(bloqueio.horaInicio);
    setHoraFim(bloqueio.horaFim);
    setMotivo(bloqueio.motivo);
    setTipo(bloqueio.tipo);
    setRecorrente(bloqueio.recorrente);
    setDiasSemana(bloqueio.diasSemana || []);
    setModalAberto(true);
  };

  const handleExcluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este bloqueio?')) {
      setBloqueios(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleToggleAtivo = (id: string) => {
    setBloqueios(prev => prev.map(b => 
      b.id === id ? { ...b, ativo: !b.ativo } : b
    ));
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setBloqueioEditando(null);
    setQuadra('');
    setDataInicio(undefined);
    setDataFim(undefined);
    setHoraInicio('');
    setHoraFim('');
    setMotivo('');
    setTipo('manutencao');
    setRecorrente(false);
    setDiasSemana([]);
  };

  const handleToggleDiaSemana = (dia: string) => {
    setDiasSemana(prev => 
      prev.includes(dia) 
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    );
  };

  const bloqueiosFiltrados = bloqueios.filter(bloqueio => {
    const filtroTipoOk = filtroTipo === 'todos' || bloqueio.tipo === filtroTipo;
    const filtroQuadraOk = filtroQuadra === 'todas' || bloqueio.quadra === filtroQuadra;
    return filtroTipoOk && filtroQuadraOk;
  });

  const getTipoInfo = (tipo: string) => {
    return tiposBloqueio.find(t => t.value === tipo) || tiposBloqueio[3];
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Bloqueio</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  {tiposBloqueio.map(tipo => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quadra</Label>
              <Select value={filtroQuadra} onValueChange={setFiltroQuadra}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as quadras</SelectItem>
                  {quadras.map(q => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Bloqueios */}
      <div className="grid gap-4">
        {bloqueiosFiltrados.map(bloqueio => {
          const tipoInfo = getTipoInfo(bloqueio.tipo);
          
          return (
            <Card key={bloqueio.id} className={`border-l-4 ${!bloqueio.ativo ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge className={tipoInfo.color}>
                        {tipoInfo.label}
                      </Badge>
                      <Badge variant="outline">
                        {bloqueio.quadra}
                      </Badge>
                      {bloqueio.recorrente && (
                        <Badge variant="secondary">
                          Recorrente
                        </Badge>
                      )}
                      {!bloqueio.ativo && (
                        <Badge variant="destructive">
                          Inativo
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg">{bloqueio.motivo}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {format(bloqueio.dataInicio, 'dd/MM/yyyy', { locale: ptBR })}
                          {bloqueio.dataFim && bloqueio.dataFim !== bloqueio.dataInicio && (
                            ` até ${format(bloqueio.dataFim, 'dd/MM/yyyy', { locale: ptBR })}`
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{bloqueio.horaInicio} às {bloqueio.horaFim}</span>
                      </div>
                    </div>

                    {bloqueio.recorrente && bloqueio.diasSemana && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Dias:</span>
                        <div className="flex gap-1">
                          {bloqueio.diasSemana.map(dia => (
                            <Badge key={dia} variant="outline" className="text-xs">
                              {diasDaSemana.find(d => d.value === dia)?.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={bloqueio.ativo}
                      onCheckedChange={() => handleToggleAtivo(bloqueio.id)}
                    />
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
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {bloqueiosFiltrados.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Ban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum bloqueio encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Não há bloqueios cadastrados com os filtros selecionados.
              </p>
              <Button onClick={() => setModalAberto(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Bloqueio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Quadra *</Label>
                  <Select value={quadra} onValueChange={setQuadra}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a quadra" />
                    </SelectTrigger>
                    <SelectContent>
                      {quadras.map(q => (
                        <SelectItem key={q} value={q}>{q}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo de Bloqueio *</Label>
                  <Select value={tipo} onValueChange={(value: any) => setTipo(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposBloqueio.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                  <Label>Hora de Início *</Label>
                  <Input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Hora de Fim *</Label>
                  <Input
                    type="time"
                    value={horaFim}
                    onChange={(e) => setHoraFim(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={recorrente}
                    onCheckedChange={setRecorrente}
                  />
                  <Label>Bloqueio recorrente</Label>
                </div>

                {recorrente && (
                  <div>
                    <Label className="mb-3 block">Dias da Semana</Label>
                    <div className="flex flex-wrap gap-2">
                      {diasDaSemana.map(dia => (
                        <Button
                          key={dia.value}
                          variant={diasSemana.includes(dia.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleDiaSemana(dia.value)}
                        >
                          {dia.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleFecharModal}>
                  Cancelar
                </Button>
                <Button onClick={handleSalvar}>
                  {bloqueioEditando ? 'Salvar Alterações' : 'Criar Bloqueio'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}