export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      assinaturas_mensalista: {
        Row: {
          created_at: string | null
          data_fim: string | null
          data_inicio: string
          dia_vencimento: number
          horas_utilizadas_mes: number | null
          id: string
          plano_id: string
          status: string | null
          updated_at: string | null
          usuario_id: string
          valor_mensal: number
        }
        Insert: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio: string
          dia_vencimento: number
          horas_utilizadas_mes?: number | null
          id?: string
          plano_id: string
          status?: string | null
          updated_at?: string | null
          usuario_id: string
          valor_mensal: number
        }
        Update: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          dia_vencimento?: number
          horas_utilizadas_mes?: number | null
          id?: string
          plano_id?: string
          status?: string | null
          updated_at?: string | null
          usuario_id?: string
          valor_mensal?: number
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_mensalista_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_mensalista"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliacoes: {
        Row: {
          avaliacao_atendimento: number | null
          avaliacao_instalacoes: number | null
          avaliacao_limpeza: number | null
          comentario: string | null
          created_at: string | null
          id: string
          nota: number
          reserva_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avaliacao_atendimento?: number | null
          avaliacao_instalacoes?: number | null
          avaliacao_limpeza?: number | null
          comentario?: string | null
          created_at?: string | null
          id?: string
          nota: number
          reserva_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avaliacao_atendimento?: number | null
          avaliacao_instalacoes?: number | null
          avaliacao_limpeza?: number | null
          comentario?: string | null
          created_at?: string | null
          id?: string
          nota?: number
          reserva_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cobrancas_mensalista: {
        Row: {
          assinatura_id: string
          created_at: string | null
          data_pagamento: string | null
          data_vencimento: string
          horas_extras: number | null
          id: string
          mes_referencia: string
          metodo_pagamento: string | null
          status: string | null
          valor_horas_extras: number | null
          valor_plano: number
          valor_total: number
        }
        Insert: {
          assinatura_id: string
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          horas_extras?: number | null
          id?: string
          mes_referencia: string
          metodo_pagamento?: string | null
          status?: string | null
          valor_horas_extras?: number | null
          valor_plano: number
          valor_total: number
        }
        Update: {
          assinatura_id?: string
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          horas_extras?: number | null
          id?: string
          mes_referencia?: string
          metodo_pagamento?: string | null
          status?: string | null
          valor_horas_extras?: number | null
          valor_plano?: number
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "cobrancas_mensalista_assinatura_id_fkey"
            columns: ["assinatura_id"]
            isOneToOne: false
            referencedRelation: "assinaturas_mensalista"
            referencedColumns: ["id"]
          },
        ]
      }
      codigos_indicacao: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string | null
          id: string
          updated_at: string | null
          usuario_id: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          usuario_id: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "codigos_indicacao_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes: {
        Row: {
          antecedencia_maxima: number | null
          antecedencia_minima: number | null
          bonus_aniversario: number | null
          bonus_indicacao: number | null
          cancelamento_gratuito: number | null
          created_at: string | null
          desconto_grupo: number | null
          desconto_mensalista: number | null
          desconto_primeira_reserva: number | null
          desconto_recorrente: number | null
          dia_vencimento: number | null
          hora_limite_reserva: number | null
          id: string
          lembrete_antes: number | null
          lembrete_final: number | null
          minimo_participantes_desconto: number | null
          multa_cancelamento: number | null
          notif_email: boolean | null
          notif_sms: boolean | null
          notif_whatsapp: boolean | null
          pagamento_cartao: boolean | null
          pagamento_dinheiro: boolean | null
          pagamento_pix: boolean | null
          pagamento_transferencia: boolean | null
          permite_cancelamento: boolean | null
          reembolso_total: number | null
          taxa_conveniencia: number | null
          updated_at: string | null
          valor_minimo: number | null
        }
        Insert: {
          antecedencia_maxima?: number | null
          antecedencia_minima?: number | null
          bonus_aniversario?: number | null
          bonus_indicacao?: number | null
          cancelamento_gratuito?: number | null
          created_at?: string | null
          desconto_grupo?: number | null
          desconto_mensalista?: number | null
          desconto_primeira_reserva?: number | null
          desconto_recorrente?: number | null
          dia_vencimento?: number | null
          hora_limite_reserva?: number | null
          id?: string
          lembrete_antes?: number | null
          lembrete_final?: number | null
          minimo_participantes_desconto?: number | null
          multa_cancelamento?: number | null
          notif_email?: boolean | null
          notif_sms?: boolean | null
          notif_whatsapp?: boolean | null
          pagamento_cartao?: boolean | null
          pagamento_dinheiro?: boolean | null
          pagamento_pix?: boolean | null
          pagamento_transferencia?: boolean | null
          permite_cancelamento?: boolean | null
          reembolso_total?: number | null
          taxa_conveniencia?: number | null
          updated_at?: string | null
          valor_minimo?: number | null
        }
        Update: {
          antecedencia_maxima?: number | null
          antecedencia_minima?: number | null
          bonus_aniversario?: number | null
          bonus_indicacao?: number | null
          cancelamento_gratuito?: number | null
          created_at?: string | null
          desconto_grupo?: number | null
          desconto_mensalista?: number | null
          desconto_primeira_reserva?: number | null
          desconto_recorrente?: number | null
          dia_vencimento?: number | null
          hora_limite_reserva?: number | null
          id?: string
          lembrete_antes?: number | null
          lembrete_final?: number | null
          minimo_participantes_desconto?: number | null
          multa_cancelamento?: number | null
          notif_email?: boolean | null
          notif_sms?: boolean | null
          notif_whatsapp?: boolean | null
          pagamento_cartao?: boolean | null
          pagamento_dinheiro?: boolean | null
          pagamento_pix?: boolean | null
          pagamento_transferencia?: boolean | null
          permite_cancelamento?: boolean | null
          reembolso_total?: number | null
          taxa_conveniencia?: number | null
          updated_at?: string | null
          valor_minimo?: number | null
        }
        Relationships: []
      }
      convite_aceites: {
        Row: {
          confirmado: boolean | null
          convite_id: string
          created_at: string | null
          email: string | null
          id: string
          nome: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          confirmado?: boolean | null
          convite_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          nome: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          confirmado?: boolean | null
          convite_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "convite_aceites_convite_id_fkey"
            columns: ["convite_id"]
            isOneToOne: false
            referencedRelation: "convites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convite_aceites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      convites: {
        Row: {
          created_at: string | null
          criado_por: string
          data_expiracao: string | null
          id: string
          mensagem: string | null
          reserva_id: string
          status: string
          token: string
          total_aceites: number | null
          updated_at: string | null
          vagas_disponiveis: number
          vagas_totais: number
          valor_por_pessoa: number | null
        }
        Insert: {
          created_at?: string | null
          criado_por: string
          data_expiracao?: string | null
          id?: string
          mensagem?: string | null
          reserva_id: string
          status?: string
          token: string
          total_aceites?: number | null
          updated_at?: string | null
          vagas_disponiveis: number
          vagas_totais: number
          valor_por_pessoa?: number | null
        }
        Update: {
          created_at?: string | null
          criado_por?: string
          data_expiracao?: string | null
          id?: string
          mensagem?: string | null
          reserva_id?: string
          status?: string
          token?: string
          total_aceites?: number | null
          updated_at?: string | null
          vagas_disponiveis?: number
          vagas_totais?: number
          valor_por_pessoa?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "convites_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      court_blocks: {
        Row: {
          court_id: string
          created_at: string | null
          created_by: string | null
          data_fim: string
          data_inicio: string
          horario_fim: string | null
          horario_inicio: string | null
          id: string
          motivo: string
        }
        Insert: {
          court_id: string
          created_at?: string | null
          created_by?: string | null
          data_fim: string
          data_inicio: string
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          motivo: string
        }
        Update: {
          court_id?: string
          created_at?: string | null
          created_by?: string | null
          data_fim?: string
          data_inicio?: string
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          motivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "court_blocks_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "court_blocks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          ativa: boolean | null
          capacidade_maxima: number | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativa?: boolean | null
          capacidade_maxima?: number | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativa?: boolean | null
          capacidade_maxima?: number | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      creditos: {
        Row: {
          created_at: string | null
          data_expiracao: string | null
          descricao: string
          id: string
          indicacao_id: string | null
          metodo_pagamento: string | null
          reserva_id: string | null
          status: string
          tipo: string
          updated_at: string | null
          usuario_id: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_expiracao?: string | null
          descricao: string
          id?: string
          indicacao_id?: string | null
          metodo_pagamento?: string | null
          reserva_id?: string | null
          status?: string
          tipo: string
          updated_at?: string | null
          usuario_id: string
          valor: number
        }
        Update: {
          created_at?: string | null
          data_expiracao?: string | null
          descricao?: string
          id?: string
          indicacao_id?: string | null
          metodo_pagamento?: string | null
          reserva_id?: string | null
          status?: string
          tipo?: string
          updated_at?: string | null
          usuario_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "creditos_indicacao_id_fkey"
            columns: ["indicacao_id"]
            isOneToOne: false
            referencedRelation: "indicacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creditos_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creditos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      horarios: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          dia_semana: number
          hora_fim: string
          hora_inicio: string
          id: string
          quadra_id: string
          updated_at: string | null
          valor_avulsa: number
          valor_mensalista: number
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          dia_semana: number
          hora_fim: string
          hora_inicio: string
          id?: string
          quadra_id: string
          updated_at?: string | null
          valor_avulsa: number
          valor_mensalista: number
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          dia_semana?: number
          hora_fim?: string
          hora_inicio?: string
          id?: string
          quadra_id?: string
          updated_at?: string | null
          valor_avulsa?: number
          valor_mensalista?: number
        }
        Relationships: [
          {
            foreignKeyName: "horarios_quadra_id_fkey"
            columns: ["quadra_id"]
            isOneToOne: false
            referencedRelation: "quadras"
            referencedColumns: ["id"]
          },
        ]
      }
      indicacoes: {
        Row: {
          codigo_usado: string
          created_at: string | null
          creditos_concedidos_indicado: number | null
          creditos_concedidos_indicador: number | null
          data_primeiro_uso: string | null
          id: string
          status: string | null
          user_id_indicado: string | null
          user_id_indicador: string
        }
        Insert: {
          codigo_usado: string
          created_at?: string | null
          creditos_concedidos_indicado?: number | null
          creditos_concedidos_indicador?: number | null
          data_primeiro_uso?: string | null
          id?: string
          status?: string | null
          user_id_indicado?: string | null
          user_id_indicador: string
        }
        Update: {
          codigo_usado?: string
          created_at?: string | null
          creditos_concedidos_indicado?: number | null
          creditos_concedidos_indicador?: number | null
          data_primeiro_uso?: string | null
          id?: string
          status?: string | null
          user_id_indicado?: string | null
          user_id_indicador?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicacoes_user_id_indicado_fkey"
            columns: ["user_id_indicado"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicacoes_user_id_indicador_fkey"
            columns: ["user_id_indicador"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mensalistas: {
        Row: {
          created_at: string | null
          data_fim: string | null
          data_inicio: string
          dia_semana: number
          dia_vencimento: number | null
          forma_pagamento: string | null
          horario_id: string
          id: string
          observacoes: string | null
          quadra_id: string
          status: string | null
          updated_at: string | null
          user_id: string
          valor_mensal: number
        }
        Insert: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio: string
          dia_semana: number
          dia_vencimento?: number | null
          forma_pagamento?: string | null
          horario_id: string
          id?: string
          observacoes?: string | null
          quadra_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
          valor_mensal: number
        }
        Update: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          dia_semana?: number
          dia_vencimento?: number | null
          forma_pagamento?: string | null
          horario_id?: string
          id?: string
          observacoes?: string | null
          quadra_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
          valor_mensal?: number
        }
        Relationships: [
          {
            foreignKeyName: "mensalistas_horario_id_fkey"
            columns: ["horario_id"]
            isOneToOne: false
            referencedRelation: "horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensalistas_quadra_id_fkey"
            columns: ["quadra_id"]
            isOneToOne: false
            referencedRelation: "quadras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensalistas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes_agendadas: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          dados_template: Json
          data_envio: string
          enviado: boolean | null
          id: string
          reserva_id: string
          telefone: string
          tentativas: number | null
          tipo: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          dados_template: Json
          data_envio: string
          enviado?: boolean | null
          id?: string
          reserva_id: string
          telefone: string
          tentativas?: number | null
          tipo: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          dados_template?: Json
          data_envio?: string
          enviado?: boolean | null
          id?: string
          reserva_id?: string
          telefone?: string
          tentativas?: number | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_agendadas_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          message_template: string
          name: string
          priority: Database["public"]["Enums"]["notification_priority"] | null
          title_template: string
          type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_template: string
          name: string
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          title_template: string
          type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_template?: string
          name?: string
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          title_template?: string
          type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          asaas_payment_id: string | null
          asaas_pix_payload: string | null
          asaas_pix_qrcode: string | null
          capture_amount: number | null
          created_at: string | null
          id: string
          legacy_payment_id: string | null
          metadata: Json | null
          paid_at: string | null
          refunded_at: string | null
          reserva_id: string | null
          status: string | null
          tipo: string
          updated_at: string | null
          user_id: string
          valor: number
        }
        Insert: {
          asaas_payment_id?: string | null
          asaas_pix_payload?: string | null
          asaas_pix_qrcode?: string | null
          capture_amount?: number | null
          created_at?: string | null
          id?: string
          legacy_payment_id?: string | null
          metadata?: Json | null
          paid_at?: string | null
          refunded_at?: string | null
          reserva_id?: string | null
          status?: string | null
          tipo: string
          updated_at?: string | null
          user_id: string
          valor: number
        }
        Update: {
          asaas_payment_id?: string | null
          asaas_pix_payload?: string | null
          asaas_pix_qrcode?: string | null
          capture_amount?: number | null
          created_at?: string | null
          id?: string
          legacy_payment_id?: string | null
          metadata?: Json | null
          paid_at?: string | null
          refunded_at?: string | null
          reserva_id?: string | null
          status?: string | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      planos_mensalista: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          horarios_permitidos: Json | null
          horas_extras_valor: number
          horas_incluidas: number
          id: string
          nome: string
          quadras_permitidas: string[] | null
          updated_at: string | null
          valor_mensal: number
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          horarios_permitidos?: Json | null
          horas_extras_valor?: number
          horas_incluidas: number
          id?: string
          nome: string
          quadras_permitidas?: string[] | null
          updated_at?: string | null
          valor_mensal: number
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          horarios_permitidos?: Json | null
          horas_extras_valor?: number
          horas_incluidas?: number
          id?: string
          nome?: string
          quadras_permitidas?: string[] | null
          updated_at?: string | null
          valor_mensal?: number
        }
        Relationships: []
      }
      quadras: {
        Row: {
          capacidade_maxima: number
          created_at: string | null
          descricao: string | null
          foto_url: string | null
          id: string
          nome: string
          status: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          capacidade_maxima: number
          created_at?: string | null
          descricao?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          status?: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          capacidade_maxima?: number
          created_at?: string | null
          descricao?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          status?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rateios: {
        Row: {
          configuracao: Json | null
          created_at: string | null
          id: string
          modo: string
          reserva_id: string
          updated_at: string | null
          valor_total: number
        }
        Insert: {
          configuracao?: Json | null
          created_at?: string | null
          id?: string
          modo: string
          reserva_id: string
          updated_at?: string | null
          valor_total: number
        }
        Update: {
          configuracao?: Json | null
          created_at?: string | null
          id?: string
          modo?: string
          reserva_id?: string
          updated_at?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "rateios_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      reserva_participantes: {
        Row: {
          amount_to_pay: number | null
          convite_id: string | null
          created_at: string | null
          data_pagamento: string | null
          email: string | null
          id: string
          nome: string
          origem: string
          payment_id: string | null
          payment_status: string | null
          percentual_rateio: number | null
          reserva_id: string
          source: string | null
          split_type: string | null
          split_value: number | null
          status_pagamento: string
          user_id: string | null
          valor_pago: number | null
          valor_rateio: number | null
          whatsapp: string | null
        }
        Insert: {
          amount_to_pay?: number | null
          convite_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          email?: string | null
          id?: string
          nome: string
          origem: string
          payment_id?: string | null
          payment_status?: string | null
          percentual_rateio?: number | null
          reserva_id: string
          source?: string | null
          split_type?: string | null
          split_value?: number | null
          status_pagamento?: string
          user_id?: string | null
          valor_pago?: number | null
          valor_rateio?: number | null
          whatsapp?: string | null
        }
        Update: {
          amount_to_pay?: number | null
          convite_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          email?: string | null
          id?: string
          nome?: string
          origem?: string
          payment_id?: string | null
          payment_status?: string | null
          percentual_rateio?: number | null
          reserva_id?: string
          source?: string | null
          split_type?: string | null
          split_value?: number | null
          status_pagamento?: string
          user_id?: string | null
          valor_pago?: number | null
          valor_rateio?: number | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reserva_participantes_convite_id_fkey"
            columns: ["convite_id"]
            isOneToOne: false
            referencedRelation: "convites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reserva_participantes_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "pagamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reserva_participantes_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reserva_participantes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          created_at: string | null
          data: string
          horario_id: string
          id: string
          observacoes: string | null
          organizador_id: string
          quadra_id: string
          rateio_configurado: boolean | null
          rateio_modo: string | null
          split_mode: string | null
          status: string
          team_id: string | null
          tipo: string
          turma_id: string | null
          updated_at: string | null
          valor_total: number
        }
        Insert: {
          created_at?: string | null
          data: string
          horario_id: string
          id?: string
          observacoes?: string | null
          organizador_id: string
          quadra_id: string
          rateio_configurado?: boolean | null
          rateio_modo?: string | null
          split_mode?: string | null
          status?: string
          team_id?: string | null
          tipo: string
          turma_id?: string | null
          updated_at?: string | null
          valor_total: number
        }
        Update: {
          created_at?: string | null
          data?: string
          horario_id?: string
          id?: string
          observacoes?: string | null
          organizador_id?: string
          quadra_id?: string
          rateio_configurado?: boolean | null
          rateio_modo?: string | null
          split_mode?: string | null
          status?: string
          team_id?: string | null
          tipo?: string
          turma_id?: string | null
          updated_at?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservas_horario_id_fkey"
            columns: ["horario_id"]
            isOneToOne: false
            referencedRelation: "horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_organizador_id_fkey"
            columns: ["organizador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_quadra_id_fkey"
            columns: ["quadra_id"]
            isOneToOne: false
            referencedRelation: "quadras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas_geradas: {
        Row: {
          data_geracao: string | null
          data_reserva: string
          hora_fim: string
          hora_inicio: string
          id: string
          reserva_id: string | null
          reserva_recorrente_id: string
          status: string | null
          valor: number
        }
        Insert: {
          data_geracao?: string | null
          data_reserva: string
          hora_fim: string
          hora_inicio: string
          id?: string
          reserva_id?: string | null
          reserva_recorrente_id: string
          status?: string | null
          valor: number
        }
        Update: {
          data_geracao?: string | null
          data_reserva?: string
          hora_fim?: string
          hora_inicio?: string
          id?: string
          reserva_id?: string | null
          reserva_recorrente_id?: string
          status?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservas_geradas_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_geradas_reserva_recorrente_id_fkey"
            columns: ["reserva_recorrente_id"]
            isOneToOne: false
            referencedRelation: "reservas_recorrentes"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas_recorrentes: {
        Row: {
          antecedencia_dias: number | null
          created_at: string | null
          data_fim: string | null
          data_inicio: string
          desconto_percentual: number | null
          descricao: string | null
          dia_mes: number | null
          dias_semana: number[] | null
          gerar_ate: string
          hora_fim: string
          hora_inicio: string
          id: string
          proxima_geracao: string | null
          quadra_id: string
          status: string | null
          tipo_recorrencia: string
          titulo: string
          total_reservas_geradas: number | null
          updated_at: string | null
          usuario_id: string
          valor_por_reserva: number
        }
        Insert: {
          antecedencia_dias?: number | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio: string
          desconto_percentual?: number | null
          descricao?: string | null
          dia_mes?: number | null
          dias_semana?: number[] | null
          gerar_ate: string
          hora_fim: string
          hora_inicio: string
          id?: string
          proxima_geracao?: string | null
          quadra_id: string
          status?: string | null
          tipo_recorrencia: string
          titulo: string
          total_reservas_geradas?: number | null
          updated_at?: string | null
          usuario_id: string
          valor_por_reserva: number
        }
        Update: {
          antecedencia_dias?: number | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          desconto_percentual?: number | null
          descricao?: string | null
          dia_mes?: number | null
          dias_semana?: number[] | null
          gerar_ate?: string
          hora_fim?: string
          hora_inicio?: string
          id?: string
          proxima_geracao?: string | null
          quadra_id?: string
          status?: string | null
          tipo_recorrencia?: string
          titulo?: string
          total_reservas_geradas?: number | null
          updated_at?: string | null
          usuario_id?: string
          valor_por_reserva?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservas_recorrentes_quadra_id_fkey"
            columns: ["quadra_id"]
            isOneToOne: false
            referencedRelation: "quadras"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          ativo: boolean | null
          court_id: string
          created_at: string | null
          dia_semana: number
          horario_fim: string
          horario_inicio: string
          id: string
          updated_at: string | null
          valor_avulsa: number
          valor_mensalista: number
        }
        Insert: {
          ativo?: boolean | null
          court_id: string
          created_at?: string | null
          dia_semana: number
          horario_fim: string
          horario_inicio: string
          id?: string
          updated_at?: string | null
          valor_avulsa: number
          valor_mensalista: number
        }
        Update: {
          ativo?: boolean | null
          court_id?: string
          created_at?: string | null
          dia_semana?: number
          horario_fim?: string
          horario_inicio?: string
          id?: string
          updated_at?: string | null
          valor_avulsa?: number
          valor_mensalista?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedules_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          categoria: string | null
          descricao: string | null
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          categoria?: string | null
          descricao?: string | null
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          categoria?: string | null
          descricao?: string | null
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      templates_notificacao: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          id: string
          template: string
          tipo: string
          titulo: string
          variaveis: string[]
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          template: string
          tipo: string
          titulo: string
          variaveis: string[]
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          template?: string
          tipo?: string
          titulo?: string
          variaveis?: string[]
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          metadata: Json | null
          referencia_id: string | null
          saldo_anterior: number
          saldo_novo: number
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          metadata?: Json | null
          referencia_id?: string | null
          saldo_anterior?: number
          saldo_novo?: number
          tipo: string
          user_id: string
          valor: number
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          metadata?: Json | null
          referencia_id?: string | null
          saldo_anterior?: number
          saldo_novo?: number
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      turma_membros: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          nome: string
          status: string
          turma_id: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          nome: string
          status: string
          turma_id: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          status?: string
          turma_id?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "turma_membros_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      turmas: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          organizador_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          organizador_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          organizador_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "turmas_organizador_id_fkey"
            columns: ["organizador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          asaas_customer_id: string | null
          bairro: string | null
          banned: boolean
          banned_at: string | null
          banned_reason: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          cpf: string | null
          created_at: string | null
          data_nascimento: string | null
          email: string
          estado: string | null
          id: string
          logradouro: string | null
          nome_completo: string | null
          numero: string | null
          rg: string | null
          role: string
          saldo_creditos: number | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          asaas_customer_id?: string | null
          bairro?: string | null
          banned?: boolean
          banned_at?: string | null
          banned_reason?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email: string
          estado?: string | null
          id: string
          logradouro?: string | null
          nome_completo?: string | null
          numero?: string | null
          rg?: string | null
          role?: string
          saldo_creditos?: number | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          asaas_customer_id?: string | null
          bairro?: string | null
          banned?: boolean
          banned_at?: string | null
          banned_reason?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string
          estado?: string | null
          id?: string
          logradouro?: string | null
          nome_completo?: string | null
          numero?: string | null
          rg?: string | null
          role?: string
          saldo_creditos?: number | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          asaas_payment_id: string | null
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          request_id: string
          retry_count: number | null
          signature: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          asaas_payment_id?: string | null
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          request_id: string
          retry_count?: number | null
          signature?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          asaas_payment_id?: string | null
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          request_id?: string
          retry_count?: number | null
          signature?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      notification_priority: "low" | "medium" | "high" | "urgent"
      user_status: "active" | "inactive" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      notification_priority: ["low", "medium", "high", "urgent"],
      user_status: ["active", "inactive", "suspended"],
    },
  },
} as const
