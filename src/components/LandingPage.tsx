import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  Users, 
  Trophy,
  Star,
  ChevronRight
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const features = [
  {
    icon: Calendar,
    title: "Reserve Online",
    description: "Escolha data e horário disponível em tempo real"
  },
  {
    icon: CreditCard,
    title: "Pagamento Fácil",
    description: "Pague com cartão, PIX ou use seus créditos"
  },
  {
    icon: Users,
    title: "Crie Turmas",
    description: "Organize jogos e convide amigos facilmente"
  },
  {
    icon: CheckCircle,
    title: "Confirmação Imediata",
    description: "Receba confirmação instantânea por WhatsApp"
  }
];

const courts = [
  {
    id: 1,
    name: "Quadra 1 - Society",
    type: "Futebol Society",
    image: "https://images.unsplash.com/photo-1680537732560-7dd5f9b1ed53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBzb2NjZXIlMjBjb3VydHxlbnwxfHx8fDE3NjAzODkxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "R$ 120/hora"
  },
  {
    id: 2,
    name: "Quadra 2 - Poliesportiva",
    type: "Vôlei, Basquete, Futsal",
    image: "https://images.unsplash.com/photo-1759365840088-cdb7f739aa7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjb3VydCUyMGFyZW5hfGVufDF8fHx8MTc2MDM4OTE2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    price: "R$ 100/hora"
  },
  {
    id: 3,
    name: "Quadra 3 - Beach Tennis",
    type: "Beach Tennis",
    image: "https://images.unsplash.com/photo-1577416412292-747c6607f055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MXx8fHwxNzYwMzI4ODEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "R$ 80/hora"
  }
];

const testimonials = [
  {
    name: "Carlos Silva",
    text: "Sistema prático e fácil de usar. Não fico mais sem jogar!",
    rating: 5
  },
  {
    name: "Ana Paula",
    text: "A função de criar turmas é perfeita para organizar meus rachões semanais.",
    rating: 5
  },
  {
    name: "Roberto Santos",
    text: "Quadras excelentes e atendimento de primeira. Recomendo!",
    rating: 5
  }
];

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">Arena Dona Santa</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('como-funciona')} 
              className="text-sm transition-colors hover:text-primary"
            >
              Como Funciona
            </button>
            <button 
              onClick={() => onNavigate('court-details')} 
              className="text-sm transition-colors hover:text-primary"
            >
              Quadras
            </button>
            <button 
              onClick={() => scrollToSection('quadras')} 
              className="text-sm transition-colors hover:text-primary"
            >
              Preços
            </button>
            <button 
              onClick={() => scrollToSection('contato')} 
              className="text-sm transition-colors hover:text-primary"
            >
              Contato
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => onNavigate('login')}>
              Entrar
            </Button>
            <Button onClick={() => onNavigate('booking')} className="bg-accent hover:bg-accent/90">
              Reserve seu Horário
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Full Width Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Content Container */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 w-fit"
              >
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm">Sistema de Reservas Online</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                Reserve sua quadra em{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">segundos</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-muted-foreground max-w-xl"
              >
                O jeito mais fácil e rápido de reservar horários, organizar jogos e gerenciar 
                suas partidas esportivas.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    onClick={() => onNavigate('booking')}
                    className="bg-accent hover:bg-accent/90 text-lg h-12"
                  >
                    Fazer Reserva
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg h-12"
                    onClick={() => onNavigate('court-details')}
                  >
                    Conhecer Quadras
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-8 pt-4"
              >
                <motion.div whileHover={{ scale: 1.1 }}>
                  <div className="text-3xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Quadras</div>
                </motion.div>
                <div className="h-12 w-px bg-border" />
                <motion.div whileHover={{ scale: 1.1 }}>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Jogos/mês</div>
                </motion.div>
                <div className="h-12 w-px bg-border" />
                <motion.div whileHover={{ scale: 1.1 }}>
                  <div className="text-3xl font-bold text-primary">4.9</div>
                  <div className="text-sm text-muted-foreground">Avaliação</div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="aspect-[4/3] overflow-hidden rounded-2xl border bg-muted shadow-2xl"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1680537732560-7dd5f9b1ed53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBzb2NjZXIlMjBjb3VydHxlbnwxfHx8fDE3NjAzODkxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Quadra Arena Dona Santa"
                  className="h-full w-full object-cover"
                />
              </motion.div>
              
              {/* Floating Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ y: -5 }}
                className="absolute -bottom-6 -left-6 rounded-xl border bg-background p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="rounded-full bg-primary/10 p-3"
                  >
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </motion.div>
                  <div>
                    <div className="font-semibold">Disponível Agora</div>
                    <div className="text-sm text-muted-foreground">15 horários livres</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reserve sua quadra em poucos passos
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="relative border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quadras */}
      <section id="quadras" className="py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossas Quadras
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estrutura completa para seu esporte favorito
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courts.map((court) => (
              <Card key={court.id} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                <div className="aspect-video overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={court.image}
                    alt={court.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle>{court.name}</CardTitle>
                      <CardDescription>{court.type}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-primary">{court.price}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => onNavigate('court-details')}
                  >
                    Ver Detalhes
                  </Button>
                  <Button 
                    className="flex-1 bg-accent hover:bg-accent/90"
                    onClick={() => onNavigate('booking')}
                  >
                    Reservar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O Que Dizem Nossos Clientes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Avaliações reais de quem já usa o Arena Dona Santa
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <CardDescription className="text-base">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para jogar?
          </h2>
          <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
            Faça sua reserva agora e garanta seu horário
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-lg h-12"
            onClick={() => onNavigate('booking')}
          >
            Reserve seu Horário
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer - Now handled by App.tsx */}
    </div>
  );
}
