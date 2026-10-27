import { useEffect, useState } from 'react';

const STORAGE_KEY = 'pt-progress';

const readStoredProgress = (): string[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
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
  // The server cannot read `localStorage`, so both the server render and the
  // client's first render start empty and the stored progress is adopted after
  // mount. Reading it inside the `useState` initialiser used to run on the render
  // path, which made every page using this hook impossible to pre-render.
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  useEffect(() => {
    setCompletedTopics(readStoredProgress());
  }, []);

  const markAsComplete = (topicId: string) => {
    if (!completedTopics.includes(topicId)) {
      const newProgress = [...completedTopics, topicId];
      setCompletedTopics(newProgress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    }
  };

  const isCompleted = (topicId: string) => completedTopics.includes(topicId);

  return { completedTopics, markAsComplete, isCompleted };
};
