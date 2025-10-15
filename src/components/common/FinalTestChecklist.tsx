/**
 * Final Test Checklist
 * Comprehensive testing checklist for final QA
 */

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  Download,
  Share2,
} from "lucide-react";

interface TestItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
}

interface TestCategory {
  id: string;
  title: string;
  items: TestItem[];
  expanded: boolean;
}

const initialTestCategories: TestCategory[] = [
  {
    id: "accessibility",
    title: "Acessibilidade (WCAG 2.1 AA)",
    expanded: true,
    items: [
      {
        id: "a11y-1",
        label: "Todas as imagens têm alt text",
        description: "Verificar se todas as imagens têm atributos alt descritivos",
        checked: false,
      },
      {
        id: "a11y-2",
        label: "Contraste de cores adequado (4.5:1 mínimo)",
        description: "Usar ferramenta de verificação de contraste",
        checked: false,
      },
      {
        id: "a11y-3",
        label: "Navegação por teclado funcional",
        description: "Testar Tab, Shift+Tab, Enter, Esc em todos os componentes",
        checked: false,
      },
      {
        id: "a11y-4",
        label: "Focus indicators visíveis",
        description: "Verificar :focus-visible em elementos interativos",
        checked: false,
      },
      {
        id: "a11y-5",
        label: "ARIA labels e roles corretos",
        description: "Validar landmarks, roles e labels ARIA",
        checked: false,
      },
      {
        id: "a11y-6",
        label: "Screen reader testado",
        description: "Testar com NVDA/JAWS (Windows) ou VoiceOver (Mac)",
        checked: false,
      },
      {
        id: "a11y-7",
        label: "Hierarquia de headings correta",
        description: "h1 → h2 → h3 sequencial",
        checked: false,
      },
      {
        id: "a11y-8",
        label: "Skip links funcionam",
        description: "Testar skip to main content",
        checked: false,
      },
      {
        id: "a11y-9",
        label: "Forms têm labels associados",
        description: "Todos os inputs têm <label> ou aria-label",
        checked: false,
      },
      {
        id: "a11y-10",
        label: "Reduced motion respeitado",
        description: "Testar com prefers-reduced-motion: reduce",
        checked: false,
      },
    ],
  },
  {
    id: "responsive",
    title: "Responsividade",
    expanded: true,
    items: [
      {
        id: "resp-1",
        label: "Mobile (320px - 768px) testado",
        description: "iPhone SE, iPhone 12/13, Samsung Galaxy",
        checked: false,
      },
      {
        id: "resp-2",
        label: "Tablet (768px - 1024px) testado",
        description: "iPad, iPad Pro",
        checked: false,
      },
      {
        id: "resp-3",
        label: "Desktop (1024px+) testado",
        description: "Laptop, Desktop, Wide monitors",
        checked: false,
      },
      {
        id: "resp-4",
        label: "Touch targets adequados (44px mínimo)",
        description: "Botões e links têm tamanho adequado em mobile",
        checked: false,
      },
      {
        id: "resp-5",
        label: "Texto legível sem zoom",
        description: "Font-size mínimo 16px em mobile",
        checked: false,
      },
      {
        id: "resp-6",
        label: "Orientação landscape e portrait",
        description: "Funciona bem em ambas orientações",
        checked: false,
      },
    ],
  },
  {
    id: "performance",
    title: "Performance",
    expanded: true,
    items: [
      {
        id: "perf-1",
        label: "Lighthouse score > 90",
        description: "Performance, Accessibility, Best Practices, SEO",
        checked: false,
      },
      {
        id: "perf-2",
        label: "LCP < 2.5s",
        description: "Largest Contentful Paint",
        checked: false,
      },
      {
        id: "perf-3",
        label: "FID < 100ms",
        description: "First Input Delay",
        checked: false,
      },
      {
        id: "perf-4",
        label: "CLS < 0.1",
        description: "Cumulative Layout Shift",
        checked: false,
      },
      {
        id: "perf-5",
        label: "Imagens otimizadas e lazy loaded",
        description: "WebP, tamanhos responsivos, loading='lazy'",
        checked: false,
      },
      {
        id: "perf-6",
        label: "Bundle size < 200KB (gzipped)",
        description: "Verificar com bundle analyzer",
        checked: false,
      },
      {
        id: "perf-7",
        label: "Code splitting implementado",
        description: "Rotas lazy loaded",
        checked: false,
      },
    ],
  },
  {
    id: "functionality",
    title: "Funcionalidade",
    expanded: true,
    items: [
      {
        id: "func-1",
        label: "Todas as rotas acessíveis",
        description: "Navegação entre páginas funciona",
        checked: false,
      },
      {
        id: "func-2",
        label: "Formulários validam corretamente",
        description: "Mensagens de erro claras e acessíveis",
        checked: false,
      },
      {
        id: "func-3",
        label: "Estados de loading exibidos",
        description: "Spinners, skeletons, progress bars",
        checked: false,
      },
      {
        id: "func-4",
        label: "Estados de erro tratados",
        description: "Error boundaries, retry mechanisms",
        checked: false,
      },
      {
        id: "func-5",
        label: "Estados vazios implementados",
        description: "Empty states com CTAs claros",
        checked: false,
      },
      {
        id: "func-6",
        label: "Feedback visual imediato",
        description: "Toasts, confirmações, animações",
        checked: false,
      },
      {
        id: "func-7",
        label: "Undo/Redo onde apropriado",
        description: "Ações destrutivas têm confirmação",
        checked: false,
      },
    ],
  },
  {
    id: "browser",
    title: "Cross-Browser",
    expanded: false,
    items: [
      {
        id: "browser-1",
        label: "Chrome/Edge testado",
        description: "Versão mais recente",
        checked: false,
      },
      {
        id: "browser-2",
        label: "Firefox testado",
        description: "Versão mais recente",
        checked: false,
      },
      {
        id: "browser-3",
        label: "Safari testado",
        description: "macOS e iOS",
        checked: false,
      },
      {
        id: "browser-4",
        label: "Fallbacks para features não suportadas",
        description: "Progressive enhancement",
        checked: false,
      },
    ],
  },
  {
    id: "security",
    title: "Segurança",
    expanded: false,
    items: [
      {
        id: "sec-1",
        label: "Inputs sanitizados",
        description: "Proteção contra XSS",
        checked: false,
      },
      {
        id: "sec-2",
        label: "HTTPS enforced",
        description: "Sem conteúdo mixed content",
        checked: false,
      },
      {
        id: "sec-3",
        label: "Sensitive data não exposta",
        description: "Sem API keys, tokens no client",
        checked: false,
      },
      {
        id: "sec-4",
        label: "Content Security Policy",
        description: "CSP headers configurados",
        checked: false,
      },
    ],
  },
  {
    id: "ux",
    title: "User Experience",
    expanded: false,
    items: [
      {
        id: "ux-1",
        label: "Micro-interactions suaves",
        description: "Hover, focus, active states",
        checked: false,
      },
      {
        id: "ux-2",
        label: "Transições de página fluidas",
        description: "Loading states, fade in/out",
        checked: false,
      },
      {
        id: "ux-3",
        label: "Tooltips informativos",
        description: "Ajuda contextual onde necessário",
        checked: false,
      },
      {
        id: "ux-4",
        label: "Confirmações para ações importantes",
        description: "Dialogs de confirmação",
        checked: false,
      },
      {
        id: "ux-5",
        label: "Breadcrumbs e navegação clara",
        description: "Usuário sempre sabe onde está",
        checked: false,
      },
    ],
  },
  {
    id: "content",
    title: "Conteúdo",
    expanded: false,
    items: [
      {
        id: "content-1",
        label: "Textos sem typos",
        description: "Revisar todos os textos",
        checked: false,
      },
      {
        id: "content-2",
        label: "Linguagem consistente",
        description: "Tom de voz, terminologia",
        checked: false,
      },
      {
        id: "content-3",
        label: "Mensagens de erro úteis",
        description: "Sugerem ações para resolver",
        checked: false,
      },
      {
        id: "content-4",
        label: "Copy persuasivo em CTAs",
        description: "Botões com labels claros",
        checked: false,
      },
    ],
  },
];

