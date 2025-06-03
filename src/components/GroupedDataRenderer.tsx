
import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Column } from '@/types/DataGridTypes';
import { GroupedData } from '@/hooks/useGrouping';

interface GroupedDataRendererProps {
  groupedData: GroupedData;
  columns: Column[];
  groupedColumns: string[];
  level?: number;
}

const GroupedDataRenderer: React.FC<GroupedDataRendererProps> = ({
  groupedData,
  columns,
  groupedColumns,
  level = 0
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  const isLastLevel = level === groupedColumns.length - 1;
  const currentColumn = groupedColumns[level];
  const indent = level * 20;

  return (
    <>
      {Object.entries(groupedData).map(([groupKey, group]) => {
        const isExpanded = expandedGroups.has(groupKey);
        
        return (
          <React.Fragment key={groupKey}>
            {/* Group Header Row */}
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
              <td 
                colSpan={columns.length}
                className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300"
                style={{ paddingLeft: 16 + indent }}
              >
                <button
                  onClick={() => toggleGroup(groupKey)}
                  className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {currentColumn}:
                  </span>
                  <span>{groupKey}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({group.items.length} {group.items.length === 1 ? 'item' : 'items'})
                  </span>
                </button>
              </td>
            </tr>
            
            {/* Group Content */}
            {isExpanded && (
              <>
                {group.subGroups ? (
                  <GroupedDataRenderer
                    groupedData={group.subGroups}
                    columns={columns}
                    groupedColumns={groupedColumns}
                    level={level + 1}
                  />
                ) : (
                  // Render actual data rows
                  group.items.map((row, index) => (
                    <tr
                      key={row.id || index}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {columns.map(column => (
                        <td
                          key={column.id}
                          className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                          style={{ paddingLeft: column.id === columns[0].id ? 40 + indent : 16 }}
                        >
                          {column.formatter ? column.formatter(row[column.accessor]) : row[column.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default GroupedDataRenderer;
