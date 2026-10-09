'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface FramePlayer {
  index: number;
  count: number;
  playing: boolean;
  atEnd: boolean;
  next: () => void;
  prev: () => void;
  reset: () => void;
  toggle: () => void;
  goTo: (i: number) => void;
}

interface FramePlayerOptions {
  /** Auto-play the sequence on mount (default true). */
  autoPlay?: boolean;
  /** How long each frame is held before advancing, in ms. */
  frameDuration?: number;
}

export function useFramePlayer(frameCount: number, options: FramePlayerOptions = {}): FramePlayer {
  const { autoPlay = true, frameDuration = 2800 } = options;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const safeIndex = frameCount > 0 && index >= frameCount ? 0 : index;

  const next = useCallback(() => {
    if (frameCount === 0) return;
    setIndex((i) => Math.min(i + 1, frameCount - 1));
  }, [frameCount]);

  const prev = useCallback(() => {
    if (frameCount === 0) return;
    setIndex((i) => Math.max(0, i - 1));
  }, [frameCount]);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const toggle = useCallback(() => {
    if (frameCount < 2) return;
    setPlaying((p) => {
      if (p) return false;
      setIndex((i) => (i >= frameCount - 1 ? 0 : i));
      return true;
    });
  }, [frameCount]);

  const goTo = useCallback(
    (i: number) => {
      if (frameCount === 0) return;
      setIndex(Math.max(0, Math.min(frameCount - 1, i)));
    },
    [frameCount],
  );

  useEffect(() => {
    clear();
    if (!playing || frameCount < 2 || safeIndex >= frameCount - 1) {
      if (playing && frameCount >= 2 && safeIndex >= frameCount - 1) setPlaying(false);
      return;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, frameCount - 1));
    }, frameDuration);
    return clear;
  }, [playing, safeIndex, frameCount, frameDuration, clear]);

  useEffect(() => clear, [clear]);

  return useMemo(
    () => ({
      index: safeIndex,
      count: frameCount,
      playing,
      atEnd: frameCount > 0 && safeIndex >= frameCount - 1,
      next,
      prev,
      reset,
      toggle,
      goTo,
    }),
    [safeIndex, frameCount, playing, next, prev, reset, toggle, goTo],
  );
}
