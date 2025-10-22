import { createClient, clearSupabaseSession } from '@/lib/supabase/client';
import type { SignupFormData, LoginFormData } from '@/lib/validations/auth.schema';
import { unformatCPF } from '@/lib/utils/cpf';

const supabase = createClient();

/**
 * Helper para tratar erros de autenticação do Supabase
 * Detecta erros de refresh token e limpa a sessão automaticamente
 */
async function handleAuthError(error: any) {
  // Verificar se é erro de refresh token
  if (
    error.message?.includes('Invalid Refresh Token') ||
    error.message?.includes('Refresh Token Not Found') ||
    error.message?.includes('refresh_token_not_found')
  ) {
    console.warn('⚠️ Sessão inválida detectada. Limpando cookies...');
    await clearSupabaseSession();
    throw new Error('Sessão expirada. Por favor, faça login novamente.');
  }

  // Outros erros
  throw error;
}

// ============================================================
// AUTH SERVICE
// ============================================================

export const authService = {
  /**
   * Login com Email ou CPF
   * Conforme PRD: "Login via e-mail ou CPF + senha"
   */
  async login(data: LoginFormData) {
    try {
      const { identifier, password } = data;

      // Verifica se é email ou CPF
      const isEmail = identifier.includes('@');

      if (isEmail) {
        // Login com email (direto no Supabase Auth)
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });

        if (error) throw error;
        return authData;
      } else {
        // Login com CPF
        // 1. Buscar email pelo CPF
        const cpfClean = unformatCPF(identifier);

        const { data: userData, error: userError } = await supabase
          .rpc('get_user_by_cpf', { user_cpf: cpfClean });

        if (userError) throw userError;
        if (!userData || userData.length === 0) {
          throw new Error('CPF não encontrado');
        }

        const email = userData[0].email;

        // 2. Login com o email encontrado
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;
        return authData;
      }
    } catch (error) {
      return handleAuthError(error);
    }
  },

  /**
   * Cadastro completo conforme PRD
   * US-002: Cadastro com informações completas
   */
  async signup(data: SignupFormData) {
    // 1. Verificar se CPF já existe
    const cpfClean = unformatCPF(data.cpf);

    const { data: existingCPF, error: cpfError } = await supabase
      .from('users')
      .select('id')
      .eq('cpf', cpfClean)
      .maybeSingle(); // maybeSingle() retorna null se não encontrar, não dá erro

    if (cpfError) throw cpfError; // Tratar erros reais (não "no rows")

    if (existingCPF) {
      throw new Error('CPF já cadastrado');
    }

    // 2. Verificar se RG já existe (se fornecido)
    if (data.rg && data.rg.trim() !== '') {
      const { data: existingRG, error: rgError } = await supabase
        .from('users')
        .select('id')
        .eq('rg', data.rg)
        .maybeSingle(); // maybeSingle() retorna null se não encontrar, não dá erro

      if (rgError) throw rgError; // Tratar erros reais (não "no rows")

      if (existingRG) {
        throw new Error('RG já cadastrado');
      }
    }

    // 3. Criar conta no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Erro ao criar conta');

    // 4. Atualizar perfil com dados completos
    // O trigger já criou o registro básico, agora atualizamos com todos os dados
    const { error: updateError } = await supabase
      .from('users')
      .update({
        nome_completo: data.nome_completo,
        cpf: cpfClean,
        rg: data.rg && data.rg.trim() !== '' ? data.rg : null,
        data_nascimento: data.data_nascimento,
        whatsapp: data.whatsapp,
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento && data.complemento.trim() !== '' ? data.complemento : null,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado.toUpperCase(),
        role: 'cliente', // Role padrão
      })
      .eq('id', authData.user.id);

    if (updateError) throw updateError;

    return authData;
  },

  /**
   * Logout
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Recuperação de senha
   * Envia email com link de reset
   */
  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  },

  /**
   * Redefinir senha
   * Deve ser chamado após clicar no link do email
   */
  async resetPassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  /**
   * Obter usuário atual
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Obter perfil completo do usuário
   */
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },
};
