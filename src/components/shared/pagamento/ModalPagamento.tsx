"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormularioPagamento, type DadosPagamento } from "./FormularioPagamento";
import { ResumoFinanceiro, type DadosResumo } from "./ResumoFinanceiro";
import { ComprovantePagamento, type DadosComprovante } from "./ComprovantePagamento";

type EtapaPagamento = "resumo" | "pagamento" | "processando" | "comprovante";

interface ModalPagamentoProps {
  aberto: boolean;
  onFechar: () => void;
  dadosResumo: DadosResumo;
  saldoDisponivel?: number;
  onPagamentoConcluido?: (dados: DadosComprovante) => void;
}

export function ModalPagamento({
  aberto,
  onFechar,
  dadosResumo,
  saldoDisponivel = 0,
  onPagamentoConcluido
}: ModalPagamentoProps) {
  const [etapa, setEtapa] = useState<EtapaPagamento>("resumo");
  const [comprovante, setComprovante] = useState<DadosComprovante | null>(null);

  const handleConfirmarResumo = () => {
    setEtapa("pagamento");
  };

  const handlePagamentoConfirmado = async (dadosPagamento: DadosPagamento) => {
    setEtapa("processando");

    // Simula processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Gera comprovante
    const novoComprovante: DadosComprovante = {
      id: `TXN${Date.now()}`,
      tipo: "reserva",
      status: "aprovado",
      valor: dadosResumo.total,
      metodoPagamento: dadosPagamento.metodo === "pix" ? "PIX" :
                       dadosPagamento.metodo === "cartao" ? "Cartão de Crédito" :
                       "Saldo em Conta",
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      detalhes: dadosResumo.detalhesReserva ? {
        quadra: dadosResumo.detalhesReserva.quadra,
        dataReserva: dadosResumo.detalhesReserva.data,
        horario: dadosResumo.detalhesReserva.horario
      } : undefined
    };

    setComprovante(novoComprovante);
    setEtapa("comprovante");
    onPagamentoConcluido?.(novoComprovante);
  };

  const handleVoltar = () => {
    if (etapa === "pagamento") {
      setEtapa("resumo");
    }
  };

  const handleFechar = () => {
    setEtapa("resumo");
    setComprovante(null);
    onFechar();
  };

  const handleBaixarComprovante = () => {
    // Implementar lógica de download do PDF
    console.log("Baixar comprovante", comprovante);
  };

  const handleCompartilharComprovante = () => {
    // Implementar lógica de compartilhamento
    console.log("Compartilhar comprovante", comprovante);
  };

  return (
    <Dialog open={aberto} onOpenChange={handleFechar}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {etapa === "resumo" && "Confirmar Pedido"}
            {etapa === "pagamento" && "Pagamento"}
            {etapa === "processando" && "Processando Pagamento"}
            {etapa === "comprovante" && "Comprovante"}
          </DialogTitle>
        </DialogHeader>

        {/* Etapa: Resumo */}
        {etapa === "resumo" && (
          <div className="space-y-6">
            <ResumoFinanceiro dados={dadosResumo} />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleFechar}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmarResumo}
                className="flex-1"
              >
                Continuar para Pagamento
              </Button>
            </div>
          </div>
        )}

        {/* Etapa: Pagamento */}
        {etapa === "pagamento" && (
          <div className="space-y-6">
            <FormularioPagamento
              valor={dadosResumo.total}
              saldoDisponivel={saldoDisponivel}
              onPagamentoConfirmado={handlePagamentoConfirmado}
              onCancelar={handleVoltar}
            />
          </div>
        )}

        {/* Etapa: Processando */}
        {etapa === "processando" && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Processando Pagamento</h3>
            <p className="text-muted-foreground">
              Aguarde enquanto confirmamos sua transação...
            </p>
          </div>
        )}

        {/* Etapa: Comprovante */}
        {etapa === "comprovante" && comprovante && (
          <div className="space-y-6">
            <ComprovantePagamento
              dados={comprovante}
              onBaixar={handleBaixarComprovante}
              onCompartilhar={handleCompartilharComprovante}
            />
            <Button
              onClick={handleFechar}
              className="w-full"
            >
              Concluir
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
