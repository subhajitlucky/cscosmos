'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import type { Progress } from '../types';
import { steps } from '../data/learningPath';
import { TOPIC_SLUG } from '../data/topic';
import { setTopicCompleted } from '@/lib/local-learning';

interface ProgressContextType {
  progress: Progress;
  completeStep: (stepNumber: number) => void;
  resetProgress: () => void;
  isStepCompleted: (stepNumber: number) => boolean;
}

const DEFAULT_PROGRESS: Progress = { completedSteps: [] };
const STORAGE_KEY = 'programviz-progress';

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Progress;
          if (Array.isArray(parsed.completedSteps)) {
            setProgress({ completedSteps: parsed.completedSteps });
          }
        } catch {
          // ignore corrupted storage
        }
      }
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isHydrated]);

  // Keep the platform-level "topic completed" state in sync with the step path.
  useEffect(() => {
    if (!isHydrated) return;
    if (progress.completedSteps.length === steps.length && steps.length > 0) {
      setTopicCompleted(TOPIC_SLUG, true);
    }
  }, [isHydrated, progress.completedSteps.length]);

  const completeStep = (stepNumber: number) => {
    setProgress((prev) => {
      if (prev.completedSteps.includes(stepNumber)) return prev;
      return {
        ...prev,
        completedSteps: [...prev.completedSteps, stepNumber],
      };
    });
  };

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    setTopicCompleted(TOPIC_SLUG, false);
  };

  const isStepCompleted = (stepNumber: number) => {
    return progress.completedSteps.includes(stepNumber);
  };

  return (
    <ProgressContext.Provider value={{ progress, completeStep, resetProgress, isStepCompleted }}>
      {children}
    </ProgressContext.Provider>
  );
};

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
