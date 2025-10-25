"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    avatar: "CS",
    name: "Carlos Silva",
    role: "Jogador regular",
    text: "Melhor arena de GV! Gramado impecável, iluminação ótima e o sistema de reserva online facilita demais.",
    rating: 5,
  },
  {
    avatar: "RF",
    name: "Ricardo Fernandes",
    role: "Organizador de peladas",
    text: "Jogo todo sábado com minha turma na Arena Dona Santa. A estrutura é top e o atendimento é show!",
    rating: 5,
  },
  {
    avatar: "MP",
    name: "Marcelo Pereira",
    role: "Cliente desde 2024",
    text: "Adorei poder reservar pelo celular e dividir o valor automaticamente. Muito mais prático que antes!",
    rating: 5,
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 fade-in">
            O Que Nossos Jogadores Dizem
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Depoimentos reais de quem já joga na Arena Dona Santa
          </p>
        </div>

        {/* Desktop: Carousel */}
        <div className="hidden md:block max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 mx-4 shadow-lg">
                    <div className="text-center">
                      <Quote className="w-12 h-12 text-primary/20 mx-auto mb-6" />

                      <p className="text-xl md:text-2xl text-gray-800 mb-8 leading-relaxed font-medium">
                        "{testimonial.text}"
                      </p>

                      <div className="flex items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
                          {testimonial.avatar}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-foreground">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          <div className="flex gap-1 mt-1">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 ${index === activeIndex
                  ? "w-8 h-3 bg-primary rounded-full"
                  : "w-3 h-3 bg-muted-foreground/30 rounded-full hover:bg-muted-foreground/50"
                  }`}
                aria-label={`Ver depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile: Grid */}
        <div className="md:hidden grid gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-foreground/90 leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
