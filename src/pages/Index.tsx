
import React, { useState } from 'react';
import DataGrid, { Column } from '@/components/DataGrid';
import { sampleEmployees } from '@/data/sampleData';
import { largeSampleEmployees } from '@/data/largeSampleData';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [useLargeDataset, setUseLargeDataset] = useState(false);
  const [streamingEnabled, setStreamingEnabled] = useState(false);
  const currentData = useLargeDataset ? largeSampleEmployees : sampleEmployees;

  const columns: Column[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
      width: 200,
      minWidth: 150
    },
    {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
      filterable: true,
      width: 250,
      minWidth: 200
    },
    {
      id: 'department',
      header: 'Department',
      accessor: 'department',
      sortable: true,
      filterable: true,
      width: 150,
      minWidth: 120
    },
    {
      id: 'position',
      header: 'Position',
      accessor: 'position',
      sortable: true,
      filterable: true,
      width: 200,
      minWidth: 150
    },
    {
      id: 'salary',
      header: 'Salary',
      accessor: 'salary',
      sortable: true,
      filterable: false,
      width: 120,
      minWidth: 100
    },
    {
      id: 'startDate',
      header: 'Start Date',
      accessor: 'startDate',
      sortable: true,
      filterable: false,
      width: 120,
      minWidth: 100
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      filterable: true,
      width: 100,
      minWidth: 80
    },
    {
      id: 'location',
      header: 'Location',
      accessor: 'location',
      sortable: true,
      filterable: true,
      width: 150,
      minWidth: 120
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Advanced Data Grid with Live Streaming
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            A powerful data grid with decoupled architecture, inline filtering, and live data streaming capabilities.
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
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
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <DataGrid
            data={currentData}
            columns={columns}
            pageSize={8}
            selectable={true}
            streaming={streamingEnabled}
            streamingInterval={3000}
            streamingBatchSize={3}
          />
        </div>

        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🔍 Inline Filtering</h3>
              <p className="text-gray-600">Click the search icon in column headers to filter data directly inline.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🔄 Live Streaming</h3>
              <p className="text-gray-600">Enable real-time data updates with the streaming toggle button.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">⚡ Grid Engine</h3>
              <p className="text-gray-600">Decoupled architecture allows for efficient data processing and updates.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🚀 Web Workers</h3>
              <p className="text-gray-600">Automatic optimization for large datasets using background processing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
