
import { useState, useMemo } from 'react';

export interface GroupedData {
  [key: string]: {
    items: any[];
    subGroups?: GroupedData;
  };
}

export const useGrouping = (data: any[]) => {
  const [groupedColumns, setGroupedColumns] = useState<string[]>([]);

  const groupedData = useMemo(() => {
    if (groupedColumns.length === 0) {
      return null;
    }

    const groupData = (items: any[], columns: string[], level = 0): GroupedData => {
      if (level >= columns.length) {
        return {};
      }

      const currentColumn = columns[level];
      const groups: GroupedData = {};

      items.forEach(item => {
        const groupKey = String(item[currentColumn] || 'Unknown');
        
        if (!groups[groupKey]) {
          groups[groupKey] = { items: [] };
        }
        
        groups[groupKey].items.push(item);
      });

      // If there are more columns to group by, create sub-groups
      if (level + 1 < columns.length) {
        Object.keys(groups).forEach(groupKey => {
          groups[groupKey].subGroups = groupData(
            groups[groupKey].items,
            columns,
            level + 1
          );
        });
      }

      return groups;
    };

    return groupData(data, groupedColumns);
  }, [data, groupedColumns]);

  const addGroupColumn = (columnId: string) => {
    if (!groupedColumns.includes(columnId)) {
      setGroupedColumns(prev => [...prev, columnId]);
    }
  };

  const removeGroupColumn = (columnId: string) => {
    setGroupedColumns(prev => prev.filter(id => id !== columnId));
  };

  const clearAllGroups = () => {
    setGroupedColumns([]);
  };

  const reorderGroupColumns = (startIndex: number, endIndex: number) => {
    setGroupedColumns(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  return {
    groupedColumns,
    groupedData,
    addGroupColumn,
    removeGroupColumn,
    clearAllGroups,
    reorderGroupColumns
  };
};
