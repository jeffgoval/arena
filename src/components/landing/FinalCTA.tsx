import { Footprints, Trophy, Waves, MessageSquare } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-dark via-primary/20 to-dark text-white">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 fade-in">
              Comece Hoje Sua Jornada Esportiva!
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90 fade-in leading-relaxed">
              Escolha como você quer aproveitar a <strong>Arena Dona Santa</strong>:
              Jogue, Aprenda ou Relaxe!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Opção 1: Reservar */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border-2 border-white/20 hover:border-primary transition-all fade-in group">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Footprints className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Reservar Quadra</h3>
              <p className="text-white/80 mb-6 text-sm">
                Society, Futsal, Vôlei e Beach Tennis disponíveis
              </p>
              <button className="bg-primary text-white w-full py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105">
                Ver Horários
              </button>
            </div>

            {/* Opção 2: Academia do Galo */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border-2 border-yellow-500 scale-105 shadow-2xl fade-in relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-dark px-4 py-1 rounded-full text-sm font-bold">
                CREDENCIADA CAM
              </div>
              <div className="w-16 h-16 mx-auto mb-6 bg-yellow-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-yellow-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Academia do Galo</h3>
              <p className="text-white/80 mb-6 text-sm">
                Metodologia oficial • Chance de profissionalizar
              </p>
              <button className="bg-yellow-500 text-dark w-full py-3 rounded-xl font-bold hover:bg-yellow-600 transition-all duration-300 hover:scale-105">
                Inscrever Agora!
              </button>
            </div>

            {/* Opção 3: Day Use */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border-2 border-white/20 hover:border-secondary transition-all fade-in group">
              <div className="w-16 h-16 mx-auto mb-6 bg-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Waves className="w-8 h-8 text-secondary" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Day Use</h3>
              <p className="text-white/80 mb-6 text-sm">
                A partir de R$ 89 • Piscina, bar e muito +
              </p>
              <button className="bg-secondary text-white w-full py-3 rounded-xl font-semibold hover:bg-secondary/90 transition-all duration-300 hover:scale-105">
                Ver Pacotes
              </button>
            </div>
          </div>

          <div className="text-center fade-in mb-12">
            <p className="text-white/70 mb-6 text-base">
              <strong>Dúvidas?</strong> Fale com nosso time agora mesmo!
            </p>
            <button className="bg-white text-dark px-12 py-5 rounded-xl text-xl font-bold shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Chamar no WhatsApp
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="fade-in">
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-white/70 text-sm">Alunos Ativos</div>
            </div>
            <div className="fade-in">
              <div className="text-3xl font-bold text-accent mb-1">4.9★</div>
              <div className="text-white/70 text-sm">Avaliação</div>
            </div>
            <div className="fade-in">
              <div className="text-3xl font-bold text-secondary mb-1">15+</div>
              <div className="text-white/70 text-sm">Anos no Mercado</div>
            </div>
            <div className="fade-in">
              <div className="text-3xl font-bold text-primary mb-1">100%</div>
              <div className="text-white/70 text-sm">Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
