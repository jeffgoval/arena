/**
 * Tipos para o Sistema de Reservas
 * Conforme PRD - Seção 2.1.2
 */

export type ReservationType = 'avulsa' | 'mensalista' | 'recorrente';
export type ReservaStatus = 'pendente' | 'confirmada' | 'cancelada';
export type RateioMode = 'percentual' | 'fixo';
export type ParticipantOrigin = 'turma' | 'convite';
export type PaymentStatus = 'pendente' | 'pago' | 'reembolsado';

export interface Reserva {
  id: string;
  organizador_id: string;
  organizador?: {
    id: string;
    nome_completo: string;
    email: string;
  };
  quadra_id: string;
  quadra?: {
    id: string;
    nome: string;
    tipo: string;
  };
  horario_id: string;
  horario?: {
    id: string;
    dia_semana: number;
    hora_inicio: string;
    hora_fim: string;
    valor_avulsa: number;
  };
  data: string; // Data da reserva (YYYY-MM-DD)
  tipo: ReservationType;
  status: ReservaStatus;
  valor_total: number;
  observacoes?: string;

  // Turma vinculada (opcional)
  turma_id?: string;
  turma?: {
    id: string;
    nome: string;
    total_membros?: number;
  };

  // Rateio
  rateio_modo?: RateioMode;
  rateio_configurado?: boolean;

  // Contadores
  total_participantes?: number;
  valor_pago?: number;
  valor_pendente?: number;

  created_at: string;
  updated_at: string;
}

export interface ReservaParticipant {
  id: string;
  reserva_id: string;
  user_id?: string;
  nome: string;
  email?: string;
  whatsapp?: string;
  origem: ParticipantOrigin; // 'turma' ou 'convite'
  convite_id?: string;

  // Rateio
  valor_rateio?: number; // Valor fixo ou null se percentual
  percentual_rateio?: number; // Percentual ou null se fixo

  // Pagamento
  status_pagamento: PaymentStatus;
  valor_pago?: number;
  data_pagamento?: string;

  created_at: string;
}

export interface RateioConfig {
  modo: RateioMode;
  participantes: {
    id: string;
    nome: string;
    valor?: number; // Se modo fixo
    percentual?: number; // Se modo percentual
  }[];
}

export const RESERVA_TYPE_LABELS: Record<ReservationType, string> = {
  avulsa: 'Avulsa',
  mensalista: 'Mensalista',
  recorrente: 'Recorrente',
};

export const RESERVA_STATUS_LABELS: Record<ReservaStatus, string> = {
  pendente: 'Pendente',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
};

export const RATEIO_MODE_LABELS: Record<RateioMode, string> = {
  percentual: 'Percentual (%)',
  fixo: 'Valor Fixo (R$)',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pendente: 'Pendente',
  pago: 'Pago',
  reembolsado: 'Reembolsado',
};
