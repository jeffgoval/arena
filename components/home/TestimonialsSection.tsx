import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "João Silva",
    role: "Frequentador há 2 anos",
    text: "Excelente estrutura e atendimento. As quadras são bem cuidadas e os horários são flexíveis. Recomendo para toda a família!",
    rating: 5,
  },
  {
    name: "Maria Santos",
    role: "Praticante de Beach Tennis",
    text: "Encontrei aqui tudo o que precisava para praticar beach tennis. Professores qualificados e um ambiente muito acolhedor.",
    rating: 5,
  },
  {
    name: "Pedro Costa",
    role: "Pai de aluno da Academia",
    text: "Meu filho está na Academia do Galo e evoluiu muito! A metodologia é excelente e os valores ensinados são fundamentais.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            O Que Dizem Nossos Clientes
          </h2>
          <p className="text-lg text-muted-foreground">
            A satisfação dos nossos clientes é nossa maior conquista
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="border-2 h-full">
                  <CardContent className="p-6 space-y-4 flex flex-col h-full">
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground italic flex-1">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    
                    <div className="border-t pt-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
