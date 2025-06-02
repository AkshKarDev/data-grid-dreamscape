
import React, { useState, useEffect, useRef, useMemo } from 'react';
import VirtualizedRow from './VirtualizedRow';
import { Column } from './DataGrid';

interface VirtualScrollerProps {
  data: any[];
  columns: Column[];
  rowHeight?: number;
  containerHeight?: number;
  selectedRows: Set<number>;
  selectable: boolean;
  editable: boolean;
  editingCell: { rowIndex: number; columnId: string } | null;
  selectionMode: 'single' | 'multiple';
  onSelectRow: (index: number, checked: boolean) => void;
  onStartEditing: (rowIndex: number, columnId: string) => void;
  onStopEditing: () => void;
  onUpdateCell: (rowIndex: number, columnId: string, value: any) => void;
}

const VirtualScroller: React.FC<VirtualScrollerProps> = ({
  data,
  columns,
  rowHeight = 56,
  containerHeight = 400,
  selectedRows,
  selectable,
  editable,
  editingCell,
  selectionMode,
  onSelectRow,
  onStartEditing,
  onStopEditing,
  onUpdateCell
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const { startIndex, endIndex, visibleData } = useMemo(() => {
    const itemCount = data.length;
    const visibleHeight = containerHeight;
    const itemsVisible = Math.ceil(visibleHeight / rowHeight);
    const buffer = 5; // Render a few extra items for smooth scrolling

    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    const end = Math.min(itemCount, start + itemsVisible + buffer * 2);

    return {
      startIndex: start,
      endIndex: end,
      visibleData: data.slice(start, end)
    };
  }, [data, scrollTop, rowHeight, containerHeight]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = data.length * rowHeight;
  const offsetY = startIndex * rowHeight;

  return (
    <div
      ref={scrollElementRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          <table className="w-full">
            <tbody>
              {visibleData.map((row, index) => {
                const actualIndex = startIndex + index;
                return (
                  <VirtualizedRow
                    key={row.id || actualIndex}
                    row={row}
                    index={actualIndex}
                    columns={columns}
                    selected={selectedRows.has(actualIndex)}
                    selectable={selectable}
                    editable={editable}
                    editingCell={editingCell}
                    selectionMode={selectionMode}
                    onSelectRow={onSelectRow}
                    onStartEditing={onStartEditing}
                    onStopEditing={onStopEditing}
                    onUpdateCell={onUpdateCell}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VirtualScroller;
