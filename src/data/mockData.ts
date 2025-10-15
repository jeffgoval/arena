/**
 * Mock Data
 * Centralized mock data for development and testing
 */

import { Crown, Star, Shield } from "lucide-react";

/**
 * Court Types and Interfaces
 */
export type CourtType = "society" | "poliesportiva" | "beach-tennis" | "volei" | "futsal";
export type CourtStatus = "active" | "inactive" | "maintenance";

export interface Court {
  id: number;
  name: string;
  type: CourtType;
  status: CourtStatus;
  image?: string;
  description?: string;
  capacity: number;
  features: {
    covered: boolean;
    lighting: boolean;
    lockerRoom: boolean;
    parking: boolean;
  };
  workingHours: {
    [key: string]: {
      enabled: boolean;
      open: string;
      close: string;
    };
  };
  occupancy?: number;
}

export interface CourtPrice {
  courtId: number;
  timeSlot: string;
  casual: number;
  monthly: number;
  isPeak?: boolean;
}

/**
 * Time Block Types and Interfaces
 */
export type TimeBlockType = "maintenance" | "private-event" | "holiday" | "other";
export type TimeBlockStatus = "active" | "past" | "canceled";
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export interface TimeBlock {
  id: number;
  courtId: number;
  courtName: string;
  type: TimeBlockType;
  status: TimeBlockStatus;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  description?: string;
  recurrence: RecurrenceType;
  createdAt: string;
  createdBy: string;
}

/**
 * Mock Courts Data
 */
export const mockCourts: Court[] = [
  {
    id: 1,
    name: "Quadra 1 - Society",
    type: "society",
    status: "active",
    description: "Quadra de futebol society com grama sintética de alta qualidade",
    capacity: 10,
    features: {
      covered: true,
      lighting: true,
      lockerRoom: true,
      parking: true,
    },
    workingHours: {
      monday: { enabled: true, open: "06:00", close: "23:00" },
      tuesday: { enabled: true, open: "06:00", close: "23:00" },
      wednesday: { enabled: true, open: "06:00", close: "23:00" },
      thursday: { enabled: true, open: "06:00", close: "23:00" },
      friday: { enabled: true, open: "06:00", close: "23:00" },
      saturday: { enabled: true, open: "07:00", close: "22:00" },
      sunday: { enabled: true, open: "07:00", close: "20:00" },
    },
    occupancy: 85,
  },
  {
    id: 2,
    name: "Quadra 2 - Poliesportiva",
    type: "poliesportiva",
    status: "active",
    description: "Quadra poliesportiva para vôlei, basquete e futsal",
    capacity: 12,
    features: {
      covered: true,
      lighting: true,
      lockerRoom: true,
      parking: true,
    },
    workingHours: {
      monday: { enabled: true, open: "06:00", close: "23:00" },
      tuesday: { enabled: true, open: "06:00", close: "23:00" },
      wednesday: { enabled: true, open: "06:00", close: "23:00" },
      thursday: { enabled: true, open: "06:00", close: "23:00" },
      friday: { enabled: true, open: "06:00", close: "23:00" },
      saturday: { enabled: true, open: "07:00", close: "22:00" },
      sunday: { enabled: true, open: "07:00", close: "20:00" },
    },
    occupancy: 72,
  },
  {
    id: 3,
    name: "Quadra 3 - Beach Tennis",
    type: "beach-tennis",
    status: "active",
    description: "Quadra oficial de beach tennis com areia importada",
    capacity: 4,
    features: {
      covered: false,
      lighting: true,
      lockerRoom: true,
      parking: true,
    },
    workingHours: {
      monday: { enabled: true, open: "06:00", close: "22:00" },
      tuesday: { enabled: true, open: "06:00", close: "22:00" },
      wednesday: { enabled: true, open: "06:00", close: "22:00" },
      thursday: { enabled: true, open: "06:00", close: "22:00" },
      friday: { enabled: true, open: "06:00", close: "22:00" },
      saturday: { enabled: true, open: "07:00", close: "21:00" },
      sunday: { enabled: true, open: "07:00", close: "20:00" },
    },
    occupancy: 68,
  },
  {
    id: 4,
    name: "Quadra 4 - Society",
    type: "society",
    status: "maintenance",
    description: "Quadra de futebol society em manutenção",
    capacity: 10,
    features: {
      covered: false,
      lighting: true,
      lockerRoom: false,
      parking: true,
    },
    workingHours: {
      monday: { enabled: false, open: "06:00", close: "23:00" },
      tuesday: { enabled: false, open: "06:00", close: "23:00" },
      wednesday: { enabled: false, open: "06:00", close: "23:00" },
      thursday: { enabled: false, open: "06:00", close: "23:00" },
      friday: { enabled: false, open: "06:00", close: "23:00" },
      saturday: { enabled: false, open: "07:00", close: "22:00" },
      sunday: { enabled: false, open: "07:00", close: "20:00" },
    },
    occupancy: 0,
  },
];

