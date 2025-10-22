import { Calendar, Users, DollarSign, MessageSquare, CreditCard, BarChart3 } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="section-padding bg-gray">
      <div className="container-custom">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 fade-in text-dark">
          Organize Seus Jogos com Tecnologia
        </h2>
        <p className="text-lg text-center text-dark/70 mb-16 fade-in">
          Plataforma completa para gerenciar suas partidas
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="feature-card bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
              <Calendar className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">
              Reserva Online 24/7
            </h3>
            <p className="text-dark/70 leading-relaxed">
              Veja disponibilidade em tempo real e reserve sua quadra a qualquer hora pelo celular.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 group-hover:scale-110 transition-all">
              <Users className="w-7 h-7 text-secondary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">
              Gestão de Turmas
            </h3>
            <p className="text-dark/70 leading-relaxed">
              Crie grupos fixos, convide jogadores e organize peladas recorrentes automaticamente.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all">
              <DollarSign className="w-7 h-7 text-accent" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">
              Divisão de Custos
            </h3>
            <p className="text-dark/70 leading-relaxed">
              Rateio automático entre jogadores. Chega de correr atrás de quem não pagou!
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
              <MessageSquare className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">
              Notificações WhatsApp
            </h3>
            <p className="text-dark/70 leading-relaxed">
              Lembretes automáticos antes dos jogos. Nunca mais esqueça seu horário.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="feature-card bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 group-hover:scale-110 transition-all">
              <CreditCard className="w-7 h-7 text-secondary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">
              Pagamento Simplificado
            </h3>
            <p className="text-dark/70 leading-relaxed">
              Pix, cartão ou crédito na plataforma. Pague de forma rápida e segura.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="feature-card bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all">
              <BarChart3 className="w-7 h-7 text-accent" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">
              Histórico e Estatísticas
            </h3>
            <p className="text-dark/70 leading-relaxed">
              Acompanhe todas suas partidas, gastos e avalie a experiência.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
