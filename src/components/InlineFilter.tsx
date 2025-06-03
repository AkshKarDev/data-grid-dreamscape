
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface InlineFilterProps {
  value: string;
  onFilterChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  column?: {
    id: string;
    header: string;
    type?: 'text' | 'number' | 'date' | 'boolean';
  };
}

const InlineFilter: React.FC<InlineFilterProps> = ({
  value,
  onFilterChange,
  placeholder = "Filter...",
  debounceMs = 300,
  column
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isVisible, setIsVisible] = useState(false);
  const [filterType, setFilterType] = useState<'contains' | 'equals' | 'greater' | 'less'>('contains');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      let filterValue = localValue;
      
      // Add filter type prefix for advanced filtering
      if (localValue && filterType !== 'contains') {
        filterValue = `${filterType}:${localValue}`;
      }
      
      onFilterChange(filterValue);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localValue, filterType, onFilterChange, debounceMs]);

  const handleClear = () => {
    setLocalValue('');
    onFilterChange('');
    setIsVisible(false);
  };

  const handleToggle = () => {
    setIsVisible(!isVisible);
    if (!isVisible) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const getFilterOptions = () => {
    if (column?.type === 'number') {
      return [
        { value: 'contains', label: 'Contains' },
        { value: 'equals', label: 'Equals' },
        { value: 'greater', label: 'Greater than' },
        { value: 'less', label: 'Less than' }
      ];
    }
    return [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' }
    ];
  };

  return (
    <div className="relative inline-flex items-center">
      {!isVisible && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Add filter"
            >
              <Search className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Filter Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {getFilterOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Filter Value
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    type={column?.type === 'number' ? 'number' : 'text'}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1"
                  />
                  {localValue && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClear}
                      className="px-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Current filter: {filterType} "{localValue}"
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default InlineFilter;
