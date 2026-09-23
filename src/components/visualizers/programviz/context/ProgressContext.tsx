'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import type { Progress } from '../types';

interface ProgressContextType {
  progress: Progress;
  completeStep: (stepNumber: number) => void;
  isStepCompleted: (stepNumber: number) => boolean;
}

const DEFAULT_PROGRESS: Progress = { completedSteps: [], currentStep: 1 };

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('programviz-progress');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Progress;
          if (Array.isArray(parsed.completedSteps)) {
            setProgress(parsed);
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
      localStorage.setItem('programviz-progress', JSON.stringify(progress));
    }
  }, [progress, isHydrated]);

  const completeStep = (stepNumber: number) => {
    setProgress((prev) => {
      if (prev.completedSteps.includes(stepNumber)) return prev;
      return {
        ...prev,
        completedSteps: [...prev.completedSteps, stepNumber],
      };
    });
  };

  const isStepCompleted = (stepNumber: number) => {
    return progress.completedSteps.includes(stepNumber);
  };

  return (
    <ProgressContext.Provider value={{ progress, completeStep, isStepCompleted }}>
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
