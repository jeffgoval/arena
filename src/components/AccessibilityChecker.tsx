/**
 * Accessibility Checker Component
 * This component helps identify accessibility issues in development
 * Should only be used in development mode
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle, XCircle, Eye } from "lucide-react";

interface A11yIssue {
  type: "error" | "warning" | "info";
  category: string;
  message: string;
  element?: string;
}

export function AccessibilityChecker() {
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "development") return;

    const checkAccessibility = () => {
      const foundIssues: A11yIssue[] = [];

      // Check for images without alt text
      const images = document.querySelectorAll("img");
      images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute("aria-label")) {
          foundIssues.push({
            type: "error",
            category: "Images",
            message: `Imagem sem alt text (índice ${index})`,
            element: img.src || "unknown",
          });
        }
      });

      // Check for buttons without accessible names
      const buttons = document.querySelectorAll("button");
      buttons.forEach((button, index) => {
        const hasText = button.textContent?.trim();
        const hasAriaLabel = button.getAttribute("aria-label");
        const hasAriaLabelledBy = button.getAttribute("aria-labelledby");
        
        if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
          foundIssues.push({
            type: "error",
            category: "Buttons",
            message: `Botão sem nome acessível (índice ${index})`,
          });
        }
      });

      // Check for links without accessible names
      const links = document.querySelectorAll("a");
      links.forEach((link, index) => {
        const hasText = link.textContent?.trim();
        const hasAriaLabel = link.getAttribute("aria-label");
        
        if (!hasText && !hasAriaLabel) {
          foundIssues.push({
            type: "error",
            category: "Links",
            message: `Link sem texto ou aria-label (índice ${index})`,
            element: link.href || "unknown",
          });
        }
      });

      // Check for form inputs without labels
      const inputs = document.querySelectorAll("input, textarea, select");
      inputs.forEach((input, index) => {
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.getAttribute("aria-label");
        const hasAriaLabelledBy = input.getAttribute("aria-labelledby");
        
        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
          foundIssues.push({
            type: "warning",
            category: "Forms",
            message: `Campo de formulário sem label (índice ${index})`,
          });
        }
      });

      // Check for headings hierarchy
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      let previousLevel = 0;
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1));
        if (previousLevel > 0 && level > previousLevel + 1) {
          foundIssues.push({
            type: "warning",
            category: "Headings",
            message: `Hierarquia de headings pulada: ${heading.tagName} após h${previousLevel}`,
          });
        }
        previousLevel = level;
      });

      // Check for interactive elements with tabindex > 0
      const positiveTabindex = document.querySelectorAll("[tabindex]");
      positiveTabindex.forEach((element) => {
        const tabindex = parseInt(element.getAttribute("tabindex") || "0");
        if (tabindex > 0) {
          foundIssues.push({
            type: "warning",
            category: "Keyboard",
            message: `Elemento com tabindex positivo (${tabindex}) - use 0 ou -1`,
          });
        }
      });

      setIssues(foundIssues);
    };

    // Run initial check
    checkAccessibility();

    // Re-check on DOM changes
    const observer = new MutationObserver(checkAccessibility);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  if (process.env.NODE_ENV !== "development") return null;

  const errorCount = issues.filter((i) => i.type === "error").length;
  const warningCount = issues.filter((i) => i.type === "warning").length;

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-[9998] rounded-full w-14 h-14 p-0 shadow-lg"
        variant={errorCount > 0 ? "destructive" : warningCount > 0 ? "default" : "secondary"}
        aria-label={`Verificador de Acessibilidade: ${errorCount} erros, ${warningCount} avisos`}
      >
        <Eye className="h-6 w-6" />
        {(errorCount > 0 || warningCount > 0) && (
          <Badge
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center"
            variant={errorCount > 0 ? "destructive" : "default"}
          >
            {errorCount + warningCount}
          </Badge>
        )}
      </Button>

      {/* Issues Panel */}
      {isVisible && (
        <Card className="fixed bottom-20 right-4 z-[9998] w-96 max-h-[600px] overflow-hidden shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Acessibilidade
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                aria-label="Fechar verificador"
              >
                ×
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                {errorCount} erros
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {warningCount} avisos
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[500px]">
            {issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-success mb-2" />
                <p className="font-medium">Nenhum problema encontrado!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Todos os testes básicos de acessibilidade passaram.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      issue.type === "error"
                        ? "bg-destructive/10 border-destructive"
                        : "bg-warning/10 border-warning"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {issue.type === "error" ? (
                        <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{issue.category}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {issue.message}
                        </p>
                        {issue.element && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {issue.element}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
