
import React, { useState } from 'react';
import DataGrid, { Column } from '@/components/DataGrid';
import { sampleEmployees } from '@/data/sampleData';
import { largeSampleEmployees } from '@/data/largeSampleData';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [useLargeDataset, setUseLargeDataset] = useState(false);
  const [streamingEnabled, setStreamingEnabled] = useState(false);
  const [editingEnabled, setEditingEnabled] = useState(true);
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('multiple');
  
  const currentData = useLargeDataset ? largeSampleEmployees : sampleEmployees;

  const columns: Column[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
      editable: true,
      width: 200,
      minWidth: 150
    },
    {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
      filterable: true,
      editable: true,
      width: 250,
      minWidth: 200
    },
    {
      id: 'department',
      header: 'Department',
      accessor: 'department',
      sortable: true,
      filterable: true,
      editable: true,
      width: 150,
      minWidth: 120
    },
    {
      id: 'position',
      header: 'Position',
      accessor: 'position',
      sortable: true,
      filterable: true,
      editable: true,
      width: 200,
      minWidth: 150
    },
    {
      id: 'salary',
      header: 'Salary',
      accessor: 'salary',
      sortable: true,
      filterable: false,
      editable: true,
      width: 120,
      minWidth: 100
    },
    {
      id: 'startDate',
      header: 'Start Date',
      accessor: 'startDate',
      sortable: true,
      filterable: false,
      editable: false,
      width: 120,
      minWidth: 100
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      filterable: true,
      editable: true,
      width: 100,
      minWidth: 80
    },
    {
      id: 'location',
      header: 'Location',
      accessor: 'location',
      sortable: true,
      filterable: true,
      editable: true,
      width: 150,
      minWidth: 120
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Advanced Data Grid with Editing & Virtualization
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            A powerful data grid with inline editing, single/multi-row selection, DOM virtualization, live streaming, and dark/light theme support.
          </p>
          
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <Button
              variant={!useLargeDataset ? "default" : "outline"}
              onClick={() => setUseLargeDataset(false)}
            >
              Small Dataset (20 rows)
            </Button>
            <Button
              variant={useLargeDataset ? "default" : "outline"}
              onClick={() => setUseLargeDataset(true)}
            >
              Large Dataset (1000 rows)
            </Button>
            <Button
              variant={streamingEnabled ? "default" : "outline"}
              onClick={() => setStreamingEnabled(!streamingEnabled)}
            >
              {streamingEnabled ? 'Disable' : 'Enable'} Live Streaming
            </Button>
            <Button
              variant={virtualizationEnabled ? "default" : "outline"}
              onClick={() => setVirtualizationEnabled(!virtualizationEnabled)}
            >
              {virtualizationEnabled ? 'Disable' : 'Enable'} Virtualization
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <DataGrid
            data={currentData}
            columns={columns}
            pageSize={8}
            selectable={true}
            editable={editingEnabled}
            streaming={streamingEnabled}
            streamingInterval={3000}
            streamingBatchSize={3}
            virtualized={virtualizationEnabled}
            virtualizedHeight={500}
            selectionMode={selectionMode}
          />
        </div>

        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">✏️ Inline Editing</h3>
              <p className="text-gray-600 dark:text-gray-400">Click on any cell to edit data directly in the grid.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">🎯 Selection Modes</h3>
              <p className="text-gray-600 dark:text-gray-400">Choose between single or multiple row selection modes.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">🚀 Virtualization</h3>
              <p className="text-gray-600 dark:text-gray-400">DOM virtualization for smooth performance with large datasets.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">🎨 Theme Support</h3>
              <p className="text-gray-600 dark:text-gray-400">Switch between light and dark themes with full grid support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
