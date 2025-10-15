import { Trophy } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const scrollToSection = (sectionId: string) => {
    // Navigate to landing page first
    onNavigate('landing');
    
    // Wait for navigation and scroll
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <footer id="footer" className="border-t bg-muted/30 mt-20" role="contentinfo">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Sobre */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="font-semibold">Arena Dona Santa</span>
            </div>
            <p className="text-sm text-muted-foreground">
              O melhor sistema de reservas de quadras esportivas
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => scrollToSection('como-funciona')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('court-details')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Ver Quadras
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('booking')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Fazer Reserva
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('faq')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Ajuda & FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('terms')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Termos de Uso
                </button>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>(11) 98765-4321</li>
              <li>contato@arenadonasanta.com</li>
              <li>Rua do Esporte, 123</li>
            </ul>
          </div>

          {/* Horário */}
          <div>
            <h3 className="font-semibold mb-4">Horário</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Segunda a Sexta: 6h às 23h</li>
              <li>Sábado e Domingo: 7h às 22h</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Arena Dona Santa. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
