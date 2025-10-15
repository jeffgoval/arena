/**
 * Components Showcase
 * Visual demonstration of all component variants
 */

import { useState } from "react";
import { 
  CardVariant, 
  InteractiveCard, 
  GhostCard, 
  BorderedCard, 
  GradientCard,
  SuccessCard,
  WarningCard,
  ErrorCard,
  StatCard,
} from "./ui/card-variants";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { 
  BadgeVariant,
  SuccessBadge,
  WarningBadge,
  ErrorBadge,
  InfoBadge,
  StatusBadge,
  CountBadge,
  NewBadge,
  ProBadge,
} from "./ui/badge-variants";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Check,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ComponentsShowcase() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [animationDemo, setAnimationDemo] = useState<string | null>(null);

  const triggerAnimation = (animation: string) => {
    setAnimationDemo(animation);
    setTimeout(() => setAnimationDemo(null), 1000);
  };

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Componentes - Fase 3</h1>
        <p className="text-lg text-muted-foreground">
          Demonstração completa de Card variants, Badge system e Micro-interactions
        </p>
      </div>

      <Separator />

      {/* Card Variants Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Card Variants</h2>
          <p className="text-muted-foreground">
            9 variações de cards para diferentes contextos
          </p>
        </div>

        {/* Row 1: Basic Variants */}
        <div className="grid gap-6 md:grid-cols-3">
          <CardVariant variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Default com shadow suave</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Ideal para conteúdo padrão. Tem elevação sutil que aumenta no hover.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Ação</Button>
            </CardFooter>
          </CardVariant>

          <InteractiveCard onClick={() => {
            setSelectedCard("interactive");
            toast.success("Interactive Card clicado!");
          }}>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Hover lift + clicável</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Clique em mim! Levanta 4px no hover e tem feedback ao clicar.
              </p>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">
                {selectedCard === "interactive" ? "✓ Selecionado" : "Clique para selecionar"}
              </span>
            </CardFooter>
          </InteractiveCard>

          <GhostCard>
            <CardHeader>
              <CardTitle>Ghost Card</CardTitle>
              <CardDescription>Minimalista e sutil</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Background transparente. Aparece no hover para economia visual.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">Ação</Button>
            </CardFooter>
          </GhostCard>
        </div>

        {/* Row 2: Special Variants */}
        <div className="grid gap-6 md:grid-cols-3">
          <BorderedCard>
            <CardHeader>
              <CardTitle>Bordered Card</CardTitle>
              <CardDescription>Ênfase na borda</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Border 2px que muda para primary no hover com glow effect.
              </p>
            </CardContent>
          </BorderedCard>

          <CardVariant variant="flat">
            <CardHeader>
              <CardTitle>Flat Card</CardTitle>
              <CardDescription>Sem elevação</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Sem shadow. Ideal para layouts compactos ou nested cards.
              </p>
            </CardContent>
          </CardVariant>

          <GradientCard>
            <CardHeader>
              <CardTitle>Gradient Card</CardTitle>
              <CardDescription className="text-white/90">
                Para destaque especial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/90">
                Gradiente primary → accent. Perfeito para CTAs importantes.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm">Call to Action</Button>
            </CardFooter>
          </GradientCard>
        </div>

        {/* Row 3: Status Variants */}
        <div className="grid gap-6 md:grid-cols-3">
          <SuccessCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Success Card
              </CardTitle>
              <CardDescription>Estado de sucesso</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Border verde com background suave. Para confirmações e sucessos.
              </p>
            </CardContent>
          </SuccessCard>

          <WarningCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Warning Card
              </CardTitle>
              <CardDescription>Estado de aviso</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Border laranja. Para avisos que precisam de atenção.
              </p>
            </CardContent>
          </WarningCard>

          <ErrorCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Error Card
              </CardTitle>
              <CardDescription>Estado de erro</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Border vermelho. Para erros e ações destrutivas.
              </p>
            </CardContent>
          </ErrorCard>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <StatCard
            title="Total de Reservas"
            value="1,234"
            description="Este mês"
            icon={<Calendar className="h-4 w-4" />}
            trend={{ value: 12.5, label: "vs mês anterior", isPositive: true }}
            variant="interactive"
            onClick={() => toast.info("Ver detalhes de reservas")}
          />
          <StatCard
            title="Receita Total"
            value="R$ 45,230"
            description="Este mês"
            icon={<DollarSign className="h-4 w-4" />}
            trend={{ value: 8.2, label: "vs mês anterior", isPositive: true }}
          />
          <StatCard
            title="Clientes Ativos"
            value="856"
            description="Este mês"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 3.1, label: "vs mês anterior", isPositive: false }}
          />
          <StatCard
            title="Taxa de Ocupação"
            value="87%"
            description="Média mensal"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>
      </section>

      <Separator />

      {/* Badge System Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Badge System</h2>
          <p className="text-muted-foreground">
            Sistema completo de badges semânticos com 3 estilos
          </p>
        </div>

        {/* Solid Badges */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Solid Badges</h3>
          <div className="flex flex-wrap gap-3">
            <BadgeVariant variant="default">Default</BadgeVariant>
            <SuccessBadge>Success</SuccessBadge>
            <WarningBadge>Warning</WarningBadge>
            <ErrorBadge>Error</ErrorBadge>
            <InfoBadge>Info</InfoBadge>
          </div>
        </div>

        {/* Outline Badges */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Outline Badges</h3>
          <div className="flex flex-wrap gap-3">
            <BadgeVariant variant="default" styleType="outline">Default</BadgeVariant>
            <SuccessBadge styleType="outline">Success</SuccessBadge>
            <WarningBadge styleType="outline">Warning</WarningBadge>
            <ErrorBadge styleType="outline">Error</ErrorBadge>
            <InfoBadge styleType="outline">Info</InfoBadge>
          </div>
        </div>

        {/* Soft Badges */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Soft Badges (Subtle)</h3>
          <div className="flex flex-wrap gap-3">
            <BadgeVariant variant="default" styleType="soft">Default</BadgeVariant>
            <SuccessBadge styleType="soft">Success</SuccessBadge>
            <WarningBadge styleType="soft">Warning</WarningBadge>
            <ErrorBadge styleType="soft">Error</ErrorBadge>
            <InfoBadge styleType="soft">Info</InfoBadge>
          </div>
        </div>

        {/* Badges with Dot */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Badges with Dot Indicator</h3>
          <div className="flex flex-wrap gap-3">
            <SuccessBadge dot>Disponível</SuccessBadge>
            <WarningBadge dot>Pendente</WarningBadge>
            <ErrorBadge dot>Bloqueado</ErrorBadge>
            <InfoBadge dot>Em Análise</InfoBadge>
          </div>
        </div>

        {/* Status Badges */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Status Badges</h3>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="available" />
            <StatusBadge status="occupied" />
            <StatusBadge status="blocked" />
            <StatusBadge status="pending" />
            <StatusBadge status="paid" />
            <StatusBadge status="canceled" />
            <StatusBadge status="confirmed" />
            <StatusBadge status="active" />
            <StatusBadge status="inactive" />
          </div>
        </div>

        {/* Special Badges */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Special Badges</h3>
          <div className="flex flex-wrap gap-3 items-center">
            <CountBadge count={5} />
            <CountBadge count={99} />
            <CountBadge count={150} max={99} />
            <NewBadge />
            <ProBadge />
          </div>
        </div>
      </section>

      <Separator />

      {/* Micro-interactions Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Micro-interactions</h2>
          <p className="text-muted-foreground">
            Animações e efeitos para feedback visual
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Shake */}
          <CardVariant variant="bordered">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Shake Animation</h3>
                <p className="text-sm text-muted-foreground">
                  Para erros de validação
                </p>
                <div className={animationDemo === "shake" ? "animate-shake" : ""}>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      triggerAnimation("shake");
                      toast.error("Campo obrigatório!");
                    }}
                    className="w-full"
                  >
                    Trigger Shake
                  </Button>
                </div>
              </div>
            </CardContent>
          </CardVariant>

          {/* Bounce */}
          <CardVariant variant="bordered">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Bounce Animation</h3>
                <p className="text-sm text-muted-foreground">
                  Para confirmações de sucesso
                </p>
                <div className={animationDemo === "bounce" ? "animate-bounce" : ""}>
                  <Button 
                    onClick={() => {
                      triggerAnimation("bounce");
                      toast.success("Salvo com sucesso!");
                    }}
                    className="w-full"
                  >
                    Trigger Bounce
                  </Button>
                </div>
              </div>
            </CardContent>
          </CardVariant>

          {/* Pulse Ring */}
          <CardVariant variant="bordered">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Pulse Ring</h3>
                <p className="text-sm text-muted-foreground">
                  Para notificações importantes
                </p>
                <div className="flex justify-center">
                  <div className="relative">
                    <Button 
                      size="icon"
                      className={animationDemo === "pulse" ? "animate-pulse-ring" : ""}
                      onClick={() => {
                        triggerAnimation("pulse");
                        toast.info("Nova notificação!");
                      }}
                    >
                      <span className="relative">🔔</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </CardVariant>

          {/* Glow */}
          <CardVariant variant="bordered">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Glow Effect</h3>
                <p className="text-sm text-muted-foreground">
                  Para elementos em destaque
                </p>
                <Button 
                  className={animationDemo === "glow" ? "animate-glow" : ""}
                  onClick={() => triggerAnimation("glow")}
                >
                  Trigger Glow
                </Button>
              </div>
            </CardContent>
          </CardVariant>

          {/* Fade In Up */}
          <CardVariant variant="bordered">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Fade In Up</h3>
                <p className="text-sm text-muted-foreground">
                  Para entrada de conteúdo
                </p>
                {animationDemo === "fadeInUp" && (
                  <div className="animate-fadeInUp p-4 bg-muted rounded-md">
                    <p className="text-sm">Conteúdo aparecendo!</p>
                  </div>
                )}
                <Button 
                  variant="outline"
                  onClick={() => triggerAnimation("fadeInUp")}
                >
                  Trigger Fade In
                </Button>
              </div>
            </CardContent>
          </CardVariant>

          {/* Scale In */}
          <CardVariant variant="bordered">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Scale In</h3>
                <p className="text-sm text-muted-foreground">
                  Para modais e popovers
                </p>
                {animationDemo === "scaleIn" && (
                  <div className="animate-scaleIn p-4 bg-muted rounded-md">
                    <p className="text-sm">Pop! 🎉</p>
                  </div>
                )}
                <Button 
                  variant="outline"
                  onClick={() => triggerAnimation("scaleIn")}
                >
                  Trigger Scale In
                </Button>
              </div>
            </CardContent>
          </CardVariant>
        </div>

        {/* Hover Effects */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Hover Effects</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-muted rounded-lg hover-lift cursor-pointer">
              <h4 className="font-medium mb-2">Hover Lift</h4>
              <p className="text-sm text-muted-foreground">
                Levanta 2px no hover
              </p>
            </div>
            <div className="p-6 bg-muted rounded-lg hover-scale cursor-pointer">
              <h4 className="font-medium mb-2">Hover Scale</h4>
              <p className="text-sm text-muted-foreground">
                Scale 1.05 no hover
              </p>
            </div>
            <div className="p-6 bg-muted rounded-lg hover-brightness cursor-pointer">
              <h4 className="font-medium mb-2">Hover Brightness</h4>
              <p className="text-sm text-muted-foreground">
                Brightness 1.1 no hover
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
