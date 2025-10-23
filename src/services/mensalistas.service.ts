import { createClient } from '@/lib/supabase/client';
import type { 
  PlanoMensalista,
  AssinaturaMensalista,
  ReservaRecorrente,
  ReservaGerada,
  CobrancaMensalista,
  EstatisticasMensalista,
  ConfiguracaoRecorrencia
} from '@/types/mensalistas.types';

export class MensalistasService {
  // ===== PLANOS MENSALISTAS =====
  
  static async buscarPlanosAtivos(): Promise<PlanoMensalista[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('planos_mensalista')
      .select('*')
      .eq('ativo', true)
      .order('valor_mensal', { ascending: true });

    if (error) {
      console.error('Erro ao buscar planos:', error);
      return [];
    }

    return data || [];
  }

  static async criarAssinatura(
    usuarioId: string,
    planoId: string,
    diaVencimento: number
  ): Promise<AssinaturaMensalista | null> {
    const supabase = createClient();
    
    // Verificar se já tem assinatura ativa
    const { data: assinaturaExistente } = await supabase
      .from('assinaturas_mensalista')
      .select('id')
      .eq('usuario_id', usuarioId)
      .eq('status', 'ativa')
      .single();

    if (assinaturaExistente) {
      throw new Error('Usuário já possui uma assinatura ativa');
    }

    // Buscar dados do plano
    const { data: plano } = await supabase
      .from('planos_mensalista')
      .select('*')
      .eq('id', planoId)
      .single();

    if (!plano) {
      throw new Error('Plano não encontrado');
    }

    const { data, error } = await supabase
      .from('assinaturas_mensalista')
      .insert({
        usuario_id: usuarioId,
        plano_id: planoId,
        status: 'ativa',
        data_inicio: new Date().toISOString(),
        dia_vencimento: diaVencimento,
        valor_mensal: plano.valor_mensal,
        horas_utilizadas_mes: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar assinatura:', error);
      return null;
    }

    return data;
  }

  static async buscarAssinaturaUsuario(usuarioId: string): Promise<AssinaturaMensalista | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('assinaturas_mensalista')
      .select(`
        *,
        plano:planos_mensalista(*)
      `)
      .eq('usuario_id', usuarioId)
      .eq('status', 'ativa')
      .single();

    if (error) {
      console.error('Erro ao buscar assinatura:', error);
      return null;
    }

    return data;
  }

  static async pausarAssinatura(assinaturaId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('assinaturas_mensalista')
      .update({ 
        status: 'pausada',
        data_atualizacao: new Date().toISOString()
      })
      .eq('id', assinaturaId);

    return !error;
  }

  static async cancelarAssinatura(assinaturaId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('assinaturas_mensalista')
      .update({ 
        status: 'cancelada',
        data_fim: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      })
      .eq('id', assinaturaId);

    return !error;
  }

  // ===== RESERVAS RECORRENTES =====

  static async criarReservaRecorrente(
    usuarioId: string,
    quadraId: string,
    configuracao: ConfiguracaoRecorrencia & {
      titulo: string;
      descricao?: string;
      valor_por_reserva: number;
      desconto_percentual?: number;
    }
  ): Promise<ReservaRecorrente | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('reservas_recorrentes')
      .insert({
        usuario_id: usuarioId,
        quadra_id: quadraId,
        titulo: configuracao.titulo,
        descricao: configuracao.descricao,
        tipo_recorrencia: configuracao.tipo,
        dias_semana: configuracao.dias_semana,
        dia_mes: configuracao.dia_mes,
        hora_inicio: configuracao.hora_inicio,
        hora_fim: configuracao.hora_fim,
        data_inicio: configuracao.data_inicio,
        data_fim: configuracao.data_fim,
        status: 'ativa',
        gerar_ate: configuracao.data_fim || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        antecedencia_dias: configuracao.antecedencia_dias,
        valor_por_reserva: configuracao.valor_por_reserva,
        desconto_percentual: configuracao.desconto_percentual || 0,
        proxima_geracao: new Date().toISOString(),
        total_reservas_geradas: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar reserva recorrente:', error);
      return null;
    }

    return data;
  }

  static async buscarReservasRecorrentesUsuario(usuarioId: string): Promise<ReservaRecorrente[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reservas_recorrentes')
      .select(`
        *,
        quadra:quadras(*),
        reservas_geradas:reservas_geradas(*)
      `)
      .eq('usuario_id', usuarioId)
      .order('data_criacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar reservas recorrentes:', error);
      return [];
    }

