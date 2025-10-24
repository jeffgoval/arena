export type CreditoTipo = 'compra' | 'bonus' | 'indicacao' | 'promocao' | 'uso' | 'expiracao';
export type CreditoStatus = 'ativo' | 'usado' | 'expirado';

export interface Credito {
  id: string;
  usuario_id: string;
  tipo: CreditoTipo;
  valor: number;
  descricao: string;
  status: CreditoStatus;
  data_expiracao?: string;
  created_at: string;
  updated_at?: string;
  reserva_id?: string;
  indicacao_id?: string;
  metodo_pagamento?: string;
  // Relacionamentos
  reservas?: {
    id: string;
  };
  indicacoes?: {
    id: string;
    usuario_indicado: {
      nome: string;
    };
  };
}

export interface SaldoCreditos {
  total: number;
  ativo: number;
  expirandoEm30Dias: number;
  usado: number;
  expirado: number;
}

export interface CreditosResponse {
  success: boolean;
  saldo: SaldoCreditos;
  historico: Credito[];
  creditosAtivos: Credito[];
  creditosExpirandoSoon: Credito[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface PacoteCredito {
  id: string;
  nome: string;
  valor: number;
  creditos: number;
  bonus: number;
  validadeMeses: number;
  beneficios: string[];
  popular?: boolean;
}

export interface ComprarCreditosData {
  pacoteId: string;
  metodoPagamento: 'pix' | 'cartao' | 'boleto';
  valor: number;
}