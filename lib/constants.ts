// User Types
export const USER_TYPES = {
  ORGANIZER: 'organizer',
  GUEST: 'guest',
  MANAGER: 'manager',
  BOTH: 'both',
} as const

// Reservation Types
export const RESERVATION_TYPES = {
  SINGLE: 'single',
  MONTHLY: 'monthly',
  RECURRING: 'recurring',
} as const

// Reservation Status
export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const

// Payment Methods
export const PAYMENT_METHODS = {
  PIX: 'pix',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BALANCE: 'balance',
  COLLATERAL: 'collateral',
} as const

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

// Split Modes
export const SPLIT_MODES = {
  PERCENTAGE: 'percentage',
  FIXED_VALUE: 'fixed_value',
} as const

// Invitation Status
export const INVITATION_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  EXPIRED: 'expired',
} as const

// Review Ratings
export const REVIEW_RATINGS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  REGULAR: 'regular',
  POOR: 'poor',
} as const

// Participant Source
export const PARTICIPANT_SOURCE = {
  TEAM: 'team',
  INVITE: 'invite',
} as const

// Court Status
export const COURT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

// Schedule Status
export const SCHEDULE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

// Days of Week
export const DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const

// Business Rules
export const BUSINESS_RULES = {
  MIN_ADVANCE_HOURS: 1, // Minimum hours in advance for reservation (RN-001)
  MAX_DEBT_ALLOWED: 200, // Maximum debt in BRL to make new reservations (RN-006)
  OBSERVATION_MAX_LENGTH: 500, // Max characters for reservation observations (RN-007)
  GAME_CLOSE_HOURS: 2, // Hours before game when it closes (RN-022, RN-027)
  CANCELLATION_FULL_REFUND_HOURS: 24, // Hours for 100% refund (RN-043)
  CANCELLATION_HALF_REFUND_HOURS: 12, // Hours for 50% refund (RN-044)
  REFERRAL_BONUS: 10, // Referral bonus in BRL (RN-036)
  REFERRAL_DISCOUNT_PERCENTAGE: 10, // Discount percentage for referred user (RN-037)
  MONTHLY_BILLING_DAY: 25, // Default day for monthly billing (RN-004)
} as const

// Contact Information
export const ARENA_CONTACT = {
  PHONE: process.env.NEXT_PUBLIC_ARENA_PHONE || '(33) 99158-0013',
  EMAIL: process.env.NEXT_PUBLIC_ARENA_EMAIL || 'contato@arenadonasanta.com.br',
  INSTAGRAM: process.env.NEXT_PUBLIC_ARENA_INSTAGRAM || '@arenadonasanta',
  ADDRESS: process.env.NEXT_PUBLIC_ARENA_ADDRESS || 'Governador Valadares, MG',
} as const

// App Configuration
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Arena Dona Santa',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const
