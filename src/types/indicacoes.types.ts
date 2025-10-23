export interface Indicacao {
    id: string;
    usuario_indicador_id: string;
    usuario_indicado_id?: string;
    codigo_indicacao: string;
    email_indicado?: string;
    nome_indicado?: string;
    status: 'pendente' | 'aceita' | 'expirada';
    creditos_concedidos: number;
    data_criacao: string;
    data_aceite?: string;
    data_expiracao: string;
}

export interface CodigoIndicacao {
    id: string;
    usuario_id: string;
    codigo: string;
    ativo: boolean;
    total_indicacoes: number;
    total_creditos_recebidos: number;
    data_criacao: string;
    data_atualizacao: string;
}

export interface CreditoIndicacao {
    id: string;
    usuario_id: string;
    indicacao_id: string;
    valor_credito: number;
    tipo: 'indicacao_aceita' | 'bonus_multiplas_indicacoes';
    descricao: string;
    data_criacao: string;
    usado: boolean;
    data_uso?: string;
    reserva_id?: string;
}

export interface ConfiguracaoIndicacao {
    id: string;
    creditos_por_indicacao: number;
    dias_expiracao_convite: number;
    bonus_multiplas_indicacoes: {
        quantidade: number;
        creditos_bonus: number;
    }[];
    ativo: boolean;
    data_criacao: string;
    data_atualizacao: string;
}

export interface EstatisticasIndicacao {
    total_indicacoes: number;
    indicacoes_aceitas: number;
    indicacoes_pendentes: number;
    total_creditos_recebidos: number;
    creditos_disponiveis: number;
    creditos_utilizados: number;
}