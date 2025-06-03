import React, { useState, useMemo } from 'react';
import ReusableDataGrid from '@/components/ReusableDataGrid';
import { DataGridConfig, DataGridEvents } from '@/types/DataGridTypes';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Database, BarChart3, TrendingUp, Play, Pause, Users, Edit3, Filter, Columns } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [useLargeDataset, setUseLargeDataset] = useState(false);
  const [currentData, setCurrentData] = useState(sampleEmployees);
  const { toast } = useToast();
  
  const currentDataSource = useLargeDataset ? largeSampleEmployees : currentData;

  const columns: Column[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
      editable: true,
      width: 200,
      minWidth: 150,
      type: 'text'
    },
    {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
      filterable: true,
      editable: true,
      width: 250,
      minWidth: 200,
      type: 'text'
    },
    {
      id: 'department',
      header: 'Department',
      accessor: 'department',
      sortable: true,
      filterable: true,
      editable: true,
      width: 150,
      minWidth: 120,
      type: 'text'
    },
    {
      id: 'position',
      header: 'Position',
      accessor: 'position',
      sortable: true,
      filterable: true,
      editable: true,
      width: 200,
      minWidth: 150,
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
      minWidth: 100,
      type: 'number',
      formatter: (value) => `$${value?.toLocaleString() || 0}`
    },
    {
      id: 'startDate',
      header: 'Start Date',
      accessor: 'startDate',
      sortable: true,
      filterable: false,
      editable: false,
      width: 120,
      minWidth: 100,
      type: 'date'
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      filterable: true,
      editable: true,
      width: 100,
      minWidth: 80,
      type: 'text'
    },
    {
      id: 'location',
      header: 'Location',
      accessor: 'location',
      sortable: true,
      filterable: true,
      editable: true,
      width: 150,
      minWidth: 120,
      type: 'text'
    }
  ];

  const config: DataGridConfig = {
    pageSize: 8,
    selectable: true,
    editable: true,
    streaming: true,
    streamingInterval: 3000,
    streamingBatchSize: 3,
    virtualized: false,
    virtualizedHeight: 500,
    selectionMode: 'multiple',
    enableGrouping: true,
    enableSorting: true,
    enableFiltering: true,
    showToolbar: true,
    showPagination: true
  };

  const events: DataGridEvents = {
    onRowSelect: (selectedRows, selectedIndexes) => {
      console.log('Rows selected:', selectedRows, selectedIndexes);
      toast({
        title: 'Selection Changed',
        description: `${selectedRows.length} row(s) selected`,
      });
    },
    onCellEdit: (rowIndex, columnId, oldValue, newValue) => {
      console.log('Cell edited:', { rowIndex, columnId, oldValue, newValue });
      toast({
        title: 'Cell Updated',
        description: `${columnId} changed from "${oldValue}" to "${newValue}"`,
      });
      
      // Update the local data
      const newData = [...currentData];
      if (newData[rowIndex]) {
        newData[rowIndex] = { ...newData[rowIndex], [columnId]: newValue };
        setCurrentData(newData);
      }
    },
    onSort: (column, direction) => {
      console.log('Sort changed:', { column, direction });
      toast({
        title: 'Sort Applied',
        description: `Sorted by ${column} (${direction})`,
      });
    },
    onFilter: (filters) => {
      console.log('Filters changed:', filters);
      const activeFilters = Object.entries(filters).filter(([_, value]) => value).length;
      if (activeFilters > 0) {
        toast({
          title: 'Filters Applied',
          description: `${activeFilters} filter(s) active`,
        });
      }
    },
    onPageChange: (page, pageSize) => {
      console.log('Page changed:', { page, pageSize });
    },
    onDataChange: (data) => {
      console.log('Data changed:', data.length, 'rows');
      setCurrentData(data);
    },
    onGroupChange: (groupedColumns) => {
      console.log('Grouping changed:', groupedColumns);
      if (groupedColumns.length > 0) {
        toast({
          title: 'Grouping Applied',
          description: `Grouped by: ${groupedColumns.join(', ')}`,
        });
      }
    },
    onSelectionModeChange: (mode) => {
      console.log('Selection mode changed:', mode);
      toast({
        title: 'Selection Mode Changed',
        description: `Mode: ${mode}`,
      });
    },
    onVirtualizationToggle: (enabled) => {
      console.log('Virtualization toggled:', enabled);
      toast({
        title: 'Virtualization',
        description: enabled ? 'Enabled' : 'Disabled',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Reusable Data Grid Component
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            A fully reusable data grid with customizable properties, data sources, and comprehensive event handling.
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
            <Link to="/large-demo">
              <Button variant="secondary" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Massive Dataset Demo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <ReusableDataGrid
            data={currentDataSource}
            columns={columns}
            config={config}
            events={events}
            className="shadow-xl"
          />
        </div>

        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">🔧 Configurable</h3>
              <p className="text-gray-600 dark:text-gray-400">Easily configure features through props and config object.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">📊 Data Driven</h3>
              <p className="text-gray-600 dark:text-gray-400">Pass any data source and column configuration.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">🎯 Event Driven</h3>
              <p className="text-gray-600 dark:text-gray-400">Handle all user interactions through event callbacks.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">♻️ Reusable</h3>
              <p className="text-gray-600 dark:text-gray-400">Drop into any project with minimal setup required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
