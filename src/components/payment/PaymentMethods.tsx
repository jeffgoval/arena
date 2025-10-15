import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { CreditCard, Smartphone, Wallet, Users, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export type PaymentMethodType = "credit-card" | "pix" | "account-balance" | "split";

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface PaymentMethodsProps {
  selectedMethod: PaymentMethodType | null;
  onSelectMethod: (method: PaymentMethodType) => void;
  accountBalance: number;
  totalAmount: number;
  savedCards?: SavedCard[];
}

export function PaymentMethods({
  selectedMethod,
  onSelectMethod,
  accountBalance,
  totalAmount,
  savedCards = [],
}: PaymentMethodsProps) {
  const hasBalance = accountBalance >= totalAmount;

  const methods = [
    {
      id: "credit-card" as PaymentMethodType,
      name: "Cartão de Crédito",
      description: savedCards.length > 0 
        ? `${savedCards.length} cartão(ões) salvos`
        : "Cartão de débito ou crédito",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      available: true,
      badge: savedCards.length > 0 ? "Salvo" : null,
    },
    {
      id: "pix" as PaymentMethodType,
      name: "PIX",
      description: "Pagamento instantâneo",
      icon: Smartphone,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      available: true,
      badge: "Instantâneo",
    },
    {
      id: "account-balance" as PaymentMethodType,
      name: "Créditos da Conta",
      description: `Saldo: R$ ${accountBalance.toFixed(2)}`,
      icon: Wallet,
      color: hasBalance ? "text-primary" : "text-muted-foreground",
      bgColor: hasBalance ? "bg-primary/10" : "bg-muted/30",
      available: hasBalance,
      badge: hasBalance ? "Disponível" : "Insuficiente",
    },
    {
      id: "split" as PaymentMethodType,
      name: "Dividir Pagamento",
      description: "Compartilhe com amigos",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
      available: true,
      badge: "Novo",
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Escolha a forma de pagamento</h3>
      <div className="grid grid-cols-1 gap-3">
        {methods.map((method, index) => {
          const isSelected = selectedMethod === method.id;
          const Icon = method.icon;

          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  !method.available ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "hover:border-primary/50 hover:shadow-md"
                }`}
                onClick={() => method.available && onSelectMethod(method.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-lg ${method.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${method.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{method.name}</p>
                        {method.badge && (
                          <Badge variant="outline" className="text-xs">
                            {method.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {method.description}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Saved Cards Quick Select */}
      {selectedMethod === "credit-card" && savedCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 space-y-2"
        >
          <p className="text-sm font-medium text-muted-foreground">Cartões salvos</p>
          {savedCards.map((card) => (
            <Card key={card.id} className="hover:border-primary/50 cursor-pointer transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {card.brand} •••• {card.last4}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Válido até {card.expiryMonth}/{card.expiryYear}
                    </p>
                  </div>
                  {card.isDefault && (
                    <Badge variant="outline" className="text-xs">
                      Padrão
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
}
