import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Endereço",
    content: "Rua Monte Pascoal, 430/440 - Vila dos Montes",
  },
  {
    icon: Phone,
    title: "Telefone",
    content: "(33) 99158-0013",
  },
  {
    icon: Clock,
    title: "Horário",
    content: "Seg-Sex: 18h-23h | Sáb: 8h-12h/16h-20h | Dom: 8h-12h",
  },
  {
    icon: Mail,
    title: "E-mail",
    content: "contato@arenadonasanta.com.br",
  },
];

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Mensagem enviada! Entraremos em contato em breve.");

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">Entre em Contato</h2>
          <p className="text-lg text-muted-foreground">
            Estamos prontos para atendê-lo! Entre em contato para agendar sua visita ou fazer sua reserva
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <info.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-lg">{info.title}</h3>
                    <p className="text-muted-foreground">{info.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-2">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" placeholder="Seu nome completo" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sport">Modalidade de Interesse</Label>
                      <Input id="sport" placeholder="Beach Tennis, Vôlei, etc." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      placeholder="Conte-nos como podemos ajudar..."
                      className="min-h-32"
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
