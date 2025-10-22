'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  cpf: string;
  rg: string | null;
  nome_completo: string;
  data_nascimento: string | null;
  whatsapp: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  role: 'admin' | 'gestor' | 'cliente';
  saldo_creditos: number;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile extends User {
  profile: UserProfile | null;
}

export function useUser() {
  const supabase = createClient();

  return useQuery<UserWithProfile | null>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return { ...user, profile: null };
      }

      return { ...user, profile };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
