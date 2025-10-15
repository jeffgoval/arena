import { useEffect, useRef, createContext, useContext, useState, ReactNode } from "react";

interface AnnouncerContextType {
  announce: (message: string, priority?: "polite" | "assertive") => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | null>(null);

export function useAnnouncer() {
  const context = useContext(AnnouncerContext);
  if (!context) {
    throw new Error("useAnnouncer must be used within A11yAnnouncerProvider");
  }
  return context;
}

interface A11yAnnouncerProviderProps {
  children: ReactNode;
}

export function A11yAnnouncerProvider({ children }: A11yAnnouncerProviderProps) {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    if (priority === "assertive") {
      setAssertiveMessage("");
      setTimeout(() => setAssertiveMessage(message), 100);
    } else {
      setPoliteMessage("");
      setTimeout(() => setPoliteMessage(message), 100);
    }
  };

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      
      {/* Live Regions for Screen Readers */}
      <div className="sr-only">
        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
          aria-relevant="additions text"
        >
          {politeMessage}
        </div>
        <div 
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
          aria-relevant="additions text"
        >
          {assertiveMessage}
        </div>
      </div>
    </AnnouncerContext.Provider>
  );
}

/**
 * Visual announcer component for displaying messages
 * This is complementary to the screen reader announcer
 */
export function A11yAnnouncer() {
  return null; // The live regions are rendered by the provider
}
