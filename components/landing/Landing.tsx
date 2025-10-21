'use client';

import dynamic from 'next/dynamic';
import { motion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Trophy, Instagram, MapPin, Mail } from "lucide-react";
import { useState, useEffect } from "react";

// Simple inline ArenaLogo component
const ArenaLogo = ({ iconSize = "md", variant = "dark", textClassName = "" }: { iconSize?: string; variant?: string; textClassName?: string }) => (
  <div className="flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
      <Trophy className="h-5 w-5" />
    </div>
    <span className={`font-semibold ${textClassName}`}>Arena Dona Santa</span>
  </div>
);

// Simple inline Footer component
const Footer = () => (
  <footer className="border-t bg-muted/30">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <ArenaLogo iconSize="sm" variant="dark" />
          <p className="text-sm text-muted-foreground">
            A melhor arena esportiva de Governador Valadares
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">Contato</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              (33) 99158-0013
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Governador Valadares, MG
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              contato@arenadonasanta.com.br
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">Horário</h3>
          <div className="text-sm text-muted-foreground">
            <p>Segunda a Sexta: 6h - 23h</p>
            <p>Sábado e Domingo: 7h - 22h</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">Redes Sociais</h3>
          <a href="https://instagram.com/arenadonasanta" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <Instagram className="h-4 w-4" />
            @arenadonasanta
          </a>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Arena Dona Santa. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

// Eager loading - acima da dobra
import { PromoBanner } from "@/components/home/PromoBanner";
import { HeroSection } from "@/components/home/HeroSection";

// Lazy loading - abaixo da dobra (carrega sob demanda)
const WelcomeSection = dynamic(() => import("@/components/home/WelcomeSection").then(mod => ({ default: mod.WelcomeSection })), { ssr: true });
const FeaturesGrid = dynamic(() => import("@/components/home/FeaturesGrid").then(mod => ({ default: mod.FeaturesGrid })), { ssr: true });
const SportsModalitiesSection = dynamic(() => import("@/components/home/SportsModalitiesSection").then(mod => ({ default: mod.SportsModalitiesSection })), { ssr: true });
const GaloAcademySection = dynamic(() => import("@/components/home/GaloAcademySection").then(mod => ({ default: mod.GaloAcademySection })), { ssr: true });
const BarRestaurantSection = dynamic(() => import("@/components/home/BarRestaurantSection").then(mod => ({ default: mod.BarRestaurantSection })), { ssr: true });
const SponsorsSection = dynamic(() => import("@/components/home/SponsorsSection").then(mod => ({ default: mod.SponsorsSection })), { ssr: true });
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection").then(mod => ({ default: mod.TestimonialsSection })), { ssr: true });
const ContactSection = dynamic(() => import("@/components/home/ContactSection").then(mod => ({ default: mod.ContactSection })), { ssr: true });
const CTASection = dynamic(() => import("@/components/home/CTASection").then(mod => ({ default: mod.CTASection })), { ssr: true });

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Floating CTA Bar - Aparece após scroll */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: scrolled ? 0 : -100,
          opacity: scrolled ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-background/95 backdrop-blur-md border-b shadow-lg">
          <div className="container flex h-16 items-center justify-between">
            <ArenaLogo
              iconSize="sm"
              variant="dark"
              textClassName="text-sm md:text-base"
            />

            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                  <a href="tel:33991580013">
                    <Phone className="h-4 w-4 mr-2" />
                    (33) 99158-0013
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <PromoBanner />
      <main className="flex-1">
        <motion.div
          id="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <HeroSection />
        </motion.div>

        <motion.div
          id="about"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <WelcomeSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <FeaturesGrid />
        </motion.div>

        <motion.div
          id="sports"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SportsModalitiesSection />
        </motion.div>

        <motion.div
          id="academy"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <GaloAcademySection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <BarRestaurantSection />
        </motion.div>





        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SponsorsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <TestimonialsSection />
        </motion.div>

        <motion.div
          id="contact"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <ContactSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <CTASection />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
