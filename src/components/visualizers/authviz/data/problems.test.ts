import { describe, it, expect } from 'vitest';
import { AUTH_PROBLEMS, AUTH_PROBLEM_CATEGORIES } from './problems';
import { AUTH_TOPICS } from './topics';

describe('AuthCosmos Practice Problems Dataset', () => {
  it('contains exactly 50 curated problems', () => {
    expect(AUTH_PROBLEMS.length).toBe(50);
  });

  it('has sequential IDs from 1 to 50', () => {
    AUTH_PROBLEMS.forEach((p, index) => {
      expect(p.id).toBe(index + 1);
    });
  });

  it('has valid structure for all problems', () => {
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const validTopicIds = new Set(AUTH_TOPICS.map((t) => t.id));

    AUTH_PROBLEMS.forEach((p) => {
      expect(p.question.trim().length).toBeGreaterThan(10);
      expect(p.options).toHaveLength(4);
      p.options.forEach((opt) => {
        expect(opt.trim().length).toBeGreaterThan(0);
      });
      expect(p.correctIndex).toBeGreaterThanOrEqual(0);
      expect(p.correctIndex).toBeLessThan(4);
      expect(p.explanation.trim().length).toBeGreaterThan(10);
      expect(validDifficulties).toContain(p.difficulty);
      expect(validTopicIds.has(p.topicId)).toBe(true);
    });
  });

  it('covers all 19 topics across the curriculum', () => {
    const coveredTopicIds = new Set(AUTH_PROBLEMS.map((p) => p.topicId));
    AUTH_TOPICS.forEach((t) => {
      expect(coveredTopicIds.has(t.id)).toBe(true);
    });
  });

  it('defines valid categories', () => {
    expect(AUTH_PROBLEM_CATEGORIES.length).toBeGreaterThanOrEqual(6);
  });
});
