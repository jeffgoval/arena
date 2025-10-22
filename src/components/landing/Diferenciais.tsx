import { Trophy, Lightbulb, Lock, Smartphone } from "lucide-react";

export function Diferenciais() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 fade-in text-dark">
            Por Que Escolher a Arena Dona Santa?
          </h2>
          <p className="text-lg text-dark/70 fade-in">
            A melhor estrutura e tecnologia para seus jogos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center fade-in group">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <Trophy className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">
              Estrutura Completa
            </h3>
            <p className="text-dark/70 leading-relaxed">
              Vestiários, estacionamento, arquibancadas e lanchonete
            </p>
          </div>

          <div className="text-center fade-in group">
            <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-300">
              <Lightbulb className="w-10 h-10 text-secondary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">
              Iluminação LED
            </h3>
            <p className="text-dark/70 leading-relaxed">
              Jogue até mais tarde com iluminação profissional de alta qualidade
            </p>
          </div>

          <div className="text-center fade-in group">
            <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
              <Lock className="w-10 h-10 text-accent" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">
              Segurança Total
            </h3>
            <p className="text-dark/70 leading-relaxed">
              Monitoramento 24h e equipe sempre presente
            </p>
          </div>

          <div className="text-center fade-in group">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <Smartphone className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">
              Reserva Online
            </h3>
            <p className="text-dark/70 leading-relaxed">
              Sistema moderno para reservar e gerenciar suas partidas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
