/**
 * Constantes e configurações do sistema de indicações
 */

export const INDICACOES_CONFIG = {
  // Valores de créditos
  CREDITO_POR_INDICACAO_ACEITA: 50, // R$ 50 quando indicado se cadastra
  CREDITO_BOAS_VINDAS_INDICADO: 25, // R$ 25 para o indicado
  VALOR_CREDITO_REAL: 1.0, // R$ 1,00 por crédito

  // Bônus por marcos
  BONUS_5_INDICACOES: 50,
  BONUS_10_INDICACOES: 100,
  BONUS_25_INDICACOES: 300,
  BONUS_50_INDICACOES: 750,

  // Limites e regras
  DIAS_EXPIRACAO_CONVITE: 30,
  DIAS_EXPIRACAO_CREDITO: 180, // 6 meses
  LIMITE_INDICACOES_POR_DIA: 10,

  // URLs
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  CADASTRO_PATH: '/auth',
} as const;

export const INDICACOES_MENSAGENS = {
  SUCESSO_INDICACAO_CRIADA: 'Indicação criada com sucesso!',
  SUCESSO_CODIGO_APLICADO: 'Código aplicado com sucesso! Você ganhou créditos!',
  SUCESSO_CREDITOS_USADOS: 'Créditos utilizados com sucesso!',

  ERRO_EMAIL_INVALIDO: 'Email inválido',
  ERRO_EMAIL_OBRIGATORIO: 'Email é obrigatório',
  ERRO_CODIGO_INVALIDO: 'Código de indicação inválido',
  ERRO_PROPRIO_CODIGO: 'Você não pode usar seu próprio código',
  ERRO_CREDITOS_INSUFICIENTES: 'Créditos insuficientes',
} as const;

export const INDICACOES_TEXTOS = {
  TITULO_PAGINA: 'Programa de Indicação',
  SUBTITULO_PAGINA: 'Indique amigos e ganhe créditos para suas reservas',

  COMO_FUNCIONA: [
    'Seu amigo receberá um convite por email com link especial',
    `Quando ele se cadastrar, você ganha R$ ${INDICACOES_CONFIG.CREDITO_POR_INDICACAO_ACEITA}`,
    `Ele também ganha R$ ${INDICACOES_CONFIG.CREDITO_BOAS_VINDAS_INDICADO} de boas-vindas`,
    `Os créditos valem R$ ${INDICACOES_CONFIG.VALOR_CREDITO_REAL.toFixed(2)} cada para usar em reservas`,
  ],

  PREVIEW_EMAIL: {
    assunto: 'Convite para Arena Dona Santa 🏓',
    saudacao: (nome?: string) => `Olá${nome ? ` ${nome}` : ''}!`,
    corpo: 'Você foi indicado(a) para se cadastrar na Arena Dona Santa, a melhor plataforma para reservar quadras esportivas!',
    beneficio: `🎁 Benefício especial: Ao se cadastrar, você ganha R$ ${INDICACOES_CONFIG.CREDITO_BOAS_VINDAS_INDICADO} para usar em suas reservas!`,
    cta: 'Clique aqui para se cadastrar:',
    despedida: 'Vamos jogar juntos! 🏓',
  },
} as const;

export const INDICACOES_BONUS_MARCOS = [
  {
    quantidade: 5,
    bonus: INDICACOES_CONFIG.BONUS_5_INDICACOES,
    titulo: '5 Indicações',
    descricao: `Ganhe R$ ${INDICACOES_CONFIG.BONUS_5_INDICACOES} ao completar 5 indicações aceitas`,
  },
  {
    quantidade: 10,
    bonus: INDICACOES_CONFIG.BONUS_10_INDICACOES,
    titulo: '10 Indicações',
    descricao: `Ganhe R$ ${INDICACOES_CONFIG.BONUS_10_INDICACOES} ao completar 10 indicações aceitas`,
  },
  {
    quantidade: 25,
    bonus: INDICACOES_CONFIG.BONUS_25_INDICACOES,
    titulo: '25 Indicações',
    descricao: `Ganhe R$ ${INDICACOES_CONFIG.BONUS_25_INDICACOES} ao completar 25 indicações aceitas`,
  },
  {
    quantidade: 50,
    bonus: INDICACOES_CONFIG.BONUS_50_INDICACOES,
    titulo: '50 Indicações',
    descricao: `Ganhe R$ ${INDICACOES_CONFIG.BONUS_50_INDICACOES} ao completar 50 indicações aceitas`,
  },
] as const;
