
import { Column } from '@/types/DataGridTypes';

// Generate large dataset with 10,000 rows and 100 columns
export const generateLargeDemoData = () => {
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Legal', 'Support', 'Design', 'Product'];
  const positions = ['Manager', 'Senior', 'Junior', 'Lead', 'Director', 'VP', 'Analyst', 'Specialist', 'Coordinator', 'Associate'];
  const locations = ['New York', 'San Francisco', 'London', 'Tokyo', 'Berlin', 'Sydney', 'Toronto', 'Singapore', 'Dubai', 'Mumbai'];
  const statuses = ['Active', 'Inactive', 'On Leave', 'Remote'];
  
  const data = [];
  
  for (let i = 1; i <= 10000; i++) {
    const row: any = {
      id: i,
      name: `Employee ${i}`,
      email: `employee${i}@company.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      salary: Math.floor(Math.random() * 150000) + 30000,
      startDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
    };
    
    // Add 91 more columns (col1 to col91) to reach 100 total columns
    for (let j = 1; j <= 91; j++) {
      row[`col${j}`] = `Value ${i}-${j}`;
    }
    
    data.push(row);
  }
  
  return data;
};

// Generate 100 columns
export const generateLargeDemoColumns = (): Column[] => {
  const baseColumns: Column[] = [
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
      id: 'position',
      header: 'Position',
      accessor: 'position',
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
      width: 100,
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
      width: 110,
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
      type: 'text'
    },
    {
      id: 'location',
      header: 'Location',
      accessor: 'location',
      sortable: true,
      filterable: true,
      editable: true,
      width: 120,
      type: 'text'
    }
  ];
  
  // Add 92 more columns to reach 100 total
  const additionalColumns: Column[] = [];
  for (let i = 1; i <= 92; i++) {
    additionalColumns.push({
      id: `col${i}`,
      header: `Column ${i}`,
      accessor: `col${i}`,
      sortable: true,
      filterable: true,
      editable: true,
      width: 100,
      type: 'text'
    });
  }
  
  return [...baseColumns, ...additionalColumns];
};
