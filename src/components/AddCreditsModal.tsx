import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { CreditCard, Smartphone, DollarSign, CheckCircle2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AddCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
}

const PRESET_VALUES = [50, 100, 200, 500];

export function AddCreditsModal({ open, onOpenChange, currentBalance }: AddCreditsModalProps) {
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card">("pix");
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setAmount(100);
      setCustomAmount("");
      setPaymentMethod("pix");
      setIsProcessing(false);
    }
  }, [open]);

  const handleCustomAmountChange = (value: string) => {
    // Remove non-numeric characters except comma and dot
    const cleanValue = value.replace(/[^\d,\.]/g, "");
    setCustomAmount(cleanValue);
    
    // Convert to number
    const numValue = parseFloat(cleanValue.replace(",", "."));
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount < 10) {
      toast.error("O valor mínimo é R$ 10,00");
      return;
    }

    if (amount > 5000) {
      toast.error("O valor máximo é R$ 5.000,00");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    onOpenChange(false);

    // Show success message
    toast.success(
      `Créditos adicionados com sucesso!`,
      {
        description: `R$ ${amount.toFixed(2)} foram adicionados à sua conta.`,
        duration: 5000,
      }
    );
  };

  const newBalance = currentBalance + amount;
  const hasBonus = amount >= 200;
  const bonusAmount = hasBonus ? amount * 0.1 : 0;
  const totalAmount = amount + bonusAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Créditos</DialogTitle>
          <DialogDescription>
            Escolha o valor que deseja adicionar à sua conta
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Balance */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Saldo Atual</span>
              <span className="font-medium">R$ {currentBalance.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Novo Saldo</span>
              <span className="font-semibold text-primary">
                R$ {(currentBalance + totalAmount).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Preset Values */}
          <div className="space-y-3">
            <Label>Valor da Recarga</Label>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_VALUES.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={amount === value && !customAmount ? "default" : "outline"}
                  className="h-12"
                  onClick={() => {
                    setAmount(value);
                    setCustomAmount("");
                  }}
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  R$ {value}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="custom-amount">Ou digite um valor personalizado</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="custom-amount"
                type="text"
                placeholder="100,00"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Valor mínimo: R$ 10,00 | Máximo: R$ 5.000,00
            </p>
          </div>

          {/* Bonus Info */}
          {hasBonus && (
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-success">Bônus de 10%!</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Você ganhará R$ {bonusAmount.toFixed(2)} de bônus nesta recarga
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Forma de Pagamento</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "pix" | "credit_card")}>
              <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">PIX</p>
                    <p className="text-xs text-muted-foreground">Aprovação instantânea</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Cartão de Crédito</p>
                    <p className="text-xs text-muted-foreground">Aprovação em até 2 minutos</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Summary */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Valor da recarga</span>
              <span>R$ {amount.toFixed(2)}</span>
            </div>
            {hasBonus && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-success">Bônus (10%)</span>
                <span className="text-success">+ R$ {bonusAmount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total de créditos</span>
              <span className="text-primary">R$ {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Adicionar R$ {totalAmount.toFixed(2)}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
