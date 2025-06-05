
import React, { useState } from 'react';
import BasicExample from './BasicExample';
import AdvancedExample from './AdvancedExample';

const Examples: React.FC = () => {
  const [activeExample, setActiveExample] = useState<'basic' | 'advanced'>('basic');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Data Grid Library Examples
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Explore different ways to use the ReusableDataGrid component
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveExample('basic')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeExample === 'basic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              Basic Example
            </button>
            <button
              onClick={() => setActiveExample('advanced')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeExample === 'advanced'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              Advanced Example
            </button>
          </div>
        </div>

        {activeExample === 'basic' && <BasicExample />}
        {activeExample === 'advanced' && <AdvancedExample />}
        
        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">How to Use This Library</h3>
          <div className="prose dark:prose-invert">
            <h4>Installation</h4>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
{`// Import the main component and types
import { ReusableDataGrid } from '@/lib';
import type { Column, DataGridConfig, DataGridEvents } from '@/lib';`}
            </pre>
            
            <h4>Basic Usage</h4>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
{`const MyComponent = () => {
  const data = [/* your data */];
  const columns = [/* column definitions */];
  const config = {/* grid configuration */};
  const events = {/* event handlers */};
  
  return (
    <ReusableDataGrid
      data={data}
      columns={columns}
      config={config}
      events={events}
    />
  );
};`}
            </pre>
            
            <h4>Key Features</h4>
            <ul>
              <li>✅ Virtualization for large datasets</li>
              <li>✅ Real-time data streaming</li>
              <li>✅ In-line editing</li>
              <li>✅ Advanced filtering and sorting</li>
              <li>✅ Drag & drop grouping</li>
              <li>✅ Column management</li>
              <li>✅ Theme support</li>
              <li>✅ TypeScript support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Examples;
