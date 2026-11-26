import { describe, it, expect } from 'vitest';
import {
  computerOrganizationChapters,
  getChapter,
  INTERACTIVE_KEYS,
} from './chapters';

describe('Computer Organization chapter catalog', () => {
  it('contains exactly 8 original chapters', () => {
    expect(computerOrganizationChapters).toHaveLength(8);
  });

  it('has unique chapter ids and sequential numbers 1..8', () => {
    const ids = computerOrganizationChapters.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(computerOrganizationChapters.map((c) => c.number)).toEqual(
      Array.from({ length: 8 }, (_, i) => i + 1),
    );
  });

  it('gives every chapter deep, structured content', () => {
    for (const c of computerOrganizationChapters) {
      expect(c.title.trim().length).toBeGreaterThan(3);
      expect(c.summary.trim().length).toBeGreaterThan(40);
      expect(c.intuition.trim().length).toBeGreaterThan(80);
      expect(c.formalModel.trim().length).toBeGreaterThan(80);
      expect(c.workedExample.steps.length).toBeGreaterThanOrEqual(3);
      expect(c.misconceptions.length).toBeGreaterThanOrEqual(2);
      expect(c.takeaways.length).toBeGreaterThanOrEqual(3);
      expect(INTERACTIVE_KEYS.has(c.interactive)).toBe(true);
    }
  });

  it('uses each interactive key exactly once', () => {
    const usedKeys = computerOrganizationChapters.map((c) => c.interactive);
    expect(new Set(usedKeys).size).toBe(usedKeys.length);
    expect(usedKeys).toHaveLength(INTERACTIVE_KEYS.size);
    for (const key of INTERACTIVE_KEYS) {
      expect(usedKeys.filter((used) => used === key)).toHaveLength(1);
    }
  });

  it('retrieves a chapter by id and returns undefined for unknown ids', () => {
    expect(getChapter('instruction-cycle')?.number).toBe(4);
    expect(getChapter('does-not-exist')).toBeUndefined();
  });
});
