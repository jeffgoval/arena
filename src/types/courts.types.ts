/**
 * Types para Sistema de Quadras
 */

export type CourtType = 'society' | 'beach_tennis' | 'volei' | 'futevolei';
export type CourtStatus = 'ativa' | 'inativa' | 'manutencao';

export const COURT_TYPE_LABELS: Record<CourtType, string> = {
  society: 'Futebol Society',
  beach_tennis: 'Beach Tennis',
  volei: 'Vôlei de Praia',
  futevolei: 'Futevôlei',
};

export interface Court {
  id: string;
  nome: string;
  tipo: CourtType;
  descricao: string | null;
  capacidade_maxima: number;
  status: CourtStatus;
  foto_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  quadra_id: string;
  dia_semana: number; // 0=Domingo, 6=Sábado
  hora_inicio: string; // HH:MM
  hora_fim: string; // HH:MM
  valor_avulsa: number;
  valor_mensalista: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourtBlock {
  id: string;
  quadra_id: string;
  data_inicio: string; // YYYY-MM-DD
  data_fim: string; // YYYY-MM-DD
  hora_inicio: string | null; // HH:MM
  hora_fim: string | null; // HH:MM
  motivo: string;
  created_by: string | null;
  created_at: string;
}

// Helper para dias da semana
export const DIAS_SEMANA = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];
