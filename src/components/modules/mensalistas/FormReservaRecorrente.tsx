'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Repeat, 
  MapPin,
  Loader2,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMensalistas } from '@/hooks/useMensalistas';

const reservaRecorrenteSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  quadra_id: z.string().min(1, 'Selecione uma quadra'),
  tipo_recorrencia: z.enum(['semanal', 'quinzenal', 'mensal']),
  dias_semana: z.array(z.number()).optional(),
  dia_mes: z.number().optional(),
  hora_inicio: z.string().min(1, 'Hora de início é obrigatória'),
  hora_fim: z.string().min(1, 'Hora de fim é obrigatória'),
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().optional(),
  antecedencia_dias: z.number().min(1).max(30),
  valor_por_reserva: z.number().min(0),
  desconto_percentual: z.number().min(0).max(100).optional(),
});

type FormData = z.infer<typeof reservaRecorrenteSchema>;

// Mock de quadras - em produção viria da API
const quadrasDisponiveis = [
  { id: '1', nome: 'Quadra 1 - Tênis de Mesa', tipo: 'tenis_mesa' },
  { id: '2', nome: 'Quadra 2 - Tênis de Mesa', tipo: 'tenis_mesa' },
  { id: '3', nome: 'Quadra 3 - Beach Tennis', tipo: 'beach_tennis' },
  { id: '4', nome: 'Quadra 4 - Beach Tennis', tipo: 'beach_tennis' },
];

const diasSemana = [
  { id: 0, nome: 'Domingo', abrev: 'Dom' },
  { id: 1, nome: 'Segunda', abrev: 'Seg' },
  { id: 2, nome: 'Terça', abrev: 'Ter' },
  { id: 3, nome: 'Quarta', abrev: 'Qua' },
  { id: 4, nome: 'Quinta', abrev: 'Qui' },
  { id: 5, nome: 'Sexta', abrev: 'Sex' },
  { id: 6, nome: 'Sábado', abrev: 'Sáb' },
];

