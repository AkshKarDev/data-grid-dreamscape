
import { useEffect, useRef, useState } from 'react';

interface StreamingConfig {
  interval: number;
  batchSize: number;
  enabled: boolean;
}

export const useDataStreaming = (
  onDataUpdate: (newData: any[]) => void,
  config: StreamingConfig
) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const counterRef = useRef(1000);

  const generateNewData = (count: number) => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    const positions = ['Manager', 'Senior', 'Junior', 'Lead', 'Specialist'];
    const locations = ['New York', 'Los Angeles', 'San Francisco', 'Chicago'];
    const statuses = ['Active', 'On Leave', 'Remote'];
    
    return Array.from({ length: count }, () => {
      counterRef.current += 1;
      return {
        id: counterRef.current,
        name: `Employee ${counterRef.current}`,
        email: `employee${counterRef.current}@company.com`,
        department: departments[Math.floor(Math.random() * departments.length)],
        position: positions[Math.floor(Math.random() * positions.length)],
        salary: Math.floor(Math.random() * 100000) + 40000,
        startDate: new Date().toISOString().split('T')[0],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        location: locations[Math.floor(Math.random() * locations.length)]
      };
    });
  };

  const startStreaming = () => {
    if (!config.enabled) return;
    
    setIsStreaming(true);
    intervalRef.current = setInterval(() => {
      const newData = generateNewData(config.batchSize);
      onDataUpdate(newData);
    }, config.interval);
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isStreaming,
    startStreaming,
    stopStreaming
  };
};
