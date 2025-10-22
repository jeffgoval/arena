'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { scheduleSchema, type ScheduleFormData } from '@/lib/validations/court.schema';
import { DIAS_SEMANA } from '@/types/courts.types';
import type { Schedule } from '@/types/courts.types';

interface FormScheduleProps {
  courtId: string;
  schedule?: Schedule;
  onSubmit: (data: ScheduleFormData) => Promise<void>;
  onCancel: () => void;
}

export function FormSchedule({ courtId, schedule, onSubmit, onCancel }: FormScheduleProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: schedule
      ? {
          court_id: schedule.court_id,
          dia_semana: schedule.dia_semana,
          horario_inicio: schedule.horario_inicio,
          horario_fim: schedule.horario_fim,
          valor_avulsa: schedule.valor_avulsa,
          valor_mensalista: schedule.valor_mensalista,
          ativa: schedule.ativa,
        }
      : {
          court_id: courtId,
          ativa: true,
        },
  });

  const diaSemana = watch('dia_semana');
  const ativa = watch('ativa');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Dia da Semana */}
      <div>
        <Label htmlFor="dia_semana">Dia da Semana *</Label>
        <Select
          value={diaSemana?.toString()}
          onValueChange={(value) => setValue('dia_semana', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o dia" />
          </SelectTrigger>
          <SelectContent>
            {DIAS_SEMANA.map((dia) => (
              <SelectItem key={dia.value} value={dia.value.toString()}>
                {dia.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.dia_semana && (
          <p className="text-sm text-red-600 mt-1">{errors.dia_semana.message}</p>
        )}
      </div>

      {/* Horários */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="horario_inicio">Horário Início *</Label>
          <Input
            id="horario_inicio"
            type="time"
            {...register('horario_inicio')}
          />
          {errors.horario_inicio && (
            <p className="text-sm text-red-600 mt-1">{errors.horario_inicio.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="horario_fim">Horário Fim *</Label>
          <Input
            id="horario_fim"
            type="time"
            {...register('horario_fim')}
          />
          {errors.horario_fim && (
            <p className="text-sm text-red-600 mt-1">{errors.horario_fim.message}</p>
          )}
        </div>
      </div>

      {/* Valores */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="valor_avulsa">Valor Avulsa (R$) *</Label>
          <Input
            id="valor_avulsa"
            type="number"
            step="0.01"
            min="0"
            {...register('valor_avulsa', { valueAsNumber: true })}
            placeholder="150.00"
          />
          {errors.valor_avulsa && (
            <p className="text-sm text-red-600 mt-1">{errors.valor_avulsa.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="valor_mensalista">Valor Mensalista (R$) *</Label>
          <Input
            id="valor_mensalista"
            type="number"
            step="0.01"
            min="0"
            {...register('valor_mensalista', { valueAsNumber: true })}
            placeholder="120.00"
          />
          {errors.valor_mensalista && (
            <p className="text-sm text-red-600 mt-1">{errors.valor_mensalista.message}</p>
          )}
        </div>
      </div>

      {/* Ativa */}
      <div className="flex items-center justify-between">
        <Label htmlFor="ativa">Horário Ativo</Label>
        <Switch
          id="ativa"
          checked={ativa}
          onCheckedChange={(checked) => setValue('ativa', checked)}
        />
      </div>

      {/* Ações */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#2D9F5D] hover:bg-[#258c4f]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : schedule ? (
            'Atualizar'
          ) : (
            'Adicionar Horário'
          )}
        </Button>
      </div>
    </form>
  );
}
