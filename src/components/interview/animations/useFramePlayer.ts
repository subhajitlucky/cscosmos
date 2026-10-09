'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface FramePlayer {
  index: number;
  count: number;
  playing: boolean;
  next: () => void;
  prev: () => void;
  reset: () => void;
  toggle: () => void;
  goTo: (i: number) => void;
}

export function useFramePlayer(frameCount: number, autoPlay = false): FramePlayer {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % frameCount);
  }, [frameCount]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + frameCount) % frameCount);
  }, [frameCount]);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const toggle = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  const goTo = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(frameCount - 1, i)));
  }, [frameCount]);

  useEffect(() => {
    clear();
    if (!playing || frameCount < 2) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % frameCount);
    }, 2200);
    return clear;
  }, [playing, frameCount, clear]);

  useEffect(() => clear, [clear]);

  return useMemo(
    () => ({ index, count: frameCount, playing, next, prev, reset, toggle, goTo }),
    [index, frameCount, playing, next, prev, reset, toggle, goTo],
  );
}
