/**
 * Tipos para Horários
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Domingo, 6 = Sábado

export interface Horario {
  id: string;
  quadra_id: string;
  dia_semana: DiaSemana;
  hora_inicio: string; // HH:MM
  hora_fim: string; // HH:MM
  valor_avulsa: number;
  valor_mensalista: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const DIA_SEMANA_LABELS: Record<DiaSemana, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
};

export const DIA_SEMANA_SHORT: Record<DiaSemana, string> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
};
