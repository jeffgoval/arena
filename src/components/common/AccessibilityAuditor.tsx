/**
 * Accessibility Auditor
 * Automated accessibility testing and reporting
 */

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";

interface A11yIssue {
  type: "error" | "warning" | "info";
  rule: string;
  element: string;
  description: string;
  suggestion: string;
}

interface A11yReport {
  errors: A11yIssue[];
  warnings: A11yIssue[];
  info: A11yIssue[];
  score: number;
}

/**
 * Run accessibility audit on the page
 */
function runAccessibilityAudit(): A11yReport {
  const issues: A11yIssue[] = [];

  // 1. Check for images without alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  imagesWithoutAlt.forEach((img) => {
    issues.push({
      type: "error",
      rule: "WCAG 2.1 - 1.1.1 Non-text Content",
      element: img.tagName,
      description: "Imagem sem atributo alt",
      suggestion: "Adicione um atributo alt descritivo para a imagem",
    });
  });

  // 2. Check for buttons without accessible names
  const buttonsWithoutLabel = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby]):empty');
  buttonsWithoutLabel.forEach((btn) => {
    issues.push({
      type: "error",
      rule: "WCAG 2.1 - 4.1.2 Name, Role, Value",
      element: "button",
      description: "Botão sem texto ou label acessível",
      suggestion: "Adicione texto ao botão ou use aria-label",
    });
  });

  // 3. Check for form inputs without labels
  const inputsWithoutLabel = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  inputsWithoutLabel.forEach((input) => {
    const id = input.getAttribute('id');
    if (!id || !document.querySelector(`label[for="${id}"]`)) {
      issues.push({
        type: "error",
        rule: "WCAG 2.1 - 3.3.2 Labels or Instructions",
        element: "input",
        description: "Input sem label associado",
        suggestion: "Associe um <label> ao input ou use aria-label",
      });
    }
  });

  // 4. Check for heading hierarchy
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1]);
    if (lastLevel > 0 && level - lastLevel > 1) {
      issues.push({
        type: "warning",
        rule: "WCAG 2.1 - 1.3.1 Info and Relationships",
        element: heading.tagName,
        description: `Hierarquia de headings pulou níveis (${lastLevel} → ${level})`,
        suggestion: "Mantenha a hierarquia sequencial de headings",
      });
    }
    lastLevel = level;
  });

  // 5. Check for links without href
  const linksWithoutHref = document.querySelectorAll('a:not([href])');
  linksWithoutHref.forEach((link) => {
    if (!link.getAttribute('role')) {
      issues.push({
        type: "warning",
        rule: "WCAG 2.1 - 2.1.1 Keyboard",
        element: "a",
        description: "Link sem href e sem role",
        suggestion: "Adicione href ou use role='button' e torne-o tabulável",
      });
    }
  });

  // 6. Check for color contrast (simplified)
  const elementsWithColor = document.querySelectorAll('[style*="color"]');
  elementsWithColor.forEach((el) => {
    issues.push({
      type: "info",
      rule: "WCAG 2.1 - 1.4.3 Contrast (Minimum)",
      element: el.tagName,
      description: "Elemento com cor inline - verificar contraste manualmente",
      suggestion: "Certifique-se de que o contraste seja pelo menos 4.5:1 para texto normal",
    });
  });

  // 7. Check for focus indicators
  const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  let hasFocusStyles = false;
  focusableElements.forEach((el) => {
    const styles = window.getComputedStyle(el, ':focus-visible');
    if (styles.outline !== 'none' || styles.boxShadow !== 'none') {
      hasFocusStyles = true;
    }
  });
  if (!hasFocusStyles && focusableElements.length > 0) {
    issues.push({
      type: "warning",
      rule: "WCAG 2.1 - 2.4.7 Focus Visible",
      element: "global",
      description: "Poucos elementos focáveis têm indicador de foco visível",
      suggestion: "Adicione estilos :focus-visible aos elementos interativos",
    });
  }

  // 8. Check for landmark regions
  const main = document.querySelector('main');
  const nav = document.querySelector('nav, [role="navigation"]');
  const header = document.querySelector('header, [role="banner"]');
  const footer = document.querySelector('footer, [role="contentinfo"]');
  
  if (!main) {
    issues.push({
      type: "error",
      rule: "WCAG 2.1 - 1.3.1 Info and Relationships",
      element: "main",
      description: "Página sem elemento <main>",
      suggestion: "Adicione um elemento <main> para marcar o conteúdo principal",
    });
  }
  if (!nav) {
    issues.push({
      type: "info",
      rule: "WCAG 2.1 - 2.4.1 Bypass Blocks",
      element: "nav",
      description: "Página sem navegação principal",
      suggestion: "Considere adicionar um elemento <nav> para navegação",
    });
  }

  // 9. Check for skip links
  const skipLink = document.querySelector('a[href^="#main"], a[href^="#content"]');
  if (!skipLink) {
    issues.push({
      type: "warning",
      rule: "WCAG 2.1 - 2.4.1 Bypass Blocks",
      element: "skip-link",
      description: "Página sem skip link",
      suggestion: "Adicione um skip link para ir direto ao conteúdo principal",
    });
  }

  // 10. Check for lang attribute
  const html = document.documentElement;
  if (!html.getAttribute('lang')) {
    issues.push({
      type: "error",
      rule: "WCAG 2.1 - 3.1.1 Language of Page",
      element: "html",
      description: "Elemento <html> sem atributo lang",
      suggestion: "Adicione lang='pt-BR' ao elemento <html>",
    });
  }

  // 11. Check for ARIA roles correctness
  const elementsWithRole = document.querySelectorAll('[role]');
  elementsWithRole.forEach((el) => {
    const role = el.getAttribute('role');
    const validRoles = [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
      'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo',
      'definition', 'dialog', 'directory', 'document', 'feed', 'figure', 'form',
      'grid', 'gridcell', 'group', 'heading', 'img', 'link', 'list', 'listbox',
      'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem',
      'menuitemcheckbox', 'menuitemradio', 'navigation', 'none', 'note', 'option',
      'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row',
      'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
      'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist',
      'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree',
      'treegrid', 'treeitem'
    ];
    if (role && !validRoles.includes(role)) {
      issues.push({
        type: "error",
        rule: "ARIA - Valid Roles",
        element: el.tagName,
        description: `Role ARIA inválido: "${role}"`,
        suggestion: "Use apenas roles ARIA válidos da especificação",
      });
    }
  });

  // 12. Check for reduced motion support
  const animatedElements = document.querySelectorAll('[class*="animate-"], [style*="animation"]');
  const hasReducedMotionCSS = Array.from(document.styleSheets).some(sheet => {
    try {
      const rules = Array.from(sheet.cssRules || []);
      return rules.some(rule => 
        rule.cssText.includes('prefers-reduced-motion')
      );
    } catch {
      return false;
    }
  });
  
  if (animatedElements.length > 0 && !hasReducedMotionCSS) {
    issues.push({
      type: "warning",
      rule: "WCAG 2.1 - 2.3.3 Animation from Interactions",
      element: "global",
      description: "Animações sem suporte a prefers-reduced-motion",
      suggestion: "Adicione @media (prefers-reduced-motion: reduce) para desabilitar animações",
    });
  }

  // Calculate score
  const errors = issues.filter(i => i.type === "error");
  const warnings = issues.filter(i => i.type === "warning");
  const info = issues.filter(i => i.type === "info");

  const maxScore = 100;
  const errorPenalty = 10;
  const warningPenalty = 3;
  const infoPenalty = 1;

  const score = Math.max(
    0,
    maxScore - (errors.length * errorPenalty) - (warnings.length * warningPenalty) - (info.length * infoPenalty)
  );

  return {
    errors,
    warnings,
    info,
    score,
  };
}

