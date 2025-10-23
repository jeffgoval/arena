'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  nome_completo: string | null;
  cpf: string | null;
  rg: string | null;
  email: string;
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
        console.error('Error fetching profile:', error);
        return { ...user, profile: null };
      }

      return { ...user, profile };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos - dados do usuário não mudam frequentemente
    gcTime: 10 * 60 * 1000, // 10 minutos em cache
    refetchOnMount: false, // Não refetch desnecessariamente
    refetchOnWindowFocus: false, // Não refetch ao focar na janela
    refetchOnReconnect: true, // Apenas ao reconectar
  });
}
