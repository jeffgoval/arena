/**
 * GlobalSearchBar Component
 * Barra de busca global com sugestões e histórico
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Clock, TrendingUp, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../ui/utils';
import { useGlobalSearch, type SearchResult } from '../../hooks/useGlobalSearch';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Kbd } from './Kbd';

interface GlobalSearchBarProps {
  placeholder?: string;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
  autoFocus?: boolean;
  showShortcut?: boolean;
}

export function GlobalSearchBar({
  placeholder = 'Buscar em tudo...',
  onResultClick,
  className,
  autoFocus = false,
  showShortcut = true,
}: GlobalSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    results,
    isSearching,
    suggestions,
    searchHistory,
    removeFromHistory,
    clearHistory,
    isEmpty,
    hasResults,
  } = useGlobalSearch();

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // ESC to close
      if (e.key === 'Escape') {
        setShowResults(false);
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setShowResults(true);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    setShowResults(false);
    setQuery('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  const showSuggestions = isFocused && isEmpty && suggestions.length > 0;
  const showSearchResults = isFocused && !isEmpty && (hasResults || isSearching);

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-2xl', className)}>
      {/* Search Input */}
      <div
        className={cn(
          'relative flex items-center',
          'bg-input-background border rounded-lg',
          'transition-all duration-200',
          isFocused && 'ring-2 ring-ring border-transparent'
        )}
      >
        <Search className="absolute left-3 w-5 h-5 text-muted-foreground pointer-events-none" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'w-full h-12 pl-11 pr-20',
            'bg-transparent border-none outline-none',
            'text-foreground placeholder:text-muted-foreground'
          )}
        />

        <div className="absolute right-2 flex items-center gap-2">
          {isSearching && (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          )}
          
          {query && !isSearching && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          
          {showShortcut && !isFocused && (
            <Kbd keys={['⌘', 'K']} />
          )}
        </div>
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {showResults && (showSuggestions || showSearchResults) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full left-0 right-0 mt-2 z-50',
              'bg-popover border rounded-lg shadow-lg',
              'max-h-[500px] overflow-y-auto'
            )}
          >
            {/* Suggestions / History */}
            {showSuggestions && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Buscas recentes</span>
                  </div>
                  {suggestions.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2',
                        'rounded-md hover:bg-muted transition-colors',
                        'text-left'
                      )}
                    >
                      <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 truncate">{suggestion}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(suggestion);
                        }}
                        className="p-1 rounded hover:bg-muted-foreground/20"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {showSearchResults && (
              <div className="p-2">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : hasResults ? (
                  <>
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                    </div>
                    
                    <div className="space-y-1">
                      {results.map((result) => (
                        <SearchResultItem
                          key={result.id}
                          result={result}
                          onClick={() => handleResultClick(result)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>Nenhum resultado encontrado</p>
                    <p className="text-sm mt-1">Tente buscar por outro termo</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Search Result Item
 */
interface SearchResultItemProps {
  result: SearchResult;
  onClick: () => void;
}

function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  const typeLabels = {
    booking: 'Reserva',
    court: 'Quadra',
    user: 'Usuário',
    team: 'Turma',
    transaction: 'Transação',
    page: 'Página',
  };

  const typeColors = {
    booking: 'bg-primary/10 text-primary',
    court: 'bg-accent/10 text-accent',
    user: 'bg-info/10 text-info',
    team: 'bg-warning/10 text-warning',
    transaction: 'bg-success/10 text-success',
    page: 'bg-muted text-muted-foreground',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-3',
        'rounded-md hover:bg-muted transition-colors',
        'text-left group'
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium truncate">{result.title}</span>
          <Badge
            variant="secondary"
            className={cn('text-xs', typeColors[result.type])}
          >
            {typeLabels[result.type]}
          </Badge>
        </div>
        
        {result.description && (
          <p className="text-sm text-muted-foreground truncate">
            {result.description}
          </p>
        )}
        
        {result.subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {result.subtitle}
          </p>
        )}
      </div>

      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </button>
  );
}

/**
 * Keyboard Shortcut Display
 */
interface KbdProps {
  keys: string[];
}

function Kbd({ keys }: KbdProps) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <kbd
          key={index}
          className={cn(
            'px-1.5 py-0.5 text-xs',
            'bg-muted border rounded',
            'text-muted-foreground font-mono'
          )}
        >
          {key}
        </kbd>
      ))}
    </div>
  );
}
