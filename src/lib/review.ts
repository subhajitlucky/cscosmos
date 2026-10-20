import { interviewQuestions } from "@/data/interview";

export interface ReviewCard {
  id: string;
  front: string;
  back: string;
  meta: string;
  href: string;
}

export interface ReviewState {
  ease: number;
  intervalDays: number;
  due: number;
  reps: number;
  lapses: number;
}

export type ReviewGrade = "again" | "hard" | "good" | "easy";

export const REVIEW_KEY = "cscosmos:review:v1";
export const REVIEW_EVENT = "cscosmos:review-updated";

export const REVIEW_DECK: ReviewCard[] = interviewQuestions.map((question) => ({
  id: `question:${question.category}/${question.slug}`,
  front: question.title,
  back: question.mentalModel,
  meta: `${question.category} · ${question.difficulty} · ${(question.companies ?? []).slice(0, 2).join(", ")}`,
  href: `/interview/${question.category}/${question.slug}`,
}));

export function parseReviewState(raw: string): Record<string, ReviewState> {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, ReviewState>) : {};
  } catch {
    return {};
  }
}

export function getReviewSnapshot(): string {
  try {
    return window.localStorage.getItem(REVIEW_KEY) ?? "";
  } catch {
    return "";
  }
}

export function subscribeReview(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(REVIEW_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(REVIEW_EVENT, callback);
  };
}

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export function gradeCard(
  state: ReviewState | undefined,
  grade: ReviewGrade
): ReviewState {
  const current: ReviewState =
    state ?? { ease: 2.5, intervalDays: 0, due: 0, reps: 0, lapses: 0 };

  let ease = current.ease;
  let intervalDays = current.intervalDays;
  let lapses = current.lapses;

  if (grade === "again") {
    ease = Math.max(1.3, ease - 0.2);
    intervalDays = 10 / (24 * 60);
    lapses += 1;
  } else if (grade === "hard") {
    ease = Math.max(1.3, ease - 0.15);
    intervalDays = Math.max(1, intervalDays * 1.2);
  } else if (grade === "good") {
    intervalDays = intervalDays === 0 ? 1 : Math.max(1, intervalDays * ease);
  } else {
    ease = Math.min(3.2, ease + 0.15);
    intervalDays = intervalDays === 0 ? 3 : Math.max(3, intervalDays * ease * 1.3);
  }

  const dueInMs =
    grade === "again"
      ? 10 * MINUTE
      : intervalDays * DAY;

  return {
    ease,
    intervalDays,
    due: Date.now() + dueInMs,
    reps: current.reps + 1,
    lapses,
  };
}

export function saveReviewState(
  all: Record<string, ReviewState>,
  id: string,
  state: ReviewState
): void {
  const next = { ...all, [id]: state };
  try {
    window.localStorage.setItem(REVIEW_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(REVIEW_EVENT));
  } catch {
    // Storage can be unavailable; review still works for the current session.
  }
}
