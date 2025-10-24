import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/hooks/auth/useUser';
import type { Reserva } from '@/types/reservas.types';

const supabase = createClient();

// ============================================================
// TYPES
// ============================================================

export interface ClientWithStats extends UserProfile {
  total_jogos: number;
  ultimo_jogo: string | null;
  status_cliente: 'ativo' | 'devedor' | 'novo' | 'inativo';
}

export interface ClientUpdateData {
  nome_completo?: string;
  cpf?: string;
  email?: string;
  whatsapp?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export interface TransacaoCredito {
  id: string;
  user_id: string;
  tipo: 'adicao' | 'uso' | 'bonus_indicacao';
  valor: number;
  saldo_anterior: number;
  saldo_novo: number;
  descricao: string | null;
  reserva_id: string | null;
  created_at: string;
}

// ============================================================
// CLIENTS SERVICE
// ============================================================

export const clientsService = {
  // Buscar todos os clientes com estatísticas
  async getAll(): Promise<ClientWithStats[]> {
    // Buscar todos os users com role = cliente
    const { data: clients, error: clientsError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'cliente')
      .order('created_at', { ascending: false });

    if (clientsError) throw clientsError;
    if (!clients) return [];

    // Para cada cliente, buscar estatísticas de reservas
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        // Contar total de jogos (reservas confirmadas onde o user é organizador ou participante)
        const { count: totalJogosOrganizador } = await supabase
          .from('reservas')
          .select('*', { count: 'exact', head: true })
          .eq('organizador_id', client.id)
          .eq('status', 'confirmada');

        const { count: totalJogosParticipante } = await supabase
          .from('reserva_participantes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', client.id);

        const total_jogos = (totalJogosOrganizador || 0) + (totalJogosParticipante || 0);

        // Buscar última reserva
        const { data: ultimaReserva } = await supabase
          .from('reservas')
          .select('data')
          .eq('organizador_id', client.id)
          .eq('status', 'confirmada')
          .order('data', { ascending: false })
          .limit(1)
          .maybeSingle();

        const ultimo_jogo = ultimaReserva?.data || null;

        // Determinar status
        let status_cliente: 'ativo' | 'devedor' | 'novo' | 'inativo' = 'ativo';

        if (client.saldo_creditos < 0) {
          status_cliente = 'devedor';
        } else if (total_jogos < 3) {
          status_cliente = 'novo';
        } else if (ultimo_jogo) {
          // Verificar se jogou nos últimos 30 dias
          const diasDesdeUltimoJogo = Math.floor(
            (Date.now() - new Date(ultimo_jogo).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (diasDesdeUltimoJogo > 30) {
            status_cliente = 'inativo';
          }
        }

        return {
          ...client,
          total_jogos,
          ultimo_jogo,
          status_cliente,
        };
      })
    );

    return clientsWithStats;
  },

  // Buscar cliente por ID com estatísticas
  async getById(id: string): Promise<ClientWithStats | null> {
    const { data: client, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!client) return null;

    // Buscar estatísticas
    const { count: totalJogosOrganizador } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true })
      .eq('organizador_id', client.id)
      .eq('status', 'confirmada');

    const { count: totalJogosParticipante } = await supabase
      .from('reserva_participantes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', client.id);

    const total_jogos = (totalJogosOrganizador || 0) + (totalJogosParticipante || 0);

    const { data: ultimaReserva } = await supabase
      .from('reservas')
      .select('data')
      .eq('organizador_id', client.id)
      .eq('status', 'confirmada')
      .order('data', { ascending: false })
      .limit(1)
      .maybeSingle();

    const ultimo_jogo = ultimaReserva?.data || null;

    let status_cliente: 'ativo' | 'devedor' | 'novo' | 'inativo' = 'ativo';

    if (client.saldo_creditos < 0) {
      status_cliente = 'devedor';
    } else if (total_jogos < 3) {
      status_cliente = 'novo';
    } else if (ultimo_jogo) {
      const diasDesdeUltimoJogo = Math.floor(
        (Date.now() - new Date(ultimo_jogo).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diasDesdeUltimoJogo > 30) {
        status_cliente = 'inativo';
      }
    }

    return {
      ...client,
      total_jogos,
      ultimo_jogo,
      status_cliente,
    };
  },

  // Buscar histórico de reservas do cliente
  async getReservas(clientId: string): Promise<Reserva[]> {
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        quadra:quadras(id, nome, tipo),
        horario:horarios(id, hora_inicio, hora_fim, valor_avulsa)
      `)
      .eq('organizador_id', clientId)
      .order('data', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  },

  // Buscar transações de crédito do cliente
  async getTransacoes(clientId: string): Promise<TransacaoCredito[]> {
    const { data, error } = await supabase
      .from('transacoes_credito')
      .select('*')
      .eq('user_id', clientId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  },

  // Atualizar dados do cliente
  async update(id: string, updateData: ClientUpdateData): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Criar novo cliente (apenas registro, sem autenticação)
  async create(clientData: {
    nome_completo: string;
    email: string;
    cpf?: string;
    whatsapp?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  }): Promise<UserProfile> {
    // Criar usuário com role 'cliente' e saldo inicial 0
    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...clientData,
        role: 'cliente',
        saldo_creditos: 0,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Adicionar/remover créditos manualmente
  async adjustCredits(
    clientId: string,
    valor: number,
    tipo: 'adicao' | 'uso',
    descricao?: string
  ): Promise<void> {
    // Buscar saldo atual
    const { data: client, error: fetchError } = await supabase
      .from('users')
      .select('saldo_creditos')
      .eq('id', clientId)
      .single();

    if (fetchError) throw fetchError;

    const saldo_anterior = client.saldo_creditos;
    const saldo_novo = tipo === 'adicao'
      ? saldo_anterior + valor
      : saldo_anterior - valor;

    // Atualizar saldo
    const { error: updateError } = await supabase
      .from('users')
      .update({ saldo_creditos: saldo_novo })
      .eq('id', clientId);

    if (updateError) throw updateError;

    // Registrar transação
    const { error: transactionError } = await supabase
      .from('transacoes_credito')
      .insert({
        user_id: clientId,
        tipo,
        valor,
        saldo_anterior,
        saldo_novo,
        descricao: descricao || (tipo === 'adicao' ? 'Crédito adicionado manualmente' : 'Débito manual'),
        reserva_id: null,
      });

    if (transactionError) throw transactionError;
  },
};
