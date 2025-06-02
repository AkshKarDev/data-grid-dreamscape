
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import EditableCell from './EditableCell';
import { Column } from './DataGrid';

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
  style?: React.CSSProperties;
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
  onUpdateCell,
  style
}) => {
  return (
    <tr
      style={style}
      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
    >
      {selectable && (
        <td className="px-4 py-3">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectRow(index, checked as boolean)}
          />
        </td>
      )}
      {columns.map(column => (
        <td
          key={column.id}
          className="px-4 py-3 text-sm text-gray-900 border-r border-gray-100 last:border-r-0"
        >
          {editable && column.id !== 'id' ? (
            <EditableCell
              value={row[column.accessor]}
              isEditing={editingCell?.rowIndex === index && editingCell?.columnId === column.accessor}
              onStartEditing={() => onStartEditing(index, column.accessor)}
              onStopEditing={onStopEditing}
              onUpdateValue={(value) => onUpdateCell(index, column.accessor, value)}
            />
          ) : (
            row[column.accessor]
          )}
        </td>
      ))}
    </tr>
  );
};

export default VirtualizedRow;
