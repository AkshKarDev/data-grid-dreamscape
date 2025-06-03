
import { Column } from '@/types/DataGridTypes';

// Generate large financial risk dataset with 50,000 rows and 100 columns
export const generateTradeRiskData = () => {
  const counterparties = ['Goldman Sachs', 'JP Morgan', 'Bank of America', 'Citibank', 'Deutsche Bank', 'UBS', 'Credit Suisse', 'Morgan Stanley', 'Wells Fargo', 'HSBC'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'SGD', 'HKD', 'CNY'];
  const products = ['FX Forward', 'Interest Rate Swap', 'Credit Default Swap', 'Equity Option', 'Bond', 'Commodity Future', 'Currency Option', 'FRA', 'Cross Currency Swap', 'Total Return Swap'];
  const portfolios = ['Trading Book', 'Banking Book', 'AFS Portfolio', 'HFT Portfolio', 'Investment Portfolio', 'Hedge Portfolio', 'Prop Trading', 'Market Making', 'Flow Trading', 'Structured Products'];
  const riskTypes = ['Market Risk', 'Credit Risk', 'Operational Risk', 'Liquidity Risk', 'Model Risk', 'Settlement Risk', 'Country Risk', 'Concentration Risk'];
  const regions = ['Americas', 'EMEA', 'APAC', 'Europe', 'Asia', 'North America', 'Latin America', 'Middle East', 'Africa', 'Oceania'];
  
  const data = [];
  
  for (let i = 1; i <= 50000; i++) {
    const row: any = {
      id: i,
      tradeId: `TR${String(i).padStart(8, '0')}`,
      counterparty: counterparties[Math.floor(Math.random() * counterparties.length)],
      product: products[Math.floor(Math.random() * products.length)],
      portfolio: portfolios[Math.floor(Math.random() * portfolios.length)],
      notional: Math.floor(Math.random() * 100000000) + 1000000, // 1M to 100M
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      maturityDate: new Date(2024 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      tradeDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      riskType: riskTypes[Math.floor(Math.random() * riskTypes.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      pnl: (Math.random() - 0.5) * 10000000, // -5M to +5M
      var95: Math.random() * 5000000, // 0 to 5M
      expectedShortfall: Math.random() * 7000000, // 0 to 7M
      creditExposure: Math.random() * 50000000, // 0 to 50M
      deltaEquivalent: (Math.random() - 0.5) * 20000000, // -10M to +10M
    };
    
    // Add 85 more risk metrics columns to reach 100 total columns
    for (let j = 1; j <= 85; j++) {
      const metricTypes = ['VaR', 'ES', 'Greeks', 'Sensitivities', 'Exposure', 'PV01', 'DV01', 'Vega', 'Gamma', 'Theta'];
      const metricType = metricTypes[j % metricTypes.length];
      row[`risk_metric_${j}`] = (Math.random() - 0.5) * 1000000; // Random risk metric value
    }
    
    data.push(row);
  }
  
  return data;
};

// Generate 100 columns for trade risk data
export const generateTradeRiskColumns = (): Column[] => {
  const baseColumns: Column[] = [
    {
      id: 'tradeId',
      header: 'Trade ID',
      accessor: 'tradeId',
      sortable: true,
      filterable: true,
      editable: false,
      width: 120,
      type: 'text'
    },
    {
      id: 'counterparty',
      header: 'Counterparty',
      accessor: 'counterparty',
      sortable: true,
      filterable: true,
      editable: true,
      width: 150,
      type: 'text'
    },
    {
      id: 'product',
      header: 'Product',
      accessor: 'product',
      sortable: true,
      filterable: true,
      editable: true,
      width: 140,
      type: 'text'
    },
    {
      id: 'portfolio',
      header: 'Portfolio',
      accessor: 'portfolio',
      sortable: true,
      filterable: true,
      editable: true,
      width: 130,
      type: 'text'
    },
    {
      id: 'notional',
      header: 'Notional',
      accessor: 'notional',
      sortable: true,
      filterable: false,
      editable: true,
      width: 120,
      type: 'number',
      formatter: (value) => `$${(value / 1000000).toFixed(1)}M`
    },
    {
      id: 'currency',
      header: 'Currency',
      accessor: 'currency',
      sortable: true,
      filterable: true,
      editable: true,
      width: 100,
      type: 'text'
    },
    {
      id: 'maturityDate',
      header: 'Maturity',
      accessor: 'maturityDate',
      sortable: true,
      filterable: false,
      editable: false,
      width: 110,
      type: 'date'
    },
    {
      id: 'tradeDate',
      header: 'Trade Date',
      accessor: 'tradeDate',
      sortable: true,
      filterable: false,
      editable: false,
      width: 110,
      type: 'date'
    },
    {
      id: 'riskType',
      header: 'Risk Type',
      accessor: 'riskType',
      sortable: true,
      filterable: true,
      editable: true,
      width: 130,
      type: 'text'
    },
    {
      id: 'region',
      header: 'Region',
      accessor: 'region',
      sortable: true,
      filterable: true,
      editable: true,
      width: 120,
      type: 'text'
    },
    {
      id: 'pnl',
      header: 'P&L',
      accessor: 'pnl',
      sortable: true,
      filterable: false,
      editable: false,
      width: 120,
      type: 'number',
      formatter: (value) => `$${(value / 1000000).toFixed(2)}M`
    },
    {
      id: 'var95',
      header: 'VaR 95%',
      accessor: 'var95',
      sortable: true,
      filterable: false,
      editable: false,
      width: 120,
      type: 'number',
      formatter: (value) => `$${(value / 1000000).toFixed(2)}M`
    },
    {
      id: 'expectedShortfall',
      header: 'Expected Shortfall',
      accessor: 'expectedShortfall',
      sortable: true,
      filterable: false,
      editable: false,
      width: 150,
      type: 'number',
      formatter: (value) => `$${(value / 1000000).toFixed(2)}M`
    },
    {
      id: 'creditExposure',
      header: 'Credit Exposure',
      accessor: 'creditExposure',
      sortable: true,
      filterable: false,
      editable: false,
      width: 140,
      type: 'number',
      formatter: (value) => `$${(value / 1000000).toFixed(2)}M`
    },
    {
      id: 'deltaEquivalent',
      header: 'Delta Equivalent',
      accessor: 'deltaEquivalent',
      sortable: true,
      filterable: false,
      editable: false,
      width: 140,
      type: 'number',
      formatter: (value) => `$${(value / 1000000).toFixed(2)}M`
    }
  ];
  
  // Add 85 more risk metric columns to reach 100 total
  const riskMetricColumns: Column[] = [];
  for (let i = 1; i <= 85; i++) {
    riskMetricColumns.push({
      id: `risk_metric_${i}`,
      header: `Risk Metric ${i}`,
      accessor: `risk_metric_${i}`,
      sortable: true,
      filterable: false,
      editable: true,
      width: 120,
      type: 'number',
      formatter: (value) => `${(value / 1000).toFixed(1)}K`
    });
  }
  
  return [...baseColumns, ...riskMetricColumns];
};
