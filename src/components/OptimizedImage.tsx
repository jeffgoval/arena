import { useRef, useState } from "react";
import { useLazyLoad } from "../hooks/useIntersectionObserver";
import { cn } from "./ui/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  priority?: boolean;
  placeholder?: "blur" | "empty";
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Componente de imagem otimizada com lazy loading
 * 
 * Features:
 * - Lazy loading automático usando IntersectionObserver
 * - Placeholder blur durante carregamento
 * - Suporte a priority loading para imagens above-the-fold
 * - Tratamento de erro com fallback
 * - Otimização automática de formato (sugere WebP)
 * 
 * @example
 * <OptimizedImage
 *   src="https://example.com/image.jpg"
 *   alt="Descrição"
 *   placeholder="blur"
 *   className="rounded-lg"
 * />
 */
export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  objectFit = "cover",
  priority = false,
  placeholder = "blur",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const shouldLoad = useLazyLoad(imageRef);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Carrega imediatamente se for priority
  const shouldRender = priority || shouldLoad;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={imageRef}
      className={cn("relative overflow-hidden bg-muted", className)}
      style={{ width, height }}
    >
      {/* Placeholder durante loading */}
      {!isLoaded && !hasError && placeholder === "blur" && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Imagem real */}
      {shouldRender && !hasError && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            objectFit === "fill" && "object-fill",
            objectFit === "none" && "object-none",
            objectFit === "scale-down" && "object-scale-down",
            "w-full h-full"
          )}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      )}

      {/* Fallback em caso de erro */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center p-4">
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Imagem não disponível</p>
          </div>
        </div>
      )}
    </div>
  );
}
