
import React, { useState } from 'react';
import { ReusableDataGrid } from '@/lib';
import type { Column, DataGridConfig, DataGridEvents } from '@/lib';

// Sample data for the example
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', salary: 75000, active: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', salary: 65000, active: true },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales', salary: 55000, active: false },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', department: 'HR', salary: 60000, active: true },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', department: 'Finance', salary: 70000, active: true },
];

const columns: Column[] = [
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
    editable: true,
    width: 200,
    type: 'text'
  },
  {
    id: 'department',
    header: 'Department',
    accessor: 'department',
    sortable: true,
    filterable: true,
    editable: true,
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
    id: 'active',
    header: 'Active',
    accessor: 'active',
    sortable: true,
    filterable: false,
    editable: true,
    width: 100,
    type: 'boolean',
    formatter: (value) => value ? 'Yes' : 'No'
  }
];

const BasicExample: React.FC = () => {
  const [data, setData] = useState(sampleData);

  const config: DataGridConfig = {
    pageSize: 5,
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
      console.log('Selected rows:', selectedRows);
    },
    onCellEdit: (rowIndex, columnId, oldValue, newValue) => {
      console.log('Cell edited:', { rowIndex, columnId, oldValue, newValue });
      
      // Update the data
      const newData = [...data];
      if (newData[rowIndex]) {
        newData[rowIndex] = { ...newData[rowIndex], [columnId]: newValue };
        setData(newData);
      }
    },
    onSort: (column, direction) => {
      console.log('Sort changed:', { column, direction });
    },
    onFilter: (filters) => {
      console.log('Filters changed:', filters);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Basic Data Grid Example</h2>
      <p className="text-gray-600 mb-6">
        This is a simple example of how to use the ReusableDataGrid component in your React application.
      </p>
      
      <ReusableDataGrid
        data={data}
        columns={columns}
        config={config}
        events={events}
      />
    </div>
  );
};

export default BasicExample;
