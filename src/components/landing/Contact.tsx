import { MessageSquare, MapPin, Clock } from "lucide-react";

export function Contact() {
  return (
    <section id="contato" className="section-padding bg-gradient-to-br from-primary to-secondary">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 fade-in">
            Entre em Contato
          </h2>
          <p className="text-lg md:text-xl mb-12 text-white/90 fade-in leading-relaxed">
            Reserve sua quadra ou tire suas dúvidas. Estamos sempre prontos para atender!
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 fade-in border border-white/20 hover:bg-white/15 transition-colors group">
              <div className="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
              <p className="text-white/80">(33) 9 9999-9999</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 fade-in border border-white/20 hover:bg-white/15 transition-colors group">
              <div className="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-lg mb-2">Localização</h3>
              <p className="text-white/80">Governador Valadares, MG</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 fade-in border border-white/20 hover:bg-white/15 transition-colors group">
              <div className="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-lg mb-2">Horário</h3>
              <p className="text-white/80">Seg - Dom: 6h às 23h</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
            <button className="bg-white text-primary hover:bg-white/90 px-10 py-5 rounded-xl text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Chamar no WhatsApp
            </button>
            <button className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 px-10 py-5 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              Ver Disponibilidade
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
