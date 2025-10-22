/**
 * Utilitários para CEP
 */

// Formatar CEP: 12345678 -> 12345-678
export function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{5})(\d)/, '$1-$2');
}

// Remover formatação
export function unformatCEP(value: string): string {
  return value.replace(/\D/g, '');
}

// Validar CEP (8 dígitos)
export function validateCEP(cep: string): boolean {
  const numbers = unformatCEP(cep);
  return numbers.length === 8;
}

// Buscar endereço por CEP via ViaCEP
export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // cidade
  uf: string; // estado
  erro?: boolean;
}

export async function fetchAddressByCEP(cep: string): Promise<ViaCEPResponse | null> {
  const numbers = unformatCEP(cep);

  if (!validateCEP(numbers)) {
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${numbers}/json/`);
    const data: ViaCEPResponse = await response.json();

    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}
