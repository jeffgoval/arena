/**
 * Optimized Image Component
 * Lazy loading, responsive images, blur placeholder
 */

import { useState, useRef, useEffect } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { cn } from "../../lib/utils";

interface ImageOptimizedProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  blurDataURL?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  aspectRatio?: string;
  sizes?: string;
  quality?: number;
}

/**
 * Optimized Image with lazy loading and blur placeholder
 */
export function ImageOptimized({
  src,
  alt,
  blurDataURL,
  priority = false,
  onLoad: onLoadProp,
  onError: onErrorProp,
  className,
  aspectRatio,
  sizes,
  quality = 75,
  ...props
}: ImageOptimizedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : blurDataURL || "");
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  const entry = useIntersectionObserver(imgRef, {
    threshold: 0,
    rootMargin: "50px",
    freezeOnceVisible: true,
  });

  const isInView = !!entry?.isIntersecting;

  useEffect(() => {
    if (!priority && isInView && !isLoaded && !hasError) {
      setImageSrc(src);
    }
  }, [isInView, priority, src, isLoaded, hasError]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoadProp?.();
  };

  const handleError = () => {
    setHasError(true);
    onErrorProp?.();
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatio && `aspect-[${aspectRatio}]`,
        className
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          hasError && "hidden"
        )}
        sizes={sizes}
        {...props}
      />

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
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
            <p className="text-sm">Falha ao carregar imagem</p>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {!isLoaded && !hasError && imageSrc && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
    </div>
  );
}

/**
 * Avatar with optimized loading
 */
interface AvatarOptimizedProps {
  src?: string;
  alt: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function AvatarOptimized({
  src,
  alt,
  fallback,
  size = "md",
  className,
}: AvatarOptimizedProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const initials = fallback || alt.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-primary/10 flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-medium text-primary">{initials}</span>
      )}
    </div>
  );
}

/**
 * Background Image with optimization
 */
interface BackgroundImageProps {
  src: string;
  alt?: string;
  blurDataURL?: string;
  children?: React.ReactNode;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export function BackgroundImage({
  src,
  alt = "",
  blurDataURL,
  children,
  className,
  overlay = false,
  overlayOpacity = 0.5,
}: BackgroundImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
          style={{ backgroundImage: `url(${blurDataURL})` }}
        />
      )}

      {/* Main background */}
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{ backgroundImage: `url(${src})` }}
        role={alt ? "img" : "presentation"}
        aria-label={alt}
      >
        <img
          src={src}
          alt=""
          onLoad={() => setIsLoaded(true)}
          className="sr-only"
        />
      </div>

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

/**
 * Image Gallery with progressive loading
 */
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    blurDataURL?: string;
  }>;
  columns?: number;
  gap?: number;
  aspectRatio?: string;
}

export function ImageGallery({
  images,
  columns = 3,
  gap = 4,
  aspectRatio = "1/1",
}: ImageGalleryProps) {
  return (
    <div
      className={cn("grid", `gap-${gap}`)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {images.map((image, index) => (
        <ImageOptimized
          key={index}
          src={image.src}
          alt={image.alt}
          blurDataURL={image.blurDataURL}
          aspectRatio={aspectRatio}
          priority={index < 3} // Load first 3 images eagerly
        />
      ))}
    </div>
  );
}
