"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BottomNavigation, useBottomNavigation } from "./BottomNavigation";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  bottomNavVariant?: 'dashboard' | 'public';
  className?: string;
  contentClassName?: string;
}

export function ResponsiveLayout({
  children,
  showBottomNav = false,
  bottomNavVariant = 'dashboard',
  className,
  contentClassName
}: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { paddingClass } = useBottomNavigation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Conteúdo principal */}
      <div className={cn(
        "min-h-screen",
        showBottomNav && paddingClass,
        contentClassName
      )}>
        {children}
      </div>

      {/* Bottom Navigation - apenas mobile */}
      {showBottomNav && (
        <BottomNavigation variant={bottomNavVariant} />
      )}
    </div>
  );
}

// Hook para detectar se é mobile
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Hook para safe area (iPhone notch, etc.)
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeArea;
}