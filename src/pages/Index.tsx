import React, { useState } from 'react';
import DataGrid, { Column } from '@/components/DataGrid';
import { sampleEmployees } from '@/data/sampleData';
import { largeSampleEmployees } from '@/data/largeSampleData';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [useLargeDataset, setUseLargeDataset] = useState(false);
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
            Advanced Data Grid
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            A powerful data grid component with Web Worker optimization for large datasets, 
            featuring sorting, filtering, pagination, and row selection capabilities.
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
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <DataGrid
            data={currentData}
            columns={columns}
            pageSize={8}
            selectable={true}
          />
        </div>

        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🔄 Sorting</h3>
              <p className="text-gray-600">Click on column headers to sort data in ascending or descending order.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🔍 Filtering</h3>
              <p className="text-gray-600">Use the filter button to search and filter data across multiple columns.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📄 Pagination</h3>
              <p className="text-gray-600">Navigate through large datasets with built-in pagination controls.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
