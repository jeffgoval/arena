import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const sports = [
  {
    name: "Beach Tennis",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2000",
    badge: "🎾",
    description: "Modalidade em crescimento que combina tênis, vôlei e badminton",
    benefits: [
      "Quadras oficiais",
      "Aulas para iniciantes",
      "Torneios regulares",
      "Aluguel de equipamentos",
    ],
  },
  {
    name: "Vôlei de Praia",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2000",
    badge: "🏐",
    description: "Esporte de areia praticado em duplas, completo e dinâmico",
    benefits: [
      "Quadras profissionais",
      "Treinos técnicos",
      "Campeonatos",
      "Grupos de todas as idades",
    ],
  },
  {
    name: "Futebol Society",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000",
    badge: "⚽",
    description: "Campo com grama sintética para jogos intensos e técnicos",
    benefits: [
      "Grama sintética premium",
      "Times de 5 e 7 jogadores",
      "Campeonatos mensais",
      "Horários flexíveis",
    ],
  },
  {
    name: "Futevôlei",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2000",
    badge: "🤾",
    description: "Mistura brasileira entre futebol e vôlei na areia",
    benefits: [
      "Quadras de areia",
      "Duplas e quartetos",
      "Aulas técnicas",
      "Torneios de fim de semana",
    ],
  },
];

export const SportsModalitiesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            Modalidades Esportivas
          </h2>
          <p className="text-lg text-muted-foreground">
            Oferecemos as melhores condições para a prática de diversos esportes, 
            com quadras profissionais e instrutores qualificados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sports.map((sport, index) => (
            <Card key={index} className="overflow-hidden border-2 hover-scale group">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <Badge className="absolute top-4 right-4 text-2xl bg-white/90 hover:bg-white">
                  {sport.badge}
                </Badge>
              </div>

              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{sport.name}</h3>
                  <p className="text-muted-foreground">{sport.description}</p>
                </div>

                <ul className="space-y-2">
                  {sport.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full group/btn" asChild>
                  <Link href="/booking">
                    Agendar Horário
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
