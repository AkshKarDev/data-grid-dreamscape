
import { useEffect, useRef, useState, useCallback } from 'react';
import { DataWorkerMessage, DataWorkerResponse } from '@/workers/dataWorker';

export const useDataWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Create worker
    workerRef.current = new Worker(
      new URL('../workers/dataWorker.ts', import.meta.url),
      { type: 'module' }
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const processData = useCallback((
    data: any[],
    sortConfig: { key: string; direction: 'asc' | 'desc' } | null,
    filters: Record<string, string>,
    onComplete: (filteredData: any[], sortedData: any[]) => void
  ) => {
    if (!workerRef.current) return;

    setIsProcessing(true);

    const handleMessage = (e: MessageEvent<DataWorkerResponse>) => {
      if (e.data.type === 'SORT_AND_FILTER_COMPLETE') {
        const { filteredData, sortedData } = e.data.payload;
        onComplete(filteredData, sortedData);
        setIsProcessing(false);
        workerRef.current?.removeEventListener('message', handleMessage);
      }
    };

    workerRef.current.addEventListener('message', handleMessage);

    const message: DataWorkerMessage = {
      type: 'SORT_AND_FILTER',
      payload: { data, sortConfig, filters }
    };

    workerRef.current.postMessage(message);
  }, []);

  return { processData, isProcessing };
};