    return data || [];
  }

  static async pausarReservaRecorrente(reservaRecorrenteId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('reservas_recorrentes')
      .update({ 
        status: 'pausada',
        data_atualizacao: new Date().toISOString()
      })
      .eq('id', reservaRecorrenteId);

    return !error;
  }

  static async cancelarReservaRecorrente(reservaRecorrenteId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('reservas_recorrentes')
      .update({ 
        status: 'cancelada',
        data_atualizacao: new Date().toISOString()
      })
      .eq('id', reservaRecorrenteId);

    return !error;
  }

  // ===== GERAÇÃO DE RESERVAS =====

  static async gerarProximasReservas(reservaRecorrenteId: string): Promise<ReservaGerada[]> {
    // Esta função seria executada por um job/cron
    // Por enquanto, simular a geração
    const supabase = createClient();
    
    const { data: reservaRecorrente } = await supabase
      .from('reservas_recorrentes')
      .select('*')
      .eq('id', reservaRecorrenteId)
      .single();

    if (!reservaRecorrente || reservaRecorrente.status !== 'ativa') {
      return [];
    }

    // Lógica de geração baseada no tipo de recorrência
    const reservasGeradas: ReservaGerada[] = [];
    const hoje = new Date();
    const dataLimite = new Date(reservaRecorrente.gerar_ate);

    // Implementar lógica específica para cada tipo de recorrência
    // Por enquanto, retornar array vazio
    return reservasGeradas;
  }

  // ===== COBRANÇAS =====

  static async buscarCobrancasUsuario(usuarioId: string): Promise<CobrancaMensalista[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('cobrancas_mensalista')
      .select(`
        *,
        assinatura:assinaturas_mensalista(
          *,
          plano:planos_mensalista(*)
        )
      `)
      .eq('assinatura.usuario_id', usuarioId)
      .order('data_vencimento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar cobranças:', error);
      return [];
    }

    return data || [];
  }

  static async processarPagamento(
    cobrancaId: string,
    metodoPagamento: string
  ): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('cobrancas_mensalista')
      .update({
        status: 'paga',
        data_pagamento: new Date().toISOString(),
        metodo_pagamento: metodoPagamento,
      })
      .eq('id', cobrancaId);

    return !error;
  }

  // ===== ESTATÍSTICAS =====

  static async buscarEstatisticasMensalista(usuarioId: string): Promise<EstatisticasMensalista | null> {
    const assinatura = await this.buscarAssinaturaUsuario(usuarioId);
    
    if (!assinatura || !assinatura.plano) {
      return null;
    }

    const horasIncluidas = assinatura.plano.horas_incluidas;
    const horasUtilizadas = assinatura.horas_utilizadas_mes;
    const horasRestantes = Math.max(0, horasIncluidas - horasUtilizadas);
    const percentualUso = Math.min(100, (horasUtilizadas / horasIncluidas) * 100);

    // Calcular próxima cobrança
    const hoje = new Date();
    const proximaCobranca = new Date(hoje.getFullYear(), hoje.getMonth() + 1, assinatura.dia_vencimento);

    return {
      horas_utilizadas_mes: horasUtilizadas,
      horas_restantes_mes: horasRestantes,
      percentual_uso: Math.round(percentualUso),
      valor_economizado: 0, // Calcular baseado em reservas vs valor avulso
      reservas_realizadas_mes: 0, // Buscar do banco
      proxima_cobranca: proximaCobranca.toISOString(),
      status_pagamento: 'em_dia', // Verificar última cobrança
    };
  }

  // ===== UTILITÁRIOS =====

  static calcularProximaOcorrencia(
    tipo: 'semanal' | 'quinzenal' | 'mensal',
    dataBase: Date,
    diasSemana?: number[],
    diaMes?: number
  ): Date {
    const proxima = new Date(dataBase);

    switch (tipo) {
      case 'semanal':
        proxima.setDate(proxima.getDate() + 7);
        break;
      case 'quinzenal':
        proxima.setDate(proxima.getDate() + 14);
        break;
      case 'mensal':
        if (diaMes) {
          proxima.setMonth(proxima.getMonth() + 1);
          proxima.setDate(diaMes);
        }
        break;
    }

    return proxima;
  }

  static validarHorarioPermitido(
    plano: PlanoMensalista,
    diaSemana: number,
    horaInicio: string
  ): boolean {
    return plano.horarios_permitidos.some(horario => 
      horario.dias_semana.includes(diaSemana) &&
      horaInicio >= horario.hora_inicio &&
      horaInicio <= horario.hora_fim
    );
  }
}