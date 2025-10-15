import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Check,
  X,
  Crown,
  Star,
  Zap,
  Calendar,
  TrendingUp,
  Clock,
  Shield,
  Gift,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SubscriptionPlansProps {
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
  onBack: () => void;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceYearly: number;
  icon: typeof Crown;
  color: string;
  bgColor: string;
  popular?: boolean;
  description: string;
  features: {
    name: string;
    included: boolean;
    value?: string;
  }[];
  benefits: string[];
}

const plans: Plan[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: 89.90,
    priceYearly: 899.90,
    icon: Shield,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    description: "Ideal para quem joga ocasionalmente",
    features: [
      { name: "Horas mensais incluídas", included: true, value: "4 horas" },
      { name: "Desconto em reservas adicionais", included: true, value: "10%" },
      { name: "Prioridade na reserva", included: false },
      { name: "Cancelamento gratuito", included: true, value: "48h antes" },
      { name: "Reservas simultâneas", included: true, value: "2" },
      { name: "Convidados por jogo", included: true, value: "10" },
      { name: "Programa de indicação", included: true },
      { name: "Suporte prioritário", included: false },
      { name: "Acesso a eventos exclusivos", included: false },
    ],
    benefits: [
      "4 horas de jogo por mês",
      "10% de desconto em horas extras",
      "Convide até 10 amigos por jogo",
    ],
  },
  {
    id: "silver",
    name: "Prata",
    price: 159.90,
    priceYearly: 1599.90,
    icon: Star,
    color: "text-slate-600",
    bgColor: "bg-slate-50 dark:bg-slate-950/20",
    popular: true,
    description: "Perfeito para jogadores regulares",
    features: [
      { name: "Horas mensais incluídas", included: true, value: "8 horas" },
      { name: "Desconto em reservas adicionais", included: true, value: "15%" },
      { name: "Prioridade na reserva", included: true, value: "Média" },
      { name: "Cancelamento gratuito", included: true, value: "24h antes" },
      { name: "Reservas simultâneas", included: true, value: "3" },
      { name: "Convidados por jogo", included: true, value: "15" },
      { name: "Programa de indicação", included: true },
      { name: "Suporte prioritário", included: true },
      { name: "Acesso a eventos exclusivos", included: false },
    ],
    benefits: [
      "8 horas de jogo por mês",
      "15% de desconto em horas extras",
      "Prioridade média nas reservas",
      "Suporte prioritário",
    ],
  },
  {
    id: "gold",
    name: "Ouro",
    price: 249.90,
    priceYearly: 2499.90,
    icon: Crown,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    description: "Para atletas que jogam frequentemente",
    features: [
      { name: "Horas mensais incluídas", included: true, value: "15 horas" },
      { name: "Desconto em reservas adicionais", included: true, value: "20%" },
      { name: "Prioridade na reserva", included: true, value: "Máxima" },
      { name: "Cancelamento gratuito", included: true, value: "2h antes" },
      { name: "Reservas simultâneas", included: true, value: "Ilimitado" },
      { name: "Convidados por jogo", included: true, value: "Ilimitado" },
      { name: "Programa de indicação", included: true },
      { name: "Suporte prioritário", included: true },
      { name: "Acesso a eventos exclusivos", included: true },
    ],
    benefits: [
      "15 horas de jogo por mês",
      "20% de desconto em horas extras",
      "Prioridade máxima nas reservas",
      "Cancelamento até 2h antes",
      "Reservas e convidados ilimitados",
      "Acesso VIP a eventos exclusivos",
    ],
  },
];

