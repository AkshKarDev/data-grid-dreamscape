
export interface DataWorkerMessage {
  type: 'SORT_AND_FILTER';
  payload: {
    data: any[];
    sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
    filters: Record<string, string>;
  };
}

export interface DataWorkerResponse {
  type: 'SORT_AND_FILTER_COMPLETE';
  payload: {
    filteredData: any[];
    sortedData: any[];
  };
}

self.onmessage = function(e: MessageEvent<DataWorkerMessage>) {
  const { type, payload } = e.data;

  if (type === 'SORT_AND_FILTER') {
    const { data, sortConfig, filters } = payload;

    // Filter data
    const filteredData = data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = String(item[key] || '').toLowerCase();
        return itemValue.includes(value.toLowerCase());
      });
    });

    // Sort data
    let sortedData = [...filteredData];
    if (sortConfig) {
      sortedData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Send results back
    const response: DataWorkerResponse = {
      type: 'SORT_AND_FILTER_COMPLETE',
      payload: {
        filteredData,
        sortedData
      }
    };

    self.postMessage(response);
  }
};
