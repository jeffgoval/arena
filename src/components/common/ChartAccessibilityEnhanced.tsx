/**
 * Chart Accessibility Enhancements
 * Patterns, keyboard navigation, ARIA labels, and screen reader support
 */

import { ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Pattern definitions for colorblind-friendly charts
 */
export const chartPatterns = {
  dots: "url(#pattern-dots)",
  stripes: "url(#pattern-stripes)",
  diagonalLeft: "url(#pattern-diagonal-left)",
  diagonalRight: "url(#pattern-diagonal-right)",
  grid: "url(#pattern-grid)",
  circles: "url(#pattern-circles)",
};

/**
 * SVG Pattern Definitions Component
 */
export function ChartPatternDefs() {
  return (
    <defs>
      {/* Dots Pattern */}
      <pattern
        id="pattern-dots"
        x="0"
        y="0"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="4" cy="4" r="1.5" fill="currentColor" />
      </pattern>

      {/* Stripes Pattern */}
      <pattern
        id="pattern-stripes"
        x="0"
        y="0"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <rect x="0" y="0" width="4" height="8" fill="currentColor" />
      </pattern>

      {/* Diagonal Left Pattern */}
      <pattern
        id="pattern-diagonal-left"
        x="0"
        y="0"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4"
          stroke="currentColor"
          strokeWidth="2"
        />
      </pattern>

      {/* Diagonal Right Pattern */}
      <pattern
        id="pattern-diagonal-right"
        x="0"
        y="0"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M-2,6 l4,4 M0,0 l8,8 M6,-2 l4,4"
          stroke="currentColor"
          strokeWidth="2"
        />
      </pattern>

      {/* Grid Pattern */}
      <pattern
        id="pattern-grid"
        x="0"
        y="0"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 8 0 L 0 0 0 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </pattern>

      {/* Circles Pattern */}
      <pattern
        id="pattern-circles"
        x="0"
        y="0"
        width="10"
        height="10"
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx="5"
          cy="5"
          r="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </pattern>
    </defs>
  );
}

/**
 * Accessible Chart Container
 */
interface AccessibleChartProps {
  title: string;
  description?: string;
  children: ReactNode;
  summaryText?: string;
  className?: string;
}

export function AccessibleChart({
  title,
  description,
  children,
  summaryText,
  className,
}: AccessibleChartProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <figure
      className={className}
      role="img"
      aria-label={title}
    >
      {/* Visual Title */}
      <figcaption className="sr-only">{title}</figcaption>
      
      {/* Description for screen readers */}
      {description && (
        <div className="sr-only">{description}</div>
      )}

      {/* Chart */}
      <div
        aria-hidden="true"
        style={{
          ...(prefersReducedMotion && {
            animation: "none",
            transition: "none",
          }),
        }}
      >
        {children}
      </div>

      {/* Text summary for screen readers */}
      {summaryText && (
        <div className="sr-only">
          Resumo dos dados: {summaryText}
        </div>
      )}
    </figure>
  );
}

/**
 * Data table alternative for charts (screen reader accessible)
 */
interface ChartDataTableProps {
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    format?: (value: any) => string;
  }>;
  caption: string;
}

export function ChartDataTable({
  data,
  columns,
  caption,
}: ChartDataTableProps) {
  return (
    <details className="mt-4">
      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
        Ver dados em formato de tabela
      </summary>
      <div className="mt-2 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-2 text-left font-medium"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-2">
                    {column.format
                      ? column.format(row[column.key])
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/**
 * Chart Legend with patterns for colorblind users
 */
interface LegendItem {
  name: string;
  color: string;
  pattern?: string;
  value?: string | number;
}

interface AccessibleLegendProps {
  items: LegendItem[];
  className?: string;
}

export function AccessibleLegend({ items, className }: AccessibleLegendProps) {
  return (
    <div
      className={className}
      role="list"
      aria-label="Legenda do gráfico"
    >
      {items.map((item, index) => (
        <div
          key={index}
          role="listitem"
          className="flex items-center gap-2"
        >
          {/* Color + Pattern indicator */}
          <svg width="16" height="16" aria-hidden="true">
            <rect
              width="16"
              height="16"
              fill={item.color}
              style={{
                ...(item.pattern && {
                  fill: item.pattern,
                  color: item.color,
                }),
              }}
            />
          </svg>
          
          {/* Label */}
          <span className="text-sm">
            {item.name}
            {item.value !== undefined && (
              <span className="font-medium ml-1">({item.value})</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Generate summary text from chart data
 */
export function generateChartSummary(
  data: Array<Record<string, any>>,
  config: {
    title: string;
    xKey: string;
    yKey: string;
    formatValue?: (value: any) => string;
  }
): string {
  if (data.length === 0) return "Sem dados disponíveis";

  const values = data.map((d) => d[config.yKey]);
  const total = values.reduce((a, b) => a + b, 0);
  const avg = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  
  const maxItem = data.find((d) => d[config.yKey] === max);
  const minItem = data.find((d) => d[config.yKey] === min);

  const format = config.formatValue || ((v) => v.toString());

  return `${config.title}. Total: ${format(total)}. Média: ${format(avg.toFixed(2))}. Maior valor: ${format(max)} em ${maxItem?.[config.xKey]}. Menor valor: ${format(min)} em ${minItem?.[config.xKey]}. Total de ${data.length} pontos de dados.`;
}

/**
 * Keyboard navigation helper for interactive charts
 */
export function useChartKeyboardNavigation(
  dataLength: number,
  onSelect: (index: number) => void
) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const currentIndex = parseInt(
      (event.currentTarget as HTMLElement).getAttribute("data-index") || "0"
    );

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        onSelect(Math.min(currentIndex + 1, dataLength - 1));
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        onSelect(Math.max(currentIndex - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        onSelect(0);
        break;
      case "End":
        event.preventDefault();
        onSelect(dataLength - 1);
        break;
    }
  };

  return { handleKeyDown };
}

/**
 * Example: Accessible Bar Chart
 */
interface AccessibleBarChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  color?: string;
  pattern?: string;
}

export function AccessibleBarChart({
  data,
  title,
  color = "var(--primary)",
  pattern,
}: AccessibleBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const summary = generateChartSummary(data, {
    title,
    xKey: "name",
    yKey: "value",
  });

  return (
    <AccessibleChart
      title={title}
      description={`Gráfico de barras mostrando ${data.length} categorias`}
      summaryText={summary}
      className="space-y-4"
    >
      {/* Include pattern definitions */}
      <svg width="0" height="0">
        <ChartPatternDefs />
      </svg>

      {/* Bars */}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-24 text-sm truncate">{item.name}</div>
            <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color,
                  ...(pattern && {
                    backgroundImage: pattern,
                  }),
                }}
                role="img"
                aria-label={`${item.name}: ${item.value}`}
              />
            </div>
            <div className="w-16 text-sm text-right font-medium">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Data table */}
      <ChartDataTable
        data={data}
        columns={[
          { key: "name", label: "Categoria" },
          { key: "value", label: "Valor" },
        ]}
        caption={title}
      />
    </AccessibleChart>
  );
}
