
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import EditableCell from './EditableCell';
import { Column } from '@/types/DataGridTypes';

interface VirtualizedRowProps {
  row: any;
  index: number;
  columns: Column[];
  selected: boolean;
  selectable: boolean;
  editable: boolean;
  editingCell: { rowIndex: number; columnId: string } | null;
  selectionMode: 'single' | 'multiple';
  onSelectRow: (index: number, checked: boolean) => void;
  onStartEditing: (rowIndex: number, columnId: string) => void;
  onStopEditing: () => void;
  onUpdateCell: (rowIndex: number, columnId: string, value: any) => void;
}

const VirtualizedRow: React.FC<VirtualizedRowProps> = ({
  row,
  index,
  columns,
  selected,
  selectable,
  editable,
  editingCell,
  selectionMode,
  onSelectRow,
  onStartEditing,
  onStopEditing,
  onUpdateCell
}) => {
  const isEvenRow = index % 2 === 0;

  return (
    <tr 
      className={`
        ${isEvenRow ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} 
        ${selected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''}
        hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700
      `}
    >
      {selectable && (
        <td className="px-4 py-3 w-12">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectRow(index, checked as boolean)}
          />
        </td>
      )}
      {columns.map(column => {
        const isEditing = editingCell?.rowIndex === index && editingCell?.columnId === column.id;
        const cellValue = row[column.accessor];
        const formattedValue = column.formatter ? column.formatter(cellValue) : cellValue;
        
        // Apply custom cell styles if they exist
        const customStyles = row._cellStyles?.[column.id] || {};

        return (
          <td 
            key={column.id}
            className="px-4 py-3 border-r border-gray-200 dark:border-gray-600 last:border-r-0"
            style={{
              width: column.width,
              minWidth: column.minWidth || 100,
              ...customStyles
            }}
          >
            {isEditing ? (
              <EditableCell
                value={cellValue}
                type={column.type || 'text'}
                onSave={(value) => {
                  onUpdateCell(index, column.id, value);
                  onStopEditing();
                }}
                onCancel={onStopEditing}
                validator={column.validator}
              />
            ) : (
              <div
                className={`text-sm text-gray-900 dark:text-gray-100 ${editable && column.editable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded px-1 py-1 -mx-1 -my-1' : ''}`}
                onClick={() => {
                  if (editable && column.editable) {
                    onStartEditing(index, column.id);
                  }
                }}
              >
                {formattedValue}
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
};

export default VirtualizedRow;