export function FinalTestChecklist() {
  const [categories, setCategories] = useState(initialTestCategories);

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : cat
      )
    );
  };

  const resetChecklist = () => {
    setCategories(initialTestCategories);
  };

  // Calculate progress
  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedItems = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.checked).length,
    0
  );
  const progress = (checkedItems / totalItems) * 100;

  // Export results
  const exportResults = () => {
    const results = categories.map((cat) => ({
      category: cat.title,
      total: cat.items.length,
      checked: cat.items.filter((item) => item.checked).length,
      items: cat.items.map((item) => ({
        label: item.label,
        checked: item.checked,
        description: item.description,
      })),
    }));

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Checklist de Testes Finais</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportResults}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetChecklist}
              >
                Resetar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Progresso: {checkedItems} / {totalItems}
              </span>
              <Badge variant={progress === 100 ? "default" : "secondary"}>
                {progress.toFixed(0)}%
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const catProgress =
                (cat.items.filter((item) => item.checked).length /
                  cat.items.length) *
                100;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    {cat.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={catProgress} className="h-1 flex-1" />
                    <span className="text-xs font-medium">
                      {catProgress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      {categories.map((category) => {
        const categoryProgress =
          (category.items.filter((item) => item.checked).length /
            category.items.length) *
          100;

        return (
          <Card key={category.id}>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {category.expanded ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <Badge variant="outline">
                    {category.items.filter((item) => item.checked).length} /{" "}
                    {category.items.length}
                  </Badge>
                </div>
                {categoryProgress === 100 ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>

            {category.expanded && (
              <CardContent className="space-y-3">
                {category.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={() =>
                          toggleItem(category.id, item.id)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <label
                          htmlFor={item.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {item.label}
                        </label>
                        {item.description && (
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {index < category.items.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* Completion Message */}
      {progress === 100 && (
        <Card className="bg-success/10 border-success">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-success" />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Todos os testes concluídos! 🎉
                </h3>
                <p className="text-muted-foreground">
                  Parabéns! O sistema passou por todos os testes de qualidade.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={exportResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Relatório
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
