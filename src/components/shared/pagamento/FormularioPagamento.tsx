"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Wallet, Check, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type MetodoPagamento = "pix" | "cartao" | "saldo";

export interface DadosPagamento {
  metodo: MetodoPagamento;
  cartao?: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  };
}

interface FormularioPagamentoProps {
  valor: number;
  saldoDisponivel?: number;
  onPagamentoConfirmado: (dados: DadosPagamento) => void;
  onCancelar?: () => void;
  processando?: boolean;
  className?: string;
}

export function FormularioPagamento({
  valor,
  saldoDisponivel = 0,
  onPagamentoConfirmado,
  onCancelar,
  processando = false,
  className
}: FormularioPagamentoProps) {
  const [metodoSelecionado, setMetodoSelecionado] = useState<MetodoPagamento>("pix");
  
  // Estados do formulário de cartão
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("");
  const [cvvCartao, setCvvCartao] = useState("");

  const saldoSuficiente = saldoDisponivel >= valor;

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarNumeroCartao = (value: string) => {
    const numeros = value.replace(/\D/g, '');
    const grupos = numeros.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : numeros;
  };

  const formatarValidade = (value: string) => {
    const numeros = value.replace(/\D/g, '');
    if (numeros.length >= 2) {
      return numeros.slice(0, 2) + '/' + numeros.slice(2, 4);
    }
    return numeros;
  };

  const handleNumeroCartaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatarNumeroCartao(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setNumeroCartao(formatted);
    }
  };

  const handleValidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatarValidade(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 4) {
      setValidadeCartao(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeros = e.target.value.replace(/\D/g, '');
    if (numeros.length <= 4) {
      setCvvCartao(numeros);
    }
  };

  const validarFormulario = (): boolean => {
    if (metodoSelecionado === "cartao") {
      const numeroLimpo = numeroCartao.replace(/\s/g, '');
      if (numeroLimpo.length !== 16) return false;
      if (!nomeCartao.trim()) return false;
      if (validadeCartao.replace(/\D/g, '').length !== 4) return false;
      if (cvvCartao.length < 3) return false;
    }
    
    if (metodoSelecionado === "saldo" && !saldoSuficiente) {
      return false;
    }

    return true;
  };

  const handleConfirmar = () => {
    if (!validarFormulario()) return;

    const dados: DadosPagamento = {
      metodo: metodoSelecionado,
      ...(metodoSelecionado === "cartao" && {
        cartao: {
          numero: numeroCartao,
          nome: nomeCartao,
          validade: validadeCartao,
          cvv: cvvCartao
        }
      })
    };

    onPagamentoConfirmado(dados);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Valor a Pagar */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Valor a pagar</p>
            <p className="text-3xl font-bold text-primary">{formatarValor(valor)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Seleção de Método */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Método de Pagamento</Label>
        
        <div className="grid gap-3">
          {/* PIX */}
          <button
            onClick={() => setMetodoSelecionado("pix")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
              "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
              metodoSelecionado === "pix" 
                ? "border-primary bg-primary/5" 
                : "border-border"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              metodoSelecionado === "pix" ? "bg-primary/10" : "bg-muted"
            )}>
              <Smartphone className={cn(
                "w-6 h-6",
                metodoSelecionado === "pix" ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1">
              <p className="font-semibold">PIX</p>
              <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
            </div>
            {metodoSelecionado === "pix" && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </button>

          {/* Cartão de Crédito */}
          <button
            onClick={() => setMetodoSelecionado("cartao")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
              "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
              metodoSelecionado === "cartao" 
                ? "border-primary bg-primary/5" 
                : "border-border"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              metodoSelecionado === "cartao" ? "bg-primary/10" : "bg-muted"
            )}>
              <CreditCard className={cn(
                "w-6 h-6",
                metodoSelecionado === "cartao" ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Cartão de Crédito</p>
              <p className="text-sm text-muted-foreground">Visa, Mastercard, Elo</p>
            </div>
            {metodoSelecionado === "cartao" && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </button>

          {/* Saldo */}
          <button
            onClick={() => setMetodoSelecionado("saldo")}
            disabled={!saldoSuficiente}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
              "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
              metodoSelecionado === "saldo" 
                ? "border-primary bg-primary/5" 
                : "border-border",
              !saldoSuficiente && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              metodoSelecionado === "saldo" ? "bg-primary/10" : "bg-muted"
            )}>
              <Wallet className={cn(
                "w-6 h-6",
                metodoSelecionado === "saldo" ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Saldo em Conta</p>
              <p className={cn(
                "text-sm",
                saldoSuficiente ? "text-green-600" : "text-destructive"
              )}>
                Disponível: {formatarValor(saldoDisponivel)}
              </p>
            </div>
            {metodoSelecionado === "saldo" && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Formulário PIX */}
      {metodoSelecionado === "pix" && (
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-2">Pagamento via PIX</p>
                <p className="text-sm text-muted-foreground">
                  Após confirmar, você receberá o QR Code para realizar o pagamento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário Cartão */}
      {metodoSelecionado === "cartao" && (
        <Card className="border border-border">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="numeroCartao">Número do Cartão *</Label>
              <Input
                id="numeroCartao"
                placeholder="0000 0000 0000 0000"
                value={numeroCartao}
                onChange={handleNumeroCartaoChange}
                maxLength={19}
              />
            </div>

            <div>
              <Label htmlFor="nomeCartao">Nome no Cartão *</Label>
              <Input
                id="nomeCartao"
                placeholder="NOME COMO ESTÁ NO CARTÃO"
                value={nomeCartao}
                onChange={(e) => setNomeCartao(e.target.value.toUpperCase())}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validade">Validade *</Label>
                <Input
                  id="validade"
                  placeholder="MM/AA"
                  value={validadeCartao}
                  onChange={handleValidadeChange}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvvCartao}
                  onChange={handleCvvChange}
                  maxLength={4}
                  type="password"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Seus dados estão protegidos e criptografados
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário Saldo */}
      {metodoSelecionado === "saldo" && (
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="font-semibold mb-2">Pagamento com Saldo</p>
                <p className="text-sm text-muted-foreground mb-4">
                  O valor será debitado do seu saldo disponível
                </p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Saldo atual</p>
                    <p className="font-semibold">{formatarValor(saldoDisponivel)}</p>
                  </div>
                  <div className="text-muted-foreground">→</div>
                  <div>
                    <p className="text-muted-foreground">Saldo após pagamento</p>
                    <p className="font-semibold text-green-600">
                      {formatarValor(saldoDisponivel - valor)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões de Ação */}
      <div className="flex gap-3 pt-4">
        {onCancelar && (
          <Button
            variant="outline"
            onClick={onCancelar}
            disabled={processando}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
        <Button
          onClick={handleConfirmar}
          disabled={!validarFormulario() || processando}
          className="flex-1"
        >
          {processando ? "Processando..." : "Confirmar Pagamento"}
        </Button>
      </div>
    </div>
  );
}
