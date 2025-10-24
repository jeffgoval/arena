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

    try {
      // SEGURANÇA: Processar pagamento no servidor (NUNCA simular no cliente)
      const response = await fetch('/api/pagamentos/processar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reservaId: dadosResumo.detalhesReserva?.id,
          valor: dadosResumo.total,
          metodo: dadosPagamento.metodo,
          dadosCartao: dadosPagamento.metodo === 'cartao' ? dadosPagamento.dadosCartao : undefined
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao processar pagamento');
      }

      const { comprovante: novoComprovante } = await response.json();

      setComprovante(novoComprovante);
      setEtapa("comprovante");
      onPagamentoConcluido?.(novoComprovante);

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setEtapa("resumo");
      alert(error instanceof Error ? error.message : 'Erro ao processar pagamento');
    }
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
