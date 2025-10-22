import { DesignSystemShowcase } from "@/components/ui/showcase";

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background">
      <DesignSystemShowcase />
    </main>
  );
}

export const metadata = {
  title: "Design System - Arena Dona Santa",
  description: "Sistema de design atualizado com componentes modernos e acessíveis",
};