/**
 * Mock Court Prices
 */
export const mockCourtPrices: CourtPrice[] = [
  // Quadra 1 - Society
  { courtId: 1, timeSlot: "06:00", casual: 80, monthly: 60, isPeak: false },
  { courtId: 1, timeSlot: "07:00", casual: 90, monthly: 70, isPeak: false },
  { courtId: 1, timeSlot: "08:00", casual: 100, monthly: 80, isPeak: false },
  { courtId: 1, timeSlot: "09:00", casual: 100, monthly: 80, isPeak: false },
  { courtId: 1, timeSlot: "10:00", casual: 90, monthly: 70, isPeak: false },
  { courtId: 1, timeSlot: "11:00", casual: 90, monthly: 70, isPeak: false },
  { courtId: 1, timeSlot: "12:00", casual: 100, monthly: 80, isPeak: false },
  { courtId: 1, timeSlot: "13:00", casual: 100, monthly: 80, isPeak: false },
  { courtId: 1, timeSlot: "14:00", casual: 110, monthly: 90, isPeak: false },
  { courtId: 1, timeSlot: "15:00", casual: 110, monthly: 90, isPeak: false },
  { courtId: 1, timeSlot: "16:00", casual: 120, monthly: 100, isPeak: false },
  { courtId: 1, timeSlot: "17:00", casual: 130, monthly: 110, isPeak: false },
  { courtId: 1, timeSlot: "18:00", casual: 150, monthly: 120, isPeak: true },
  { courtId: 1, timeSlot: "19:00", casual: 150, monthly: 120, isPeak: true },
  { courtId: 1, timeSlot: "20:00", casual: 150, monthly: 120, isPeak: true },
  { courtId: 1, timeSlot: "21:00", casual: 140, monthly: 110, isPeak: true },
  { courtId: 1, timeSlot: "22:00", casual: 130, monthly: 100, isPeak: false },
  
  // Quadra 2 - Poliesportiva
  { courtId: 2, timeSlot: "06:00", casual: 70, monthly: 50, isPeak: false },
  { courtId: 2, timeSlot: "07:00", casual: 80, monthly: 60, isPeak: false },
  { courtId: 2, timeSlot: "08:00", casual: 90, monthly: 70, isPeak: false },
  { courtId: 2, timeSlot: "09:00", casual: 90, monthly: 70, isPeak: false },
  { courtId: 2, timeSlot: "18:00", casual: 130, monthly: 100, isPeak: true },
  { courtId: 2, timeSlot: "19:00", casual: 130, monthly: 100, isPeak: true },
  { courtId: 2, timeSlot: "20:00", casual: 130, monthly: 100, isPeak: true },
  
  // Quadra 3 - Beach Tennis
  { courtId: 3, timeSlot: "06:00", casual: 60, monthly: 45, isPeak: false },
  { courtId: 3, timeSlot: "07:00", casual: 70, monthly: 55, isPeak: false },
  { courtId: 3, timeSlot: "18:00", casual: 110, monthly: 85, isPeak: true },
  { courtId: 3, timeSlot: "19:00", casual: 110, monthly: 85, isPeak: true },
  { courtId: 3, timeSlot: "20:00", casual: 110, monthly: 85, isPeak: true },
];

