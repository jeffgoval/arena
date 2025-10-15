import { Button } from "./ui/button";

interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
}

export function SkipLink({ targetId, children }: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Button
      asChild
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2"
    >
      <a href={`#${targetId}`} onClick={handleClick}>
        {children}
      </a>
    </Button>
  );
}

export function SkipLinks() {
  return (
    <div className="skip-links" role="navigation" aria-label="Atalhos de navegação">
      <SkipLink targetId="main-content">Pular para conteúdo principal</SkipLink>
      <SkipLink targetId="main-navigation">Pular para navegação</SkipLink>
      <SkipLink targetId="footer">Pular para rodapé</SkipLink>
    </div>
  );
}
