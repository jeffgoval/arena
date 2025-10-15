import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Sparkles, 
  Star, 
  Mail, 
  Zap,
  ArrowRight,
  MapPin,
  CreditCard
} from "lucide-react";

interface DemoShowcaseProps {
  onNavigateToInvite: () => void;
  onShowRating: () => void;
  onNavigateToCourt?: () => void;
  onNavigateToPayment?: () => void;
}

export function DemoShowcase({ 
  onNavigateToInvite, 
  onShowRating, 
  onNavigateToCourt, 
  onNavigateToPayment
}: DemoShowcaseProps) {
  const features = [
    {
      icon: CreditCard,
      title: "Sistema de Pagamento",
      description: "PIX, cartão, divisão de conta e cupons de desconto",
      action: "Ver Pagamento",
      onClick: onNavigateToPayment,
      color: "bg-success/10 text-success"
    },
    {
      icon: Mail,
      title: "Visualização de Convite",
      description: "Veja como seus amigos receberão convites para jogos",
      action: "Ver Demo do Convite",
      onClick: onNavigateToInvite,
      color: "bg-info/10 text-info"
    },
    {
      icon: Star,
      title: "Avaliação Pós-Jogo",
      description: "Sistema completo de feedback e avaliação de participantes",
      action: "Ver Avaliação",
      onClick: onShowRating,
      color: "bg-accent/10 text-accent"
    },
    {
      icon: MapPin,
      title: "Detalhes da Quadra",
      description: "Explore informações completas sobre nossas quadras premium",
      action: "Ver Quadra",
      onClick: onNavigateToCourt,
      color: "bg-primary/10 text-primary"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-6 right-6 z-[100] max-w-sm"
      style={{ zIndex: 100 }}
    >
      <Card className="border-2 shadow-2xl backdrop-blur-sm bg-background/95">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-5 w-5 text-accent" />
            </motion.div>
            <CardTitle className="text-lg">Novos Recursos!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            if (!feature.onClick) return null;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={feature.onClick}
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-3 p-3 rounded-lg border hover:border-primary/50 transition-all">
                    <div className={`p-2 rounded-lg ${feature.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm mb-1">{feature.title}</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {feature.description}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-primary">
                        <Zap className="h-3 w-3" />
                        {feature.action}
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="pt-2 text-xs text-center text-muted-foreground"
          >
            Com animações Motion 🎨
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
