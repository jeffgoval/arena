import { useEffect, useState, RefObject } from "react";

/**
 * Hook para detectar quando um elemento está visível no viewport
 * Útil para lazy loading de imagens e infinite scroll
 * 
 * @param ref - Ref do elemento a observar
 * @param options - Opções do IntersectionObserver
 * @returns true se o elemento está visível
 * 
 * @example
 * const imageRef = useRef<HTMLImageElement>(null);
 * const isVisible = useIntersectionObserver(imageRef, { threshold: 0.1 });
 * 
 * {isVisible && <img ref={imageRef} src={imageSrc} />}
 */
export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold, options.root, options.rootMargin]);

  return isIntersecting;
}

/**
 * Hook para lazy loading one-time
 * Após o elemento ser visível uma vez, permanece true
 */
export function useLazyLoad(
  ref: RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [hasLoaded, setHasLoaded] = useState(false);
  const isVisible = useIntersectionObserver(ref, options);

  useEffect(() => {
    if (isVisible && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isVisible, hasLoaded]);

  return hasLoaded;
}
