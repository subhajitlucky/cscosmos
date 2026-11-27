'use client';

import { useCallback, useEffect, useState } from 'react';

export interface DBMSProgress {
  completedChapters: string[];
  solvedProblems: string[];
}

const STORAGE_KEY = 'cscosmos:dbmsviz:progress:v1';
const UPDATE_EVENT = 'cscosmos:dbmsviz:progress-updated';

const EMPTY_PROGRESS: DBMSProgress = { completedChapters: [], solvedProblems: [] };

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readDBMSProgress(): DBMSProgress {
  if (!canUseStorage()) return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<DBMSProgress>;
    return {
      completedChapters: Array.isArray(parsed.completedChapters) ? parsed.completedChapters : [],
      solvedProblems: Array.isArray(parsed.solvedProblems) ? parsed.solvedProblems : [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function writeDBMSProgress(progress: DBMSProgress): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // Storage can be unavailable; the UI stays usable.
  }
}

export function useDBMSProgress() {
  const [progress, setProgress] = useState<DBMSProgress>(EMPTY_PROGRESS);

  useEffect(() => {
    const sync = () => setProgress(readDBMSProgress());
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener(UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(UPDATE_EVENT, sync);
    };
  }, []);

  const markChapterComplete = useCallback((chapterId: string) => {
    const current = readDBMSProgress();
    if (current.completedChapters.includes(chapterId)) return;
    writeDBMSProgress({
      ...current,
      completedChapters: [...current.completedChapters, chapterId],
    });
  }, []);

  const markProblemSolved = useCallback((problemId: string) => {
    const current = readDBMSProgress();
    if (current.solvedProblems.includes(problemId)) return;
    writeDBMSProgress({
      ...current,
      solvedProblems: [...current.solvedProblems, problemId],
    });
  }, []);

  const resetProgress = useCallback(() => writeDBMSProgress(EMPTY_PROGRESS), []);

  return { progress, markChapterComplete, markProblemSolved, resetProgress };
}
