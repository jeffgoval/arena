import Link from "next/link";
import { Users, Waves, Star, Check } from "lucide-react";

export function DayUse() {
  return (
    <section id="day-use" className="section-padding bg-gradient-to-br from-secondary/10 to-primary/10">
      <div className="container-custom">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full mb-6">
            <Waves className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-bold uppercase text-sm">Day Use</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-dark">
            Dia Completo de Diversão e Lazer
          </h2>
          <p className="text-lg text-dark/70 max-w-3xl mx-auto leading-relaxed">
            Aproveite nossa estrutura completa! Piscina, bar, alimentação, quadras e muito mais em pacotes especiais.
            Perfeito para família, amigos e eventos!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Pacote Família */}
          <div className="feature-card bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/30">
            <div className="bg-gradient-to-br from-primary to-secondary p-8 text-white text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold">Day Use Família</h3>
              <p className="text-white/90 text-sm mt-2">Até 6 pessoas</p>
            </div>
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-dark/50 line-through text-lg">R$ 599</span>
                  <span className="text-4xl font-bold text-primary">R$ 449</span>
                </div>
                <p className="text-center text-sm text-dark/60">Válido seg-qui</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Acesso à piscina (10h às 18h)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Almoço buffet completo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Bebidas não-alcoólicas à vontade</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">2h de quadra incluídas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Área kids com brinquedos</span>
                </li>
              </ul>

              <Link href="/auth">
                <button className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-base hover:bg-primary/90 transition-all duration-300 hover:scale-105">
                  Reservar Agora
                </button>
              </Link>
            </div>
          </div>

          {/* Pacote Individual */}
          <div className="feature-card bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-secondary/10 hover:border-secondary/30">
            <div className="bg-gradient-to-br from-secondary to-accent p-8 text-white text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Waves className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold">Day Use Individual</h3>
              <p className="text-white/90 text-sm mt-2">Por pessoa</p>
            </div>
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-secondary">R$ 89</span>
                </div>
                <p className="text-center text-sm text-dark/60">Seg-qui • R$ 119 sex-dom</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Acesso à piscina</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Bar e área de convivência</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Bebidas não-alcoólicas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Vestiários com duchas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Estacionamento gratuito</span>
                </li>
              </ul>

              <Link href="/auth">
                <button className="w-full bg-secondary text-white py-4 rounded-xl font-semibold text-base hover:bg-secondary/90 transition-all duration-300 hover:scale-105">
                  Comprar Day Use
                </button>
              </Link>
            </div>
          </div>

          {/* Pacote Premium */}
          <div className="feature-card bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-accent/20 hover:border-accent/50 relative">
            <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold z-10">
              MAIS VENDIDO
            </div>
            <div className="bg-gradient-to-br from-accent to-primary p-8 text-white text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Star className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold">Day Use Premium</h3>
              <p className="text-white/90 text-sm mt-2">Até 10 pessoas</p>
            </div>
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-accent">R$ 899</span>
                </div>
                <p className="text-center text-sm text-dark/60">Qualquer dia da semana</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Tudo do pacote família +</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">4h de quadra incluídas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Churrasqueira exclusiva</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Área reservada na piscina</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-dark/80 text-sm">Bebidas alcoólicas incluídas</span>
                </li>
              </ul>

              <Link href="/auth">
                <button className="w-full bg-accent text-white py-4 rounded-xl font-semibold text-base hover:bg-accent/90 transition-all duration-300 hover:scale-105">
                  Garantir Vaga Premium
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-dark/70 mb-4 font-medium">
            <strong>Promoção:</strong> Reserve com 7 dias de antecedência e ganhe 15% de desconto!
          </p>
          <Link href="/auth">
            <button className="bg-white text-secondary border-2 border-secondary px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Ver Todos os Pacotes e Add-ons
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
