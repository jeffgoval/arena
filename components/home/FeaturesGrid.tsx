import { MapPin, Users, Trees, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: MapPin,
    title: "Localização Privilegiada",
    description: "A 15 min do centro com estacionamento interno gratuito",
    gradient: "from-primary to-primary/80",
  },
  {
    icon: Users,
    title: "Para Toda Família",
    description: "Área kids, bar, vestiários e ambiente seguro",
    gradient: "from-secondary to-secondary/80",
  },
  {
    icon: Trees,
    title: "Experiência ao Ar Livre",
    description: "Quadras sombreadas por árvores com iluminação profissional",
    gradient: "from-accent to-accent/80",
  },
  {
    icon: Video,
    title: "Sistema Replay Sports",
    description: "Grave e compartilhe os melhores momentos dos seus jogos",
    gradient: "from-primary to-secondary",
  },
];

export const FeaturesGrid = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            Diferenciais Exclusivos
          </h2>
          <p className="text-lg text-muted-foreground">
            Tudo que você precisa para uma experiência esportiva completa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover-lift">
              <CardContent className="p-6 space-y-4">
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
