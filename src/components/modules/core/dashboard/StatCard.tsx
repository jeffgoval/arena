import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  isPositive,
  icon: Icon,
  color,
  bgColor,
}: StatCardProps) {
  return (
    <Card className="card-interactive border-0 shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {change}
            </div>
          )}
        </div>
        <p className="text-3xl font-bold text-foreground mb-1">
          {value}
        </p>
        <p className="text-sm text-muted-foreground">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
