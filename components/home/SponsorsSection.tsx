import { Building2, Trophy, Users, Star, Target, Zap } from "lucide-react";

export const SponsorsSection = () => {
  const sponsors = [
    { name: "Parceiro 1", icon: Building2 },
    { name: "Parceiro 2", icon: Trophy },
    { name: "Parceiro 3", icon: Users },
    { name: "Parceiro 4", icon: Star },
    { name: "Parceiro 5", icon: Target },
    { name: "Parceiro 6", icon: Zap },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">Nossos Parceiros</h2>
          <p className="text-muted-foreground">
            Agradecemos aos nossos parceiros que acreditam no potencial do esporte
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {sponsors.map((sponsor, index) => {
            const Icon = sponsor.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 opacity-60 hover:opacity-100 transition-all duration-300 hover-scale"
              >
                <Icon className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{sponsor.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
