import { createClient } from '@/lib/supabase/client';
import type { 
  Indicacao, 
  CodigoIndicacao, 
  CreditoIndicacao, 
  ConfiguracaoIndicacao,
  EstatisticasIndicacao 
} from '@/types/indicacoes.types';

export class IndicacoesService {
  // Buscar código de indicação do usuário
  static async buscarCodigoUsuario(usuarioId: string): Promise<CodigoIndicacao | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('codigos_indicacao')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('ativo', true)
      .single();

    if (error) {
      console.error('Erro ao buscar código de indicação:', error);
      return null;
    }

    return data;
  }

  // Criar nova indicação
  static async criarIndicacao(dados: {
    usuarioIndicadorId: string;
    codigoIndicacao: string;
    emailIndicado?: string;
    nomeIndicado?: string;
  }): Promise<Indicacao | null> {
    // Buscar configuração para definir data de expiração
    const config = await this.buscarConfiguracaoAtiva();
    const diasExpiracao = config?.dias_expiracao_convite || 30;
    
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + diasExpiracao);

    const supabase = createClient();
    const { data, error } = await supabase
      .from('indicacoes')
      .insert({
        usuario_indicador_id: dados.usuarioIndicadorId,
        codigo_indicacao: dados.codigoIndicacao,
        email_indicado: dados.emailIndicado,
        nome_indicado: dados.nomeIndicado,
        data_expiracao: dataExpiracao.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar indicação:', error);
      return null;
    }

    return data;
  }

  // Aplicar código de indicação no cadastro
  static async aplicarCodigoIndicacao(
    codigoIndicacao: string,
    usuarioIndicadoId: string
  ): Promise<boolean> {
    try {
      const supabase = createClient();
      // Verificar se o código existe e está ativo
      const { data: codigo, error: codigoError } = await supabase
        .from('codigos_indicacao')
        .select('*')
        .eq('codigo', codigoIndicacao)
        .eq('ativo', true)
        .single();

      if (codigoError || !codigo) {
        console.error('Código de indicação inválido:', codigoError);
        return false;
      }

      // Verificar se já existe indicação pendente para este código e usuário
      const { data: indicacaoExistente } = await supabase
        .from('indicacoes')
        .select('id')
        .eq('codigo_indicacao', codigoIndicacao)
        .eq('usuario_indicado_id', usuarioIndicadoId)
        .single();

      if (indicacaoExistente) {
        // Já existe indicação, apenas atualizar status
        const { error: updateError } = await supabase
          .from('indicacoes')
          .update({ 
            status: 'aceita',
            usuario_indicado_id: usuarioIndicadoId 
          })
          .eq('id', indicacaoExistente.id);

        return !updateError;
      }

      // Buscar indicação pendente por email (se houver)
      const { data: user } = await supabase.auth.getUser();
      if (user.user?.email) {
        const { data: indicacaoPorEmail } = await supabase
          .from('indicacoes')
          .select('id')
          .eq('codigo_indicacao', codigoIndicacao)
          .eq('email_indicado', user.user.email)
          .eq('status', 'pendente')
          .single();

        if (indicacaoPorEmail) {
          // Atualizar indicação existente
          const { error: updateError } = await supabase
            .from('indicacoes')
            .update({ 
              status: 'aceita',
              usuario_indicado_id: usuarioIndicadoId 
            })
            .eq('id', indicacaoPorEmail.id);

          return !updateError;
        }
      }

      // Criar nova indicação diretamente aceita
      const config = await this.buscarConfiguracaoAtiva();
      const diasExpiracao = config?.dias_expiracao_convite || 30;
      
      const dataExpiracao = new Date();
      dataExpiracao.setDate(dataExpiracao.getDate() + diasExpiracao);

      const { error: insertError } = await supabase
        .from('indicacoes')
        .insert({
          usuario_indicador_id: codigo.usuario_id,
          usuario_indicado_id: usuarioIndicadoId,
          codigo_indicacao: codigoIndicacao,
          status: 'aceita',
          data_expiracao: dataExpiracao.toISOString(),
        });

      return !insertError;
    } catch (error) {
      console.error('Erro ao aplicar código de indicação:', error);
      return false;
    }
  }

  // Listar indicações do usuário
  static async listarIndicacoesUsuario(usuarioId: string): Promise<Indicacao[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('indicacoes')
      .select('*')
      .eq('usuario_indicador_id', usuarioId)
      .order('data_criacao', { ascending: false });

    if (error) {
      console.error('Erro ao listar indicações:', error);
      return [];
    }

    return data || [];
  }

  // Buscar créditos do usuário
  static async buscarCreditosUsuario(usuarioId: string): Promise<CreditoIndicacao[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('creditos_indicacao')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar créditos:', error);
      return [];
    }

    return data || [];
  }

  // Buscar estatísticas de indicação do usuário
  static async buscarEstatisticasUsuario(usuarioId: string): Promise<EstatisticasIndicacao> {
    const [indicacoes, creditos] = await Promise.all([
      this.listarIndicacoesUsuario(usuarioId),
      this.buscarCreditosUsuario(usuarioId)
    ]);

    const totalIndicacoes = indicacoes.length;
    const indicacoesAceitas = indicacoes.filter(i => i.status === 'aceita').length;
    const indicacoesPendentes = indicacoes.filter(i => i.status === 'pendente').length;
    
    const totalCreditosRecebidos = creditos.reduce((total, credito) => total + credito.valor_credito, 0);
    const creditosUtilizados = creditos
      .filter(c => c.usado)
      .reduce((total, credito) => total + credito.valor_credito, 0);
    const creditosDisponiveis = totalCreditosRecebidos - creditosUtilizados;

    return {
      total_indicacoes: totalIndicacoes,
      indicacoes_aceitas: indicacoesAceitas,
      indicacoes_pendentes: indicacoesPendentes,
      total_creditos_recebidos: totalCreditosRecebidos,
      creditos_disponiveis: creditosDisponiveis,
      creditos_utilizados: creditosUtilizados,
    };
  }

  // Usar créditos para reserva
  static async usarCreditos(
    usuarioId: string,
    valorCreditos: number,
    reservaId: string
  ): Promise<boolean> {
    try {
      const supabase = createClient();
      // Buscar créditos disponíveis
      const { data: creditos, error } = await supabase
        .from('creditos_indicacao')
        .select('*')
        .eq('usuario_id', usuarioId)
        .eq('usado', false)
        .order('created_at', { ascending: true });

      if (error || !creditos) {
        console.error('Erro ao buscar créditos:', error);
        return false;
      }

      let valorRestante = valorCreditos;
      const creditosParaUsar: string[] = [];

      // Selecionar créditos para usar (FIFO)
      for (const credito of creditos) {
        if (valorRestante <= 0) break;
        
        if (credito.valor_credito <= valorRestante) {
          creditosParaUsar.push(credito.id);
          valorRestante -= credito.valor_credito;
        }
      }

      if (valorRestante > 0) {
        console.error('Créditos insuficientes');
        return false;
      }

      // Marcar créditos como usados
      const { error: updateError } = await supabase
        .from('creditos_indicacao')
        .update({
          usado: true,
          data_uso: new Date().toISOString(),
          reserva_id: reservaId
        })
        .in('id', creditosParaUsar);

      return !updateError;
    } catch (error) {
      console.error('Erro ao usar créditos:', error);
      return false;
    }
  }

  // Buscar configuração ativa
  static async buscarConfiguracaoAtiva(): Promise<ConfiguracaoIndicacao | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('configuracao_indicacao')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Erro ao buscar configuração:', error);
      return null;
    }

    return data;
  }

  // Validar código de indicação
  static async validarCodigo(codigo: string): Promise<boolean> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('codigos_indicacao')
      .select('id')
      .eq('codigo', codigo)
      .eq('ativo', true)
      .single();

    return !error && !!data;
  }

  // Expirar indicações antigas (função utilitária)
  static async expirarIndicacoesAntigas(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.rpc('expirar_indicacoes_antigas');
    
    if (error) {
      console.error('Erro ao expirar indicações antigas:', error);
    }
  }
}