/**
 * Plan Interface
 */
export interface Plan {
  id: string;
  name: string;
  price: number;
  priceYearly: number;
  icon: typeof Crown | typeof Star | typeof Shield;
  color: string;
  bgColor: string;
  description: string;
  popular?: boolean;
  features: Array<{
    name: string;
    included: boolean;
    value?: string;
  }>;
  benefits: string[];
}

/**
 * Subscription Plans Mock Data
 */
export const mockPlans: Plan[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: 89.90,
    priceYearly: 899.90,
    icon: Shield,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    description: "Ideal para quem joga ocasionalmente",
    features: [
      { name: "Horas mensais incluídas", included: true, value: "4 horas" },
      { name: "Desconto em reservas adicionais", included: true, value: "10%" },
      { name: "Prioridade na reserva", included: false },
      { name: "Cancelamento gratuito", included: true, value: "48h antes" },
      { name: "Reservas simultâneas", included: true, value: "2" },
      { name: "Convidados por jogo", included: true, value: "10" },
      { name: "Programa de indicação", included: true },
      { name: "Suporte prioritário", included: false },
      { name: "Acesso a eventos exclusivos", included: false },
    ],
    benefits: [
      "4 horas de jogo por mês",
      "10% de desconto em horas extras",
      "Convide até 10 amigos por jogo",
    ],
  },
  {
    id: "silver",
    name: "Prata",
    price: 159.90,
    priceYearly: 1599.90,
    icon: Star,
    color: "text-slate-600",
    bgColor: "bg-slate-50 dark:bg-slate-950/20",
    popular: true,
    description: "Perfeito para jogadores regulares",
    features: [
      { name: "Horas mensais incluídas", included: true, value: "8 horas" },
      { name: "Desconto em reservas adicionais", included: true, value: "15%" },
      { name: "Prioridade na reserva", included: true, value: "Média" },
      { name: "Cancelamento gratuito", included: true, value: "24h antes" },
      { name: "Reservas simultâneas", included: true, value: "3" },
      { name: "Convidados por jogo", included: true, value: "15" },
      { name: "Programa de indicação", included: true },
      { name: "Suporte prioritário", included: true },
      { name: "Acesso a eventos exclusivos", included: false },
    ],
    benefits: [
      "8 horas de jogo por mês",
      "15% de desconto em horas extras",
      "Prioridade média nas reservas",
      "Suporte prioritário",
    ],
  },
  {
    id: "gold",
    name: "Ouro",
    price: 249.90,
    priceYearly: 2499.90,
    icon: Crown,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    description: "Para atletas que jogam frequentemente",
    features: [
      { name: "Horas mensais incluídas", included: true, value: "15 horas" },
      { name: "Desconto em reservas adicionais", included: true, value: "20%" },
      { name: "Prioridade na reserva", included: true, value: "Máxima" },
      { name: "Cancelamento gratuito", included: true, value: "2h antes" },
      { name: "Reservas simultâneas", included: true, value: "Ilimitado" },
      { name: "Convidados por jogo", included: true, value: "Ilimitado" },
      { name: "Programa de indicação", included: true },
      { name: "Suporte prioritário", included: true },
      { name: "Acesso a eventos exclusivos", included: true },
    ],
    benefits: [
      "15 horas de jogo por mês",
      "20% de desconto em horas extras",
      "Prioridade máxima nas reservas",
      "Cancelamento até 2h antes",
      "Reservas e convidados ilimitados",
      "Acesso VIP a eventos exclusivos",
    ],
  },
];

/**
 * Invite Data Interface
 */
export interface InviteData {
  id: string;
  organizer: {
    name: string;
    initials: string;
    rating: number;
  };
  game: {
    court: string;
    courtImage: string;
    date: string;
    time: string;
    duration: string;
    sport: string;
  };
  participants: {
    confirmed: number;
    total: number;
    avatars: string[];
  };
  pricing: {
    value: number;
    isRecurring: boolean;
    recurringDates?: string[];
  };
}

