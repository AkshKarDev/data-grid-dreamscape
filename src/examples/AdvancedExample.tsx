
import React, { useState, useMemo } from 'react';
import { ReusableDataGrid, generateLargeDemoData } from '@/lib';
import type { Column, DataGridConfig, DataGridEvents } from '@/lib';

const AdvancedExample: React.FC = () => {
  const [dataSize, setDataSize] = useState(1000);
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(true);
  
  const data = useMemo(() => generateLargeDemoData(dataSize), [dataSize]);
  
  const columns: Column[] = [
    {
      id: 'id',
      header: 'ID',
      accessor: 'id',
      sortable: true,
      filterable: true,
      width: 80,
      type: 'number'
    },
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
      editable: true,
      width: 150,
      type: 'text'
    },
    {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
      filterable: true,
      width: 200,
      type: 'text'
    },
    {
      id: 'department',
      header: 'Department',
      accessor: 'department',
      sortable: true,
      filterable: true,
      width: 120,
      type: 'text'
    },
    {
      id: 'position',
      header: 'Position',
      accessor: 'position',
      sortable: true,
      filterable: true,
      width: 120,
      type: 'text'
    },
    {
      id: 'salary',
      header: 'Salary',
      accessor: 'salary',
      sortable: true,
      filterable: false,
      editable: true,
      width: 120,
      type: 'number',
      formatter: (value) => `$${value.toLocaleString()}`
    },
    {
      id: 'startDate',
      header: 'Start Date',
      accessor: 'startDate',
      sortable: true,
      filterable: false,
      width: 120,
      type: 'date'
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      filterable: true,
      width: 100,
      type: 'text'
    }
  ];

  const config: DataGridConfig = {
    pageSize: 50,
    selectable: true,
    editable: true,
    streaming: true,
    streamingInterval: 2000,
    streamingBatchSize: 10,
    virtualized: virtualizationEnabled,
    virtualizedHeight: 600,
    selectionMode: 'multiple',
    enableGrouping: true,
    enableSorting: true,
    enableFiltering: true,
    showToolbar: true,
    showPagination: !virtualizationEnabled
  };

  const events: DataGridEvents = {
    onRowSelect: (selectedRows, selectedIndexes) => {
      console.log(`Selected ${selectedRows.length} rows`);
    },
    onCellEdit: (rowIndex, columnId, oldValue, newValue) => {
      console.log('Cell edited:', { rowIndex, columnId, oldValue, newValue });
    },
    onVirtualizationToggle: (enabled) => {
      setVirtualizationEnabled(enabled);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Advanced Data Grid Example</h2>
      <p className="text-gray-600 mb-6">
        This example demonstrates virtualization, streaming, and large dataset handling.
      </p>
      
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium">
          Dataset Size:
          <select 
            value={dataSize} 
            onChange={(e) => setDataSize(Number(e.target.value))}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value={100}>100 rows</option>
            <option value={1000}>1,000 rows</option>
            <option value={5000}>5,000 rows</option>
            <option value={10000}>10,000 rows</option>
          </select>
        </label>
        
        <label className="text-sm font-medium flex items-center gap-2">
          <input
            type="checkbox"
            checked={virtualizationEnabled}
            onChange={(e) => setVirtualizationEnabled(e.target.checked)}
          />
          Enable Virtualization
        </label>
      </div>
      
      <ReusableDataGrid
        data={data}
        columns={columns}
        config={config}
        events={events}
      />
    </div>
  );
};

export default AdvancedExample;