export function FormReservaRecorrente() {
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { criarReservaRecorrente } = useMensalistas();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(reservaRecorrenteSchema),
    defaultValues: {
      antecedencia_dias: 7,
      valor_por_reserva: 50,
      desconto_percentual: 0,
    },
  });

  const tipoRecorrencia = form.watch('tipo_recorrencia');

  const handleDiaChange = (dia: number, checked: boolean) => {
    if (checked) {
      setDiasSelecionados([...diasSelecionados, dia]);
    } else {
      setDiasSelecionados(diasSelecionados.filter(d => d !== dia));
    }
  };

  const onSubmit = async (data: FormData) => {
    // Validações específicas
    if ((data.tipo_recorrencia === 'semanal' || data.tipo_recorrencia === 'quinzenal') && diasSelecionados.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um dia da semana",
        variant: "destructive",
      });
      return;
    }

    if (data.tipo_recorrencia === 'mensal' && !data.dia_mes) {
      toast({
        title: "Erro",
        description: "Selecione o dia do mês",
        variant: "destructive",
      });
      return;
    }

    if (data.hora_inicio >= data.hora_fim) {
      toast({
        title: "Erro",
        description: "Hora de início deve ser anterior à hora de fim",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const configuracao = {
        ...data,
        dias_semana: (data.tipo_recorrencia === 'semanal' || data.tipo_recorrencia === 'quinzenal') 
          ? diasSelecionados 
          : undefined,
      };

      const resultado = await criarReservaRecorrente(data.quadra_id, configuracao);
      
      if (resultado.success) {
        toast({
          title: "Sucesso! 🎉",
          description: "Reserva recorrente criada com sucesso!",
        });
        form.reset();
        setDiasSelecionados([]);
      } else {
        toast({
          title: "Erro",
          description: resultado.error || 'Erro ao criar reserva recorrente',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar reserva recorrente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="h-5 w-5" />
          Nova Reserva Recorrente
        </CardTitle>
        <CardDescription>
          Configure uma reserva que se repete automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              Informações Básicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  placeholder="Ex: Treino de Tênis de Mesa"
                  {...form.register('titulo')}
                />
                {form.formState.errors.titulo && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.titulo.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quadra_id">Quadra *</Label>
                <Select onValueChange={(value) => form.setValue('quadra_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma quadra" />
                  </SelectTrigger>
                  <SelectContent>
                    {quadrasDisponiveis.map((quadra) => (
                      <SelectItem key={quadra.id} value={quadra.id}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {quadra.nome}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.quadra_id && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.quadra_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                placeholder="Detalhes adicionais sobre a reserva..."
                {...form.register('descricao')}
              />
            </div>
          </div>

          {/* Configuração de Recorrência */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Recorrência
            </h3>

            <div className="space-y-2">
              <Label>Tipo de Recorrência *</Label>
              <Select onValueChange={(value: any) => form.setValue('tipo_recorrencia', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="quinzenal">Quinzenal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dias da Semana (para semanal/quinzenal) */}
            {(tipoRecorrencia === 'semanal' || tipoRecorrencia === 'quinzenal') && (
              <div className="space-y-2">
                <Label>Dias da Semana *</Label>
                <div className="flex flex-wrap gap-2">
                  {diasSemana.map((dia) => (
                    <div key={dia.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dia-${dia.id}`}
                        checked={diasSelecionados.includes(dia.id)}
                        onCheckedChange={(checked) => handleDiaChange(dia.id, checked as boolean)}
                      />
                      <Label htmlFor={`dia-${dia.id}`} className="text-sm">
                        {dia.abrev}
                      </Label>
                    </div>
                  ))}
                </div>
                {diasSelecionados.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {diasSelecionados.map((dia) => (
                      <Badge key={dia} variant="secondary">
                        {diasSemana.find(d => d.id === dia)?.nome}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Dia do Mês (para mensal) */}
            {tipoRecorrencia === 'mensal' && (
              <div className="space-y-2">
                <Label htmlFor="dia_mes">Dia do Mês *</Label>
                <Select onValueChange={(value) => form.setValue('dia_mes', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((dia) => (
                      <SelectItem key={dia} value={dia.toString()}>
                        Dia {dia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Horários */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horários
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora_inicio">Hora de Início *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  {...form.register('hora_inicio')}
                />
                {form.formState.errors.hora_inicio && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.hora_inicio.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_fim">Hora de Fim *</Label>
                <Input
                  id="hora_fim"
                  type="time"
                  {...form.register('hora_fim')}
                />
                {form.formState.errors.hora_fim && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.hora_fim.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Período */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Período
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data de Início *</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  {...form.register('data_inicio')}
                />
                {form.formState.errors.data_inicio && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.data_inicio.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim">Data de Fim (opcional)</Label>
                <Input
                  id="data_fim"
                  type="date"
                  {...form.register('data_fim')}
                />
                <p className="text-xs text-muted-foreground">
                  Deixe vazio para reservas indefinidas
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="antecedencia_dias">Antecedência (dias)</Label>
              <Input
                id="antecedencia_dias"
                type="number"
                min="1"
                max="30"
                {...form.register('antecedencia_dias', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">
                Quantos dias antes as reservas serão criadas automaticamente
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Valores</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor_por_reserva">Valor por Reserva (R$)</Label>
                <Input
                  id="valor_por_reserva"
                  type="number"
                  step="0.01"
                  min="0"
                  {...form.register('valor_por_reserva', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desconto_percentual">Desconto (%)</Label>
                <Input
                  id="desconto_percentual"
                  type="number"
                  min="0"
                  max="100"
                  {...form.register('desconto_percentual', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Desconto aplicado por ser recorrente
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Repeat className="h-4 w-4 mr-2" />
                Criar Reserva Recorrente
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}