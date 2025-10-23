"use client";

import { toast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";

/**
 * Helpers para facilitar o uso de toasts com estilos consistentes
 */

export const showToast = {
  // Toast de Sucesso
  success: (message: string, description?: string) => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span>{message}</span>
        </div>
      ),
      description,
      variant: "default",
    });
  },

  // Toast de Erro
  error: (message: string, description?: string) => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-destructive" />
          <span>{message}</span>
        </div>
      ),
      description,
      variant: "destructive",
    });
  },

  // Toast de Aviso
  warning: (message: string, description?: string) => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span>{message}</span>
        </div>
      ),
      description,
      variant: "default",
    });
  },

  // Toast de Informação
  info: (message: string, description?: string) => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          <span>{message}</span>
        </div>
      ),
      description,
      variant: "default",
    });
  },

  // Toast de Promessa (para operações assíncronas)
  promise: async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<T> => {
    const toastId = toast({
      title: messages.loading,
      description: "Aguarde...",
    });

    try {
      const result = await promise;
      toastId.update({
        id: toastId.id,
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>{messages.success}</span>
          </div>
        ),
        description: undefined,
      });
      return result;
    } catch (error) {
      toastId.update({
        id: toastId.id,
        title: (
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-destructive" />
            <span>{messages.error}</span>
          </div>
        ),
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
      throw error;
    }
  },
};

// Exemplos de uso específicos para o domínio da aplicação

export const reservaToasts = {
  criada: () => showToast.success("Reserva criada!", "Sua reserva foi confirmada com sucesso."),
  cancelada: () => showToast.success("Reserva cancelada", "A reserva foi cancelada."),
  erro: () => showToast.error("Erro na reserva", "Não foi possível processar sua reserva."),
  horarioIndisponivel: () => showToast.warning("Horário indisponível", "Este horário já foi reservado."),
};

export const quadraToasts = {
  criada: () => showToast.success("Quadra criada!", "A quadra foi cadastrada com sucesso."),
  atualizada: () => showToast.success("Quadra atualizada", "As informações foram salvas."),
  excluida: () => showToast.success("Quadra excluída", "A quadra foi removida do sistema."),
  erro: () => showToast.error("Erro", "Não foi possível processar a operação."),
};

export const horarioToasts = {
  criado: () => showToast.success("Horário criado", "O horário foi adicionado à grade."),
  atualizado: () => showToast.success("Horário atualizado", "As alterações foram salvas."),
  excluido: () => showToast.success("Horário excluído", "O horário foi removido."),
  ativado: () => showToast.info("Horário ativado", "O horário está disponível para reservas."),
  desativado: () => showToast.info("Horário desativado", "O horário não está mais disponível."),
};

export const bloqueioToasts = {
  criado: () => showToast.success("Bloqueio criado", "O período foi bloqueado com sucesso."),
  removido: () => showToast.success("Bloqueio removido", "O bloqueio foi cancelado."),
  finalizado: () => showToast.info("Bloqueio finalizado", "O bloqueio foi marcado como concluído."),
};

export const authToasts = {
  loginSucesso: () => showToast.success("Login realizado", "Bem-vindo de volta!"),
  loginErro: () => showToast.error("Erro no login", "Credenciais inválidas."),
  logoutSucesso: () => showToast.info("Logout realizado", "Até logo!"),
  semPermissao: () => showToast.error("Sem permissão", "Você não tem acesso a este recurso."),
};
