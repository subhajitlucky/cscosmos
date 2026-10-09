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

  const safeIndex = frameCount > 0 && index >= frameCount ? 0 : index;

  const next = useCallback(() => {
    if (frameCount === 0) return;
    setIndex((i) => (i + 1) % frameCount);
  }, [frameCount]);

  const prev = useCallback(() => {
    if (frameCount === 0) return;
    setIndex((i) => (i - 1 + frameCount) % frameCount);
  }, [frameCount]);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const toggle = useCallback(() => {
    if (frameCount < 2) return;
    setPlaying((p) => !p);
  }, [frameCount]);

  const goTo = useCallback((i: number) => {
    if (frameCount === 0) return;
    setIndex(Math.max(0, Math.min(frameCount - 1, i)));
  }, [frameCount]);

  useEffect(() => {
    clear();
    if (!playing || frameCount < 2) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPlaying(false);
      return;
    }
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % frameCount);
    }, 2200);
    return clear;
  }, [playing, frameCount, clear]);

  useEffect(() => clear, [clear]);

  return useMemo(
    () => ({ index: safeIndex, count: frameCount, playing, next, prev, reset, toggle, goTo }),
    [safeIndex, frameCount, playing, next, prev, reset, toggle, goTo],
  );
}
