"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Sparkles, Waves } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      <div className="container-custom relative z-10 text-center text-white py-24 md:py-32">
        <div className="mb-6 fade-in">
          <span className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4" />
            A Melhor Arena de Governador Valadares
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 fade-in leading-tight">
          Bem-vindo à
          <br />
          <span className="gradient-text">Arena Dona Santa</span>
        </h1>

        <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-white/90 fade-in leading-relaxed font-medium">
          Reserve sua quadra online, organize turmas e gerencie tudo em um só lugar.
          Futebol Society e Futsal com a melhor estrutura da região.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16 fade-in">
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

        <div className="flex flex-wrap gap-8 justify-center text-sm fade-in">
          <span className="flex items-center gap-2 text-white/90">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">5 Modalidades</span>
          </span>
          <span className="flex items-center gap-2 text-white/90">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">Aulas com Professores</span>
          </span>
          <span className="flex items-center gap-2 text-white/90">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Waves className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">Piscina + Bar</span>
          </span>
          <span className="flex items-center gap-2 text-white/90">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">Governador Valadares</span>
          </span>
        </div>
      </div>
    </section>
  );
}
