/**
 * Tipos para o Sistema de Turmas (Times Fixos)
 * Conforme PRD - Seção 2.1.3
 */

export type MemberStatus = 'fixo' | 'variavel';

export interface TeamMember {
  id: string;
  turma_id: string;
  user_id: string;
  nome: string;
  email?: string;
  whatsapp?: string;
  status: MemberStatus; // 'fixo' ou 'variavel'
  created_at: string;
}

export interface Team {
  id: string;
  nome: string;
  descricao?: string;
  organizador_id: string;
  organizador?: {
    id: string;
    nome_completo: string;
    email: string;
  };
  membros?: TeamMember[];
  total_membros?: number;
  total_fixos?: number;
  total_variaveis?: number;
  created_at: string;
  updated_at: string;
}

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  fixo: 'Fixo',
  variavel: 'Variável',
};

export const MEMBER_STATUS_DESCRIPTIONS: Record<MemberStatus, string> = {
  fixo: 'Sempre incluído nas reservas',
  variavel: 'Incluído opcionalmente',
};
