import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-12 md:p-20 shadow-glow">
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Pronto Para Começar?
            </h2>
            <p className="text-lg md:text-xl text-white/90">
              Crie sua conta gratuitamente e faça sua primeira reserva hoje mesmo. 
              Junte-se a milhares de jogadores que já reservam com praticidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="text-lg bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/cliente">
                  Acessar Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg border-white/80 border-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary font-semibold"
                asChild
              >
                <Link href="/cliente/reservas/nova">
                  Ver Horários
                </Link>
              </Button>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl hidden md:block" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl hidden md:block" />
        </div>
      </div>
    </section>
  );
};
