
import React from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Column } from '@/types/DataGridTypes';

interface ColumnChooserProps {
  allColumns: Column[];
  visibleColumns: string[];
  onToggleColumn: (columnId: string) => void;
  onResetColumns: () => void;
}

const ColumnChooser: React.FC<ColumnChooserProps> = ({
  allColumns,
  visibleColumns,
  onToggleColumn,
  onResetColumns
}) => {
  const visibleCount = visibleColumns.length;
  const totalCount = allColumns.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Columns ({visibleCount}/{totalCount})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Column Visibility</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetColumns}
              className="text-xs"
            >
              Reset All
            </Button>
          </div>
          
          <div className="space-y-2">
            {allColumns.map((column) => {
              const isVisible = visibleColumns.includes(column.id);
              return (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={isVisible}
                    onCheckedChange={() => onToggleColumn(column.id)}
                  />
                  <label
                    htmlFor={column.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    {isVisible ? (
                      <Eye className="w-3 h-3 text-green-600" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-gray-400" />
                    )}
                    {column.header}
                  </label>
                </div>
              );
            })}
          </div>
          
          <div className="text-xs text-gray-500 border-t pt-2">
            {visibleCount} of {totalCount} columns visible
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnChooser;
