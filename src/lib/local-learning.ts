export interface LearningState {
  bookmarks: string[];
  completed: string[];
  visited: Record<string, number>;
}

export const LEARNING_STORAGE_KEY = "cscosmos:learning:v1";
export const LEARNING_EVENT = "cscosmos:learning-updated";

const EMPTY_STATE: LearningState = {
  bookmarks: [],
  completed: [],
  visited: {},
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readLearningState(): LearningState {
  if (!canUseStorage()) return EMPTY_STATE;

  try {
    const raw = window.localStorage.getItem(LEARNING_STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<LearningState>;
    return {
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      visited:
        parsed.visited && typeof parsed.visited === "object"
          ? (parsed.visited as Record<string, number>)
          : {},
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function writeLearningState(state: LearningState): void {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event(LEARNING_EVENT));
  } catch {
    // Storage can be unavailable (private mode/quota); the UI stays usable.
  }
}

export function toggleBookmark(slug: string): LearningState {
  const state = readLearningState();
  const bookmarks = state.bookmarks.includes(slug)
    ? state.bookmarks.filter((id) => id !== slug)
    : [...state.bookmarks, slug];
  const next = { ...state, bookmarks };
  writeLearningState(next);
  return next;
}

export function toggleCompleted(slug: string): LearningState {
  const state = readLearningState();
  const completed = state.completed.includes(slug)
    ? state.completed.filter((id) => id !== slug)
    : [...state.completed, slug];
  const next = { ...state, completed };
  writeLearningState(next);
  return next;
}

export function markVisited(slug: string): LearningState {
  const state = readLearningState();
  const next = {
    ...state,
    visited: { ...state.visited, [slug]: Date.now() },
  };
  writeLearningState(next);
  return next;
}

function dayKey(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getCurrentStreak(visited: Record<string, number>): number {
  const days = new Set(Object.values(visited).map(dayKey));
  if (days.size === 0) return 0;

  const cursor = new Date();
  let streak = 0;

  for (let i = 0; i < 3650; i += 1) {
    if (!days.has(dayKey(cursor.getTime()))) {
      if (i === 0) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getLongestStreak(visited: Record<string, number>): number {
  const days = [...new Set(Object.values(visited).map(dayKey))].sort();
  if (days.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < days.length; i += 1) {
    const prev = new Date(days[i - 1]).getTime();
    const next = new Date(days[i]).getTime();
    if (next - prev === 24 * 60 * 60 * 1000) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}
