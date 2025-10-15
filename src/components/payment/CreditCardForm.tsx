import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { CreditCard, Lock } from "lucide-react";
import { motion } from "motion/react";

interface CreditCardFormProps {
  onCardDataChange: (data: CreditCardData) => void;
  totalAmount: number;
}

export interface CreditCardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  installments: number;
  saveCard: boolean;
}

export function CreditCardForm({ onCardDataChange, totalAmount }: CreditCardFormProps) {
  const [cardData, setCardData] = useState<CreditCardData>({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    installments: 1,
    saveCard: false,
  });

  const [focused, setFocused] = useState<string | null>(null);

  const updateCardData = (field: keyof CreditCardData, value: string | number | boolean) => {
    const newData = { ...cardData, [field]: value };
    setCardData(newData);
    onCardDataChange(newData);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 16) {
      updateCardData("number", cleaned);
    }
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 4) {
      updateCardData("expiry", cleaned);
    }
  };

  const handleCvvChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) {
      updateCardData("cvv", cleaned);
    }
  };

  // Calculate installments
  const maxInstallments = Math.min(12, Math.floor(totalAmount / 50)); // Min R$ 50 per installment
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1);

  const getCardBrand = (number: string) => {
    const firstDigit = number.charAt(0);
    if (firstDigit === "4") return "Visa";
    if (firstDigit === "5") return "Mastercard";
    if (firstDigit === "3") return "Amex";
    return "Cartão";
  };

  return (
    <div className="space-y-6">
      {/* Card Preview */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: focused === "cvv" ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden relative h-52">
          <CardContent className="p-6 h-full flex flex-col justify-between">
            {focused !== "cvv" ? (
              <>
                <div className="flex items-start justify-between">
                  <div className="h-10 w-14 bg-yellow-400/80 rounded"></div>
                  <p className="text-sm opacity-80">{getCardBrand(cardData.number)}</p>
                </div>
                <div>
                  <p className="text-2xl tracking-wider font-mono mb-6">
                    {formatCardNumber(cardData.number) || "•••• •••• •••• ••••"}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs opacity-70 mb-1">Nome do Titular</p>
                      <p className="text-sm font-medium uppercase">
                        {cardData.name || "SEU NOME"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70 mb-1">Validade</p>
                      <p className="text-sm font-medium font-mono">
                        {formatExpiry(cardData.expiry) || "MM/AA"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="w-full">
                  <div className="h-12 bg-black/30 -mx-6 mb-4"></div>
                  <div className="flex justify-end">
                    <div className="bg-white text-black px-4 py-2 rounded font-mono">
                      {cardData.cvv || "•••"}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Card pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full translate-y-20 -translate-x-20"></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Número do Cartão</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              placeholder="0000 0000 0000 0000"
              value={formatCardNumber(cardData.number)}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              onFocus={() => setFocused("number")}
              onBlur={() => setFocused(null)}
              maxLength={19}
            />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardName">Nome do Titular</Label>
          <Input
            id="cardName"
            placeholder="Como está no cartão"
            value={cardData.name}
            onChange={(e) => updateCardData("name", e.target.value.toUpperCase())}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Validade</Label>
            <Input
              id="expiry"
              placeholder="MM/AA"
              value={formatExpiry(cardData.expiry)}
              onChange={(e) => handleExpiryChange(e.target.value)}
              onFocus={() => setFocused("expiry")}
              onBlur={() => setFocused(null)}
              maxLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <div className="relative">
              <Input
                id="cvv"
                type="password"
                placeholder="•••"
                value={cardData.cvv}
                onChange={(e) => handleCvvChange(e.target.value)}
                onFocus={() => setFocused("cvv")}
                onBlur={() => setFocused(null)}
                maxLength={3}
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Installments */}
        {maxInstallments > 1 && (
          <div className="space-y-2">
            <Label htmlFor="installments">Parcelamento</Label>
            <Select
              value={cardData.installments.toString()}
              onValueChange={(value) => updateCardData("installments", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {installmentOptions.map((num) => {
                  const installmentValue = totalAmount / num;
                  return (
                    <SelectItem key={num} value={num.toString()}>
                      {num}x de R$ {installmentValue.toFixed(2)}
                      {num === 1 ? " (à vista)" : ` sem juros`}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Save Card */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm font-medium">Salvar cartão</p>
            <p className="text-xs text-muted-foreground">
              Para facilitar pagamentos futuros
            </p>
          </div>
          <Switch
            checked={cardData.saveCard}
            onCheckedChange={(checked) => updateCardData("saveCard", checked)}
          />
        </div>

        {/* Security Notice */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
          <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
              Pagamento 100% seguro
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Seus dados são criptografados e protegidos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