/**
 * Mock Invite Data
 */
export const mockInviteData: InviteData = {
  id: "inv_123",
  organizer: {
    name: "Carlos Silva",
    initials: "CS",
    rating: 4.8
  },
  game: {
    court: "Quadra 1 - Society",
    courtImage: "https://images.unsplash.com/photo-1680537732560-7dd5f9b1ed53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBzb2NjZXIlMjBjb3VydHxlbnwxfHx8fDE3NjAzODkxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "20 de Outubro de 2025",
    time: "19:00",
    duration: "1 hora",
    sport: "Futebol Society"
  },
  participants: {
    confirmed: 6,
    total: 10,
    avatars: ["CS", "AP", "RS", "MO"]
  },
  pricing: {
    value: 15,
    isRecurring: true,
    recurringDates: ["20/10", "27/10", "03/11", "10/11"]
  }
};

/**
 * Game Details Interface
 */
export interface GameDetails {
  court: string;
  date: string;
  time: string;
}

/**
 * Mock Game Details
 */
export const mockGameDetails: GameDetails = {
  court: "Quadra 1 - Society",
  date: "20/10/2025",
  time: "19:00"
};

/**
 * Participant Interface
 */
export interface Participant {
  id: number;
  name: string;
  initials: string;
}

/**
 * Mock Participants
 */
export const mockParticipants: Participant[] = [
  { id: 1, name: "João Santos", initials: "JS" },
  { id: 2, name: "Maria Oliveira", initials: "MO" },
  { id: 3, name: "Pedro Costa", initials: "PC" }
];

/**
 * Mock Time Blocks Data
 */
export const mockTimeBlocks: TimeBlock[] = [
  {
    id: 1,
    courtId: 1,
    courtName: "Quadra 1 - Society",
    type: "maintenance",
    status: "active",
    startDate: "2025-10-20",
    endDate: "2025-10-20",
    startTime: "08:00",
    endTime: "12:00",
    reason: "Manutenção preventiva da grama sintética",
    description: "Troca de areia e nivelamento da superfície",
    recurrence: "none",
    createdAt: "2025-10-14T10:00:00",
    createdBy: "Admin"
  },
  {
    id: 2,
    courtId: 2,
    courtName: "Quadra 2 - Poliesportiva",
    type: "private-event",
    status: "active",
    startDate: "2025-10-18",
    endDate: "2025-10-18",
    startTime: "14:00",
    endTime: "18:00",
    reason: "Evento corporativo - Empresa XYZ",
    description: "Torneio interno da empresa com coffee break",
    recurrence: "none",
    createdAt: "2025-10-10T14:30:00",
    createdBy: "Admin"
  },
  {
    id: 3,
    courtId: 3,
    courtName: "Quadra 3 - Beach Tennis",
    type: "holiday",
    status: "active",
    startDate: "2025-12-25",
    endDate: "2025-12-25",
    startTime: "00:00",
    endTime: "23:59",
    reason: "Natal - Arena fechada",
    description: "Fechamento por feriado nacional",
    recurrence: "none",
    createdAt: "2025-10-01T09:00:00",
    createdBy: "Admin"
  },
  {
    id: 4,
    courtId: 1,
    courtName: "Quadra 1 - Society",
    type: "maintenance",
    status: "active",
    startDate: "2025-10-21",
    endDate: "2025-10-27",
    startTime: "06:00",
    endTime: "08:00",
    reason: "Manutenção do sistema de iluminação",
    description: "Troca de lâmpadas LED e revisão elétrica",
    recurrence: "daily",
    createdAt: "2025-10-12T16:00:00",
    createdBy: "Admin"
  },
  {
    id: 5,
    courtId: 4,
    courtName: "Quadra 4 - Society",
    type: "maintenance",
    status: "active",
    startDate: "2025-10-15",
    endDate: "2025-10-30",
    startTime: "00:00",
    endTime: "23:59",
    reason: "Reforma completa da quadra",
    description: "Troca completa do piso e pintura das marcações",
    recurrence: "none",
    createdAt: "2025-10-01T08:00:00",
    createdBy: "Admin"
  },
  {
    id: 6,
    courtId: 2,
    courtName: "Quadra 2 - Poliesportiva",
    type: "other",
    status: "active",
    startDate: "2025-10-16",
    endDate: "2025-10-16",
    startTime: "19:00",
    endTime: "22:00",
    reason: "Campeonato interno de vôlei",
    description: "Final do campeonato - entrada gratuita",
    recurrence: "none",
    createdAt: "2025-10-08T11:00:00",
    createdBy: "Admin"
  },
  {
    id: 7,
    courtId: 1,
    courtName: "Quadra 1 - Society",
    type: "maintenance",
    status: "past",
    startDate: "2025-10-10",
    endDate: "2025-10-10",
    startTime: "10:00",
    endTime: "14:00",
    reason: "Limpeza geral",
    description: "Higienização completa da quadra e vestiários",
    recurrence: "none",
    createdAt: "2025-10-05T13:00:00",
    createdBy: "Admin"
  }
];

