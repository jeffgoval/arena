/**
 * Breadcrumbs Component
 * Enhanced breadcrumb navigation with proper ARIA and mobile support
 */

import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { PAGE_TITLES } from "../../config/routes";

interface BreadcrumbsProps {
  currentPage: string;
  onNavigate?: (page: string) => void;
  customPath?: Array<{ label: string; page: string }>;
}

/**
 * Maps pages to their parent hierarchy
 */
const PAGE_HIERARCHY: Record<string, string[]> = {
  // Client paths
  "client-dashboard": ["landing"],
  "booking": ["landing", "client-dashboard"],
  "teams": ["landing", "client-dashboard"],
  "transactions": ["landing", "client-dashboard"],
  "user-profile": ["landing", "client-dashboard"],
  "settings": ["landing", "client-dashboard"],
  "subscription-plans": ["landing", "client-dashboard"],
  "subscription-management": ["landing", "client-dashboard"],
  
  // Manager paths
  "manager-dashboard": ["landing"],
  
  // Institutional
  "faq": ["landing"],
  "terms": ["landing"],
};

export function Breadcrumbs({ currentPage, onNavigate, customPath }: BreadcrumbsProps) {
  // Don't show breadcrumbs on landing, login, or cadastro
  if (["landing", "login", "cadastro", "invite-view"].includes(currentPage)) {
    return null;
  }

  // Build path from hierarchy or use custom path
  const path = customPath || PAGE_HIERARCHY[currentPage] || ["landing"];
  const fullPath = [...path, currentPage];

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Home icon for first item */}
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => onNavigate?.(fullPath[0])}
              className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only md:not-sr-only">Início</span>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Intermediate items */}
          {fullPath.slice(1, -1).map((page, index) => (
            <div key={page} className="flex items-center gap-2">
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => onNavigate?.(page)}
                  className="cursor-pointer hover:text-primary transition-colors max-w-[150px] truncate"
                >
                  {PAGE_TITLES[page] || page}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ))}

          {/* Current page */}
          <div className="flex items-center gap-2">
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate">
                {PAGE_TITLES[currentPage] || currentPage}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </div>
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}
