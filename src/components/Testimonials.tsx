"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    avatar: "CS",
    text: "Melhor arena de GV! Gramado impecável, iluminação ótima e o sistema de reserva online facilita demais.",
    author: "Carlos Silva, jogador regular",
  },
  {
    avatar: "RF",
    text: "Jogo todo sábado com minha turma na Arena Dona Santa. A estrutura é top e o atendimento é show!",
    author: "Ricardo Fernandes, organizador de peladas",
  },
  {
    avatar: "MP",
    text: "Adorei poder reservar pelo celular e dividir o valor automaticamente. Muito mais prático que antes!",
    author: "Marcelo Pereira, cliente desde 2024",
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 fade-in">
          O Que Nossos Jogadores Dizem
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[300px] flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-item ${
                  index === activeIndex ? "active" : ""
                }`}
              >
                <div className="bg-gray rounded-2xl p-8 md:p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">
                    {testimonial.avatar}
                  </div>
                  <p className="text-xl md:text-2xl text-dark/90 italic mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <span className="text-dark/60 font-medium">
                    {testimonial.author}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? "bg-primary w-8"
                    : "bg-dark/20 hover:bg-dark/40"
                }`}
                aria-label={`Ver depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
