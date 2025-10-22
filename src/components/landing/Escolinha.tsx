import Link from "next/link";
import { GraduationCap, Check } from "lucide-react";

export function Escolinha() {
  return (
    <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div className="slide-in-left">
            <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full mb-6">
              <GraduationCap className="w-4 h-4 text-accent" />
              <span className="text-accent font-bold uppercase text-sm">Escolinha Esportiva</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-dark">
              Mais Modalidades Esportivas
            </h2>
            <p className="text-lg text-dark/80 mb-8 leading-relaxed">
              Além da <strong>Academia do Galo</strong>, oferecemos aulas de <strong>Vôlei, Beach Tennis e Futsal</strong> para todas as idades.
              Do iniciante ao avançado, desenvolvemos suas habilidades com professores especializados!
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-base text-dark font-medium">Turmas divididas por idade e nível</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-base text-dark font-medium">Professores com certificação</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-base text-dark font-medium">Desconto especial para sócios da arena</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-base text-dark font-medium">Aula experimental gratuita</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="group">
                <button className="bg-accent text-white px-8 py-4 rounded-xl text-base font-semibold shadow-lg w-full sm:w-auto transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl flex items-center justify-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Agendar Aula Experimental
                </button>
              </Link>
              <button className="bg-white text-accent border-2 border-accent px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105">
                Ver Turmas e Horários
              </button>
            </div>
          </div>

          {/* Cards de Modalidades */}
          <div className="slide-in-right grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-center group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🏐</div>
              <h3 className="font-bold text-lg mb-2">Vôlei</h3>
              <p className="text-sm text-dark/60 mb-3">8 a 16 anos</p>
              <p className="text-secondary font-bold">A partir de R$ 129/mês</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-center group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🎾</div>
              <h3 className="font-bold text-lg mb-2">Beach Tennis</h3>
              <p className="text-sm text-dark/60 mb-3">Adultos</p>
              <p className="text-accent font-bold">A partir de R$ 179/mês</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-center group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">⚽</div>
              <h3 className="font-bold text-lg mb-2">Futsal</h3>
              <p className="text-sm text-dark/60 mb-3">6 a 14 anos</p>
              <p className="text-primary font-bold">A partir de R$ 129/mês</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-center group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="font-bold text-lg mb-2">Iniciação Esportiva</h3>
              <p className="text-sm text-dark/60 mb-3">4 a 6 anos</p>
              <p className="text-primary font-bold">A partir de R$ 99/mês</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
