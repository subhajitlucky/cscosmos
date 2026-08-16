import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useSimulation() {
  const tick = useStore((state: any) => state.tick);
  const isPaused = useStore((state: any) => state.isPaused);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      tick();
    }, 100);

    return () => clearInterval(interval);
  }, [tick, isPaused]);
}
