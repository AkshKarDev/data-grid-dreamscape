
import React from 'react';
import { ChevronUp, ChevronDown, Loader2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useGridEngine } from '@/hooks/useGridEngine';
import { useDataStreaming } from '@/hooks/useDataStreaming';
import InlineFilter from './InlineFilter';

export interface Column {
  id: string;
  header: string;
  accessor: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  minWidth?: number;
}

export interface DataGridProps {
  data: any[];
  columns: Column[];
  pageSize?: number;
  selectable?: boolean;
  streaming?: boolean;
  streamingInterval?: number;
  streamingBatchSize?: number;
}

const DataGrid: React.FC<DataGridProps> = ({
  data,
  columns,
  pageSize = 10,
  selectable = false,
  streaming = false,
  streamingInterval = 3000,
  streamingBatchSize = 5
}) => {
  const { state, engine, isProcessing } = useGridEngine(data, {
    pageSize,
    selectable,
    useWorkerThreshold: 100
  });

  const { isStreaming, startStreaming, stopStreaming } = useDataStreaming(
    (newData) => engine?.addData(newData),
    {
      interval: streamingInterval,
      batchSize: streamingBatchSize,
      enabled: streaming
    }
  );

  if (!state || !engine) {
    return <div className="p-4">Loading...</div>;
  }

  const handleSort = (key: string) => {
    engine.setSort(key);
  };

  const handleFilter = (column: string, value: string) => {
    engine.setFilter(column, value);
  };

  const handleSelectAll = (checked: boolean) => {
    engine.selectAll(checked);
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    engine.selectRow(index, checked);
  };

  const getSortIcon = (columnId: string) => {
    if (state.sortConfig?.key !== columnId) return null;
    return state.sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">Data Grid</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {state.sortedData.length} rows
              </span>
              {isProcessing && (
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </div>
              )}
              {state.data.length > 100 && !isProcessing && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Worker Optimized
                </span>
              )}
            </div>
          </div>
          
          {streaming && (
            <div className="flex items-center gap-2">
              <Button
                variant={isStreaming ? "destructive" : "default"}
                size="sm"
                onClick={isStreaming ? stopStreaming : startStreaming}
                className="flex items-center gap-2"
              >
                {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isStreaming ? 'Stop Stream' : 'Start Stream'}
              </Button>
              {isStreaming && (
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded animate-pulse">
                  Live Streaming
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={state.selectedRows.size === state.paginatedData.length && state.paginatedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.id}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
                  style={{
                    width: column.width,
                    minWidth: column.minWidth || 100
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      {column.filterable && (
                        <InlineFilter
                          value={state.filters[column.accessor] || ''}
                          onFilterChange={(value) => handleFilter(column.accessor, value)}
                          placeholder={`Filter ${column.header}...`}
                        />
                      )}
                    </div>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.accessor)}
                        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {getSortIcon(column.accessor) || (
                          <div className="flex flex-col">
                            <ChevronUp className="w-3 h-3 -mb-1 opacity-50" />
                            <ChevronDown className="w-3 h-3 opacity-50" />
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.paginatedData.map((row, index) => (
              <tr
                key={row.id || index}
                className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={state.selectedRows.has(index)}
                      onCheckedChange={(checked) => handleSelectRow(index, checked as boolean)}
                    />
                  </td>
                )}
                {columns.map(column => (
                  <td
                    key={column.id}
                    className="px-4 py-3 text-sm text-gray-900 border-r border-gray-100 last:border-r-0"
                  >
                    {row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {state.totalPages > 1 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(state.currentPage - 1) * state.pageSize + 1} to{' '}
              {Math.min(state.currentPage * state.pageSize, state.sortedData.length)} of{' '}
              {state.sortedData.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => engine.setPage(state.currentPage - 1)}
                disabled={state.currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, state.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={state.currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => engine.setPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => engine.setPage(state.currentPage + 1)}
                disabled={state.currentPage === state.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGrid;