/**
 * Referral Program Types and Interfaces
 */
export type ReferralStatus = "pending" | "active" | "rewarded" | "expired";

export interface Referral {
  id: number;
  referrerName: string;
  referrerId: number;
  referredName: string;
  referredEmail: string;
  referredPhone?: string;
  status: ReferralStatus;
  referralCode: string;
  signupDate?: string;
  firstBookingDate?: string;
  rewardAmount: number;
  rewardClaimed: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  totalRewardsEarned: number;
  conversionRate: number;
}

/**
 * Mock Referrals Data
 */
export const mockReferrals: Referral[] = [
  {
    id: 1,
    referrerName: "Carlos Silva",
    referrerId: 1,
    referredName: "João Mendes",
    referredEmail: "joao@email.com",
    referredPhone: "(11) 98888-7777",
    status: "rewarded",
    referralCode: "CARLOS2024",
    signupDate: "2025-09-15",
    firstBookingDate: "2025-09-20",
    rewardAmount: 40,
    rewardClaimed: true,
    createdAt: "2025-09-10T10:00:00"
  },
  {
    id: 2,
    referrerName: "Carlos Silva",
    referrerId: 1,
    referredName: "Maria Santos",
    referredEmail: "maria.santos@email.com",
    referredPhone: "(11) 97777-6666",
    status: "rewarded",
    referralCode: "CARLOS2024",
    signupDate: "2025-09-25",
    firstBookingDate: "2025-09-28",
    rewardAmount: 40,
    rewardClaimed: true,
    createdAt: "2025-09-20T14:30:00"
  },
  {
    id: 3,
    referrerName: "Carlos Silva",
    referrerId: 1,
    referredName: "Pedro Costa",
    referredEmail: "pedro.costa@email.com",
    status: "active",
    referralCode: "CARLOS2024",
    signupDate: "2025-10-01",
    firstBookingDate: "2025-10-05",
    rewardAmount: 40,
    rewardClaimed: true,
    createdAt: "2025-09-28T16:00:00"
  },
  {
    id: 4,
    referrerName: "Carlos Silva",
    referrerId: 1,
    referredName: "Ana Oliveira",
    referredEmail: "ana.oliveira@email.com",
    status: "pending",
    referralCode: "CARLOS2024",
    signupDate: "2025-10-10",
    rewardAmount: 40,
    rewardClaimed: false,
    expiresAt: "2025-11-10",
    createdAt: "2025-10-08T09:00:00"
  },
  {
    id: 5,
    referrerName: "Ana Paula",
    referrerId: 2,
    referredName: "Lucas Ferreira",
    referredEmail: "lucas@email.com",
    status: "rewarded",
    referralCode: "ANA2024",
    signupDate: "2025-09-20",
    firstBookingDate: "2025-09-22",
    rewardAmount: 40,
    rewardClaimed: true,
    createdAt: "2025-09-18T11:30:00"
  },
  {
    id: 6,
    referrerName: "Roberto Santos",
    referrerId: 3,
    referredName: "Fernanda Lima",
    referredEmail: "fernanda@email.com",
    status: "pending",
    referralCode: "ROBERTO2024",
    signupDate: "2025-10-12",
    rewardAmount: 40,
    rewardClaimed: false,
    expiresAt: "2025-11-12",
    createdAt: "2025-10-12T15:00:00"
  }
];

