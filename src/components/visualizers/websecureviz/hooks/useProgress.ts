import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'websecureviz-progress';

/**
 * Progress lives in a module-level store rather than per-hook `useState`.
 *
 * `TopicLayout` and `LearningPathNavigator` both mount this hook independently, and
 * they stay mounted across client-side route changes. With local state, clicking
 * "Mark as Complete" updated only the caller: the button flipped to "Completed"
 * while the sidebar checkmarks stayed empty until a full page reload. A single
 * external store keeps every consumer in sync, and `useSyncExternalStore` gives
 * each of them the same snapshot.
 */
let completedSteps: number[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function read(): number[] {
  if (typeof window === 'undefined') return completedSteps;
  if (!hydrated) {
    hydrated = true;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          completedSteps = parsed.filter((n): n is number => typeof n === 'number');
        }
      }
    } catch (e) {
      console.error('Failed to parse progress', e);
    }
  }
  return completedSteps;
}

function write(next: number[]) {
  completedSteps = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.error('Failed to persist progress', e);
  }
  emit();
}

function subscribe(listener: () => void) {
  // Hydrate on first subscribe so the snapshot is stable during render.
  read();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => read();
// Must be a STABLE reference: returning a fresh [] on every call makes
// useSyncExternalStore re-render in a loop during hydration.
const EMPTY: number[] = [];
const getServerSnapshot = (): number[] => EMPTY;

export const useProgress = () => {
  const steps = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const markComplete = useCallback((stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) return;
    write([...completedSteps, stepNumber]);
  }, []);

  const isComplete = useCallback(
    (stepNumber: number) => steps.includes(stepNumber),
    [steps],
  );

  const getProgressPercentage = useCallback(
    (totalSteps: number) => Math.round((steps.length / totalSteps) * 100),
    [steps],
  );

  return { completedSteps: steps, markComplete, isComplete, getProgressPercentage };
};
