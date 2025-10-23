export interface Notificacao {
  id: string;
  tipo: 'reserva' | 'pagamento' | 'indicacao' | 'sistema' | 'mensalista' | 'turma';
  titulo: string;
  descricao: string;
  data: string;
  lida: boolean;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  acao?: {
    tipo: 'link' | 'botao';
    url?: string;
    texto?: string;
    callback?: () => void;
  };
  dados?: {
    reservaId?: string;
    usuarioId?: string;
    valor?: number;
    [key: string]: any;
  };
}

export interface NotificacaoConfig {
  habilitada: boolean;
  tipos: {
    reserva: boolean;
    pagamento: boolean;
    indicacao: boolean;
    sistema: boolean;
    mensalista: boolean;
    turma: boolean;
  };
  som: boolean;
  desktop: boolean;
  email: boolean;
}

export interface EstatisticasNotificacao {
  total: number;
  naoLidas: number;
  porTipo: Record<string, number>;
  ultimaAtualizacao: string;
}