/**
 * WhatsApp Template Types and Interfaces
 */
export type TemplateCategory = 
  | "confirmation" 
  | "reminder" 
  | "invite" 
  | "cancellation" 
  | "payment" 
  | "promotional" 
  | "welcome" 
  | "other";

export type TemplateStatus = "active" | "inactive" | "draft";

export interface WhatsAppVariable {
  key: string;
  label: string;
  example: string;
  description: string;
}

export interface WhatsAppTemplate {
  id: number;
  name: string;
  category: TemplateCategory;
  status: TemplateStatus;
  message: string;
  variables: string[];
  usageCount: number;
  lastUsed?: string;
  createdAt: string;
  updatedBy: string;
}

/**
 * Available template variables
 */
export const TEMPLATE_VARIABLES: WhatsAppVariable[] = [
  { key: "{nome}", label: "Nome do Cliente", example: "Carlos Silva", description: "Nome completo do cliente" },
  { key: "{primeiro_nome}", label: "Primeiro Nome", example: "Carlos", description: "Primeiro nome do cliente" },
  { key: "{quadra}", label: "Nome da Quadra", example: "Quadra 1 - Society", description: "Nome completo da quadra" },
  { key: "{data}", label: "Data", example: "15/10/2025", description: "Data da reserva (dd/mm/yyyy)" },
  { key: "{dia_semana}", label: "Dia da Semana", example: "Segunda-feira", description: "Dia da semana por extenso" },
  { key: "{horario}", label: "Horário", example: "19:00", description: "Horário da reserva" },
  { key: "{valor}", label: "Valor", example: "R$ 120,00", description: "Valor da reserva" },
  { key: "{codigo_reserva}", label: "Código da Reserva", example: "#12345", description: "Número identificador da reserva" },
  { key: "{link_pagamento}", label: "Link de Pagamento", example: "arena.com/pay/123", description: "Link para pagamento online" },
  { key: "{saldo}", label: "Saldo", example: "R$ 50,00", description: "Saldo disponível do cliente" },
  { key: "{endereco}", label: "Endereço", example: "Rua das Flores, 123", description: "Endereço da arena" },
  { key: "{telefone}", label: "Telefone", example: "(11) 98765-4321", description: "Telefone de contato da arena" },
];

/**
 * Mock WhatsApp Templates
 */
