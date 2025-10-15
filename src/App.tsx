/**
 * Main Application Component
 * Entry point with providers and routing
 */

import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

// Providers
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { SWRProvider } from "./contexts/SWRProvider";

// Features
import { A11yAnnouncerProvider } from "./components/features";
import { SkipLinks } from "./components/features";

// Common
import { ErrorBoundary, CommandPalette, TopLoadingBar, ResourceHints } from "./components/common";

// Shared
import { Header, Breadcrumbs, LayoutErrorBoundary, Footer, ScrollToTop } from "./components/shared";

// Router
import { AppRouter } from "./router/AppRouter";

// Hooks
import { useHashRouter } from "./hooks/useHashRouter";

// Config
import { ROUTES, PAGE_TITLES, type Page } from "./config/routes";

/**
 * Main Application Content
 */
function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const { currentPage, navigate } = useHashRouter(ROUTES.LANDING);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<string | undefined>("silver");
  const [isNavigating, setIsNavigating] = useState(false);

  // Announce page changes to screen readers + loading state
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 300);

    const announcer = document.getElementById("route-announcer");
    if (announcer) {
      announcer.textContent = `Navegado para ${PAGE_TITLES[currentPage]}`;
    }

    // Set page title for browser
    document.title = `${PAGE_TITLES[currentPage]} - Arena Dona Santa`;

    return () => clearTimeout(timer);
  }, [currentPage]);

  // Show header for authenticated pages
  const showHeader = isAuthenticated && ![
    ROUTES.LANDING, 
    ROUTES.LOGIN, 
    ROUTES.CADASTRO, 
    ROUTES.INVITE_VIEW
  ].includes(currentPage);

  // Wrapper for CommandPalette navigation (accepts string)
  const handleCommandNavigate = (page: string) => {
    navigate(page as Page);
  };

  return (
    <>
      {/* Resource Hints for Performance */}
      <ResourceHints
        preconnect={[
          'https://esm.sh', // ESM CDN
          'https://fonts.googleapis.com',
        ]}
        prefetch={[
          // Prefetch likely next routes based on user role
          ...(user?.role === 'client' ? ['/booking', '/teams'] : []),
          ...(user?.role === 'manager' ? ['/manager-dashboard'] : []),
        ]}
      />

      {/* Skip Links */}
      <SkipLinks />

      {/* Top Loading Bar */}
      <TopLoadingBar isLoading={isNavigating} />

      {/* Command Palette (⌘K) */}
      {isAuthenticated && <CommandPalette onNavigate={handleCommandNavigate} />}

      {/* Route Announcer for Screen Readers */}
      <div
        id="route-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <LayoutErrorBoundary onNavigate={navigate}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          {showHeader && (
            <header id="main-navigation" role="banner">
              <Header onNavigate={navigate} />
            </header>
          )}
          
          {/* Main Content */}
          <main 
            id="main-content" 
            role="main" 
            tabIndex={-1} 
            className="flex-1"
          >
            {/* Breadcrumbs */}
            {showHeader && <Breadcrumbs currentPage={currentPage} onNavigate={navigate} />}
            
            <AppRouter
              currentPage={currentPage}
              navigate={navigate}
              isAuthenticated={isAuthenticated}
              userRole={user?.role}
              showRatingModal={showRatingModal}
              setShowRatingModal={setShowRatingModal}
              currentSubscription={currentSubscription}
              setCurrentSubscription={setCurrentSubscription}
            />
          </main>

          {/* Footer */}
          <Footer onNavigate={navigate} />
        </div>

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </LayoutErrorBoundary>
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          classNames: {
            toast: 'rounded-lg shadow-lg backdrop-blur-sm',
            title: 'font-medium',
            description: 'text-sm opacity-90',
            actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90',
            cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/90',
            closeButton: 'bg-muted hover:bg-muted/90',
          },
        }}
      />
    </>
  );
}

/**
 * Root Application Component with Providers
 */
export default function App() {
  return (
    <ErrorBoundary
      showDetails={process.env.NODE_ENV === "development"}
      onError={(error, errorInfo) => {
        // Log to error tracking service in production
        console.error("Application Error:", error, errorInfo);
        
        // Show toast notification
        toast.error("Ocorreu um erro inesperado. A página será recarregada.");
      }}
    >
      <ThemeProvider>
        <SWRProvider>
          <AuthProvider>
            <NotificationProvider>
              <A11yAnnouncerProvider>
                <AppContent />
              </A11yAnnouncerProvider>
            </NotificationProvider>
          </AuthProvider>
        </SWRProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
