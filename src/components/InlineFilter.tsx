
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface InlineFilterProps {
  value: string;
  onFilterChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const InlineFilter: React.FC<InlineFilterProps> = ({
  value,
  onFilterChange,
  placeholder = "Filter...",
  debounceMs = 300
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isVisible, setIsVisible] = useState(false);
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
      onFilterChange(localValue);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localValue, onFilterChange, debounceMs]);

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

  return (
    <div className="relative inline-flex items-center">
      {!isVisible && (
        <button
          onClick={handleToggle}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Add filter"
        >
          <Search className="w-4 h-4" />
        </button>
      )}
      
      {isVisible && (
        <div className="flex items-center gap-1 bg-white border rounded px-2 py-1 shadow-sm min-w-[120px]">
          <Search className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder}
            className="border-0 p-0 h-auto text-xs focus:ring-0 focus:border-0 bg-transparent"
          />
          <button
            onClick={handleClear}
            className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default InlineFilter;
