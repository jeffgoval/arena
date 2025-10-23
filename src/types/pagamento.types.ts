export interface Cliente {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  celular?: string;
  cpf: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  observacoes?: string;
}

export interface DadosCartao {
  nomePortador: string;
  numero: string;
  mesVencimento: string;
  anoVencimento: string;
  codigoSeguranca: string;
}

export interface DadosPortadorCartao {
  nome: string;
  email: string;
  cpf: string;
  cep: string;
  numero: string;
  complemento?: string;
  telefone: string;
  celular?: string;
}

export interface Desconto {
  valor: number;
  diasLimite: number;
  tipo: 'FIXED' | 'PERCENTAGE';
}

export interface Juros {
  valor: number;
  tipo: 'PERCENTAGE';
}

export interface Multa {
  valor: number;
  tipo: 'FIXED' | 'PERCENTAGE';
}

export interface DadosPagamento {
  clienteId: string;
  tipoPagamento: 'BOLETO' | 'CREDIT_CARD' | 'PIX';
  valor: number;
  dataVencimento: string;
  descricao?: string;
  referencia?: string;
  parcelas?: number;
  valorParcela?: number;
  desconto?: Desconto;
  juros?: Juros;
  multa?: Multa;
  dadosCartao?: DadosCartao;
  dadosPortadorCartao?: DadosPortadorCartao;
  ipRemoto?: string;
}

export interface DadosPreAutorizacao {
  clienteId: string;
  valor: number;
  descricao?: string;
  referencia?: string;
  dadosCartao: DadosCartao;
  dadosPortadorCartao: DadosPortadorCartao;
}

export interface StatusPagamento {
  id: string;
  status: 'PENDING' | 'AWAITING_PAYMENT' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'CANCELLED';
  valor: number;
  valorLiquido?: number;
  dataVencimento: string;
  dataPagamento?: string;
  dataConfirmacao?: string;
  tipoPagamento: string;
  descricao?: string;
  referencia?: string;
  linkBoleto?: string;
  linkPagamento?: string;
  qrCodePix?: string;
  pixCopiaECola?: string;
  cliente: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface WebhookPagamento {
  event: string;
  payment: {
    id: string;
    customer: string;
    paymentLink?: string;
    value: number;
    netValue?: number;
    originalValue?: number;
    interestValue?: number;
    description?: string;
    billingType: string;
    status: string;
    pixTransaction?: string;
    confirmedDate?: string;
    paymentDate?: string;
    clientPaymentDate?: string;
    installmentNumber?: number;
    invoiceUrl?: string;
    bankSlipUrl?: string;
    transactionReceiptUrl?: string;
    invoiceNumber?: string;
    externalReference?: string;
    originalDueDate?: string;
    paymentFee?: number;
    deleted?: boolean;
    anticipated?: boolean;
    anticipable?: boolean;
  };
}

export interface ResultadoPagamento {
  sucesso: boolean;
  dados?: StatusPagamento;
  erro?: string;
  codigoErro?: string;
}

export interface ResultadoPreAutorizacao {
  sucesso: boolean;
  dados?: {
    id: string;
    status: string;
    valor: number;
    dataExpiracao: string;
  };
  erro?: string;
  codigoErro?: string;
}

// Enums para facilitar o uso
export enum TipoPagamento {
  BOLETO = 'BOLETO',
  CARTAO_CREDITO = 'CREDIT_CARD',
  PIX = 'PIX'
}

export enum StatusPagamentoEnum {
  PENDENTE = 'PENDING',
  AGUARDANDO_PAGAMENTO = 'AWAITING_PAYMENT',
  RECEBIDO = 'RECEIVED',
  CONFIRMADO = 'CONFIRMED',
  VENCIDO = 'OVERDUE',
  ESTORNADO = 'REFUNDED',
  CANCELADO = 'CANCELLED'
}

export enum TipoDesconto {
  VALOR_FIXO = 'FIXED',
  PERCENTUAL = 'PERCENTAGE'
}

export enum EventoWebhook {
  PAGAMENTO_CRIADO = 'PAYMENT_CREATED',
  AGUARDANDO_PAGAMENTO = 'PAYMENT_AWAITING_PAYMENT',
  PAGAMENTO_RECEBIDO = 'PAYMENT_RECEIVED',
  PAGAMENTO_CONFIRMADO = 'PAYMENT_CONFIRMED',
  PAGAMENTO_VENCIDO = 'PAYMENT_OVERDUE',
  PAGAMENTO_DELETADO = 'PAYMENT_DELETED',
  PAGAMENTO_RESTAURADO = 'PAYMENT_RESTORED',
  PAGAMENTO_ESTORNADO = 'PAYMENT_REFUNDED'
}