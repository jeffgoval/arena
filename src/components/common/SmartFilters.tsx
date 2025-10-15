/**
 * SmartFilters Component
 * Sistema de filtros inteligentes com múltiplos tipos
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Filter,
  X,
  ChevronDown,
  Check,
  Calendar,
  DollarSign,
  Save,
  Star,
} from 'lucide-react';
import { cn } from '../ui/utils';
import {
  useSmartFilters,
  useCommonFilters,
  useSavedFilters,
  type FilterConfig,
  type ActiveFilter,
} from '../../hooks/useSmartFilters';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';

interface SmartFiltersProps {
  configs: FilterConfig[];
  persistKey?: string;
  onFilterChange?: (filters: ActiveFilter[]) => void;
  showSavedFilters?: boolean;
  className?: string;
}

export function SmartFilters({
  configs,
  persistKey,
  onFilterChange,
  showSavedFilters = true,
  className,
}: SmartFiltersProps) {
  const {
    activeFilters,
    activeCount,
    hasActiveFilters,
    activeFilterLabels,
    setFilter,
    removeFilter,
    clearFilters,
    getFilterValue,
    isFilterActive,
  } = useSmartFilters(configs, { persistKey, onFilterChange });

  const { savedFilters, saveFilters, deleteSavedFilter, loadSavedFilter } =
    useSavedFilters();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  const handleSaveFilters = () => {
    if (filterName.trim() && hasActiveFilters) {
      saveFilters(filterName.trim(), activeFilters);
      setFilterName('');
      setShowSaveDialog(false);
    }
  };

  const handleLoadFilter = (id: string) => {
    const filters = loadSavedFilter(id);
    clearFilters();
    filters.forEach((filter) => {
      setFilter(filter.filterId, filter.value, filter.label);
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </div>

        {/* Filter Dropdowns */}
        {configs.map((config) => (
          <FilterDropdown
            key={config.id}
            config={config}
            value={getFilterValue(config.id)}
            isActive={isFilterActive(config.id)}
            onChange={(value, label) => setFilter(config.id, value, label)}
            onRemove={() => removeFilter(config.id)}
          />
        ))}

        {/* Clear All */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar tudo
          </Button>
        )}

        {/* Save Filters */}
        {showSavedFilters && hasActiveFilters && (
          <Popover open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Save className="w-4 h-4 mr-1" />
                Salvar filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Salvar filtros atuais</h4>
                  <Input
                    placeholder="Nome do filtro..."
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveFilters();
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleSaveFilters}
                  disabled={!filterName.trim()}
                  className="w-full"
                >
                  Salvar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Saved Filters */}
        {showSavedFilters && savedFilters.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Star className="w-4 h-4 mr-1" />
                Filtros salvos
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium mb-2">Filtros salvos</h4>
                {savedFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                  >
                    <button
                      onClick={() => handleLoadFilter(filter.id)}
                      className="flex-1 text-left"
                    >
                      <p className="font-medium">{filter.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {filter.filters.length} filtro
                        {filter.filters.length !== 1 ? 's' : ''}
                      </p>
                    </button>
                    <button
                      onClick={() => deleteSavedFilter(filter.id)}
                      className="p-1 rounded hover:bg-muted-foreground/20"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 flex-wrap"
        >
          {activeFilters.map((filter, index) => {
            const config = configs.find((c) => c.id === filter.filterId);
            return (
              <Badge
                key={`${filter.filterId}-${index}`}
                variant="secondary"
                className="gap-2"
              >
                <span className="text-xs text-muted-foreground">
                  {config?.label}:
                </span>
                <span>{filter.label || String(filter.value)}</span>
                <button
                  onClick={() => removeFilter(filter.filterId)}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

/**
 * Filter Dropdown Component
 */
interface FilterDropdownProps {
  config: FilterConfig;
  value: any;
  isActive: boolean;
  onChange: (value: any, label?: string) => void;
  onRemove: () => void;
}

function FilterDropdown({
  config,
  value,
  isActive,
  onChange,
  onRemove,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (optionValue: any, optionLabel?: string) => {
    if (config.type === 'select') {
      onChange(optionValue, optionLabel);
      setOpen(false);
    } else if (config.type === 'multiselect') {
      // Toggle selection
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      
      onChange(newValues.length > 0 ? newValues : null, optionLabel);
    }
  };

  const isSelected = (optionValue: any) => {
    if (config.type === 'multiselect') {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? 'default' : 'outline'}
          size="sm"
          className="gap-2"
        >
          {config.label}
          {isActive && (
            <Badge variant="secondary" className="ml-1">
              {Array.isArray(value) ? value.length : 1}
            </Badge>
          )}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-sm font-medium">{config.label}</span>
            {isActive && (
              <button
                onClick={() => {
                  onRemove();
                  setOpen(false);
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Select / Multiselect */}
          {(config.type === 'select' || config.type === 'multiselect') && (
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {config.options?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.value, option.label)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-2',
                    'rounded-md hover:bg-muted transition-colors',
                    'text-left'
                  )}
                >
                  {config.type === 'multiselect' && (
                    <Checkbox checked={isSelected(option.value)} />
                  )}
                  <span className="flex-1">{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      ({option.count})
                    </span>
                  )}
                  {config.type === 'select' && isSelected(option.value) && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Range */}
          {config.type === 'range' && (
            <div className="space-y-4 px-2 py-3">
              <div className="flex items-center justify-between text-sm">
                <span>R$ {value?.[0] || config.min || 0}</span>
                <span>R$ {value?.[1] || config.max || 100}</span>
              </div>
              <Slider
                min={config.min || 0}
                max={config.max || 100}
                step={10}
                value={value || [config.min || 0, config.max || 100]}
                onValueChange={(newValue) => onChange(newValue)}
              />
            </div>
          )}

          {/* Toggle / Checkbox */}
          {(config.type === 'toggle' || config.type === 'checkbox') && (
            <div className="space-y-2 px-2 py-2">
              {config.options?.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={option.id}
                    checked={isSelected(option.value)}
                    onCheckedChange={() =>
                      handleSelect(option.value, option.label)
                    }
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Pre-built filters for common use cases
 */
export function BookingFilters({ onFilterChange }: { onFilterChange?: (filters: ActiveFilter[]) => void }) {
  const { statusFilter, dateRangeFilter, courtFilter, timeOfDayFilter } = useCommonFilters();

  return (
    <SmartFilters
      configs={[statusFilter, courtFilter, timeOfDayFilter, dateRangeFilter]}
      persistKey="booking-filters"
      onFilterChange={onFilterChange}
    />
  );
}

export function TransactionFilters({ onFilterChange }: { onFilterChange?: (filters: ActiveFilter[]) => void }) {
  const { paymentStatusFilter, priceRangeFilter, dateRangeFilter } = useCommonFilters();

  return (
    <SmartFilters
      configs={[paymentStatusFilter, priceRangeFilter, dateRangeFilter]}
      persistKey="transaction-filters"
      onFilterChange={onFilterChange}
    />
  );
}
