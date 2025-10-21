import { useState } from "react";
import { X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("QUEROCONHECER10");
    alert("Cupom copiado! Use QUEROCONHECER10 na sua primeira locação");
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary via-secondary to-accent text-white">
      <div className="container py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Tag className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm md:text-base font-medium">
              <span className="font-bold">OFERTA ESPECIAL:</span> Use o cupom{" "}
              <code className="bg-white/20 px-2 py-1 rounded text-sm font-mono">
                QUEROCONHECER10
              </code>{" "}
              e ganhe <span className="font-bold">10% OFF</span> na primeira locação
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyCoupon}
              className="hidden sm:flex"
            >
              Copiar Cupom
            </Button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Fechar banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
