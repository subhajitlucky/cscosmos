import { describe, expect, it } from "vitest";
import {
  REVIEW_DECK,
  gradeCard,
  parseReviewState,
  type ReviewState,
} from "./review";

const fresh: ReviewState = { ease: 2.5, intervalDays: 0, due: 0, reps: 0, lapses: 0 };

describe("spaced repetition", () => {
  it("has a non-empty deck with unique ids", () => {
    expect(REVIEW_DECK.length).toBeGreaterThan(0);
    const ids = REVIEW_DECK.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("schedules a new card for tomorrow on good", () => {
    const next = gradeCard(undefined, "good");
    expect(next.intervalDays).toBe(1);
    expect(next.reps).toBe(1);
    expect(next.due).toBeGreaterThan(Date.now());
  });

  it("schedules easy cards further out than good", () => {
    const good = gradeCard(fresh, "good");
    const easy = gradeCard(fresh, "easy");
    expect(easy.intervalDays).toBeGreaterThan(good.intervalDays);
  });

  it("resets again cards to a short interval and lowers ease", () => {
    const next = gradeCard(fresh, "again");
    expect(next.intervalDays).toBeLessThan(1);
    expect(next.ease).toBeLessThan(fresh.ease);
    expect(next.lapses).toBe(1);
  });

  it("parses malformed state safely", () => {
    expect(parseReviewState("")).toEqual({});
    expect(parseReviewState("nope")).toEqual({});
  });
});
