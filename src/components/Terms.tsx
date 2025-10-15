import { motion } from "motion/react";
import { Button } from "./ui/button";
import { ArrowLeft, FileText } from "lucide-react";

interface TermsProps {
  onBack: () => void;
}

export function Terms({ onBack }: TermsProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="font-semibold">Termos de Uso</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-gray dark:prose-invert max-w-none"
        >
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-12 w-12 text-primary" />
            <div>
              <h1 className="mb-0">Termos de Uso</h1>
              <p className="text-sm text-muted-foreground">Última atualização: 13 de outubro de 2025</p>
            </div>
          </div>

          <section className="mb-8">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar a plataforma Arena Dona Santa, você concorda em cumprir estes termos de uso.
              Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2>2. Descrição do Serviço</h2>
            <p>
              A Arena Dona Santa é uma plataforma online que permite aos usuários reservar quadras esportivas,
              gerenciar jogos, organizar turmas e realizar pagamentos de forma digital.
            </p>
          </section>

          <section className="mb-8">
            <h2>3. Cadastro e Conta</h2>
            <p>
              Para utilizar nossos serviços, você deve criar uma conta fornecendo informações verdadeiras,
              precisas e completas. Você é responsável por manter a confidencialidade de sua senha e por
              todas as atividades que ocorrem em sua conta.
            </p>
          </section>

          <section className="mb-8">
            <h2>4. Reservas e Pagamentos</h2>
            <ul>
              <li>Todas as reservas estão sujeitas à disponibilidade</li>
              <li>O pagamento deve ser feito no momento da reserva</li>
              <li>Cancelamentos com até 24h de antecedência têm reembolso integral</li>
              <li>Cancelamentos com menos de 24h não têm direito a reembolso</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>5. Conduta do Usuário</h2>
            <p>Você concorda em não:</p>
            <ul>
              <li>Usar o serviço para qualquer finalidade ilegal</li>
              <li>Interferir ou interromper o serviço ou servidores</li>
              <li>Realizar atividades fraudulentas</li>
              <li>Violar os direitos de propriedade intelectual</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>6. Limitação de Responsabilidade</h2>
            <p>
              A Arena Dona Santa não se responsabiliza por danos indiretos, incidentais ou consequenciais
              decorrentes do uso ou impossibilidade de uso do serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2>7. Modificações</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão
              em vigor imediatamente após a publicação.
            </p>
          </section>

          <section className="mb-8">
            <h2>8. Contato</h2>
            <p>
              Para questões sobre estes termos, entre em contato através do email:{" "}
              <a href="mailto:contato@arenadonasanta.com.br">contato@arenadonasanta.com.br</a>
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
