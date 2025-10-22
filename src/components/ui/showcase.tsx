/**
 * Design System Showcase
 * Demonstra os novos componentes e tokens do design system
 */

import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";

export function DesignSystemShowcase() {
  return (
    <div className="container-custom section-padding space-y-12">
      {/* Typography */}
      <section className="space-y-6">
        <h1 className="heading-1 gradient-text">Design System Atualizado</h1>
        <p className="body-large text-muted-foreground max-w-3xl">
          Sistema de design moderno com tokens padronizados, suporte a dark mode e componentes acessíveis.
        </p>
      </section>

      {/* Colors & Tokens */}
      <section className="space-y-6">
        <h2 className="heading-3">Paleta de Cores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-16 bg-primary rounded-lg shadow-soft"></div>
            <p className="text-sm font-medium">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-secondary rounded-lg shadow-soft"></div>
            <p className="text-sm font-medium">Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-accent rounded-lg shadow-soft"></div>
            <p className="text-sm font-medium">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-muted rounded-lg shadow-soft"></div>
            <p className="text-sm font-medium">Muted</p>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="space-y-6">
        <h2 className="heading-3">Componentes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Botões
                <Badge variant="secondary">Novo</Badge>
              </CardTitle>
              <CardDescription>
                Variações de botões com estados consistentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Primary Button</Button>
              <Button variant="secondary" className="w-full">Secondary</Button>
              <Button variant="outline" className="w-full">Outline</Button>
              <Button variant="ghost" className="w-full">Ghost</Button>
            </CardContent>
          </Card>

          <Card className="card-interactive card-glass">
            <CardHeader>
              <CardTitle>Cards Interativos</CardTitle>
              <CardDescription>
                Cards com hover effects e glass morphism
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Este card tem efeito glass e animações suaves ao passar o mouse.
              </p>
            </CardContent>
          </Card>

          <Card className="card-interactive bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="gradient-text">Gradientes</CardTitle>
              <CardDescription>
                Suporte nativo a gradientes e efeitos visuais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="btn-gradient w-full">
                Gradient Button
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Typography Scale */}
      <section className="space-y-6">
        <h2 className="heading-3">Escala Tipográfica</h2>
        <div className="space-y-4">
          <h1 className="heading-1">Heading 1 - Display</h1>
          <h2 className="heading-2">Heading 2 - Title</h2>
          <h3 className="heading-3">Heading 3 - Subtitle</h3>
          <h4 className="heading-4">Heading 4 - Section</h4>
          <p className="body-large">Body Large - Para introduções e destaques</p>
          <p className="body-medium">Body Medium - Texto padrão para conteúdo</p>
          <p className="body-small">Body Small - Para legendas e informações secundárias</p>
        </div>
      </section>

      {/* Shadows & Elevation */}
      <section className="space-y-6">
        <h2 className="heading-3">Elevação e Sombras</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg shadow-soft">
            <h4 className="font-semibold mb-2">Soft Shadow</h4>
            <p className="text-sm text-muted-foreground">Sombra suave para elementos sutis</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-medium">
            <h4 className="font-semibold mb-2">Medium Shadow</h4>
            <p className="text-sm text-muted-foreground">Sombra média para cards e modais</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-strong">
            <h4 className="font-semibold mb-2">Strong Shadow</h4>
            <p className="text-sm text-muted-foreground">Sombra forte para elementos flutuantes</p>
          </div>
        </div>
      </section>
    </div>
  );
}