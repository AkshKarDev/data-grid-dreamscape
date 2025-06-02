import React from 'react';
import { ChevronUp, ChevronDown, Loader2, Play, Pause, Edit3, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useGridEngine } from '@/hooks/useGridEngine';
import { useDataStreaming } from '@/hooks/useDataStreaming';
import { useGrouping } from '@/hooks/useGrouping';
import InlineFilter from './InlineFilter';
import GroupingArea from './GroupingArea';
import GroupedDataRenderer from './GroupedDataRenderer';
import VirtualScroller from './VirtualScroller';
import VirtualizedRow from './VirtualizedRow';
import ThemeToggle from './ThemeToggle';

export interface Column {
  id: string;
  header: string;
  accessor: string;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  width?: number;
  minWidth?: number;
}

export interface DataGridProps {
  data: any[];
  columns: Column[];
  pageSize?: number;
  selectable?: boolean;
  editable?: boolean;
  streaming?: boolean;
  streamingInterval?: number;
  streamingBatchSize?: number;
  virtualized?: boolean;
  virtualizedHeight?: number;
  selectionMode?: 'single' | 'multiple';
}

const DataGrid: React.FC<DataGridProps> = ({
  data,
  columns,
  pageSize = 10,
  selectable = false,
  editable = false,
  streaming = false,
  streamingInterval = 3000,
  streamingBatchSize = 5,
  virtualized = false,
  virtualizedHeight = 400,
  selectionMode = 'multiple'
}) => {
  const { state, engine, isProcessing } = useGridEngine(data, {
    pageSize,
    selectable,
    useWorkerThreshold: 100,
    editable,
    selectionMode,
    virtualizationEnabled: virtualized
  });

  const { isStreaming, startStreaming, stopStreaming } = useDataStreaming(
    (newData) => engine?.addData(newData),
    {
      interval: streamingInterval,
      batchSize: streamingBatchSize,
      enabled: streaming
    }
  );

  const {
    groupedColumns,
    groupedData,
    addGroupColumn,
    removeGroupColumn,
    clearAllGroups
  } = useGrouping(state?.sortedData || []);

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

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    e.dataTransfer.setData('text/plain', columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const columnId = e.dataTransfer.getData('text/plain');
    if (columnId) {
      addGroupColumn(columnId);
    }
  };

  const getSortIcon = (columnId: string) => {
    if (state.sortConfig?.key !== columnId) return null;
    return state.sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const handleStartEditing = (rowIndex: number, columnId: string) => {
    engine.startEditing(rowIndex, columnId);
  };

  const handleStopEditing = () => {
    engine.stopEditing();
  };

  const handleUpdateCell = (rowIndex: number, columnId: string, value: any) => {
    engine.updateCell(rowIndex, columnId, value);
  };

  const handleSelectionModeChange = (mode: 'single' | 'multiple') => {
    engine.setSelectionMode(mode);
  };

  const handleVirtualizationToggle = (enabled: boolean) => {
    engine.enableVirtualization(enabled);
  };

  const columnHeaders = columns.reduce((acc, col) => {
    acc[col.id] = col.header;
    return acc;
  }, {} as Record<string, string>);

  const isGrouped = groupedColumns.length > 0;
  const showVirtualization = state.virtualizationEnabled && !isGrouped;
  const isPaginated = !showVirtualization && !isGrouped;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Data Grid</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {state.sortedData.length} rows
              </span>
              {isProcessing && (
                <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </div>
              )}
              {state.data.length > 100 && !isProcessing && (
                <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400 px-2 py-1 rounded">
                  Worker Optimized
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* Feature toggles */}
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Editing</span>
              <Switch
                checked={editable}
                onCheckedChange={() => {}}
                disabled
              />
            </div>
            
            {selectable && (
              <div className="flex items-center gap-2">
                <Button
                  variant={state.selectionMode === 'single' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSelectionModeChange('single')}
                  className="flex items-center gap-1"
                >
                  <User className="w-4 h-4" />
                  Single
                </Button>
                <Button
                  variant={state.selectionMode === 'multiple' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSelectionModeChange('multiple')}
                  className="flex items-center gap-1"
                >
                  <Users className="w-4 h-4" />
                  Multi
                </Button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Virtualized</span>
              <Switch
                checked={state.virtualizationEnabled}
                onCheckedChange={handleVirtualizationToggle}
              />
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
                  <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400 px-2 py-1 rounded animate-pulse">
                    Live Streaming
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grouping Area */}
      <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <GroupingArea
          groupedColumns={groupedColumns}
          columnHeaders={columnHeaders}
          onRemoveGroup={removeGroupColumn}
          onClearAll={clearAllGroups}
        />
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  {state.selectionMode === 'multiple' && (
                    <Checkbox
                      checked={state.selectedRows.size === state.paginatedData.length && state.paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  )}
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.id}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 last:border-r-0 cursor-move"
                  style={{
                    width: column.width,
                    minWidth: column.minWidth || 100
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      {column.filterable && !isGrouped && (
                        <InlineFilter
                          value={state.filters[column.accessor] || ''}
                          onFilterChange={(value) => handleFilter(column.accessor, value)}
                          placeholder={`Filter ${column.header}...`}
                        />
                      )}
                    </div>
                    {column.sortable && !isGrouped && (
                      <button
                        onClick={() => handleSort(column.accessor)}
                        className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
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
          {!showVirtualization && (
            <tbody>
              {isGrouped && groupedData ? (
                <GroupedDataRenderer
                  groupedData={groupedData}
                  columns={columns}
                  groupedColumns={groupedColumns}
                />
              ) : (
                state.paginatedData.map((row, index) => (
                  <VirtualizedRow
                    key={row.id || index}
                    row={row}
                    index={index}
                    columns={columns}
                    selected={state.selectedRows.has(index)}
                    selectable={selectable}
                    editable={editable}
                    editingCell={state.editingCell}
                    selectionMode={state.selectionMode}
                    onSelectRow={handleSelectRow}
                    onStartEditing={handleStartEditing}
                    onStopEditing={handleStopEditing}
                    onUpdateCell={handleUpdateCell}
                  />
                ))
              )}
            </tbody>
          )}
        </table>
        
        {/* Virtualized Rows */}
        {showVirtualization && (
          <VirtualScroller
            data={state.sortedData}
            columns={columns}
            containerHeight={virtualizedHeight}
            selectedRows={state.selectedRows}
            selectable={selectable}
            editable={editable}
            editingCell={state.editingCell}
            selectionMode={state.selectionMode}
            onSelectRow={handleSelectRow}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onUpdateCell={handleUpdateCell}
          />
        )}
      </div>

      {/* Pagination - Only show when not grouped and not virtualized */}
      {isPaginated && state.totalPages > 1 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-t border-gray-200 dark:border-gray-600 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
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
