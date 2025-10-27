// Utilitários para logging com mascaramento de dados sensíveis

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  component: string;
  action: string;
  userId?: string;
  data?: any;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

/**
 * Mascara CPF mostrando apenas os 3 primeiros e 2 últimos dígitos
 * Exemplo: 123.456.789-10 -> 123.***.***-10
 */
export function mascaraCPF(cpf: string): string {
  if (!cpf) return '';
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) return '***';
  return `${cpfLimpo.substring(0, 3)}.***.***-${cpfLimpo.substring(9)}`;
}

/**
 * Mascara número de cartão mostrando apenas os 4 últimos dígitos
 * Exemplo: 1234567890123456 -> ************3456
 */
export function mascaraCartao(numero: string): string {
  if (!numero) return '';
  const numeroLimpo = numero.replace(/\D/g, '');
  if (numeroLimpo.length < 4) return '****';
  return '*'.repeat(numeroLimpo.length - 4) + numeroLimpo.slice(-4);
}

/**
 * Mascara email mostrando apenas primeira letra e domínio
 * Exemplo: usuario@email.com -> u*****@email.com
 */
export function mascaraEmail(email: string): string {
  if (!email || !email.includes('@')) return '***';
  const [local, dominio] = email.split('@');
  return `${local[0]}${'*'.repeat(local.length - 1)}@${dominio}`;
}

/**
 * Mascara telefone mostrando apenas os 2 últimos dígitos
 * Exemplo: (11) 98765-4321 -> (11) ****-**21
 */
export function mascaraTelefone(telefone: string): string {
  if (!telefone) return '';
  const telefoneLimpo = telefone.replace(/\D/g, '');
  if (telefoneLimpo.length < 2) return '**';
  return `****-**${telefoneLimpo.slice(-2)}`;
}

/**
 * Remove dados sensíveis de um objeto para logging
 */
export function sanitizarDadosParaLog(dados: any): any {
  if (!dados) return dados;
  
  const dadosSanitizados = { ...dados };
  
  // Mascarar CPF/CNPJ
  if (dadosSanitizados.cpf) dadosSanitizados.cpf = mascaraCPF(dadosSanitizados.cpf);
  if (dadosSanitizados.cpfCnpj) dadosSanitizados.cpfCnpj = mascaraCPF(dadosSanitizados.cpfCnpj);
  
  // Mascarar email
  if (dadosSanitizados.email) dadosSanitizados.email = mascaraEmail(dadosSanitizados.email);
  
  // Mascarar telefones
  if (dadosSanitizados.telefone) dadosSanitizados.telefone = mascaraTelefone(dadosSanitizados.telefone);
  if (dadosSanitizados.celular) dadosSanitizados.celular = mascaraTelefone(dadosSanitizados.celular);
  if (dadosSanitizados.phone) dadosSanitizados.phone = mascaraTelefone(dadosSanitizados.phone);
  if (dadosSanitizados.mobilePhone) dadosSanitizados.mobilePhone = mascaraTelefone(dadosSanitizados.mobilePhone);
  
  // Remover completamente dados de cartão
  if (dadosSanitizados.creditCard) {
    dadosSanitizados.creditCard = {
      holderName: dadosSanitizados.creditCard.holderName || '***',
      number: mascaraCartao(dadosSanitizados.creditCard.number || ''),
      expiryMonth: '**',
      expiryYear: '****',
      ccv: '***'
    };
  }
  
  if (dadosSanitizados.dadosCartao) {
    dadosSanitizados.dadosCartao = {
      nomePortador: dadosSanitizados.dadosCartao.nomePortador || '***',
      numero: mascaraCartao(dadosSanitizados.dadosCartao.numero || ''),
      mesVencimento: '**',
      anoVencimento: '****',
      codigoSeguranca: '***'
    };
  }
  
  // Mascarar dados do portador do cartão
  if (dadosSanitizados.creditCardHolderInfo) {
    dadosSanitizados.creditCardHolderInfo = {
      ...dadosSanitizados.creditCardHolderInfo,
      cpfCnpj: mascaraCPF(dadosSanitizados.creditCardHolderInfo.cpfCnpj || ''),
      email: mascaraEmail(dadosSanitizados.creditCardHolderInfo.email || ''),
      phone: mascaraTelefone(dadosSanitizados.creditCardHolderInfo.phone || ''),
      mobilePhone: mascaraTelefone(dadosSanitizados.creditCardHolderInfo.mobilePhone || '')
    };
  }
  
  if (dadosSanitizados.dadosPortadorCartao) {
    dadosSanitizados.dadosPortadorCartao = {
      ...dadosSanitizados.dadosPortadorCartao,
      cpf: mascaraCPF(dadosSanitizados.dadosPortadorCartao.cpf || ''),
      email: mascaraEmail(dadosSanitizados.dadosPortadorCartao.email || ''),
      telefone: mascaraTelefone(dadosSanitizados.dadosPortadorCartao.telefone || ''),
      celular: mascaraTelefone(dadosSanitizados.dadosPortadorCartao.celular || '')
    };
  }
  
  return dadosSanitizados;
}

/**
 * Cria uma entrada de log estruturada
 */
export function criarLogEntry(
  level: 'info' | 'warn' | 'error',
  component: string,
  action: string,
  data?: any,
  error?: Error,
  userId?: string
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    component,
    action,
    userId
  };
  
  if (data) {
    entry.data = sanitizarDadosParaLog(data);
  }
  
  if (error) {
    entry.error = {
      message: error.message,
      stack: error.stack,
      code: (error as any).code
    };
  }
  
  return entry;
}

/**
 * Loga uma entrada estruturada no console
 */
export function logEntry(entry: LogEntry): void {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.component}]`;
  const message = `${prefix} ${entry.action}`;
  
  switch (entry.level) {
    case 'error':
      console.error(message, entry);
      break;
    case 'warn':
      console.warn(message, entry);
      break;
    default:
      console.log(message, entry);
  }
}

/**
 * Logger simplificado para uso rápido
 */
export const logger = {
  info: (component: string, action: string, data?: any, userId?: string) => {
    logEntry(criarLogEntry('info', component, action, data, undefined, userId));
  },
  
  warn: (component: string, action: string, data?: any, userId?: string) => {
    logEntry(criarLogEntry('warn', component, action, data, undefined, userId));
  },
  
  error: (component: string, action: string, error: Error, data?: any, userId?: string) => {
    logEntry(criarLogEntry('error', component, action, data, error, userId));
  }
};