export function SubscriptionPlans({
  currentPlan,
  onSelectPlan,
  onBack,
}: SubscriptionPlansProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [showComparison, setShowComparison] = useState(false);

  const handleSelectPlan = (planId: string) => {
    if (currentPlan === planId) {
      toast.info("Você já está neste plano");
      return;
    }
    onSelectPlan(planId);
  };

  const getYearlySavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCost = monthlyPrice * 12;
    const savings = monthlyCost - yearlyPrice;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { savings, percentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-4xl">Planos de Mensalidade</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Escolha o plano perfeito para você e economize jogando mais
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant={billingCycle === "monthly" ? "default" : "outline"}
              onClick={() => setBillingCycle("monthly")}
              className="min-w-[120px]"
            >
              Mensal
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "outline"}
              onClick={() => setBillingCycle("yearly")}
              className="min-w-[120px] relative"
            >
              Anual
              <Badge className="absolute -top-2 -right-2 bg-accent">
                -20%
              </Badge>
            </Button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;
            const price = billingCycle === "monthly" ? plan.price : plan.priceYearly;
            const savings = billingCycle === "yearly" ? getYearlySavings(plan.price, plan.priceYearly) : null;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-accent shadow-lg px-4 py-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <Card
                  className={`h-full transition-all hover:shadow-xl ${
                    plan.popular ? "border-primary border-2 shadow-lg" : ""
                  } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
                >
                  <CardHeader className={plan.bgColor}>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`h-8 w-8 ${plan.color}`} />
                      {isCurrentPlan && (
                        <Badge variant="secondary">
                          <Check className="h-3 w-3 mr-1" />
                          Plano Atual
                        </Badge>
                      )}
                    </div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>

                    <div className="pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl">R$ {price.toFixed(2)}</span>
                        <span className="text-muted-foreground">
                          /{billingCycle === "monthly" ? "mês" : "ano"}
                        </span>
                      </div>
                      {savings && (
                        <p className="text-sm text-success mt-2">
                          Economize R$ {savings.savings.toFixed(2)} ({savings.percentage}%) por ano
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-6">
                    {/* Benefits */}
                    <div className="space-y-3">
                      {plan.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isCurrentPlan}
                      className={`w-full ${plan.popular ? "bg-accent hover:bg-accent/90" : ""}`}
                      size="lg"
                    >
                      {isCurrentPlan ? (
                        "Plano Atual"
                      ) : currentPlan ? (
                        <>
                          {plans.findIndex((p) => p.id === currentPlan) < index
                            ? "Fazer Upgrade"
                            : "Fazer Downgrade"}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Assinar Agora
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table Toggle */}
        <div className="text-center mb-8">
          <Button
            variant="outline"
            onClick={() => setShowComparison(!showComparison)}
            size="lg"
          >
            {showComparison ? "Ocultar" : "Ver"} Comparação Detalhada
            <TrendingUp className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Detailed Comparison Table */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Comparação Detalhada de Planos</CardTitle>
                <CardDescription>
                  Veja todos os recursos e benefícios lado a lado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Recurso</th>
                        {plans.map((plan) => {
                          const Icon = plan.icon;
                          return (
                            <th key={plan.id} className="text-center p-4">
                              <div className="flex flex-col items-center gap-2">
                                <Icon className={`h-6 w-6 ${plan.color}`} />
                                <span className="font-medium">{plan.name}</span>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {plans[0].features.map((_, featureIndex) => (
                        <tr key={featureIndex} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">
                            {plans[0].features[featureIndex].name}
                          </td>
                          {plans.map((plan) => {
                            const feature = plan.features[featureIndex];
                            return (
                              <td key={plan.id} className="text-center p-4">
                                {feature.included ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <Check className="h-5 w-5 text-success" />
                                    {feature.value && (
                                      <span className="text-xs text-muted-foreground">
                                        {feature.value}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Renovação Automática</h3>
                  <p className="text-sm text-muted-foreground">
                    Seu plano renova automaticamente. Cancele quando quiser.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Horas Rollover</h3>
                  <p className="text-sm text-muted-foreground">
                    Horas não utilizadas acumulam por até 2 meses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-success/10">
                  <Gift className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Bônus de Indicação</h3>
                  <p className="text-sm text-muted-foreground">
                    Ganhe 1 mês grátis a cada 3 amigos que assinarem.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Button variant="outline" onClick={onBack} size="lg">
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
