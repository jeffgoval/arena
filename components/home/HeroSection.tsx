'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, MapPin, Users, Trophy, LogIn } from "lucide-react";

// Simple inline ArenaLogo component
const ArenaLogo = ({ iconSize = "md", variant = "dark", textClassName = "", showText = true }: { iconSize?: string; variant?: string; textClassName?: string; showText?: boolean }) => (
  <div className="flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
      <Trophy className="h-5 w-5" />
    </div>
    {showText && <span className={`font-semibold ${textClassName}`}>Arena Dona Santa</span>}
  </div>
);

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(/hero-arena.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="container relative z-10 text-center px-4 py-20">
        {/* Logo/Brand no topo (discreto) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
          <ArenaLogo
            iconSize="lg"
            variant="hero"
            showText={true}
            textClassName="text-lg hidden md:inline"
          />
        </div>

        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Main Headline */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            A Melhor Arena de
            <motion.span
              className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mt-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Governador Valadares
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Infraestrutura completa para atletas e famílias que buscam diversão, esporte e qualidade de vida
          </motion.p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="gradient" asChild className="text-lg px-8 py-6 h-auto shadow-2xl">
                <Link href="/cliente/reservas/nova">
                  <Calendar className="mr-2 h-5 w-5" />
                  Reservar um Horário
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 h-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                <Link href="/cliente">
                  <LogIn className="mr-2 h-5 w-5" />
                  Entrar
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mini Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <div className="flex flex-col items-center space-y-2 text-white/90">
              <MapPin className="h-8 w-8" />
              <div className="text-center">
                <p className="text-2xl font-bold">15min</p>
                <p className="text-sm text-white/70">do centro</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2 text-white/90">
              <Trophy className="h-8 w-8" />
              <div className="text-center">
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-white/70">quadras</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2 text-white/90">
              <Users className="h-8 w-8" />
              <div className="text-center">
                <p className="text-2xl font-bold">1000+</p>
                <p className="text-sm text-white/70">atletas</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-3 bg-white/50 rounded-full"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
