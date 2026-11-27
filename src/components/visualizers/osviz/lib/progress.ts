'use client';

import { useCallback, useEffect, useState } from 'react';

export interface OSProgress {
  completedChapters: string[];
  solvedProblems: string[];
}

const STORAGE_KEY = 'cscosmos:osviz:progress:v1';
const UPDATE_EVENT = 'cscosmos:osviz:progress-updated';

const EMPTY_PROGRESS: OSProgress = {
  completedChapters: [],
  solvedProblems: [],
};

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readOSProgress(): OSProgress {
  if (!canUseStorage()) return EMPTY_PROGRESS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<OSProgress>;
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

export function writeOSProgress(progress: OSProgress): void {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // Storage can be unavailable; the UI stays usable.
  }
}

export function useOSProgress() {
  const [progress, setProgress] = useState<OSProgress>(EMPTY_PROGRESS);

  useEffect(() => {
    const sync = () => setProgress(readOSProgress());
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener(UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(UPDATE_EVENT, sync);
    };
  }, []);

  const markChapterComplete = useCallback((chapterId: string) => {
    const current = readOSProgress();
    if (current.completedChapters.includes(chapterId)) return;
    writeOSProgress({
      ...current,
      completedChapters: [...current.completedChapters, chapterId],
    });
  }, []);

  const markProblemSolved = useCallback((problemId: string) => {
    const current = readOSProgress();
    if (current.solvedProblems.includes(problemId)) return;
    writeOSProgress({
      ...current,
      solvedProblems: [...current.solvedProblems, problemId],
    });
  }, []);

  const resetProgress = useCallback(() => writeOSProgress(EMPTY_PROGRESS), []);

  return { progress, markChapterComplete, markProblemSolved, resetProgress };
}
