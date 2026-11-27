'use client';

import { useCallback, useEffect, useState } from 'react';

export interface ITProgress {
  completedChapters: string[];
  solvedProblems: string[];
}

const STORAGE_KEY = 'cscosmos:itviz:progress:v1';
const UPDATE_EVENT = 'cscosmos:itviz:progress-updated';
const EMPTY_PROGRESS: ITProgress = { completedChapters: [], solvedProblems: [] };

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readITProgress(): ITProgress {
  if (!canUseStorage()) return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ITProgress>;
    return {
      completedChapters: Array.isArray(parsed.completedChapters) ? parsed.completedChapters : [],
      solvedProblems: Array.isArray(parsed.solvedProblems) ? parsed.solvedProblems : [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function writeITProgress(progress: ITProgress): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // Storage can be unavailable; the module remains usable.
  }
}

export function useITProgress() {
  const [progress, setProgress] = useState<ITProgress>(EMPTY_PROGRESS);

  useEffect(() => {
    const sync = () => setProgress(readITProgress());
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener(UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(UPDATE_EVENT, sync);
    };
  }, []);

  const markChapterComplete = useCallback((chapterId: string) => {
    const current = readITProgress();
    if (current.completedChapters.includes(chapterId)) return;
    writeITProgress({
      ...current,
      completedChapters: [...current.completedChapters, chapterId],
    });
  }, []);

  const markProblemSolved = useCallback((problemId: string) => {
    const current = readITProgress();
    if (current.solvedProblems.includes(problemId)) return;
    writeITProgress({
      ...current,
      solvedProblems: [...current.solvedProblems, problemId],
    });
  }, []);

  const resetProgress = useCallback(() => writeITProgress(EMPTY_PROGRESS), []);

  return { progress, markChapterComplete, markProblemSolved, resetProgress };
}
