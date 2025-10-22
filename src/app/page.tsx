import { AnimationObserver } from "@/components/AnimationObserver";
import { Testimonials } from "@/components/Testimonials";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Infrastructure } from "@/components/landing/Infrastructure";
import { Modalidades } from "@/components/landing/Modalidades";
import { Diferenciais } from "@/components/landing/Diferenciais";
import { AcademiaGalo } from "@/components/landing/AcademiaGalo";
import { Escolinha } from "@/components/landing/Escolinha";
import { DayUse } from "@/components/landing/DayUse";
import { Patrocinadores } from "@/components/landing/Patrocinadores";
import { Features } from "@/components/landing/Features";
import { Contact } from "@/components/landing/Contact";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <AnimationObserver />
      <Header />
      <Hero />
      <Infrastructure />
      <Modalidades />
      <Diferenciais />
      <AcademiaGalo />
      <Escolinha />
      <DayUse />
      <Patrocinadores />
      <Features />
      <Testimonials />
      <Contact />
      <FinalCTA />
      <Footer />
    </>
  );
}
