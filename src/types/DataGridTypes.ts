
export interface Column {
  id: string;
  header: string;
  accessor: string;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  width?: number;
  minWidth?: number;
  type?: 'text' | 'number' | 'date' | 'boolean';
  formatter?: (value: any) => string;
  validator?: (value: any) => boolean | string;
}

export interface DataGridConfig {
  pageSize?: number;
  selectable?: boolean;
  editable?: boolean;
  streaming?: boolean;
  streamingInterval?: number;
  streamingBatchSize?: number;
  virtualized?: boolean;
  virtualizedHeight?: number;
  selectionMode?: 'single' | 'multiple';
  enableGrouping?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  showToolbar?: boolean;
  showPagination?: boolean;
}

export interface DataGridEvents {
  onRowSelect?: (selectedRows: any[], selectedIndexes: number[]) => void;
  onRowEdit?: (rowIndex: number, row: any, changes: any) => void;
  onCellEdit?: (rowIndex: number, columnId: string, oldValue: any, newValue: any) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, string>) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onDataChange?: (data: any[]) => void;
  onGroupChange?: (groupedColumns: string[]) => void;
  onSelectionModeChange?: (mode: 'single' | 'multiple') => void;
  onVirtualizationToggle?: (enabled: boolean) => void;
}

export interface DataGridProps {
  data: any[];
  columns: Column[];
  config?: DataGridConfig;
  events?: DataGridEvents;
  className?: string;
  loading?: boolean;
  error?: string;
}
