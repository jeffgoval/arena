import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { PaymentMethods, PaymentMethodType } from "./PaymentMethods";
import { CreditCardForm, CreditCardData } from "./CreditCardForm";
import { PixPayment } from "./PixPayment";
import { SplitPayment } from "./SplitPayment";
import { PaymentConfirmation } from "./PaymentConfirmation";
import { PaymentReceipt } from "./PaymentReceipt";
import { WhatsAppPreview } from "../WhatsAppPreview";
import {
  ArrowLeft,
  Tag,
  AlertCircle,
  Info,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface PaymentFlowProps {
  bookingDetails: {
    court: string;
    date: string;
    time: string;
    duration: string;
    basePrice: number;
  };
  onBack: () => void;
  onComplete: () => void;
}

export function PaymentFlow({ bookingDetails, onBack, onComplete }: PaymentFlowProps) {
  const [step, setStep] = useState<"method" | "details" | "processing" | "confirmed">("method");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [cardData, setCardData] = useState<CreditCardData | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Mock data
  const accountBalance = 150; // User's account balance
  const savedCards = [
    {
      id: "card1",
      brand: "Visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "25",
      isDefault: true,
    },
  ];

  // Calculate total
  const baseAmount = bookingDetails.basePrice;
  const discount = appliedCoupon?.discount || 0;
  const totalAmount = Math.max(0, baseAmount - discount);

  const transactionId = `TRX${Date.now().toString().slice(-8)}`;
  const currentDate = new Date().toLocaleString("pt-BR");

  const handleApplyCoupon = () => {
    // Mock coupon validation
    const mockCoupons: Record<string, number> = {
      PRIMEIRA10: baseAmount * 0.1,
      VIP15: baseAmount * 0.15,
      AMIGO20: baseAmount * 0.2,
    };

    const couponUpper = couponCode.toUpperCase();
    if (mockCoupons[couponUpper]) {
      setAppliedCoupon({
        code: couponUpper,
        discount: mockCoupons[couponUpper],
      });
      toast.success(`Cupom "${couponUpper}" aplicado com sucesso!`);
      setCouponCode("");
    } else {
      toast.error("Cupom inválido ou expirado");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Cupom removido");
  };

  const handleMethodSelect = (method: PaymentMethodType) => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (!selectedMethod) {
      toast.error("Selecione um método de pagamento");
      return;
    }

    // For account balance, pay immediately
    if (selectedMethod === "account-balance") {
      handleProcessPayment();
      return;
    }

    setStep("details");
  };

  const handleProcessPayment = () => {
    setStep("processing");

    // Simulate payment processing
    setTimeout(() => {
      setStep("confirmed");
      toast.success("Pagamento processado com sucesso!");
    }, 2000);
  };

  const getPaymentMethodLabel = () => {
    switch (selectedMethod) {
      case "credit-card":
        return cardData?.installments && cardData.installments > 1
          ? `Cartão de Crédito (${cardData.installments}x)`
          : "Cartão de Crédito";
      case "pix":
        return "PIX";
      case "account-balance":
        return "Créditos da Conta";
      case "split":
        return "Pagamento Dividido";
      default:
        return "Não definido";
    }
  };

  const progressPercentage = step === "method" ? 33 : step === "details" ? 66 : 100;

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Pagamento Seguro
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete seu pagamento e garanta sua reserva
            </p>
          </div>
        </div>

        {/* Progress */}
        {step !== "confirmed" && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progresso</span>
                  <span className="text-muted-foreground">
                    {step === "method" && "Selecionando método"}
                    {step === "details" && "Inserindo dados"}
                    {step === "processing" && "Processando..."}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Select Method */}
              {step === "method" && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Forma de Pagamento</CardTitle>
                      <CardDescription>
                        Escolha como deseja pagar sua reserva
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PaymentMethods
                        selectedMethod={selectedMethod}
                        onSelectMethod={handleMethodSelect}
                        accountBalance={accountBalance}
                        totalAmount={totalAmount}
                        savedCards={savedCards}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment Details */}
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {selectedMethod === "credit-card" && "Dados do Cartão"}
                        {selectedMethod === "pix" && "Pagamento via PIX"}
                        {selectedMethod === "split" && "Dividir Pagamento"}
                      </CardTitle>
                      <CardDescription>
                        {selectedMethod === "credit-card" &&
                          "Preencha os dados do seu cartão de forma segura"}
                        {selectedMethod === "pix" &&
                          "Escaneie o QR Code ou copie o código"}
                        {selectedMethod === "split" &&
                          "Configure como dividir o pagamento"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedMethod === "credit-card" && (
                        <CreditCardForm
                          onCardDataChange={setCardData}
                          totalAmount={totalAmount}
                        />
                      )}
                      {selectedMethod === "pix" && (
                        <PixPayment
                          amount={totalAmount}
                          onPaymentConfirmed={handleProcessPayment}
                        />
                      )}
                      {selectedMethod === "split" && (
                        <SplitPayment
                          totalAmount={totalAmount}
                          onContinue={(participants) => {
                            console.log("Split with:", participants);
                            toast.success("Convites enviados aos participantes!");
                            handleProcessPayment();
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Processing */}
              {step === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card>
                    <CardContent className="p-12 text-center space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="h-16 w-16 mx-auto border-4 border-primary border-t-transparent rounded-full"
                      />
                      <div>
                        <p className="font-medium text-lg">Processando Pagamento</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Aguarde enquanto confirmamos sua transação...
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        <span>Conexão segura e criptografada</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            {step === "method" && (
              <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!selectedMethod}
                  className="flex-1"
                  size="lg"
                >
                  Continuar
                </Button>
              </div>
            )}

            {step === "details" && selectedMethod === "credit-card" && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("method")}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  disabled={
                    !cardData?.number ||
                    !cardData?.name ||
                    !cardData?.expiry ||
                    !cardData?.cvv
                  }
                  className="flex-1"
                  size="lg"
                >
                  Pagar Agora
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-base">Resumo da Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quadra</p>
                    <p className="font-medium">{bookingDetails.court}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data</p>
                    <p className="font-medium">{bookingDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Horário</p>
                    <p className="font-medium">
                      {bookingDetails.time} ({bookingDetails.duration})
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Coupon */}
                <div className="space-y-2">
                  <Label className="text-sm">Cupom de Desconto</Label>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite o código"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode}
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-success/10 rounded border border-success/20">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-success">
                          {appliedCoupon.code}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="h-6 px-2"
                      >
                        Remover
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Dica: Tente PRIMEIRA10, VIP15 ou AMIGO20
                  </p>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {baseAmount.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Desconto</span>
                      <span>-R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R$ {totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <Lock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    Seus dados estão protegidos com criptografia SSL
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Precisa de ajuda?</p>
                    <p className="text-xs text-muted-foreground">
                      Entre em contato conosco pelo WhatsApp ou email para qualquer dúvida sobre pagamentos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Modal */}
        {step === "confirmed" && !showWhatsApp && (
          <PaymentConfirmation
            amount={totalAmount}
            paymentMethod={getPaymentMethodLabel()}
            transactionId={transactionId}
            bookingDetails={bookingDetails}
            onClose={onComplete}
            onViewReceipt={() => setShowReceipt(true)}
            onViewWhatsApp={() => setShowWhatsApp(true)}
          />
        )}

        {/* Receipt Modal */}
        {showReceipt && (
          <PaymentReceipt
            transactionId={transactionId}
            date={currentDate}
            amount={totalAmount}
            paymentMethod={getPaymentMethodLabel()}
            bookingDetails={bookingDetails}
            customerName="João Silva"
            customerEmail="joao@email.com"
            discount={discount}
            onClose={() => setShowReceipt(false)}
          />
        )}

        {/* WhatsApp Preview */}
        {showWhatsApp && (
          <WhatsAppPreview
            bookingDetails={{
              court: bookingDetails.court,
              date: bookingDetails.date,
              time: bookingDetails.time,
              duration: bookingDetails.duration,
              price: totalAmount,
            }}
            customerName="João Silva"
            customerPhone="+55 11 98765-4321"
            onClose={() => setShowWhatsApp(false)}
            onSend={() => {
              setShowWhatsApp(false);
              toast.success("Confirmação enviada por WhatsApp!");
            }}
          />
        )}
      </div>
    </div>
  );
}
