import Image from "next/image";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark text-white py-16">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <Image
                src="/logo-arena.png"
                alt="Arena Dona Santa Logo"
                width={64}
                height={64}
                className="mb-4"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4">Arena Dona Santa</h3>
            <p className="text-white/70 leading-relaxed">
              Gestão inteligente de quadras esportivas em Governador Valadares.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Quadras</h4>
            <ul className="space-y-3 text-white/70">
              <li>
                <a href="#modalidades" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                  Society
                </a>
              </li>
              <li>
                <a href="#modalidades" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                  Futsal
                </a>
              </li>
              <li>
                <a href="#modalidades" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                  Beach Tennis
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                  Horários
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Suporte</h4>
            <ul className="space-y-3 text-white/70">
              <li>
                <a href="#" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                  Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Redes Sociais</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-primary/20 border border-white/20 hover:border-primary/40 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-primary/20 border border-white/20 hover:border-primary/40 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-primary/20 border border-white/20 hover:border-primary/40 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/60">
          <p className="text-sm">© 2025 Arena Dona Santa. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