export const mockWhatsAppTemplates: WhatsAppTemplate[] = [
  {
    id: 1,
    name: "Confirmação de Reserva",
    category: "confirmation",
    status: "active",
    message: "✅ *Reserva Confirmada!*\n\nOlá, {primeiro_nome}! 👋\n\nSua reserva foi confirmada com sucesso:\n\n🏟️ *Quadra:* {quadra}\n📅 *Data:* {data} ({dia_semana})\n⏰ *Horário:* {horario}\n💰 *Valor:* {valor}\n🔖 *Código:* {codigo_reserva}\n\nNos vemos em quadra! ⚽🎾\n\n_Arena Dona Santa_\n📍 {endereco}\n📞 {telefone}",
    variables: ["{primeiro_nome}", "{quadra}", "{data}", "{dia_semana}", "{horario}", "{valor}", "{codigo_reserva}", "{endereco}", "{telefone}"],
    usageCount: 245,
    lastUsed: "2025-10-14T10:30:00",
    createdAt: "2025-09-01T09:00:00",
    updatedBy: "Admin"
  },
  {
    id: 2,
    name: "Lembrete de Jogo - 24h",
    category: "reminder",
    status: "active",
    message: "⏰ *Lembrete de Jogo*\n\nOlá, {primeiro_nome}!\n\nSeu jogo está chegando! 🏃‍♂️\n\n🏟️ *Quadra:* {quadra}\n📅 *Amanhã:* {data}\n⏰ *Horário:* {horario}\n\nNão esqueça de chegar 10 minutos antes para se preparar! 💪\n\nTe esperamos!\n\n_Arena Dona Santa_",
    variables: ["{primeiro_nome}", "{quadra}", "{data}", "{horario}"],
    usageCount: 189,
    lastUsed: "2025-10-13T18:00:00",
    createdAt: "2025-09-01T09:15:00",
    updatedBy: "Admin"
  },
  {
    id: 3,
    name: "Convite para Jogo",
    category: "invite",
    status: "active",
    message: "🎮 *Convite para Jogar!*\n\nE aí, {primeiro_nome}! Bora jogar? ⚽\n\n{nome} está te convidando para um jogo:\n\n🏟️ *Quadra:* {quadra}\n📅 *Data:* {data}\n⏰ *Horário:* {horario}\n💰 *Valor:* {valor} por pessoa\n\nConfirma sua presença respondendo esta mensagem! 🙋‍♂️\n\n_Arena Dona Santa_",
    variables: ["{primeiro_nome}", "{nome}", "{quadra}", "{data}", "{horario}", "{valor}"],
    usageCount: 412,
    lastUsed: "2025-10-14T15:20:00",
    createdAt: "2025-09-01T09:30:00",
    updatedBy: "Admin"
  },
  {
    id: 4,
    name: "Cancelamento de Reserva",
    category: "cancellation",
    status: "active",
    message: "❌ *Reserva Cancelada*\n\nOlá, {primeiro_nome},\n\nSua reserva foi cancelada:\n\n🏟️ *Quadra:* {quadra}\n📅 *Data:* {data}\n⏰ *Horário:* {horario}\n🔖 *Código:* {codigo_reserva}\n\nSe o cancelamento foi feito com antecedência, o valor será devolvido ao seu saldo em até 24h.\n\n💰 *Saldo atual:* {saldo}\n\nQualquer dúvida, estamos à disposição!\n\n_Arena Dona Santa_\n📞 {telefone}",
    variables: ["{primeiro_nome}", "{quadra}", "{data}", "{horario}", "{codigo_reserva}", "{saldo}", "{telefone}"],
    usageCount: 67,
    lastUsed: "2025-10-12T11:45:00",
    createdAt: "2025-09-01T09:45:00",
    updatedBy: "Admin"
  },
  {
    id: 5,
    name: "Cobrança Pendente",
    category: "payment",
    status: "active",
    message: "💳 *Pagamento Pendente*\n\nOlá, {primeiro_nome}!\n\nIdentificamos um pagamento pendente:\n\n🏟️ *Quadra:* {quadra}\n📅 *Data:* {data}\n💰 *Valor:* {valor}\n\n🔗 Pague agora pelo link:\n{link_pagamento}\n\nOu compareça na arena para efetuar o pagamento.\n\n_Arena Dona Santa_\n📞 {telefone}",
    variables: ["{primeiro_nome}", "{quadra}", "{data}", "{valor}", "{link_pagamento}", "{telefone}"],
    usageCount: 34,
    lastUsed: "2025-10-11T16:00:00",
    createdAt: "2025-09-01T10:00:00",
    updatedBy: "Admin"
  },
  {
    id: 6,
    name: "Promoção de Fim de Semana",
    category: "promotional",
    status: "active",
    message: "🎉 *PROMOÇÃO ESPECIAL!*\n\nOlá, {primeiro_nome}! 🌟\n\nNeste final de semana temos uma super promoção:\n\n⚡ *30% OFF* em todas as reservas!\n📅 Válido: Sábado e Domingo\n⏰ Horários: 08h às 12h\n\nNão perca! Vagas limitadas! 🏃‍♂️\n\nReserve agora:\n📞 {telefone}\n📍 {endereco}\n\n_Arena Dona Santa_",
    variables: ["{primeiro_nome}", "{telefone}", "{endereco}"],
    usageCount: 156,
    lastUsed: "2025-10-10T09:00:00",
    createdAt: "2025-09-15T08:00:00",
    updatedBy: "Admin"
  },
  {
    id: 7,
    name: "Boas-vindas Novo Cliente",
    category: "welcome",
    status: "active",
    message: "🎊 *Bem-vindo à Arena Dona Santa!*\n\nOlá, {primeiro_nome}! 👋\n\nÉ um prazer ter você aqui! 🏟️\n\nAproveite seu *BÔNUS DE BOAS-VINDAS*:\n🎁 R$ 20,00 de crédito na sua primeira reserva!\n\nNossas quadras:\n⚽ Futebol Society\n🎾 Beach Tennis\n🏐 Poliesportiva\n\nFaça sua primeira reserva:\n📞 {telefone}\n📍 {endereco}\n\nVamos jogar! 💪\n\n_Arena Dona Santa_",
    variables: ["{primeiro_nome}", "{telefone}", "{endereco}"],
    usageCount: 89,
    lastUsed: "2025-10-14T12:00:00",
    createdAt: "2025-09-01T10:30:00",
    updatedBy: "Admin"
  },
  {
    id: 8,
    name: "Lembrete 2 Horas Antes",
    category: "reminder",
    status: "active",
    message: "⚡ *Seu jogo é daqui a 2 horas!*\n\nOlá, {primeiro_nome}! ⏰\n\nPreparando a chuteira? 👟\n\n🏟️ *{quadra}*\n⏰ *{horario}*\n\nVoc�� está a tempo de:\n✅ Fazer um lanche leve\n✅ Separar seu material\n✅ Chamar um amigo de última hora\n\nTe esperamos! 🎯\n\n_Arena Dona Santa_\n📍 {endereco}",
    variables: ["{primeiro_nome}", "{quadra}", "{horario}", "{endereco}"],
    usageCount: 203,
    lastUsed: "2025-10-14T17:00:00",
    createdAt: "2025-09-05T14:00:00",
    updatedBy: "Admin"
  },
  {
    id: 9,
    name: "Pagamento Confirmado",
    category: "payment",
    status: "active",
    message: "✅ *Pagamento Confirmado!*\n\nOlá, {primeiro_nome}! 💚\n\nSeu pagamento foi confirmado:\n\n💰 *Valor:* {valor}\n🔖 *Código:* {codigo_reserva}\n📅 *Data do jogo:* {data} às {horario}\n\n💵 *Saldo atual:* {saldo}\n\nEstá tudo certo para seu jogo!\n\nNos vemos em breve! ⚽\n\n_Arena Dona Santa_",
    variables: ["{primeiro_nome}", "{valor}", "{codigo_reserva}", "{data}", "{horario}", "{saldo}"],
    usageCount: 178,
    lastUsed: "2025-10-14T14:30:00",
    createdAt: "2025-09-01T11:00:00",
    updatedBy: "Admin"
  },
  {
    id: 10,
    name: "Aniversário Cliente",
    category: "promotional",
    status: "draft",
    message: "🎂 *FELIZ ANIVERSÁRIO!* 🎉\n\nParabéns, {primeiro_nome}! 🎈\n\nA Arena Dona Santa deseja um dia incrível! 🌟\n\nE para comemorar, você ganhou:\n🎁 *50% OFF* na sua próxima reserva!\n\nVálido por 30 dias!\n\nComemore jogando com os amigos! ⚽🎾\n\n_Arena Dona Santa_\n📞 {telefone}",
    variables: ["{primeiro_nome}", "{telefone}"],
    usageCount: 0,
    createdAt: "2025-10-12T10:00:00",
    updatedBy: "Admin"
  }
];
