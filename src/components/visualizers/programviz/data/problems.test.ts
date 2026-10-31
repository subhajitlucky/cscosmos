import { describe, it, expect } from 'vitest';
import { PROGRAM_PROBLEMS, TOPIC_CATEGORIES } from './problems';

describe('Program Cosmos 100 Practice Questions', () => {
  it('contains exactly 100 problems', () => {
    expect(PROGRAM_PROBLEMS).toHaveLength(100);
  });

  it('has sequential IDs from 1 to 100', () => {
    PROGRAM_PROBLEMS.forEach((problem, index) => {
      expect(problem.id).toBe(index + 1);
    });
  });

  it('validates options and correctIndex for all 100 questions', () => {
    PROGRAM_PROBLEMS.forEach((problem) => {
      expect(problem.options).toHaveLength(4);
      expect(problem.correctIndex).toBeGreaterThanOrEqual(0);
      expect(problem.correctIndex).toBeLessThan(4);
      expect(problem.question.trim().length).toBeGreaterThan(10);
      expect(problem.explanation.trim().length).toBeGreaterThan(15);
      expect(['Beginner', 'Intermediate', 'Advanced']).toContain(problem.difficulty);
      expect(problem.topicNumber).toBeGreaterThanOrEqual(1);
      expect(problem.topicNumber).toBeLessThanOrEqual(10);
    });
  });

  it('covers all 10 curriculum topics with 10 questions each', () => {
    expect(TOPIC_CATEGORIES).toHaveLength(10);

    for (let topicNum = 1; topicNum <= 10; topicNum++) {
      const topicProblems = PROGRAM_PROBLEMS.filter((p) => p.topicNumber === topicNum);
      expect(topicProblems).toHaveLength(10);
    }
  });
});
