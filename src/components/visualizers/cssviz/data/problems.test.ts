import { describe, it, expect } from 'vitest';
import { cssProblems } from './problems';

describe('cssProblems dataset', () => {
  it('contains exactly 100 CSS problems', () => {
    expect(cssProblems).toHaveLength(100);
  });

  it('has strictly sequential IDs from 1 to 100', () => {
    cssProblems.forEach((problem, index) => {
      expect(problem.id).toBe(index + 1);
    });
  });

  it('has valid metadata, target HTML, and at least 2 test cases per problem', () => {
    cssProblems.forEach((p) => {
      expect(p.title.trim().length).toBeGreaterThan(0);
      expect(p.description.trim().length).toBeGreaterThan(0);
      expect(['Easy', 'Medium', 'Hard']).toContain(p.difficulty);
      expect(p.category.trim().length).toBeGreaterThan(0);
      expect(p.targetHtml.trim().length).toBeGreaterThan(0);
      expect(p.solution.trim().length).toBeGreaterThan(0);
      expect(p.testCases.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('ensures every problem solution passes all its test cases', () => {
    const failures: { id: number; title: string; failedTest: string }[] = [];

    cssProblems.forEach((p) => {
      p.testCases.forEach((test) => {
        const passed = test.check(p.solution);
        if (!passed) {
          failures.push({
            id: p.id,
            title: p.title,
            failedTest: test.description,
          });
        }
      });
    });

    expect(failures).toEqual([]);
  });
});
