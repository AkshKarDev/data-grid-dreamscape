
# Reusable Data Grid

A high-performance, feature-rich React data grid component built with TypeScript, Tailwind CSS, and modern React patterns.

## Features

- 🚀 **High Performance**: Virtualization support for handling large datasets (50k+ rows)
- 📝 **Inline Editing**: Edit cells directly with validation support
- 🔍 **Advanced Filtering**: Multiple filter types with custom operators
- 📊 **Sorting & Grouping**: Multi-column sorting and drag-drop grouping
- 🎯 **Selection**: Single and multi-row selection modes
- 📱 **Responsive**: Mobile-friendly responsive design
- 🎨 **Customizable**: Custom cell styling and formatting
- ⚡ **Real-time**: Data streaming capabilities
- 🌙 **Theme Support**: Dark/light mode support
- 📦 **TypeScript**: Full TypeScript support with type definitions

## Installation

```bash
npm install reusable-data-grid
# or
yarn add reusable-data-grid
```

## Quick Start

```tsx
import React from 'react';
import { ReusableDataGrid } from 'reusable-data-grid';
import type { Column, DataGridConfig } from 'reusable-data-grid';

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', salary: 75000 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', salary: 65000 },
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
    width: 200,
    type: 'text'
  },
  {
    id: 'salary',
    header: 'Salary',
    accessor: 'salary',
    sortable: true,
    editable: true,
    width: 120,
    type: 'number',
    formatter: (value) => \`$\${value.toLocaleString()}\`
  }
];

const config: DataGridConfig = {
  pageSize: 10,
  selectable: true,
  editable: true,
  virtualized: false,
  enableGrouping: true,
  enableSorting: true,
  enableFiltering: true,
  showToolbar: true,
  showPagination: true
};

const MyApp = () => {
  return (
    <ReusableDataGrid
      data={data}
      columns={columns}
      config={config}
      events={{
        onCellEdit: (rowIndex, columnId, oldValue, newValue) => {
          console.log('Cell edited:', { rowIndex, columnId, oldValue, newValue });
        },
        onRowSelect: (selectedRows, selectedIndexes) => {
          console.log('Selected rows:', selectedRows);
        }
      }}
    />
  );
};
```

## API Reference

### Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `any[]` | Array of data objects to display |
| `columns` | `Column[]` | Column definitions |
| `config` | `DataGridConfig` | Grid configuration options |
| `events` | `DataGridEvents` | Event handlers |
| `className` | `string` | Additional CSS classes |
| `loading` | `boolean` | Show loading state |
| `error` | `string` | Error message to display |

### Column Definition

```tsx
interface Column {
  id: string;
  header: string;
  accessor: string;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  width?: number;
  minWidth?: number;
  type?: 'text' | 'number' | 'date' | 'boolean';
  formatter?: (value: any) => string;
  validator?: (value: any) => boolean | string;
}
```

### Configuration Options

```tsx
interface DataGridConfig {
  pageSize?: number;
  selectable?: boolean;
  editable?: boolean;
  streaming?: boolean;
  streamingInterval?: number;
  streamingBatchSize?: number;
  virtualized?: boolean;
  virtualizedHeight?: number;
  selectionMode?: 'single' | 'multiple';
  enableGrouping?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  showToolbar?: boolean;
  showPagination?: boolean;
}
```

## License

MIT © [Your Name]
