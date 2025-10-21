/**
 * Remove non-numeric characters from string
 */
export function cleanNumericString(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Format CPF: 123.456.789-00
 */
export function formatCPF(cpf: string): string {
  const cleaned = cleanNumericString(cpf)

  if (cleaned.length !== 11) return cpf

  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Validate CPF (Brazilian Tax ID)
 * Business Rule: RN-049 - CPF must be unique
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cleanNumericString(cpf)

  // Check if has 11 digits
  if (cleaned.length !== 11) return false

  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cleaned)) return false

  // Validate first digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cleaned.charAt(9))) return false

  // Validate second digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cleaned.charAt(10))) return false

  return true
}

/**
 * Format RG: 12.345.678-9
 */
export function formatRG(rg: string): string {
  const cleaned = cleanNumericString(rg)

  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
  }

  // RG can have different lengths depending on state
  return rg
}

/**
 * Validate RG (Brazilian ID)
 * Business Rule: RN-049 - RG must be unique
 * Note: RG validation varies by state, this is a basic check
 */
export function validateRG(rg: string): boolean {
  const cleaned = cleanNumericString(rg)

  // Basic validation: must have between 7 and 9 digits
  return cleaned.length >= 7 && cleaned.length <= 9
}

/**
 * Format phone number: (33) 99158-0013
 */
export function formatPhone(phone: string): string {
  const cleaned = cleanNumericString(phone)

  // Mobile with 9 digits
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  // Landline with 8 digits
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  return phone
}

/**
 * Validate Brazilian phone number
 */
export function validatePhone(phone: string): boolean {
  const cleaned = cleanNumericString(phone)

  // Must be 10 (landline) or 11 (mobile) digits
  return cleaned.length === 10 || cleaned.length === 11
}

/**
 * Format CEP (Brazilian ZIP code): 12345-678
 */
export function formatCEP(cep: string): string {
  const cleaned = cleanNumericString(cep)

  if (cleaned.length !== 8) return cep

  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
}

/**
 * Validate CEP
 */
export function validateCEP(cep: string): boolean {
  const cleaned = cleanNumericString(cep)
  return cleaned.length === 8
}