/**
 * Accessibility Auditor Component
 */
export function AccessibilityAuditor() {
  const [report, setReport] = useState<A11yReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunAudit = () => {
    setIsRunning(true);
    // Simulate async audit
    setTimeout(() => {
      const newReport = runAccessibilityAudit();
      setReport(newReport);
      setIsRunning(false);
    }, 500);
  };

  useEffect(() => {
    // Run audit on mount in development
    if (process.env.NODE_ENV === 'development') {
      handleRunAudit();
    }
  }, []);

  if (!report && !isRunning) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-semibold mb-2">Auditoria de Acessibilidade</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Execute uma auditoria automática para identificar problemas de acessibilidade
              </p>
            </div>
            <Button onClick={handleRunAudit}>
              Executar Auditoria
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isRunning) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-muted-foreground">
              Executando auditoria de acessibilidade...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excelente";
    if (score >= 70) return "Bom";
    if (score >= 50) return "Regular";
    return "Precisa melhorar";
  };

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pontuação de Acessibilidade</span>
            <Button onClick={handleRunAudit} variant="outline" size="sm">
              Executar Novamente
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(report!.score)}`}>
              {report!.score}
            </div>
            <div className="text-lg font-medium text-muted-foreground">
              {getScoreLabel(report!.score)}
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <div className="text-center">
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-4 w-4" />
                  <span className="font-semibold">{report!.errors.length}</span>
                </div>
                <div className="text-xs text-muted-foreground">Erros</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">{report!.warnings.length}</span>
                </div>
                <div className="text-xs text-muted-foreground">Avisos</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-info">
                  <Info className="h-4 w-4" />
                  <span className="font-semibold">{report!.info.length}</span>
                </div>
                <div className="text-xs text-muted-foreground">Info</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues */}
      {report!.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Erros ({report!.errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report!.errors.map((issue, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="destructive">{issue.element}</Badge>
                  <div className="flex-1">
                    <div className="font-medium">{issue.description}</div>
                    <div className="text-xs text-muted-foreground">{issue.rule}</div>
                    <div className="text-sm text-success mt-1">💡 {issue.suggestion}</div>
                  </div>
                </div>
                {index < report!.errors.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {report!.warnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Avisos ({report!.warnings.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report!.warnings.map((issue, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="border-warning text-warning">
                    {issue.element}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium">{issue.description}</div>
                    <div className="text-xs text-muted-foreground">{issue.rule}</div>
                    <div className="text-sm text-success mt-1">💡 {issue.suggestion}</div>
                  </div>
                </div>
                {index < report!.warnings.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {report!.info.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-info">
              <Info className="h-5 w-5" />
              Informações ({report!.info.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report!.info.map((issue, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="border-info text-info">
                    {issue.element}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium">{issue.description}</div>
                    <div className="text-xs text-muted-foreground">{issue.rule}</div>
                    <div className="text-sm text-success mt-1">💡 {issue.suggestion}</div>
                  </div>
                </div>
                {index < report!.info.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Perfect Score */}
      {report!.errors.length === 0 && 
       report!.warnings.length === 0 && 
       report!.info.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-success" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Perfeito! 🎉</h3>
                <p className="text-muted-foreground">
                  Nenhum problema de acessibilidade detectado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
