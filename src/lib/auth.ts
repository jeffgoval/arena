import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Tipos de usuário
export type UserRole = 'cliente' | 'gestor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
}

// Chave secreta para JWT (em produção deve vir de variável de ambiente)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'arena-dona-santa-super-secret-key-2024'
);

// Configurações de token
const JWT_EXPIRES_IN = '7d'; // 7 dias
const REFRESH_EXPIRES_IN = '30d'; // 30 dias

// Permissões por role
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  cliente: [
    'reservas:create',
    'reservas:read:own',
    'reservas:update:own',
    'reservas:delete:own',
    'turmas:create',
    'turmas:read:own',
    'turmas:update:own',
    'turmas:delete:own',
    'convites:create',
    'convites:read:own',
    'profile:read:own',
    'profile:update:own'
  ],
  gestor: [
    'quadras:create',
    'quadras:read',
    'quadras:update',
    'quadras:delete',
    'reservas:read',
    'reservas:update',
    'reservas:delete',
    'clientes:read',
    'clientes:update',
    'relatorios:read',
    'configuracoes:read',
    'configuracoes:update',
    'agenda:read',
    'bloqueios:create',
    'bloqueios:read',
    'bloqueios:update',
    'bloqueios:delete'
  ],
  admin: [
    '*' // Todas as permissões
  ]
};

// Gerar JWT Token
export async function generateToken(user: Omit<User, 'permissions'>): Promise<string> {
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

// Verificar JWT Token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Validar se o payload tem os campos necessários
    if (
      typeof payload.sub === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.name === 'string' &&
      typeof payload.role === 'string' &&
      Array.isArray(payload.permissions) &&
      typeof payload.iat === 'number' &&
      typeof payload.exp === 'number'
    ) {
      return payload as unknown as JWTPayload;
    }
    
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Obter usuário atual do token
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      permissions: payload.permissions
    };
  } catch (error) {
    console.error('Get current user failed:', error);
    return null;
  }
}

// Verificar se usuário tem permissão
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  
  // Admin tem todas as permissões
  if (user.permissions.includes('*')) return true;
  
  // Verificar permissão específica
  return user.permissions.includes(permission);
}

// Verificar se usuário pode acessar rota
export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false;

  // Rotas do cliente
  if (route.startsWith('/cliente')) {
    return user.role === 'cliente' || user.role === 'admin';
  }

  // Rotas do gestor
  if (route.startsWith('/gestor')) {
    return user.role === 'gestor' || user.role === 'admin';
  }

  // Rotas públicas
  if (route.startsWith('/auth') || route === '/') {
    return true;
  }

  return false;
}

// Simular autenticação (em produção seria integração com banco de dados)
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // Simulação de usuários do sistema
  const users: Record<string, Omit<User, 'permissions'>> = {
    'cliente@arena.com': {
      id: '1',
      email: 'cliente@arena.com',
      name: 'João Silva',
      role: 'cliente'
    },
    'gestor@arena.com': {
      id: '2',
      email: 'gestor@arena.com',
      name: 'Maria Gestora',
      role: 'gestor'
    },
    'admin@arena.com': {
      id: '3',
      email: 'admin@arena.com',
      name: 'Admin Sistema',
      role: 'admin'
    }
  };

  const user = users[email];
  if (!user) {
    return null;
  }

  // Em produção: verificar hash da senha
  // Por enquanto, aceitar qualquer senha para demonstração
  if (password.length < 6) {
    return null;
  }

  return {
    ...user,
    permissions: ROLE_PERMISSIONS[user.role] || []
  };
}

// Middleware helper para verificar autenticação
export async function getAuthFromRequest(request: NextRequest): Promise<User | null> {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    permissions: payload.permissions
  };
}