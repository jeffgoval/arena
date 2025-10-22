/**
 * Utilitários para telefone/WhatsApp
 */

// Formatar telefone: 11999999999 -> (11) 99999-9999
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 10) {
    // Telefone fixo: (11) 9999-9999
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // Celular: (11) 99999-9999
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
}

// Remover formatação
export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '');
}

// Validar telefone (mínimo 10 dígitos)
export function validatePhone(phone: string): boolean {
  const numbers = unformatPhone(phone);
  return numbers.length >= 10 && numbers.length <= 11;
}
