import { describe, expect, it } from "vitest";
import {
  validNotes,
  validStringArray,
  validVisited,
} from "./route";

describe("learning payload validation", () => {
  it("validates string arrays within length and item bounds", () => {
    expect(validStringArray(["reactcosmos", "jsviz"], 5)).toBe(true);
    expect(validStringArray([], 5)).toBe(true);
    expect(validStringArray(["a".repeat(161)], 5)).toBe(false);
    expect(validStringArray([""], 5)).toBe(false);
    expect(validStringArray([123], 5)).toBe(false);
    expect(validStringArray(["a", "b", "c"], 2)).toBe(false);
  });

  it("validates notes with key and value bounds", () => {
    expect(validNotes({ "reactcosmos": "useState notes" })).toBe(true);
    expect(validNotes({})).toBe(true);
    expect(validNotes(null)).toBe(false);
    expect(validNotes("string")).toBe(false);
    expect(validNotes({ ["a".repeat(121)]: "text" })).toBe(false);
    expect(validNotes({ "slug": "a".repeat(20001) })).toBe(false);

    const tooManyKeys: Record<string, string> = {};
    for (let i = 0; i < 501; i++) {
      tooManyKeys[`key-${i}`] = "val";
    }
    expect(validNotes(tooManyKeys, 500)).toBe(false);
  });

  it("validates visited timestamps with key and number bounds", () => {
    expect(validVisited({ "reactcosmos": Date.now() })).toBe(true);
    expect(validVisited({})).toBe(true);
    expect(validVisited(null)).toBe(false);
    expect(validVisited({ "reactcosmos": -1 })).toBe(false);
    expect(validVisited({ "reactcosmos": Infinity })).toBe(false);
    expect(validVisited({ "reactcosmos": "not-a-number" })).toBe(false);

    const tooManyKeys: Record<string, number> = {};
    for (let i = 0; i < 501; i++) {
      tooManyKeys[`key-${i}`] = 1000;
    }
    expect(validVisited(tooManyKeys, 500)).toBe(false);
  });
});
