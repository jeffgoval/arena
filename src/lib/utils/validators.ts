/**
 * Validadores de dados do cliente
 */

/**
 * Valida um CPF brasileiro
 * @param cpf - CPF a ser validado (com ou sem formatação)
 * @returns true se o CPF é válido, false caso contrário
 */
export function validarCPF(cpf: string): boolean {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  // Validação dos dígitos verificadores
  let soma = 0;
  let resto;

  // Valida primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

  // Valida segundo dígito verificador
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

  return true;
}

/**
 * Formata um CPF para o padrão brasileiro (XXX.XXX.XXX-XX)
 * @param cpf - CPF a ser formatado
 * @returns CPF formatado
 */
export function formatarCPF(cpf: string): string {
  if (!cpf) return '';
  
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length <= 3) return cpfLimpo;
  if (cpfLimpo.length <= 6) return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3)}`;
  if (cpfLimpo.length <= 9) return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6)}`;
  
  return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6, 9)}-${cpfLimpo.slice(9, 11)}`;
}

/**
 * Remove a formatação de um CPF
 * @param cpf - CPF formatado
 * @returns CPF sem formatação (apenas números)
 */
export function limparCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

/**
 * Valida um email
 * @param email - Email a ser validado
 * @returns true se o email é válido, false caso contrário
 */
export function validarEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida um telefone brasileiro
 * @param telefone - Telefone a ser validado (com ou sem formatação)
 * @returns true se o telefone é válido, false caso contrário
 */
export function validarTelefone(telefone: string): boolean {
  if (!telefone) return false;
  
  const telefoneLimpo = telefone.replace(/\D/g, '');
  
  // Aceita telefones com 10 ou 11 dígitos (com DDD)
  return telefoneLimpo.length === 10 || telefoneLimpo.length === 11;
}

/**
 * Formata um telefone para o padrão brasileiro
 * @param telefone - Telefone a ser formatado
 * @returns Telefone formatado
 */
export function formatarTelefone(telefone: string): string {
  if (!telefone) return '';
  
  const telefoneLimpo = telefone.replace(/\D/g, '');
  
  if (telefoneLimpo.length <= 2) return `(${telefoneLimpo}`;
  if (telefoneLimpo.length <= 6) return `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2)}`;
  if (telefoneLimpo.length <= 10) {
    return `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2, 6)}-${telefoneLimpo.slice(6)}`;
  }
  
  return `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2, 7)}-${telefoneLimpo.slice(7, 11)}`;
}
