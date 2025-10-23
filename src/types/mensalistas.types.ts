export interface PlanoMensalista {
  id: string;
  nome: string;
  descricao: string;
  valor_mensal: number;
  horas_incluidas: number;
  horas_extras_valor: number;
  quadras_permitidas: string[];
  horarios_permitidos: {
    dias_semana: number[]; // 0-6 (domingo-sábado)
    hora_inicio: string;
    hora_fim: string;
  }[];
  ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
}

export interface AssinaturaMensalista {
  id: string;
  usuario_id: string;
  plano_id: string;
  status: 'ativa' | 'pausada' | 'cancelada' | 'vencida';
  data_inicio: string;
  data_fim?: string;
  dia_vencimento: number; // 1-31
  valor_mensal: number;
  horas_utilizadas_mes: number;
  data_criacao: string;
  data_atualizacao: string;
  
  // Relacionamentos
  plano?: PlanoMensalista;
  usuario?: any;
}

export interface ReservaRecorrente {
  id: string;
  usuario_id: string;
  quadra_id: string;
  titulo: string;
  descricao?: string;
  
  // Configuração de recorrência
  tipo_recorrencia: 'semanal' | 'quinzenal' | 'mensal';
  dias_semana: number[]; // Para semanal/quinzenal
  dia_mes?: number; // Para mensal
  hora_inicio: string;
  hora_fim: string;
  
  // Período de vigência
  data_inicio: string;
  data_fim?: string;
  
  // Status e configurações
  status: 'ativa' | 'pausada' | 'cancelada';
  gerar_ate: string; // Data limite para gerar reservas
  antecedencia_dias: number; // Quantos dias antes gerar
  
  // Valores
  valor_por_reserva: number;
  desconto_percentual: number;
  
  // Controle
  proxima_geracao: string;
  total_reservas_geradas: number;
  data_criacao: string;
  data_atualizacao: string;
  
  // Relacionamentos
  quadra?: any;
  usuario?: any;
  reservas_geradas?: ReservaGerada[];
}

export interface ReservaGerada {
  id: string;
  reserva_recorrente_id: string;
  reserva_id?: string;
  data_reserva: string;
  hora_inicio: string;
  hora_fim: string;
  status: 'agendada' | 'confirmada' | 'cancelada' | 'realizada';
  valor: number;
  data_geracao: string;
  
  // Relacionamentos
  reserva_recorrente?: ReservaRecorrente;
  reserva?: any;
}

export interface CobrancaMensalista {
  id: string;
  assinatura_id: string;
  mes_referencia: string; // YYYY-MM
  valor_plano: number;
  horas_extras: number;
  valor_horas_extras: number;
  valor_total: number;
  status: 'pendente' | 'paga' | 'vencida' | 'cancelada';
  data_vencimento: string;
  data_pagamento?: string;
  metodo_pagamento?: string;
  data_criacao: string;
  
  // Relacionamentos
  assinatura?: AssinaturaMensalista;
}

export interface EstatisticasMensalista {
  horas_utilizadas_mes: number;
  horas_restantes_mes: number;
  percentual_uso: number;
  valor_economizado: number;
  reservas_realizadas_mes: number;
  proxima_cobranca: string;
  status_pagamento: 'em_dia' | 'pendente' | 'vencido';
}

export interface ConfiguracaoRecorrencia {
  tipo: 'semanal' | 'quinzenal' | 'mensal';
  dias_semana?: number[];
  dia_mes?: number;
  hora_inicio: string;
  hora_fim: string;
  data_inicio: string;
  data_fim?: string;
  antecedencia_dias: number;
}