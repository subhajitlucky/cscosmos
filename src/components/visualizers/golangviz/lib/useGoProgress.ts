'use client';

import { useState, useEffect, useCallback } from 'react';
import { allConcepts } from '../data/concepts-data';

const STORAGE_KEY = 'cscosmos_golangviz_progress';

export interface ProgressState {
  completed: Record<string, boolean>; // slug -> boolean
  quizScores: Record<string, number>; // slug -> score percentage
  lastVisitedSlug: string | null;
}

const DEFAULT_STATE: ProgressState = {
  completed: {},
  quizScores: {},
  lastVisitedSlug: null,
};

export function useGoProgress() {
  const [state, setState] = useState<ProgressState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (SSR safe)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState(parsed);
      }
    } catch {
      // ignore JSON parse or localStorage security errors
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  const saveState = useCallback((newState: ProgressState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      // Dispatch custom event so other components on page re-render instantly
      window.dispatchEvent(new Event('golangviz_progress_updated'));
    } catch {
      // ignore storage errors
    }
  }, []);

  // Listen to cross-component sync
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setState(JSON.parse(raw));
        }
      } catch (e) {
        void e;
      }
    };
    window.addEventListener('golangviz_progress_updated', handleUpdate);
    return () => window.removeEventListener('golangviz_progress_updated', handleUpdate);
  }, []);

  const markCompleted = useCallback(
    (slug: string) => {
      saveState({
        ...state,
        completed: { ...state.completed, [slug]: true },
        lastVisitedSlug: slug,
      });
    },
    [state, saveState]
  );

  const toggleCompleted = useCallback(
    (slug: string) => {
      const isDone = !!state.completed[slug];
      const nextCompleted = { ...state.completed };
      if (isDone) {
        delete nextCompleted[slug];
      } else {
        nextCompleted[slug] = true;
      }
      saveState({
        ...state,
        completed: nextCompleted,
        lastVisitedSlug: slug,
      });
    },
    [state, saveState]
  );

  const recordVisit = useCallback(
    (slug: string) => {
      if (state.lastVisitedSlug !== slug) {
        saveState({
          ...state,
          lastVisitedSlug: slug,
        });
      }
    },
    [state, saveState]
  );

  const isCompleted = useCallback(
    (slug: string) => {
      return !!state.completed[slug];
    },
    [state.completed]
  );

  // Compute metrics
  const totalConcepts = allConcepts.length;
  const completedCount = Object.keys(state.completed).filter(Boolean).length;
  const percentage = Math.round((completedCount / totalConcepts) * 100);

  // Find next uncompleted concept
  const nextUncompletedConcept = allConcepts.find((c) => !state.completed[c.slug]) || allConcepts[0];

  return {
    isLoaded,
    completed: state.completed,
    lastVisitedSlug: state.lastVisitedSlug,
    markCompleted,
    toggleCompleted,
    recordVisit,
    isCompleted,
    totalConcepts,
    completedCount,
    percentage,
    nextUncompletedConcept,
  };
}
