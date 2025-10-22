import Link from "next/link";
import { Trophy, Target, Building2, Smartphone, Users, Award, Sparkles } from "lucide-react";

export function AcademiaGalo() {
  return (
    <section id="academia-galo" className="relative section-padding bg-gradient-to-br from-dark via-gray-900 to-dark text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)"}} />
      </div>

      <div className="container-custom relative z-10">
        {/* Badge Oficial */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-dark px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-2xl">
            <Sparkles className="w-4 h-4" />
            Unidade Oficial Credenciada
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Lado Esquerdo - Conteúdo */}
          <div className="slide-in-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Academia de Futebol
              <br />
              <span className="text-yellow-500">do Galo</span>
            </h2>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
              <p className="text-xl font-bold mb-2">Unidade Governador Valadares</p>
              <p className="text-lg text-white/90">
                Metodologia oficial do <strong className="text-yellow-500">Clube Atlético Mineiro</strong>
              </p>
            </div>

            <p className="text-base text-white/90 mb-8 leading-relaxed">
              Treinos estruturados com exercícios técnicos, táticos e preparação física,
              levando a qualidade de clube grande para o nível local.
              <strong> Formação integral</strong> que valoriza tanto o atleta quanto o ser humano.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/login" className="group">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-dark px-8 py-4 rounded-xl text-base font-bold shadow-2xl w-full sm:w-auto transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Inscrever na Academia
                </button>
              </Link>
              <button className="bg-white/10 backdrop-blur-sm border-2 border-white/40 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105">
                Ver Turmas e Horários
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">✓</span>
                <span className="font-medium">5 mil alunos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">✓</span>
                <span className="font-medium">50+ unidades Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">✓</span>
                <span className="font-medium">Metodologia CAM</span>
              </div>
            </div>
          </div>

          {/* Lado Direito - Diferenciais */}
          <div className="slide-in-right">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6 text-yellow-500 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Por Que Escolher a Academia do Galo?
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4 group hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6 text-dark" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Metodologia Oficial</h4>
                    <p className="text-sm text-white/70">Mesma metodologia das categorias de base do Galo</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4 group hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-dark" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Peneiras Oficiais</h4>
                    <p className="text-sm text-white/70">Testes em parceria com o Atlético Mineiro</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4 group hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-dark" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Visitas Exclusivas</h4>
                    <p className="text-sm text-white/70">Cidade do Galo e Arena MRV</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4 group hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-6 h-6 text-dark" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">App Dedicado</h4>
                    <p className="text-sm text-white/70">Pais acompanham o progresso em tempo real</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4 group hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-dark" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Inclusão Total</h4>
                    <p className="text-sm text-white/70">Turmas mistas para meninos e meninas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4 group hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-dark" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Match Days + Torneios</h4>
                    <p className="text-sm text-white/70">Participação em copas e ativações nos jogos do Galo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chamada Final */}
        <div className="mt-20 text-center max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-3xl p-10 border-2 border-yellow-500/50">
            <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Chance Real de Ingressar na Base do Atlético!
            </h3>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Nossa parceria oficial oferece oportunidades concretas de profissionalização.
              Valores humanos: <strong>disciplina, trabalho em equipe e superação</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="group">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-dark px-10 py-4 rounded-xl text-lg font-bold shadow-2xl transition-all duration-300 group-hover:scale-105">
                  Quero Fazer Parte do Galo!
                </button>
              </Link>
              <Link href="/login" className="group">
                <button className="bg-white text-dark px-10 py-4 rounded-xl text-lg font-semibold shadow-2xl transition-all duration-300 group-hover:scale-105">
                  Agendar Avaliação Gratuita
                </button>
              </Link>
            </div>
            <p className="text-sm text-white/70 mt-6">
              Planos acessíveis com desconto para sócios e parcelamento facilitado
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
