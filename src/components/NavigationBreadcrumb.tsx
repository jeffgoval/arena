import { ChevronRight, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Breadcrumb {
  label: string;
  onClick?: () => void;
}

interface NavigationBreadcrumbProps {
  items: Breadcrumb[];
}

export function NavigationBreadcrumb({ items }: NavigationBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={items[0]?.onClick}
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {index === items.length - 1 ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:text-primary"
              onClick={item.onClick}
            >
              {item.label}
            </Button>
          )}
        </div>
      ))}
    </nav>
  );
}
