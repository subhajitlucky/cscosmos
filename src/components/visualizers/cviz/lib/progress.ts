'use client';

import { useCallback, useEffect, useState } from 'react';

export interface CProgress {
  completedChapters: string[];
  solvedProblems: string[];
}

const STORAGE_KEY = 'cscosmos:cviz:progress:v1';
const UPDATE_EVENT = 'cscosmos:cviz:progress-updated';

const EMPTY_PROGRESS: CProgress = {
  completedChapters: [],
  solvedProblems: [],
};

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readCProgress(): CProgress {
  if (!canUseStorage()) return EMPTY_PROGRESS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;

    const parsed = JSON.parse(raw) as Partial<CProgress>;
    return {
      completedChapters: Array.isArray(parsed.completedChapters)
        ? parsed.completedChapters
        : [],
      solvedProblems: Array.isArray(parsed.solvedProblems) ? parsed.solvedProblems : [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function writeCProgress(progress: CProgress): void {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // Storage can be unavailable (private mode or quota); the UI stays usable.
  }
}

export function useCProgress() {
  const [progress, setProgress] = useState<CProgress>(EMPTY_PROGRESS);

  useEffect(() => {
    const sync = () => setProgress(readCProgress());
    sync();

    window.addEventListener('storage', sync);
    window.addEventListener(UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(UPDATE_EVENT, sync);
    };
  }, []);

  const markChapterComplete = useCallback((chapterId: string) => {
    const current = readCProgress();
    if (current.completedChapters.includes(chapterId)) return;
    writeCProgress({
      ...current,
      completedChapters: [...current.completedChapters, chapterId],
    });
  }, []);

  const markProblemSolved = useCallback((problemId: string) => {
    const current = readCProgress();
    if (current.solvedProblems.includes(problemId)) return;
    writeCProgress({
      ...current,
      solvedProblems: [...current.solvedProblems, problemId],
    });
  }, []);

  const resetProgress = useCallback(() => {
    writeCProgress(EMPTY_PROGRESS);
  }, []);

  return {
    progress,
    markChapterComplete,
    markProblemSolved,
    resetProgress,
  };
}
