"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogIn } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray/20">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo-arena.png"
                alt="Arena Dona Santa"
                width={48}
                height={48}
                className="drop-shadow-md"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Arena Dona Santa
              </h1>
              <p className="text-xs text-dark/60 font-medium">Governador Valadares</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#modalidades"
              className="text-sm font-medium text-dark/70 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
            >
              Modalidades
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-dark/70 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
            >
              Recursos
            </a>
            <a
              href="#contato"
              className="text-sm font-medium text-dark/70 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
            >
              Contato
            </a>

            {/* Botão Entrar */}
            <Button 
              onClick={() => startTransition(() => router.push("/auth"))}
              disabled={isPending}
              className="gap-2"
            >
              <LogIn className="w-4 h-4" />
              {isPending ? "Carregando..." : "Entrar"}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-dark hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray/20 animate-fadeIn">
            <nav className="flex flex-col gap-4">
              <a
                href="#modalidades"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-dark/70 hover:text-primary transition-colors py-2"
              >
                Modalidades
              </a>
              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-dark/70 hover:text-primary transition-colors py-2"
              >
                Recursos
              </a>
              <a
                href="#contato"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-dark/70 hover:text-primary transition-colors py-2"
              >
                Contato
              </a>

              {/* Botão Entrar Mobile */}
              <Button 
                onClick={() => {
                  setIsMenuOpen(false);
                  startTransition(() => router.push("/auth"));
                }}
                disabled={isPending}
                className="w-full gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                {isPending ? "Carregando..." : "Entrar"}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
