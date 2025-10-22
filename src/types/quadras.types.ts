/**
 * Tipos para Quadras
 */

export type QuadraStatus = 'ativa' | 'inativa' | 'manutencao';
export type QuadraTipo = 'society' | 'beach_tennis' | 'volei' | 'futevolei';

export interface Quadra {
  id: string;
  nome: string;
  tipo: QuadraTipo;
  descricao?: string;
  status: QuadraStatus;
  capacidade_maxima: number;
  foto_url?: string;
  created_at: string;
  updated_at: string;
}

export const QUADRA_TIPO_LABELS: Record<QuadraTipo, string> = {
  society: 'Society',
  beach_tennis: 'Beach Tennis',
  volei: 'Vôlei',
  futevolei: 'Futevôlei',
};

export const QUADRA_STATUS_LABELS: Record<QuadraStatus, string> = {
  ativa: 'Ativa',
  inativa: 'Inativa',
  manutencao: 'Em Manutenção',
};
