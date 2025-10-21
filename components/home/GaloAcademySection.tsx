import { Trophy, Users, Smartphone, Target, Calendar, Award, CreditCard, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Trophy,
    title: "Metodologia Oficial",
    description: "Mesma metodologia das categorias de base do Galo",
  },
  {
    icon: Users,
    title: "Inclusão Total",
    description: "Turmas mistas para meninos e meninas",
  },
  {
    icon: Smartphone,
    title: "Tecnologia",
    description: "App dedicado para pais acompanharem o progresso",
  },
  {
    icon: Target,
    title: "Oportunidades",
    description: "Chance real de ingressar na base do Atlético",
  },
  {
    icon: Calendar,
    title: "Eventos Especiais",
    description: "Visitas à Cidade do Galo e Arena MRV",
  },
  {
    icon: Award,
    title: "Torneios",
    description: "Participação em copas e eventos competitivos",
  },
  {
    icon: CreditCard,
    title: "Planos Acessíveis",
    description: "Descontos para sócios e parcelamento",
  },
  {
    icon: Globe,
    title: "Rede Nacional",
    description: "5 mil alunos em 50+ unidades no Brasil",
  },
];

export const GaloAcademySection = () => {
  return (
    <section className="py-20 gradient-dark text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-yellow-500 font-semibold">Parceria Oficial</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold">
            Academia de Futebol do Galo
          </h2>

          <p className="text-xl text-white/80">
            Metodologia oficial do Atlético Mineiro com treinos estruturados,
            preparação física e formação integral de atletas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover-lift">
              <CardContent className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                <p className="text-sm text-white/70">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold text-center">Diferenciais Exclusivos</h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Trophy className="h-10 w-10 text-yellow-500 mx-auto" />
                <h4 className="font-semibold">Peneiras Oficiais</h4>
                <p className="text-sm text-white/70">Testes em parceria com o Atlético Mineiro</p>
              </div>

              <div className="space-y-2">
                <Calendar className="h-10 w-10 text-yellow-500 mx-auto" />
                <h4 className="font-semibold">Match Days</h4>
                <p className="text-sm text-white/70">Ativações nos dias de jogos do Galo</p>
              </div>
              
              <div className="space-y-2">
                <Award className="h-10 w-10 text-yellow-500 mx-auto" />
                <h4 className="font-semibold">Valores Humanos</h4>
                <p className="text-sm text-white/70">Disciplina, trabalho em equipe e superação</p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                Inscrever na Academia do Galo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
