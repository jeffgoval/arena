/**
 * Routes Configuration
 * Centralized route definitions for the application
 */

export const ROUTES = {
  LANDING: 'landing',
  LOGIN: 'login',
  CADASTRO: 'cadastro',
  BOOKING: 'booking',
  PAYMENT: 'payment',
  CLIENT_DASHBOARD: 'client-dashboard',
  USER_PROFILE: 'user-profile',
  TEAMS: 'teams',
  COURT_DETAILS: 'court-details',
  TRANSACTIONS: 'transactions',
  FAQ: 'faq',
  TERMS: 'terms',
  SETTINGS: 'settings',
  SUBSCRIPTION_PLANS: 'subscription-plans',
  SUBSCRIPTION_MANAGEMENT: 'subscription-management',
  INVITE_VIEW: 'invite-view',
  
  // Manager
  MANAGER_DASHBOARD: 'manager-dashboard',
  MANAGER_SCHEDULE: 'manager-schedule',
  MANAGER_COURTS: 'manager-courts',
  MANAGER_CLIENTS: 'manager-clients',
  MANAGER_REPORTS: 'manager-reports',
  MANAGER_SETTINGS: 'manager-settings',
  
  NOT_FOUND: '404',
} as const;

export type Page = typeof ROUTES[keyof typeof ROUTES];

export const PAGE_TITLES: Record<Page, string> = {
  [ROUTES.LANDING]: "Página inicial",
  [ROUTES.BOOKING]: "Nova reserva",
  [ROUTES.PAYMENT]: "Pagamento",
  [ROUTES.LOGIN]: "Login",
  [ROUTES.CADASTRO]: "Cadastro",
  [ROUTES.CLIENT_DASHBOARD]: "Dashboard do cliente",
  [ROUTES.INVITE_VIEW]: "Visualizar convite",
  [ROUTES.USER_PROFILE]: "Perfil do usuário",
  [ROUTES.TEAMS]: "Turmas",
  [ROUTES.COURT_DETAILS]: "Detalhes da quadra",
  [ROUTES.TRANSACTIONS]: "Histórico de transações",
  [ROUTES.FAQ]: "Perguntas frequentes",
  [ROUTES.TERMS]: "Termos de uso",
  [ROUTES.SETTINGS]: "Configurações",
  [ROUTES.SUBSCRIPTION_PLANS]: "Planos de assinatura",
  [ROUTES.SUBSCRIPTION_MANAGEMENT]: "Gerenciar assinatura",
  
  // Manager
  [ROUTES.MANAGER_DASHBOARD]: "Dashboard do Gestor",
  [ROUTES.MANAGER_SCHEDULE]: "Agenda",
  [ROUTES.MANAGER_COURTS]: "Quadras",
  [ROUTES.MANAGER_CLIENTS]: "Clientes",
  [ROUTES.MANAGER_REPORTS]: "Relatórios",
  [ROUTES.MANAGER_SETTINGS]: "Configurações",
  
  [ROUTES.NOT_FOUND]: "Página não encontrada",
};

/**
 * Routes that should show the header
 */
export const ROUTES_WITH_HEADER = [
  ROUTES.CLIENT_DASHBOARD,
  ROUTES.MANAGER_DASHBOARD,
  ROUTES.MANAGER_SCHEDULE,
  ROUTES.MANAGER_COURTS,
  ROUTES.MANAGER_CLIENTS,
  ROUTES.MANAGER_REPORTS,
  ROUTES.MANAGER_SETTINGS,
  ROUTES.USER_PROFILE,
  ROUTES.TEAMS,
  ROUTES.COURT_DETAILS,
  ROUTES.TRANSACTIONS,
  ROUTES.FAQ,
  ROUTES.TERMS,
  ROUTES.SETTINGS,
  ROUTES.SUBSCRIPTION_PLANS,
  ROUTES.SUBSCRIPTION_MANAGEMENT,
  ROUTES.NOT_FOUND,
];

/**
 * Routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  ROUTES.LANDING,
  ROUTES.LOGIN,
  ROUTES.CADASTRO,
  ROUTES.BOOKING,           // Public - requires login only to confirm
  ROUTES.INVITE_VIEW,
  ROUTES.COURT_DETAILS,
  ROUTES.SUBSCRIPTION_PLANS, // Public - can browse plans
  ROUTES.FAQ,
  ROUTES.TERMS,
  ROUTES.NOT_FOUND,
];
