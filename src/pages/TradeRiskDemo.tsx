
import React, { useState, useMemo } from 'react';
import ReusableDataGrid from '@/components/ReusableDataGrid';
import { DataGridConfig, DataGridEvents } from '@/types/DataGridTypes';
import { generateTradeRiskData, generateTradeRiskColumns } from '@/data/tradeRiskData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, TrendingUp, DollarSign, Shield, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TradeRiskDemo = () => {
  const { toast } = useToast();
  
  // Generate data only once using useMemo
  const tradeData = useMemo(() => generateTradeRiskData(), []);
  const tradeColumns = useMemo(() => generateTradeRiskColumns(), []);
  
  const [currentData, setCurrentData] = useState(tradeData);

  const config: DataGridConfig = {
    pageSize: 25,
    selectable: true,
    editable: true,
    streaming: false,
    virtualized: true,
    virtualizedHeight: 650,
    selectionMode: 'multiple',
    enableGrouping: true,
    enableSorting: true,
    enableFiltering: true,
    showToolbar: true,
    showPagination: true
  };

  const events: DataGridEvents = {
    onRowSelect: (selectedRows, selectedIndexes) => {
      console.log('Trade rows selected:', selectedRows.length);
      const totalNotional = selectedRows.reduce((sum, row) => sum + (row.notional || 0), 0);
      toast({
        title: 'Trade Selection',
        description: `${selectedRows.length} trades selected (Total: $${(totalNotional / 1000000).toFixed(1)}M)`,
      });
    },
    onCellEdit: (rowIndex, columnId, oldValue, newValue) => {
      console.log('Trade data edited:', { rowIndex, columnId, oldValue, newValue });
      toast({
        title: 'Trade Updated',
        description: `${columnId} changed for trade ${currentData[rowIndex]?.tradeId}`,
      });
      
      const newData = [...currentData];
      if (newData[rowIndex]) {
        newData[rowIndex] = { ...newData[rowIndex], [columnId]: newValue };
        setCurrentData(newData);
      }
    },
    onSort: (column, direction) => {
      console.log('Trade sort changed:', { column, direction });
      toast({
        title: 'Risk Data Sorted',
        description: `Sorted by ${column} (${direction})`,
      });
    },
    onFilter: (filters) => {
      console.log('Trade filters changed:', filters);
      const activeFilters = Object.entries(filters).filter(([_, value]) => value).length;
      if (activeFilters > 0) {
        toast({
          title: 'Risk Filters Applied',
          description: `${activeFilters} filter(s) active on trade data`,
        });
      }
    },
    onPageChange: (page, pageSize) => {
      console.log('Trade page changed:', { page, pageSize });
    },
    onDataChange: (data) => {
      console.log('Trade data changed:', data.length, 'trades');
      setCurrentData(data);
    },
    onGroupChange: (groupedColumns) => {
      console.log('Trade grouping changed:', groupedColumns);
      if (groupedColumns.length > 0) {
        toast({
          title: 'Risk Grouping Applied',
          description: `Grouped by: ${groupedColumns.join(', ')}`,
        });
      }
    }
  };

  // Calculate summary stats
  const totalNotional = useMemo(() => 
    currentData.reduce((sum, trade) => sum + (trade.notional || 0), 0)
  , [currentData]);

  const totalPnL = useMemo(() => 
    currentData.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
  , [currentData]);

  const avgVaR = useMemo(() => 
    currentData.reduce((sum, trade) => sum + (trade.var95 || 0), 0) / currentData.length
  , [currentData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Trade Financial Risk Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Experience enterprise-grade performance with 50,000 trade records and 100 risk metrics. 
              Test the grid's capabilities with real financial risk management scenarios.
            </p>
            
            <div className="flex justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="font-semibold">50,000 Trades</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <span className="font-semibold">100 Risk Metrics</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">High Performance</span>
              </div>
            </div>

            {/* Risk Summary Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Notional</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      ${(totalNotional / 1000000000).toFixed(1)}B
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <TrendingUp className={`w-8 h-8 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total P&L</h3>
                    <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${(totalPnL / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-orange-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg VaR 95%</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      ${(avgVaR / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <ReusableDataGrid
            data={currentData}
            columns={tradeColumns}
            config={config}
            events={events}
            className="shadow-2xl"
          />
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 max-w-6xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">🏦 Financial Risk Management Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">📊 Risk Metrics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">100 columns including VaR, P&L, exposure, and Greek sensitivities.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">⚡ Real-time Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Handle 50K trades with instant sorting, filtering, and grouping.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">🎯 Trade Selection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Multi-select trades for portfolio analysis and risk aggregation.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">🔍 Advanced Filtering</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Filter by counterparty, product, region, or any risk attribute.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">📋 Risk Grouping</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Group trades by portfolio, counterparty, or risk type for analysis.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">✏️ Live Editing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update trade parameters and risk metrics in real-time.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">🎛️ Column Management</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Show/hide specific risk metrics based on your analysis needs.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">📈 Risk Dashboard</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Summary statistics including total notional, P&L, and average VaR.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeRiskDemo;
