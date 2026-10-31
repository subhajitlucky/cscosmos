import { describe, it, expect } from 'vitest';
import { AUTH_PROBLEMS, AUTH_PROBLEM_CATEGORIES } from './problems';
import { AUTH_TOPICS } from './topics';

describe('AuthCosmos Practice Problems Dataset', () => {
  it('contains exactly 60 curated problems (2 per topic)', () => {
    expect(AUTH_PROBLEMS.length).toBe(60);
  });

  it('has sequential IDs from 1 to 60', () => {
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

  it('covers all 30 topics across the curriculum with exactly 2 questions each', () => {
    const topicCountMap = new Map<string, number>();
    AUTH_PROBLEMS.forEach((p) => {
      topicCountMap.set(p.topicId, (topicCountMap.get(p.topicId) || 0) + 1);
    });

    AUTH_TOPICS.forEach((t) => {
      expect(topicCountMap.get(t.id)).toBe(2);
    });
  });

  it('defines valid categories', () => {
    expect(AUTH_PROBLEM_CATEGORIES.length).toBeGreaterThanOrEqual(6);
  });
});
