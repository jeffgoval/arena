import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Input } from "./ui/input";
import { ArrowLeft, Search, HelpCircle, MessageCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "Como faço uma reserva?", a: "Acesse 'Fazer Reserva', escolha a quadra, data e horário desejados. Confirme e pague." },
  { q: "Posso cancelar uma reserva?", a: "Sim, com até 24h de antecedência sem custo. Acesse 'Meus Jogos' e clique em cancelar." },
  { q: "Como funciona o sistema de créditos?", a: "Você pode adicionar créditos na sua conta e usar para pagar reservas futuras." },
  { q: "O que são turmas?", a: "Turmas são grupos fixos para organizar jogos recorrentes com os mesmos participantes." },
  { q: "Como convidar amigos?", a: "Ao criar uma reserva, você pode adicionar participantes por telefone ou link de convite." },
  { q: "Quais formas de pagamento aceitam?", a: "Cartão de crédito, PIX e créditos da conta." },
];

interface FAQProps {
  onBack: () => void;
}

export function FAQ({ onBack }: FAQProps) {
  const [search, setSearch] = useState("");
  
  const filtered = faqs.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="font-semibold">Ajuda & FAQ</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Como podemos ajudar?</h2>
          <p className="text-muted-foreground">Busque respostas rápidas para suas dúvidas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar dúvidas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-2">
            {filtered.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/5 p-8 rounded-lg text-center"
        >
          <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Não encontrou o que procura?</h3>
          <p className="text-sm text-muted-foreground mb-4">Entre em contato conosco</p>
          <Button className="bg-primary">Falar com Suporte</Button>
        </motion.div>
      </div>
    </div>
  );
}
