import { describe, expect, it } from "vitest";
import { domains } from "./domains";
import { exercises } from "./exercises";

const DOMAIN_KEYS = new Set(domains.map((domain) => domain.domainKey));

describe("exercise catalog", () => {
  it("has unique ids", () => {
    const ids = exercises.map((exercise) => exercise.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every exercise is complete and auto-gradable", () => {
    for (const exercise of exercises) {
      expect(DOMAIN_KEYS.has(exercise.domain), `${exercise.id} domain`).toBe(true);
      expect(['beginner', 'intermediate', 'advanced']).toContain(exercise.difficulty);
      expect(exercise.prompt.length).toBeGreaterThan(10);
      expect(exercise.options.length).toBeGreaterThanOrEqual(2);
      expect(exercise.answer).toBeGreaterThanOrEqual(0);
      expect(exercise.answer).toBeLessThan(exercise.options.length);
      expect(exercise.explanation.length).toBeGreaterThan(30);
    }
  });

  it("covers more than one domain", () => {
    expect(new Set(exercises.map((exercise) => exercise.domain)).size).toBeGreaterThan(3);
  });
});
