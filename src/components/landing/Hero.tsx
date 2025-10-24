"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Sparkles, Waves } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      <div className="hero-bg absolute inset-0 z-0">
        <Image
          src="/hero-arena.jpg"
          alt="Arena Dona Santa - Governador Valadares"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white py-16 md:py-24 lg:py-32 w-full max-w-7xl">
        <div className="mb-4 md:mb-6 fade-in">
          <span className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-2 md:px-6 md:py-2.5 rounded-2xl sm:rounded-full text-xs md:text-sm font-semibold tracking-wide text-center">
            <span className="hidden sm:flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              A Melhor Arena de Governador Valadares
            </span>
            <span className="sm:hidden flex flex-col items-center gap-0.5 leading-tight">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                A Melhor Arena de
              </span>
              <span>Governador Valadares</span>
            </span>
          </span>
        </div>

        <h1 className="text-[32px] md:text-[48px] lg:text-[60px] font-semibold mb-4 md:mb-6 fade-in leading-tight">
          Bem-vindo à
          <br />
          <span className="gradient-text">Arena Dona Santa</span>
        </h1>

        <p className="text-base md:text-lg lg:text-xl mb-8 md:mb-12 max-w-3xl mx-auto text-white/90 fade-in leading-relaxed font-medium">
          Reserve sua quadra online, organize turmas e gerencie tudo em um só lugar.
          Futebol Society e Futsal com a melhor estrutura da região.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto mb-12 md:mb-16 fade-in">
          <Link href="/auth" className="group">
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-xl text-base font-semibold shadow-lg w-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Reservar Quadra
            </button>
          </Link>
          <a href="#academia-galo" className="group">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-dark px-6 py-4 rounded-xl text-base font-bold shadow-lg w-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Academia do Galo
            </button>
          </a>
          <a href="#day-use" className="group">
            <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-4 rounded-xl text-base font-semibold shadow-lg w-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl flex items-center justify-center gap-2">
              <Waves className="w-5 h-5" />
              Day Use
            </button>
          </a>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-6 lg:gap-8 justify-center text-xs md:text-sm fade-in max-w-4xl mx-auto">
          <span className="flex items-center gap-1.5 md:gap-2 text-white/90">
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
            </div>
            <span className="font-medium text-[11px] md:text-sm">5 Modalidades</span>
          </span>
          <span className="flex items-center gap-1.5 md:gap-2 text-white/90">
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Users className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
            </div>
            <span className="font-medium text-[11px] md:text-sm hidden md:inline">Aulas com Professores</span>
            <span className="font-medium text-[11px] md:hidden">Professores</span>
          </span>
          <span className="flex items-center gap-1.5 md:gap-2 text-white/90">
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Waves className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
            </div>
            <span className="font-medium text-[11px] md:text-sm">Piscina + Bar</span>
          </span>
          <span className="flex items-center gap-1.5 md:gap-2 text-white/90">
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
            </div>
            <span className="font-medium text-[11px] md:text-sm hidden md:inline">Governador Valadares</span>
            <span className="font-medium text-[11px] md:hidden">GV/MG</span>
          </span>
        </div>
      </div>
    </section>
  );
}
