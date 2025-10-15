import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Copy, CheckCircle, Clock, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { copyToClipboard } from "../../lib/clipboard";

interface PixPaymentProps {
  amount: number;
  onPaymentConfirmed: () => void;
}

export function PixPayment({ amount, onPaymentConfirmed }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate mock PIX code
  const pixCode = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 38)}52040000530398654${amount.toFixed(2)}5802BR5925Arena Dona Santa6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyCode = async () => {
    const success = await copyToClipboard(pixCode);
    if (success) {
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Não foi possível copiar o código");
    }
  };

  // Simulate payment confirmation after 3 seconds for demo
  const handleSimulatePayment = () => {
    setIsProcessing(true);
    toast.loading("Verificando pagamento...");
    
    setTimeout(() => {
      toast.dismiss();
      toast.success("Pagamento confirmado!");
      onPaymentConfirmed();
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
        <Clock className="h-4 w-4 text-amber-600" />
        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
          Código expira em: <span className="font-mono">{formatTime(timeLeft)}</span>
        </p>
      </div>

      {/* QR Code Placeholder */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Mock QR Code */}
            <div className="relative">
              <div className="h-48 w-48 bg-white border-4 border-black rounded-lg p-2">
                <div className="h-full w-full bg-gradient-to-br from-black via-gray-800 to-black opacity-90 rounded grid grid-cols-8 gap-0.5 p-2">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        Math.random() > 0.5 ? "bg-black" : "bg-white"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-primary rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900">
                <QrCode className="h-6 w-6 text-white" />
              </div>
            </div>

            <div>
              <p className="font-medium text-lg">Escaneie o QR Code</p>
              <p className="text-sm text-muted-foreground mt-1">
                Abra o app do seu banco e escaneie o código
              </p>
            </div>

            <Badge variant="outline" className="text-2xl py-2 px-4 font-bold">
              R$ {amount.toFixed(2)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">ou</span>
        </div>
      </div>

      {/* PIX Code */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-center">Copie o código PIX</p>
        <div className="relative">
          <div className="p-4 bg-muted/50 rounded-lg border border-dashed font-mono text-xs break-all leading-relaxed">
            {pixCode}
          </div>
          <Button
            size="sm"
            variant={copied ? "default" : "outline"}
            className="absolute top-2 right-2"
            onClick={handleCopyCode}
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
              1
            </div>
            Como pagar com PIX
          </h4>
          <ol className="space-y-2 text-sm text-muted-foreground ml-8">
            <li>1. Abra o app do seu banco</li>
            <li>2. Escolha pagar com PIX QR Code ou Copia e Cola</li>
            <li>3. Escaneie o código ou cole o código copiado</li>
            <li>4. Confirme as informações e finalize</li>
          </ol>
        </CardContent>
      </Card>

      {/* Auto-detect notice */}
      <AnimatePresence>
        {!isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900"
          >
            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                Confirmação automática
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Assim que o pagamento for identificado, você será redirecionado automaticamente
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo: Simulate payment button */}
      <div className="pt-4 border-t">
        <Button
          onClick={handleSimulatePayment}
          disabled={isProcessing}
          className="w-full"
          variant="outline"
        >
          {isProcessing ? "Verificando pagamento..." : "🎬 Simular Pagamento (Demo)"}
        </Button>
      </div>

      {/* Processing indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Card className="max-w-sm">
              <CardContent className="p-6 text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-16 w-16 mx-auto border-4 border-primary border-t-transparent rounded-full"
                />
                <div>
                  <p className="font-medium">Aguardando confirmação</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Verificando o pagamento...
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
