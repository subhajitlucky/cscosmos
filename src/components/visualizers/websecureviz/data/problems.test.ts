import { describe, it, expect } from 'vitest';
import { SECURITY_PROBLEMS, SECURITY_CATEGORIES } from './problems';
import { securityTopics } from './topics';

describe('Web Security Problems Dataset', () => {
  it('should have at least 50 problems', () => {
    expect(SECURITY_PROBLEMS.length).toBeGreaterThanOrEqual(50);
  });

  it('should have unique, consecutive problem IDs starting at 1', () => {
    const ids = SECURITY_PROBLEMS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(SECURITY_PROBLEMS.length);

    for (let i = 0; i < SECURITY_PROBLEMS.length; i++) {
      expect(SECURITY_PROBLEMS[i].id).toBe(i + 1);
    }
  });

  it('should associate each problem with a valid topicId from securityTopics', () => {
    const validTopicIds = new Set(securityTopics.map((t) => t.id));
    for (const problem of SECURITY_PROBLEMS) {
      expect(validTopicIds.has(problem.topicId)).toBe(true);
    }
  });

  it('should associate each problem with a known category', () => {
    const categoryNames = new Set(SECURITY_CATEGORIES.map((c) => c.name));
    for (const problem of SECURITY_PROBLEMS) {
      expect(categoryNames.has(problem.category)).toBe(true);
    }
  });

  it('should have valid difficulty, 4 options, a valid correctIndex, and non-empty explanation', () => {
    for (const problem of SECURITY_PROBLEMS) {
      expect(['Beginner', 'Intermediate', 'Advanced']).toContain(problem.difficulty);
      expect(problem.options.length).toBeGreaterThanOrEqual(2);
      expect(problem.correctIndex).toBeGreaterThanOrEqual(0);
      expect(problem.correctIndex).toBeLessThan(problem.options.length);
      expect(problem.question.trim().length).toBeGreaterThan(10);
      expect(problem.explanation.trim().length).toBeGreaterThan(15);
      // Ensure all options are non-empty strings
      for (const opt of problem.options) {
        expect(opt.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
