'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import type { Progress } from '../types';

interface ProgressContextType {
  progress: Progress;
  completeStep: (stepNumber: number) => void;
  isStepCompleted: (stepNumber: number) => boolean;
}

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Progress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('programviz-progress');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return { completedSteps: [], currentStep: 1 };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('programviz-progress', JSON.stringify(progress));
    }
  }, [progress]);

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
