// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  avatar?: string;
  role: "client" | "manager" | "admin";
  bio?: string;
  address?: string;
  sports: string[];
  credits: number;
  createdAt: Date;
  stats: {
    gamesPlayed: number;
    hoursPlayed: number;
    totalSpent: number;
    rating: number;
  };
  preferences: {
    notifications: {
      email: boolean;
      whatsapp: boolean;
      push: boolean;
    };
    privacy: {
      profilePublic: boolean;
      showStats: boolean;
    };
  };
}

// Team Types
export interface Team {
  id: string;
  name: string;
  description: string;
  sport: string;
  avatar?: string;
  ownerId: string;
  members: TeamMember[];
  maxMembers: number;
  isPrivate: boolean;
  createdAt: Date;
  stats: {
    gamesPlayed: number;
    nextGame?: Date;
  };
}

export interface TeamMember {
  userId: string;
  name: string;
  avatar?: string;
  role: "owner" | "admin" | "member";
  joinedAt: Date;
  stats: {
    gamesPlayed: number;
    attendance: number;
  };
}

// Court Types
export interface Court {
  id: string;
  name: string;
  type: string;
  description: string;
  images: string[];
  specs: {
    size: string;
    floor: string;
    lighting: boolean;
    covered: boolean;
    capacity: number;
  };
  amenities: string[];
  rules: string[];
  pricing: {
    hourly: number;
    weekend: number;
    recurring: number;
  };
  availability: {
    daysOpen: number[];
    hoursOpen: { start: string; end: string };
  };
  rating: {
    average: number;
    count: number;
  };
}

export interface CourtReview {
  id: string;
  courtId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

// Booking Types
export interface Booking {
  id: string;
  courtId: string;
  userId: string;
  date: string;
  time: string;
  duration: number;
  type: "avulsa" | "recorrente" | "mensalista";
  status: "pending" | "confirmed" | "canceled" | "completed";
  price: number;
  participants?: string[];
  teamId?: string;
  createdAt: Date;
}

// Notification Types
export type NotificationType = "invite" | "confirmation" | "reminder" | "payment" | "message" | "rating" | "team";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: "credit_card" | "pix" | "credits";
  cardLast4?: string;
  cardBrand?: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "credit" | "debit" | "refund";
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed";
  method: string;
  date: Date;
  bookingId?: string;
}

// Utility Types
export type Theme = "light" | "dark" | "auto";

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
