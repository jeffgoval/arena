/**
 * Tipos para o Sistema de Avaliações
 */

export type AvaliacaoRating = 1 | 2 | 3 | 4 | 5;

export interface Avaliacao {
  id: string;
  reserva_id: string;
  user_id: string;
  rating: AvaliacaoRating;
  comentario?: string;
  created_at: string;
  
  // Dados relacionados (joins)
  user?: {
    id: string;
    nome_completo: string;
  };
  reserva?: {
    id: string;
    data: string;
    quadra?: {
      id: string;
      nome: string;
    };
  };
}

export interface AvaliacaoStats {
  mediaGeral: number;
  totalAvaliacoes: number;
  distribuicao: {
    rating: AvaliacaoRating;
    quantidade: number;
    percentual: number;
  }[];
  porQuadra: {
    quadra_id: string;
    quadra_nome: string;
    media: number;
    total: number;
  }[];
}

export const RATING_LABELS: Record<AvaliacaoRating, string> = {
  5: 'Excelente',
  4: 'Bom',
  3: 'Regular',
  2: 'Ruim',
  1: 'Péssimo',
};

export const RATING_COLORS: Record<AvaliacaoRating, string> = {
  5: 'text-green-500',
  4: 'text-green-400',
  3: 'text-yellow-500',
  2: 'text-orange-500',
  1: 'text-red-500',
};
