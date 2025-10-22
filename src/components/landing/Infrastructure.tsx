import { TreePine, Beer, Video, Footprints, Waves } from "lucide-react";

export function Infrastructure() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 fade-in text-dark">
            Infraestrutura Completa
          </h2>
          <p className="text-lg md:text-xl text-dark/70 max-w-4xl mx-auto leading-relaxed fade-in">
            Contamos com <strong className="text-dark">1 campo society de grama sintética</strong> e{" "}
            <strong className="text-dark">4 quadras de areia multifuncionais</strong> para Beach Tennis, Vôlei de Praia e Futevôlei.
            Oferecemos uma experiência ao ar livre em contato com a natureza.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Features Destaque */}
          <div className="slide-in-left space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <TreePine className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-dark">Contato com a Natureza</h3>
                <p className="text-dark/70 leading-relaxed">
                  Ambiente ao ar livre com quadras sombreadas por árvores de grande porte. Jogue com conforto e bem-estar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                <Beer className="w-7 h-7 text-secondary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-dark">Bar e Área de Convivência</h3>
                <p className="text-dark/70 leading-relaxed">
                  Relaxe após o jogo no nosso bar com espaço de convivência. Brinquedos para as crianças se divertirem enquanto você joga.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                <Video className="w-7 h-7 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-dark">Sistema Replay Sports</h3>
                <p className="text-dark/70 leading-relaxed">
                  Grave seus jogos e reveja suas melhores jogadas! Sistema profissional de gravação disponível.
                </p>
              </div>
            </div>
          </div>

          {/* Cards de Modalidades */}
          <div className="slide-in-right space-y-6">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/10 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Footprints className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark">Campo Society</h3>
                  <p className="text-primary font-semibold">45x25m • Grama Sintética</p>
                </div>
              </div>
              <p className="text-dark/70 leading-relaxed">
                Gramado sintético de última geração com dimensões oficiais, perfeito para partidas de 7x7.
              </p>
            </div>

            <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-3xl p-8 border border-secondary/10 hover:border-secondary/30 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Waves className="w-8 h-8 text-secondary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark">Quadras de Areia</h3>
                  <p className="text-secondary font-semibold">4 Quadras Multifuncionais</p>
                </div>
              </div>
              <p className="text-dark/70 leading-relaxed">
                Areia branca de qualidade para Beach Tennis, Vôlei de Praia e Futevôlei. Modalidades variadas para todos!
              </p>
            </div>
          </div>
        </div>

        {/* Ícones de Facilidades */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center fade-in group">
            <div className="w-20 h-20 rounded-2xl bg-gray flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
              <Footprints className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <h4 className="font-bold text-dark mb-1">Campo Society</h4>
            <p className="text-sm text-dark/60">45x25m grama sintética</p>
          </div>

          <div className="text-center fade-in group">
            <div className="w-20 h-20 rounded-2xl bg-gray flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/10 transition-colors">
              <Waves className="w-10 h-10 text-secondary" strokeWidth={1.5} />
            </div>
            <h4 className="font-bold text-dark mb-1">4 Quadras Areia</h4>
            <p className="text-sm text-dark/60">Beach, Vôlei, Futevôlei</p>
          </div>

          <div className="text-center fade-in group">
            <div className="w-20 h-20 rounded-2xl bg-gray flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
              <Video className="w-10 h-10 text-accent" strokeWidth={1.5} />
            </div>
            <h4 className="font-bold text-dark mb-1">Replay Sports</h4>
            <p className="text-sm text-dark/60">Gravação de jogos</p>
          </div>

          <div className="text-center fade-in group">
            <div className="w-20 h-20 rounded-2xl bg-gray flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
              <Beer className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <h4 className="font-bold text-dark mb-1">Bar Completo</h4>
            <p className="text-sm text-dark/60">Vestiários e estacionamento</p>
          </div>
        </div>
      </div>
    </section>
  );
}
