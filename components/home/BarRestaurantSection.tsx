import { UtensilsCrossed, Coffee, Armchair, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Culinária Variada",
    description: "Pratos tradicionais e contemporâneos",
  },
  {
    icon: Coffee,
    title: "Bebidas Geladas",
    description: "Cervejas, sucos naturais e drinks",
  },
  {
    icon: Armchair,
    title: "Ambiente Agradável",
    description: "Espaço climatizado e ao ar livre",
  },
  {
    icon: Clock,
    title: "Horário Estendido",
    description: "Aberto durante toda a operação",
  },
];

export const BarRestaurantSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-5xl font-bold">
                Bar & Restaurante
              </h2>
              <p className="text-lg text-muted-foreground">
                Desfrute de uma experiência gastronômica completa em nosso bar e restaurante. 
                Oferecemos pratos deliciosos e bebidas refrescantes em um ambiente aconchegante, 
                perfeito para relaxar após as atividades esportivas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Imagem */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-elegant">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000"
                alt="Bar e Restaurante Arena Dona Santa"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Ambiente Acolhedor</h3>
                <p className="text-white/90">Perfeito para confraternizar após os jogos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
