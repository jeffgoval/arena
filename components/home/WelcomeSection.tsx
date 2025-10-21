import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const benefits = [
  "1 campo society 45x25m com grama sintética",
  "4 quadras de areia branca multifuncionais",
  "Sistema Replay Sports para gravação de jogos",
  "Bar, vestiários e estacionamento interno",
  "Área kids e ambiente familiar",
  "Quadras sombreadas por árvores de grande porte",
];

export const WelcomeSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Imagem */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-elegant">
              <img
                src="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2000"
                alt="Arena Dona Santa - Vista aérea das quadras"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-2/3 aspect-video rounded-xl overflow-hidden shadow-elegant border-4 border-background hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?q=80&w=2000"
                alt="Campo society Arena Dona Santa"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Bem-vindo à<br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Arena Dona Santa
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                A melhor arena de Governador Valadares, localizada a apenas 15 minutos do centro, 
                oferecendo infraestrutura completa para atletas e famílias.
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Infraestrutura Completa</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild variant="gradient">
                <Link href="/booking">Ver Quadras Disponíveis</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
