import { useState, useEffect } from 'react';

export const useProgress = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('websecureviz-progress');
    if (stored) {
      try {
        setCompletedSteps(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  const markComplete = (stepNumber: number) => {
    setCompletedSteps(prev => {
      if (prev.includes(stepNumber)) return prev;
      const newSteps = [...prev, stepNumber];
      localStorage.setItem('websecureviz-progress', JSON.stringify(newSteps));
      return newSteps;
    });
  };

  const isComplete = (stepNumber: number) => completedSteps.includes(stepNumber);

  const getProgressPercentage = (totalSteps: number) => {
    return Math.round((completedSteps.length / totalSteps) * 100);
  };

  return { completedSteps, markComplete, isComplete, getProgressPercentage };
};
