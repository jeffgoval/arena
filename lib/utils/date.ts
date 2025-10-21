import { format, parseISO, addHours, differenceInHours, addDays, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Format date to Brazilian format (dd/MM/yyyy)
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR })
}

/**
 * Format time to HH:mm
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'HH:mm')
}

/**
 * Format datetime to Brazilian format (dd/MM/yyyy HH:mm)
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

/**
 * Format date to day of week (Segunda, Terça, etc)
 */
export function formatDayOfWeek(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'EEEE', { locale: ptBR })
}

/**
 * Format date to short day of week (Seg, Ter, etc)
 */
export function formatShortDayOfWeek(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'EEE', { locale: ptBR })
}

/**
 * Check if reservation is within minimum advance time (Business Rule RN-001)
 */
export function isWithinMinimumAdvance(reservationDate: Date | string, minimumHours: number = 1): boolean {
  const dateObj = typeof reservationDate === 'string' ? parseISO(reservationDate) : reservationDate
  const now = new Date()
  const minDate = addHours(now, minimumHours)

  return isAfter(dateObj, minDate)
}

/**
 * Calculate hours until a date
 */
export function hoursUntil(date: Date | string): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return differenceInHours(dateObj, new Date())
}

/**
 * Check if game is closed (2 hours before - Business Rule RN-022, RN-027)
 */
export function isGameClosed(gameDate: Date | string, closeHours: number = 2): boolean {
  return hoursUntil(gameDate) <= closeHours
}

/**
 * Get cancellation refund percentage based on hours until game
 * Business Rules: RN-043, RN-044, RN-045
 */
export function getCancellationRefundPercentage(gameDate: Date | string): number {
  const hours = hoursUntil(gameDate)

  if (hours >= 24) return 100 // Full refund
  if (hours >= 12 && hours < 24) return 50 // Half refund
  return 0 // No refund
}

/**
 * Add days to a date
 */
export function addDaysToDate(date: Date | string, days: number): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return addDays(dateObj, days)
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const today = new Date()

  return format(dateObj, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isBefore(dateObj, new Date())
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isAfter(dateObj, new Date())
}

/**
 * Get start of day
 */
export function getStartOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return startOfDay(dateObj)
}

/**
 * Get end of day
 */
export function getEndOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return endOfDay(dateObj)
}
