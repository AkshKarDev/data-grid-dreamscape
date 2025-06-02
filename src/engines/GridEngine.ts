export interface GridState {
  data: any[];
  filteredData: any[];
  sortedData: any[];
  paginatedData: any[];
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  filters: Record<string, string>;
  currentPage: number;
  pageSize: number;
  selectedRows: Set<number>;
  totalPages: number;
  editingCell: { rowIndex: number; columnId: string } | null;
  selectionMode: 'single' | 'multiple';
  virtualizationEnabled: boolean;
}

export interface GridConfig {
  pageSize: number;
  selectable: boolean;
  useWorkerThreshold: number;
  editable: boolean;
  selectionMode: 'single' | 'multiple';
  virtualizationEnabled: boolean;
}

export type GridEngineListener = (state: GridState) => void;

export class GridEngine {
  private state: GridState;
  private config: GridConfig;
  private listeners: Set<GridEngineListener> = new Set();
  private worker: Worker | null = null;
  private isProcessing = false;

  constructor(initialData: any[] = [], config: Partial<GridConfig> = {}) {
    this.config = {
      pageSize: 10,
      selectable: false,
      useWorkerThreshold: 100,
      editable: false,
      selectionMode: 'multiple',
      virtualizationEnabled: false,
      ...config
    };

    this.state = {
      data: initialData,
      filteredData: initialData,
      sortedData: initialData,
      paginatedData: initialData.slice(0, this.config.pageSize),
      sortConfig: null,
      filters: {},
      currentPage: 1,
      pageSize: this.config.pageSize,
      selectedRows: new Set(),
      totalPages: Math.ceil(initialData.length / this.config.pageSize),
      editingCell: null,
      selectionMode: this.config.selectionMode,
      virtualizationEnabled: this.config.virtualizationEnabled
    };

    this.initializeWorker();
  }

  private initializeWorker() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('../workers/dataWorker.ts', import.meta.url),
        { type: 'module' }
      );
    }
  }

  public subscribe(listener: GridEngineListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  public updateData(newData: any[]) {
    this.state.data = newData;
    this.processData();
  }

  public addData(newRows: any[]) {
    this.state.data = [...this.state.data, ...newRows];
    this.processData();
  }

  public updateRow(index: number, newRow: any) {
    this.state.data[index] = { ...this.state.data[index], ...newRow };
    this.processData();
  }

  public removeRow(index: number) {
    this.state.data.splice(index, 1);
    this.processData();
  }

  public updateCell(rowIndex: number, columnId: string, value: any) {
    const dataIndex = this.getDataIndexFromDisplayIndex(rowIndex);
    if (dataIndex !== -1) {
      this.state.data[dataIndex] = { ...this.state.data[dataIndex], [columnId]: value };
      this.processData();
    }
  }

  public startEditing(rowIndex: number, columnId: string) {
    this.state.editingCell = { rowIndex, columnId };
    this.notify();
  }

  public stopEditing() {
    this.state.editingCell = null;
    this.notify();
  }

  private getDataIndexFromDisplayIndex(displayIndex: number): number {
    const displayRow = this.state.paginatedData[displayIndex];
    return this.state.data.findIndex(row => row.id === displayRow.id || row === displayRow);
  }

  public setSort(key: string) {
    if (this.state.sortConfig?.key === key) {
      this.state.sortConfig.direction = this.state.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortConfig = { key, direction: 'asc' };
    }
    this.processData();
  }

  public setFilter(column: string, value: string) {
    this.state.filters = { ...this.state.filters, [column]: value };
    this.state.currentPage = 1;
    this.processData();
  }

  public setPage(page: number) {
    this.state.currentPage = Math.max(1, Math.min(page, this.state.totalPages));
    this.updatePagination();
    this.notify();
  }

  public selectRow(index: number, selected: boolean) {
    const newSelected = new Set(this.state.selectedRows);
    
    if (this.state.selectionMode === 'single') {
      newSelected.clear();
      if (selected) {
        newSelected.add(index);
      }
    } else {
      if (selected) {
        newSelected.add(index);
      } else {
        newSelected.delete(index);
      }
    }
    
    this.state.selectedRows = newSelected;
    this.notify();
  }

  public selectAll(selected: boolean) {
    if (this.state.selectionMode === 'single') return;
    
    if (selected) {
      this.state.selectedRows = new Set(this.state.paginatedData.map((_, i) => i));
    } else {
      this.state.selectedRows = new Set();
    }
    this.notify();
  }

  public setSelectionMode(mode: 'single' | 'multiple') {
    this.state.selectionMode = mode;
    if (mode === 'single' && this.state.selectedRows.size > 1) {
      const firstSelected = Array.from(this.state.selectedRows)[0];
      this.state.selectedRows = new Set([firstSelected]);
    }
    this.notify();
  }

  public enableVirtualization(enabled: boolean) {
    this.state.virtualizationEnabled = enabled;
    this.notify();
  }

  private async processData() {
    const shouldUseWorker = this.state.data.length > this.config.useWorkerThreshold && this.worker;

    if (shouldUseWorker) {
      this.isProcessing = true;
      this.notify();

      return new Promise<void>((resolve) => {
        const handleMessage = (e: MessageEvent) => {
          if (e.data.type === 'SORT_AND_FILTER_COMPLETE') {
            const { filteredData, sortedData } = e.data.payload;
            this.state.filteredData = filteredData;
            this.state.sortedData = sortedData;
            this.updatePagination();
            this.isProcessing = false;
            this.worker?.removeEventListener('message', handleMessage);
            this.notify();
            resolve();
          }
        };

        this.worker?.addEventListener('message', handleMessage);
        this.worker?.postMessage({
          type: 'SORT_AND_FILTER',
          payload: {
            data: this.state.data,
            sortConfig: this.state.sortConfig,
            filters: this.state.filters
          }
        });
      });
    } else {
      this.processDataSync();
    }
  }

  private processDataSync() {
    // Filter data
    this.state.filteredData = this.state.data.filter(item => {
      return Object.entries(this.state.filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = String(item[key] || '').toLowerCase();
        return itemValue.includes(value.toLowerCase());
      });
    });

    // Sort data
    this.state.sortedData = [...this.state.filteredData];
    if (this.state.sortConfig) {
      this.state.sortedData.sort((a, b) => {
        const aValue = a[this.state.sortConfig!.key];
        const bValue = b[this.state.sortConfig!.key];

        if (aValue < bValue) {
          return this.state.sortConfig!.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.state.sortConfig!.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    this.updatePagination();
    this.notify();
  }

  private updatePagination() {
    this.state.totalPages = Math.ceil(this.state.sortedData.length / this.state.pageSize);
    this.state.currentPage = Math.max(1, Math.min(this.state.currentPage, this.state.totalPages));
    
    const startIndex = (this.state.currentPage - 1) * this.state.pageSize;
    this.state.paginatedData = this.state.sortedData.slice(startIndex, startIndex + this.state.pageSize);
  }

  public getState(): GridState {
    return { ...this.state };
  }

  public isProcessingData(): boolean {
    return this.isProcessing;
  }

  public destroy() {
    this.worker?.terminate();
    this.listeners.clear();
  }
}
