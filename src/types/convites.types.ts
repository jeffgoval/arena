/**
 * Tipos para o Sistema de Convites Públicos
 * Conforme PRD - Seção 2.1.3
 */

export type ConviteStatus = 'ativo' | 'expirado' | 'completo';

export interface Convite {
  id: string;
  reserva_id: string;
  reserva?: {
    id: string;
    data: string;
    valor_total: number;
    quadra?: {
      id: string;
      nome: string;
      tipo: string;
    };
    horario?: {
      id: string;
      hora_inicio: string;
      hora_fim: string;
    };
  };
  criado_por: string;
  organizador?: {
    id: string;
    nome_completo: string;
    email: string;
  };
  token: string; // Token único para o link
  vagas_disponiveis: number;
  vagas_totais: number;
  mensagem?: string;
  valor_por_pessoa?: number; // Valor sugerido por pessoa (opcional)
  data_expiracao?: string;
  status: ConviteStatus;
  total_aceites: number;
  created_at: string;
  updated_at: string;
}

export interface ConviteAceite {
  id: string;
  convite_id: string;
  convite?: Convite;
  nome: string;
  email?: string;
  whatsapp?: string;
  user_id?: string; // Se o convidado já tem conta
  confirmado: boolean;
  created_at: string;
}

export const CONVITE_STATUS_LABELS: Record<ConviteStatus, string> = {
  ativo: 'Ativo',
  expirado: 'Expirado',
  completo: 'Completo',
};

export const CONVITE_STATUS_COLORS: Record<ConviteStatus, string> = {
  ativo: 'bg-green-100 text-green-700',
  expirado: 'bg-red-100 text-red-700',
  completo: 'bg-blue-100 text-blue-700',
};
