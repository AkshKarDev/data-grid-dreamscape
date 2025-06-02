
import React from 'react';
import { X, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GroupingAreaProps {
  groupedColumns: string[];
  columnHeaders: Record<string, string>;
  onRemoveGroup: (columnId: string) => void;
  onClearAll: () => void;
}

const GroupingArea: React.FC<GroupingAreaProps> = ({
  groupedColumns,
  columnHeaders,
  onRemoveGroup,
  onClearAll
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // The drop handling is managed by the parent component
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Layers className="w-4 h-4" />
          Group by:
        </div>
        
        <div
          className="flex-1 min-h-[40px] border-2 border-dashed border-gray-300 rounded-lg p-2 flex items-center gap-2 transition-colors hover:border-gray-400"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {groupedColumns.length === 0 ? (
            <span className="text-gray-400 text-sm">Drag column headers here to group data</span>
          ) : (
            groupedColumns.map(columnId => (
              <div
                key={columnId}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-blue-200"
              >
                <span>{columnHeaders[columnId]}</span>
                <button
                  onClick={() => onRemoveGroup(columnId)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
        
        {groupedColumns.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default GroupingArea;
