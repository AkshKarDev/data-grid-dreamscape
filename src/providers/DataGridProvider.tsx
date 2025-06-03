
import React, { createContext, useContext, useCallback } from 'react';
import { DataGridEvents } from '@/types/DataGridTypes';

interface DataGridContextType {
  events: DataGridEvents;
  emitRowSelect: (selectedRows: any[], selectedIndexes: number[]) => void;
  emitRowEdit: (rowIndex: number, row: any, changes: any) => void;
  emitCellEdit: (rowIndex: number, columnId: string, oldValue: any, newValue: any) => void;
  emitSort: (column: string, direction: 'asc' | 'desc') => void;
  emitFilter: (filters: Record<string, string>) => void;
  emitPageChange: (page: number, pageSize: number) => void;
  emitDataChange: (data: any[]) => void;
  emitGroupChange: (groupedColumns: string[]) => void;
  emitSelectionModeChange: (mode: 'single' | 'multiple') => void;
  emitVirtualizationToggle: (enabled: boolean) => void;
}

const DataGridContext = createContext<DataGridContextType | undefined>(undefined);

export const useDataGridContext = () => {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error('useDataGridContext must be used within a DataGridProvider');
  }
  return context;
};

interface DataGridProviderProps {
  children: React.ReactNode;
  events: DataGridEvents;
}

export const DataGridProvider: React.FC<DataGridProviderProps> = ({ children, events }) => {
  const emitRowSelect = useCallback((selectedRows: any[], selectedIndexes: number[]) => {
    events.onRowSelect?.(selectedRows, selectedIndexes);
  }, [events.onRowSelect]);

  const emitRowEdit = useCallback((rowIndex: number, row: any, changes: any) => {
    events.onRowEdit?.(rowIndex, row, changes);
  }, [events.onRowEdit]);

  const emitCellEdit = useCallback((rowIndex: number, columnId: string, oldValue: any, newValue: any) => {
    events.onCellEdit?.(rowIndex, columnId, oldValue, newValue);
  }, [events.onCellEdit]);

  const emitSort = useCallback((column: string, direction: 'asc' | 'desc') => {
    events.onSort?.(column, direction);
  }, [events.onSort]);

  const emitFilter = useCallback((filters: Record<string, string>) => {
    events.onFilter?.(filters);
  }, [events.onFilter]);

  const emitPageChange = useCallback((page: number, pageSize: number) => {
    events.onPageChange?.(page, pageSize);
  }, [events.onPageChange]);

  const emitDataChange = useCallback((data: any[]) => {
    events.onDataChange?.(data);
  }, [events.onDataChange]);

  const emitGroupChange = useCallback((groupedColumns: string[]) => {
    events.onGroupChange?.(groupedColumns);
  }, [events.onGroupChange]);

  const emitSelectionModeChange = useCallback((mode: 'single' | 'multiple') => {
    events.onSelectionModeChange?.(mode);
  }, [events.onSelectionModeChange]);

  const emitVirtualizationToggle = useCallback((enabled: boolean) => {
    events.onVirtualizationToggle?.(enabled);
  }, [events.onVirtualizationToggle]);

  const value = {
    events,
    emitRowSelect,
    emitRowEdit,
    emitCellEdit,
    emitSort,
    emitFilter,
    emitPageChange,
    emitDataChange,
    emitGroupChange,
    emitSelectionModeChange,
    emitVirtualizationToggle
  };

  return (
    <DataGridContext.Provider value={value}>
      {children}
    </DataGridContext.Provider>
  );
};
