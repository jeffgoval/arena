import { Building2, Target, Award, TrendingUp, Check, Phone, FileText } from "lucide-react";

export function Patrocinadores() {
  return (
    <section className="section-padding bg-gradient-to-br from-gray via-white to-gray relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle at 20% 50%, rgba(0,102,204,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,87,34,0.3) 0%, transparent 50%)"}} />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-6">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-primary font-bold uppercase text-sm tracking-wide">Nossos Parceiros</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-dark fade-in">
            Patrocinadores que
            <br />
            <span className="gradient-text">Fazem a Diferença</span>
          </h2>
          <p className="text-lg text-dark/70 max-w-3xl mx-auto leading-relaxed fade-in">
            Agradecemos aos nossos parceiros que acreditam no potencial do esporte
            e contribuem para o desenvolvimento da nossa comunidade.
          </p>
        </div>

        {/* Grid de Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className="feature-card bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center min-h-[160px] group border border-gray/20 hover:border-primary/40"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <Building2 className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-xs font-semibold text-dark/60 group-hover:text-primary transition-colors">
                  Logo {num}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Métricas de Impacto */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 mb-20 border border-primary/20">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold text-dark mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              Impacto dos Nossos Patrocinadores
            </h3>
            <p className="text-base text-dark/70 font-medium">
              Sua marca conectada com uma comunidade ativa e engajada
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center fade-in">
              <div className="text-5xl font-bold text-primary mb-2">5.000+</div>
              <div className="text-dark/70 font-semibold">Pessoas/mês</div>
              <div className="text-sm text-dark/50 mt-1">visitando a arena</div>
            </div>

            <div className="text-center fade-in">
              <div className="text-5xl font-bold text-secondary mb-2">500+</div>
              <div className="text-dark/70 font-semibold">Alunos Ativos</div>
              <div className="text-sm text-dark/50 mt-1">academia e escolinha</div>
            </div>

            <div className="text-center fade-in">
              <div className="text-5xl font-bold text-accent mb-2">50+</div>
              <div className="text-dark/70 font-semibold">Eventos/ano</div>
              <div className="text-sm text-dark/50 mt-1">torneios e campeonatos</div>
            </div>

            <div className="text-center fade-in">
              <div className="text-5xl font-bold text-primary mb-2">100K+</div>
              <div className="text-dark/70 font-semibold">Impressões</div>
              <div className="text-sm text-dark/50 mt-1">nas redes sociais</div>
            </div>
          </div>
        </div>

        {/* CTA para Novos Patrocinadores */}
        <div className="bg-gradient-to-br from-dark via-primary/20 to-dark rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Lado Esquerdo - Conteúdo */}
            <div className="p-12 text-white">
              <div className="inline-flex items-center gap-2 bg-yellow-500 text-dark px-4 py-2 rounded-full mb-6 font-bold text-sm">
                <Target className="w-4 h-4" />
                OPORTUNIDADE DE PARCERIA
              </div>
              <h3 className="text-4xl font-bold mb-6 leading-tight">
                Torne-se um
                <br />
                <span className="text-yellow-500">Patrocinador Oficial</span>
              </h3>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Conecte sua marca a uma comunidade esportiva ativa e em crescimento.
                Exposição em eventos, redes sociais, uniformes e instalações.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { title: "Exposição Premium", desc: "Logo em uniformes, banners e materiais digitais" },
                  { title: "Eventos Exclusivos", desc: "Ativações e experiências em torneios e campeonatos" },
                  { title: "Redes Sociais", desc: "Menções, posts patrocinados e stories destacados" },
                  { title: "Comunidade Engajada", desc: "Acesso direto a 5 mil+ visitantes mensais" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-dark" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-white/70 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-dark px-8 py-4 rounded-xl text-base font-bold shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Quero Ser Patrocinador
                </button>
                <button className="bg-white/10 backdrop-blur-sm border-2 border-white/40 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Ver Pacotes
                </button>
              </div>
            </div>

            {/* Lado Direito - Planos */}
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-12 flex items-center">
              <div className="space-y-6 w-full">
                {[
                  { icon: Target, title: "Plano Bronze", desc: "Logo em banners e redes sociais", price: "R$ 500/mês" },
                  { icon: Award, title: "Plano Prata", desc: "Bronze + logo em uniformes", price: "R$ 1.200/mês" },
                  { icon: TrendingUp, title: "Plano Ouro", desc: "Prata + naming rights de eventos", price: "R$ 2.500/mês", featured: true }
                ].map((plan, i) => (
                  <div key={i} className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border ${plan.featured ? 'border-2 border-yellow-500' : 'border-white/20'} relative group hover:bg-white/15 transition-colors`}>
                    {plan.featured && (
                      <div className="absolute -top-3 right-4 bg-yellow-500 text-dark px-3 py-1 rounded-full text-xs font-bold">
                        MAIS ESCOLHIDO
                      </div>
                    )}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <plan.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>
                      <h4 className="text-2xl font-bold text-white">{plan.title}</h4>
                    </div>
                    <p className="text-white/80 mb-2 text-sm">{plan.desc}</p>
                    <p className="text-yellow-500 font-bold text-lg">A partir de {plan.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
