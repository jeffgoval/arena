/**
 * Chart Accessibility Components
 * Provides screen reader support for charts and graphs
 */

import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronDown, Table as TableIcon } from "lucide-react";

interface ChartDataPoint {
  label: string;
  value: number | string;
  [key: string]: any;
}

interface ChartAccessibilityProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  columns?: string[];
  children: ReactNode;
  type?: "line" | "bar" | "pie" | "area" | "donut";
}

/**
 * Accessible Chart Wrapper
 * Wraps visual charts with screen reader alternatives
 */
export function AccessibleChart({
  title,
  description,
  data,
  columns = ["label", "value"],
  children,
  type = "bar"
}: ChartAccessibilityProps) {
  // Generate summary statistics
  const values = data.map(d => typeof d.value === 'number' ? d.value : 0);
  const total = values.reduce((sum, val) => sum + val, 0);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = total / values.length;

  const summary = `
    ${title}. 
    ${description ? description + '. ' : ''}
    Gráfico de ${type === 'bar' ? 'barras' : type === 'line' ? 'linhas' : type === 'pie' ? 'pizza' : 'área'}.
    Total de ${data.length} ${data.length === 1 ? 'item' : 'itens'}.
    Valor máximo: ${max.toFixed(2)}.
    Valor mínimo: ${min.toFixed(2)}.
    Média: ${avg.toFixed(2)}.
  `.trim();

  return (
    <div role="group" aria-label={title}>
      {/* Visual chart */}
      <div aria-hidden="true">
        {children}
      </div>

      {/* Screen reader summary */}
      <div className="sr-only">
        <p>{summary}</p>
      </div>

      {/* Data table alternative (collapsible) */}
      <Collapsible className="mt-4">
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Ver dados em tabela
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <ChartDataTable 
            data={data} 
            columns={columns}
            caption={`Dados do gráfico: ${title}`}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

/**
 * Chart Data Table
 * Accessible table representation of chart data
 */
function ChartDataTable({ 
  data, 
  columns,
  caption 
}: { 
  data: ChartDataPoint[];
  columns: string[];
  caption: string;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <caption className="sr-only">{caption}</caption>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col} className="capitalize">
                {col === 'label' ? 'Item' : col === 'value' ? 'Valor' : col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col}>
                  {formatValue(row[col])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function formatValue(value: any): string {
  if (typeof value === 'number') {
    return value.toLocaleString('pt-BR');
  }
  return String(value);
}

/**
 * Simple Chart Description
 * For charts that don't need full data tables
 */
export function ChartDescription({ 
  title, 
  summary 
}: { 
  title: string; 
  summary: string;
}) {
  return (
    <div className="sr-only">
      <h3>{title}</h3>
      <p>{summary}</p>
    </div>
  );
}

/**
 * Chart Legend with proper ARIA
 */
export function AccessibleChartLegend({ 
  items 
}: { 
  items: Array<{ label: string; color: string; value?: string | number }>;
}) {
  return (
    <div role="list" aria-label="Legenda do gráfico">
      {items.map((item, index) => (
        <div 
          key={index}
          role="listitem"
          className="flex items-center gap-2 py-1"
        >
          <div
            aria-hidden="true"
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span>
            {item.label}
            {item.value && `: ${item.value}`}
          </span>
        </div>
      ))}
    </div>
  );
}
