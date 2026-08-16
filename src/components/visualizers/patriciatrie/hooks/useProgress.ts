import { useState } from 'react';

const getInitialProgress = (): string[] => {
  const saved = localStorage.getItem('pt-progress');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse progress', e);
    }
  }
  return [];
};

export const useProgress = () => {
  const [completedTopics, setCompletedTopics] = useState<string[]>(getInitialProgress);

  const markAsComplete = (topicId: string) => {
    if (!completedTopics.includes(topicId)) {
      const newProgress = [...completedTopics, topicId];
      setCompletedTopics(newProgress);
      localStorage.setItem('pt-progress', JSON.stringify(newProgress));
    }
  };

  const isCompleted = (topicId: string) => completedTopics.includes(topicId);

  return { completedTopics, markAsComplete, isCompleted };
};