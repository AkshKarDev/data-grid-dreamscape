
import React, { useState, useMemo } from 'react';
import ReusableDataGrid from '@/components/ReusableDataGrid';
import { Column, DataGridConfig, DataGridEvents } from '@/types/DataGridTypes';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, TrendingUp, Database, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

// Trading sample data
const tradingSampleData = [
  { id: 1, symbol: 'AAPL', price: 175.25, volume: 45000000, change: 2.15, changePercent: 1.24, sector: 'Technology' },
  { id: 2, symbol: 'GOOGL', price: 142.80, volume: 28000000, change: -1.50, changePercent: -1.04, sector: 'Technology' },
  { id: 3, symbol: 'TSLA', price: 89.45, volume: 95000000, change: 5.20, changePercent: 6.18, sector: 'Automotive' },
  { id: 4, symbol: 'MSFT', price: 112.30, volume: 32000000, change: 0.85, changePercent: 0.76, sector: 'Technology' },
  { id: 5, symbol: 'AMZN', price: 98.75, volume: 41000000, change: -2.10, changePercent: -2.08, sector: 'E-commerce' }
];

const tradingColumns: Column[] = [
  {
    id: 'symbol',
    header: 'Symbol',
    accessor: 'symbol',
    sortable: true,
    filterable: true,
    editable: false,
    width: 100,
    type: 'text'
  },
  {
    id: 'price',
    header: 'Price',
    accessor: 'price',
    sortable: true,
    filterable: false,
    editable: true,
    width: 120,
    type: 'number',
    formatter: (value) => `$${value.toFixed(2)}`
  },
  {
    id: 'volume',
    header: 'Volume',
    accessor: 'volume',
    sortable: true,
    filterable: false,
    editable: false,
    width: 120,
    type: 'number',
    formatter: (value) => value.toLocaleString()
  },
  {
    id: 'change',
    header: 'Change',
    accessor: 'change',
    sortable: true,
    filterable: false,
    editable: false,
    width: 100,
    type: 'number',
    formatter: (value) => value > 0 ? `+$${value.toFixed(2)}` : `-$${Math.abs(value).toFixed(2)}`
  },
  {
    id: 'changePercent',
    header: 'Change %',
    accessor: 'changePercent',
    sortable: true,
    filterable: false,
    editable: false,
    width: 120,
    type: 'number',
    formatter: (value) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
  },
  {
    id: 'sector',
    header: 'Sector',
    accessor: 'sector',
    sortable: true,
    filterable: true,
    editable: true,
    width: 120,
    type: 'text'
  }
];

const Index = () => {
  const { toast } = useToast();
  const [data, setData] = useState(tradingSampleData);
  const [highlightHighPrices, setHighlightHighPrices] = useState(true);
  const [customFilters, setCustomFilters] = useState<Record<string, string>>({});

  const config: DataGridConfig = {
    pageSize: 10,
    selectable: true,
    editable: true,
    streaming: false,
    virtualized: false,
    selectionMode: 'multiple',
    enableGrouping: true,
    enableSorting: true,
    enableFiltering: true,
    showToolbar: true,
    showPagination: true
  };

  const events: DataGridEvents = {
    onRowSelect: (selectedRows, selectedIndexes) => {
      console.log('Rows selected:', selectedRows);
      toast({
        title: 'Selection Updated',
        description: `${selectedRows.length} row(s) selected`,
      });
    },
    onCellEdit: (rowIndex, columnId, oldValue, newValue) => {
      console.log('Cell edited:', { rowIndex, columnId, oldValue, newValue });
      toast({
        title: 'Cell Updated',
        description: `${columnId} changed from ${oldValue} to ${newValue}`,
      });
      
      const newData = [...data];
      if (newData[rowIndex]) {
        newData[rowIndex] = { ...newData[rowIndex], [columnId]: newValue };
        setData(newData);
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
      setCustomFilters(filters);
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
      setData(data);
    },
    onGroupChange: (groupedColumns) => {
      console.log('Grouping changed:', groupedColumns);
      if (groupedColumns.length > 0) {
        toast({
          title: 'Grouping Applied',
          description: `Grouped by: ${groupedColumns.join(', ')}`,
        });
      }
    }
  };

  // Apply custom cell styling for high prices
  const styledData = useMemo(() => {
    if (!highlightHighPrices) return data;
    
    return data.map(row => ({
      ...row,
      _cellStyles: {
        price: row.price > 100 ? { 
          backgroundColor: '#fef3c7', 
          color: '#92400e',
          fontWeight: 'bold'
        } : undefined
      }
    }));
  }, [data, highlightHighPrices]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Advanced Data Grid Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            Experience the power of our high-performance React data grid with real-time editing, 
            advanced filtering, grouping, and virtualization capabilities.
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Link to="/large-demo">
              <Button size="lg" className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Large Dataset Demo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/trade-risk">
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Financial Risk Demo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Trading Data Controls</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="highlightPrices"
                  checked={highlightHighPrices}
                  onChange={(e) => setHighlightHighPrices(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="highlightPrices" className="text-sm text-gray-600 dark:text-gray-400">
                  Highlight prices over $100
                </label>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Active filters: {Object.entries(customFilters).filter(([_, value]) => value).length}
              </div>
            </div>
          </div>

          <ReusableDataGrid
            data={styledData}
            columns={tradingColumns}
            config={config}
            events={events}
            className="shadow-2xl"
          />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">✨ Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">📊 Real-time Editing</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">Edit cells directly in the grid with instant updates and validation.</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">🔍 Advanced Filtering</h4>
                <p className="text-sm text-green-700 dark:text-green-300">Powerful filtering capabilities with custom filter options and search.</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">📱 Responsive Design</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">Fully responsive layout that works perfectly on all device sizes.</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">⚡ High Performance</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">Virtualization support for handling thousands of rows smoothly.</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">🎯 Smart Selection</h4>
                <p className="text-sm text-red-700 dark:text-red-300">Single and multi-row selection with keyboard shortcuts.</p>
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">🔄 Data Streaming</h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">Real-time data updates with streaming capabilities.</p>
              </div>
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <h4 className="font-medium text-teal-900 dark:text-teal-100 mb-2">📋 Grouping & Sorting</h4>
                <p className="text-sm text-teal-700 dark:text-teal-300">Drag-and-drop grouping with multi-column sorting support.</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">🎨 Custom Styling</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Conditional cell highlighting and custom formatting options.</p>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <h4 className="font-medium text-pink-900 dark:text-pink-100 mb-2">🔧 Column Management</h4>
                <p className="text-sm text-pink-700 dark:text-pink-300">Show/hide columns with an intuitive column chooser interface.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
