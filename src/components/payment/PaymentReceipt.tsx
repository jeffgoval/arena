import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { CheckCircle, Download, X, Calendar, Clock, MapPin, User, CreditCard, Hash } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PaymentReceiptProps {
  transactionId: string;
  date: string;
  amount: number;
  paymentMethod: string;
  bookingDetails: {
    court: string;
    date: string;
    time: string;
    duration: string;
  };
  customerName: string;
  customerEmail: string;
  discount?: number;
  onClose: () => void;
}

export function PaymentReceipt({
  transactionId,
  date,
  amount,
  paymentMethod,
  bookingDetails,
  customerName,
  customerEmail,
  discount = 0,
  onClose,
}: PaymentReceiptProps) {
  const subtotal = amount + discount;

  const handleDownload = () => {
    toast.success("Comprovante baixado com sucesso!");
    // In a real app, this would generate a PDF
  };

  const handlePrint = () => {
    window.print();
    toast.success("Abrindo janela de impressão...");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Comprovante de Pagamento</h2>
                <p className="text-white/80 text-sm">Arena Dona Santa</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Status Badge */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Pagamento Aprovado</span>
            </div>
          </div>

          {/* Receipt Body */}
          <div className="p-6 space-y-6">
            {/* Transaction Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Número do Comprovante</p>
                <p className="font-mono font-medium">{transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data e Hora</p>
                <p className="font-medium">{date}</p>
              </div>
            </div>

            <Separator />

            {/* Customer Info */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Dados do Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nome</p>
                  <p className="font-medium">{customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{customerEmail}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Booking Details */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Detalhes da Reserva
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Quadra</p>
                    <p className="font-medium">{bookingDetails.court}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{bookingDetails.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Horário e Duração</p>
                    <p className="font-medium">
                      {bookingDetails.time} - {bookingDetails.duration}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Info */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Informações de Pagamento
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método de Pagamento</span>
                  <span className="font-medium">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-2">
                      Desconto
                      <Badge variant="outline" className="text-xs">
                        Cupom Aplicado
                      </Badge>
                    </span>
                    <span className="font-medium">-R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-medium">Total Pago</span>
                  <span className="font-bold text-success">R$ {amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <strong>ID da Transação:</strong> {transactionId}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Este comprovante é válido como documento fiscal. Guarde-o para referência futura.
              </p>
              <p className="text-xs text-muted-foreground">
                Em caso de dúvidas, entre em contato conosco através do email:{" "}
                <a href="mailto:contato@arenadona santa.com" className="text-primary hover:underline">
                  contato@arenadona santa.com
                </a>
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                Imprimir
              </Button>
            </div>

            {/* Company Info */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm font-medium">Arena Dona Santa</p>
              <p className="text-xs text-muted-foreground">
                Rua Exemplo, 123 - São Paulo, SP - CEP 01234-567
              </p>
              <p className="text-xs text-muted-foreground">
                CNPJ: 12.345.678/0001-90
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
