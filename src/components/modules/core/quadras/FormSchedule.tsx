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
  defaultDiaSemana?: number;
  onSubmit: (data: ScheduleFormData) => Promise<void>;
  onCancel: () => void;
}

export function FormSchedule({ courtId, schedule, defaultDiaSemana, onSubmit, onCancel }: FormScheduleProps) {
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
          quadra_id: schedule.quadra_id,
          dia_semana: schedule.dia_semana,
          hora_inicio: schedule.hora_inicio,
          hora_fim: schedule.hora_fim,
          valor_avulsa: schedule.valor_avulsa,
          valor_mensalista: schedule.valor_mensalista,
          ativo: schedule.ativo,
        }
      : {
          quadra_id: courtId,
          dia_semana: defaultDiaSemana,
          ativo: true as boolean,
        },
  } as any);

  const diaSemana = watch('dia_semana');
  const ativo = watch('ativo');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Dia da Semana */}
      <div>
        <Label htmlFor="dia_semana" className="text-sm font-medium text-gray-700">
          Dia da Semana *
        </Label>
        <Select
          value={diaSemana?.toString()}
          onValueChange={(value) => setValue('dia_semana', parseInt(value))}
          disabled={!!defaultDiaSemana}
        >
          <SelectTrigger className={`mt-1.5 rounded-lg ${defaultDiaSemana ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}>
            <SelectValue placeholder="Selecione o dia" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {DIAS_SEMANA.map((dia) => (
              <SelectItem key={dia.value} value={dia.value.toString()}>
                {dia.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {defaultDiaSemana && (
          <p className="text-xs text-gray-500 mt-1">
            Dia já selecionado automaticamente
          </p>
        )}
        {errors.dia_semana && (
          <p className="text-sm text-red-600 mt-1">{errors.dia_semana.message}</p>
        )}
      </div>

      {/* Horários */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hora_inicio" className="text-sm font-medium text-gray-700">
            Horário Início *
          </Label>
          <Input
            id="hora_inicio"
            type="time"
            {...register('hora_inicio')}
            className="mt-1.5 rounded-lg"
          />
          {errors.hora_inicio && (
            <p className="text-sm text-red-600 mt-1">{errors.hora_inicio.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="hora_fim" className="text-sm font-medium text-gray-700">
            Horário Fim *
          </Label>
          <Input
            id="hora_fim"
            type="time"
            {...register('hora_fim')}
            className="mt-1.5 rounded-lg"
          />
          {errors.hora_fim && (
            <p className="text-sm text-red-600 mt-1">{errors.hora_fim.message}</p>
          )}
        </div>
      </div>

      {/* Valores */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="valor_avulsa" className="text-sm font-medium text-gray-700">
            Valor Avulsa (R$) *
          </Label>
          <Input
            id="valor_avulsa"
            type="number"
            step="0.01"
            min="0"
            {...register('valor_avulsa', { valueAsNumber: true })}
            placeholder="150.00"
            className="mt-1.5 rounded-lg"
          />
          {errors.valor_avulsa && (
            <p className="text-sm text-red-600 mt-1">{errors.valor_avulsa.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="valor_mensalista" className="text-sm font-medium text-gray-700">
            Valor Mensalista (R$) *
          </Label>
          <Input
            id="valor_mensalista"
            type="number"
            step="0.01"
            min="0"
            {...register('valor_mensalista', { valueAsNumber: true })}
            placeholder="120.00"
            className="mt-1.5 rounded-lg"
          />
          {errors.valor_mensalista && (
            <p className="text-sm text-red-600 mt-1">{errors.valor_mensalista.message}</p>
          )}
        </div>
      </div>

      {/* Ativo */}
      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            ativo ? 'bg-primary/10' : 'bg-gray-200'
          }`}>
            <div className={`w-2 h-2 rounded-full transition-colors ${
              ativo ? 'bg-primary' : 'bg-gray-400'
            }`} />
          </div>
          <div>
            <Label htmlFor="ativo" className="text-sm font-semibold text-gray-900 cursor-pointer block">
              Horário {ativo ? 'Ativo' : 'Inativo'}
            </Label>
            <p className="text-xs text-gray-500 mt-0.5">
              {ativo ? 'Disponível para reservas' : 'Não disponível para reservas'}
            </p>
          </div>
        </div>
        <Switch
          id="ativo"
          checked={ativo}
          onCheckedChange={(checked) => setValue('ativo', checked)}
        />
      </div>

      {/* Ações */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 rounded-lg h-11"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary hover:bg-primary/90 rounded-lg h-11"
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
