import { describe, expect, it } from 'vitest';
import { SCENARIOS, CHALLENGES } from './scenarios';

describe('network lab data', () => {
  it('ships three distinct scenarios with full hop paths', () => {
    expect(SCENARIOS.map((s) => s.id)).toEqual(['dns', 'http', 'ping']);
    for (const s of SCENARIOS) expect(s.hops.length).toBeGreaterThanOrEqual(6);
  });
  it('ships 20 graded challenges with valid answers', () => {
    expect(CHALLENGES).toHaveLength(20);
    for (const q of CHALLENGES) {
      expect(q.options).toHaveLength(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
      expect(q.explanation.length).toBeGreaterThan(60);
    }
  });
});
