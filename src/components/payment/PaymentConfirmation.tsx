import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, Download, Share2, Calendar, Clock, MapPin, CreditCard, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";
import { copyToClipboard } from "../../lib/clipboard";

interface PaymentConfirmationProps {
  amount: number;
  paymentMethod: string;
  transactionId: string;
  bookingDetails: {
    court: string;
    date: string;
    time: string;
    duration: string;
  };
  onClose: () => void;
  onViewReceipt: () => void;
  onViewWhatsApp?: () => void;
}

export function PaymentConfirmation({
  amount,
  paymentMethod,
  transactionId,
  bookingDetails,
  onClose,
  onViewReceipt,
  onViewWhatsApp,
}: PaymentConfirmationProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const handleShare = async () => {
    const text = `🎾 Reserva confirmada!\n\n📍 ${bookingDetails.court}\n📅 ${bookingDetails.date} às ${bookingDetails.time}\n💰 R$ ${amount.toFixed(2)}\n\nNos vemos em quadra! 🏟️`;
    
    // Check if Web Share API is available and supported
    if (navigator.share && navigator.canShare && navigator.canShare({ text })) {
      try {
        await navigator.share({
          title: "Reserva Confirmada - Arena Dona Santa",
          text: text,
        });
        toast.success("Compartilhado com sucesso!");
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          // Fallback to clipboard
          const success = await copyToClipboard(text);
          if (success) {
            toast.success("Texto copiado para a área de transferência!");
          } else {
            toast.error("Não foi possível compartilhar ou copiar.");
          }
        }
      }
    } else {
      // Fallback to clipboard
      const success = await copyToClipboard(text);
      if (success) {
        toast.success("Texto copiado para a área de transferência!");
      } else {
        toast.error("Não foi possível copiar para a área de transferência.");
      }
    }
  };

  const handleDownloadReceipt = () => {
    toast.success("Comprovante baixado com sucesso!");
    onViewReceipt();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Success Header */}
            <div className="bg-gradient-to-br from-success to-success/80 text-white p-8 text-center relative overflow-hidden">
              {/* Confetti Animation */}
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, opacity: 1 }}
                      animate={{
                        y: 400,
                        x: Math.random() * 400 - 200,
                        rotate: Math.random() * 360,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        ease: "easeOut",
                      }}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: -20,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: [
                            "#f59e0b",
                            "#3b82f6",
                            "#ec4899",
                            "#10b981",
                          ][Math.floor(Math.random() * 4)],
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="inline-block"
              >
                <div className="h-20 w-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-success" />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h2>
                <p className="text-white/90">Sua reserva está garantida</p>
              </motion.div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              {/* Amount */}
              <div className="text-center pb-4 border-b">
                <p className="text-sm text-muted-foreground mb-1">Valor Pago</p>
                <p className="text-3xl font-bold text-success">
                  R$ {amount.toFixed(2)}
                </p>
              </div>

              {/* Booking Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Quadra</p>
                    <p className="font-medium">{bookingDetails.court}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{bookingDetails.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Horário</p>
                    <p className="font-medium">
                      {bookingDetails.time} ({bookingDetails.duration})
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                    <p className="font-medium">{paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Transaction ID */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">ID da Transação</p>
                <p className="text-sm font-mono">{transactionId}</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button variant="outline" onClick={handleDownloadReceipt}>
                  <Download className="h-4 w-4 mr-2" />
                  Comprovante
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>

              {/* WhatsApp Confirmation */}
              {onViewWhatsApp && (
                <Button 
                  variant="outline" 
                  onClick={onViewWhatsApp}
                  className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ver Confirmação WhatsApp
                </Button>
              )}

              {/* Close Button */}
              <Button onClick={onClose} className="w-full" size="lg">
                Voltar ao Dashboard
              </Button>

              {/* Info */}
              <p className="text-xs text-center text-muted-foreground">
                Um email de confirmação foi enviado para você
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
