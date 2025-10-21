/**
 * Format number to Brazilian Real currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Parse Brazilian currency string to number
 * Example: "R$ 1.234,56" => 1234.56
 */
export function parseCurrency(value: string): number {
  // Remove currency symbol, dots (thousand separator) and replace comma with dot
  const cleaned = value
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  return parseFloat(cleaned) || 0
}

/**
 * Format number to Brazilian currency without symbol
 * Example: 1234.56 => "1.234,56"
 */
export function formatCurrencyValue(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Calculate percentage of a value
 */
export function calculatePercentage(total: number, percentage: number): number {
  return (total * percentage) / 100
}

/**
 * Calculate what percentage one value represents of another
 */
export function getPercentageOf(part: number, total: number): number {
  if (total === 0) return 0
  return (part / total) * 100
}
