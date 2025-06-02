
import { Employee } from './sampleData';

// Generate a larger dataset for testing Web Worker optimization
export const generateLargeDataset = (size: number = 1000): Employee[] => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Operations'];
  const positions = ['Manager', 'Senior', 'Junior', 'Lead', 'Specialist', 'Director', 'Analyst'];
  const locations = ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Boston', 'Seattle', 'Austin'];
  const statuses = ['Active', 'On Leave', 'Remote'];
  
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

  return Array.from({ length: size }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department,
      position: `${position} ${department.slice(0, -1)}`,
      salary: Math.floor(Math.random() * 100000) + 40000,
      startDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location: locations[Math.floor(Math.random() * locations.length)]
    };
  });
};

export const largeSampleEmployees = generateLargeDataset(1000);
