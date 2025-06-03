
import React, { useState, useMemo } from 'react';
import ReusableDataGrid from '@/components/ReusableDataGrid';
import { DataGridConfig, DataGridEvents } from '@/types/DataGridTypes';
import { generateLargeDemoData, generateLargeDemoColumns } from '@/data/largeDemoData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Database, Columns, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const LargeDatasetDemo = () => {
  const { toast } = useToast();
  
  // Generate data only once using useMemo
  const demoData = useMemo(() => generateLargeDemoData(), []);
  const demoColumns = useMemo(() => generateLargeDemoColumns(), []);
  
  const [currentData, setCurrentData] = useState(demoData);

  const config: DataGridConfig = {
    pageSize: 20,
    selectable: true,
    editable: true,
    streaming: false,
    virtualized: true,
    virtualizedHeight: 600,
    selectionMode: 'multiple',
    enableGrouping: true,
    enableSorting: true,
    enableFiltering: true,
    showToolbar: true,
    showPagination: true
  };

  const events: DataGridEvents = {
    onRowSelect: (selectedRows, selectedIndexes) => {
      console.log('Rows selected:', selectedRows.length);
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Main Demo
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Large Dataset Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Experience the data grid's performance with 10,000 rows and 100 columns. Test column visibility controls, 
              virtualization, grouping, and all other features at scale.
            </p>
            
            <div className="flex justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
                <Database className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">10,000 Rows</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
                <Columns className="w-5 h-5 text-green-600" />
                <span className="font-semibold">100 Columns</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Virtualized</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <ReusableDataGrid
            data={currentData}
            columns={demoColumns}
            config={config}
            events={events}
            className="shadow-2xl"
          />
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">📊 Performance Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">🎛️ Column Chooser</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Use the "Columns" button to show/hide columns dynamically.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">⚡ Virtualization</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Only visible rows are rendered for optimal performance.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">🔍 Smart Filtering</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Filter across all 100 columns with real-time search.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">📋 Grouping</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Drag column headers to the grouping area for hierarchical view.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">✏️ Inline Editing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Click on any cell to edit data in place.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">🎯 Selection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select individual rows or use bulk selection modes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LargeDatasetDemo;
