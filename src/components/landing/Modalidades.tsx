import Link from "next/link";
import { Footprints, Waves, Medal, PartyPopper, Baby } from "lucide-react";

export function Modalidades() {
  return (
    <section id="modalidades" className="section-padding bg-gray">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 fade-in text-dark">
            Modalidades Esportivas
          </h2>
          <p className="text-lg text-dark/70 fade-in">
            Diversas opções para você se divertir e praticar esportes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Futebol Society */}
          <div className="feature-card bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
              <div className="w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Footprints className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Futebol Society
              </h3>
              <p className="text-dark/70 mb-6 leading-relaxed">
                Campo 45x25m com grama sintética de alta qualidade. Partidas de 7x7.
              </p>
              <Link href="/auth">
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold w-full hover:bg-primary/90 transition-all duration-300 hover:scale-105">
                  Reservar Agora
                </button>
              </Link>
            </div>
          </div>

          {/* Beach Tennis */}
          <div className="feature-card bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="h-48 bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center group-hover:from-secondary/20 group-hover:to-accent/20 transition-colors">
              <div className="w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Waves className="w-12 h-12 text-secondary" strokeWidth={1.5} />
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Beach Tennis
              </h3>
              <p className="text-dark/70 mb-6 leading-relaxed">
                Quadras de areia branca com infraestrutura completa. Diversão garantida!
              </p>
              <Link href="/auth">
                <button className="bg-secondary text-white px-6 py-3 rounded-xl font-semibold w-full hover:bg-secondary/90 transition-all duration-300 hover:scale-105">
                  Reservar Agora
                </button>
              </Link>
            </div>
          </div>

          {/* Vôlei de Praia */}
          <div className="feature-card bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="h-48 bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center group-hover:from-accent/20 group-hover:to-primary/20 transition-colors">
              <div className="w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Medal className="w-12 h-12 text-accent" strokeWidth={1.5} />
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Vôlei de Praia
              </h3>
              <p className="text-dark/70 mb-6 leading-relaxed">
                Areia de qualidade e espaço adequado para jogos e treinos.
              </p>
              <Link href="/auth">
                <button className="bg-accent text-white px-6 py-3 rounded-xl font-semibold w-full hover:bg-accent/90 transition-all duration-300 hover:scale-105">
                  Reservar Agora
                </button>
              </Link>
            </div>
          </div>

          {/* Futevôlei */}
          <div className="feature-card bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
              <div className="w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Footprints className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Futevôlei
              </h3>
              <p className="text-dark/70 mb-6 leading-relaxed">
                Modalidade que une futebol e vôlei em quadras de areia.
              </p>
              <Link href="/auth">
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold w-full hover:bg-primary/90 transition-all duration-300 hover:scale-105">
                  Reservar Agora
                </button>
              </Link>
            </div>
          </div>

          {/* Eventos */}
          <div className="feature-card bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="h-48 bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center group-hover:from-secondary/20 group-hover:to-primary/20 transition-colors">
              <div className="w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <PartyPopper className="w-12 h-12 text-secondary" strokeWidth={1.5} />
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Eventos Esportivos
              </h3>
              <p className="text-dark/70 mb-6 leading-relaxed">
                Espaço perfeito para torneios, campeonatos e confraternizações.
              </p>
              <button className="bg-secondary text-white px-6 py-3 rounded-xl font-semibold w-full hover:bg-secondary/90 transition-all duration-300 hover:scale-105">
                Saiba Mais
              </button>
            </div>
          </div>

          {/* Área Kids */}
          <div className="feature-card bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="h-48 bg-gradient-to-br from-accent/10 to-secondary/10 flex items-center justify-center group-hover:from-accent/20 group-hover:to-secondary/20 transition-colors">
              <div className="w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Baby className="w-12 h-12 text-accent" strokeWidth={1.5} />
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Área Kids
              </h3>
              <p className="text-dark/70 mb-6 leading-relaxed">
                Brinquedos para as crianças enquanto você se diverte!
              </p>
              <button className="bg-accent text-white px-6 py-3 rounded-xl font-semibold w-full hover:bg-accent/90 transition-all duration-300 hover:scale-105">
                Ver Estrutura
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
