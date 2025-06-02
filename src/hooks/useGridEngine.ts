
import { useEffect, useRef, useState } from 'react';
import { GridEngine, GridState, GridConfig } from '@/engines/GridEngine';

export const useGridEngine = (initialData: any[], config?: Partial<GridConfig>) => {
  const engineRef = useRef<GridEngine | null>(null);
  const [state, setState] = useState<GridState | null>(null);

  useEffect(() => {
    engineRef.current = new GridEngine(initialData, config);
    
    const unsubscribe = engineRef.current.subscribe(setState);
    setState(engineRef.current.getState());

    return () => {
      unsubscribe();
      engineRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateData(initialData);
    }
  }, [initialData]);

  return {
    state,
    engine: engineRef.current,
    isProcessing: engineRef.current?.isProcessingData() || false
  };
};
