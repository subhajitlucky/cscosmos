import { describe, it, expect } from 'vitest';
import { WEB_PROTOCOL_PROBLEMS, WEB_PROTOCOL_CATEGORIES } from './problems';
import { topics } from './topics';

describe('Web Protocols 100 Practice Problems Dataset', () => {
  it('contains exactly 100 curated problems', () => {
    expect(WEB_PROTOCOL_PROBLEMS.length).toBe(100);
  });

  it('has sequential IDs from 1 to 100', () => {
    WEB_PROTOCOL_PROBLEMS.forEach((p, index) => {
      expect(p.id).toBe(index + 1);
    });
  });

  it('has valid structure for all problems', () => {
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    const validTopicIds = new Set(topics.map((t) => t.id));

    WEB_PROTOCOL_PROBLEMS.forEach((p) => {
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

  it('covers all 18 topics across the curriculum', () => {
    const coveredTopicIds = new Set(WEB_PROTOCOL_PROBLEMS.map((p) => p.topicId));
    topics.forEach((t) => {
      expect(coveredTopicIds.has(t.id)).toBe(true);
    });
  });

  it('has proper difficulty gradation', () => {
    const beginner = WEB_PROTOCOL_PROBLEMS.filter((p) => p.difficulty === 'Beginner');
    const intermediate = WEB_PROTOCOL_PROBLEMS.filter((p) => p.difficulty === 'Intermediate');
    const advanced = WEB_PROTOCOL_PROBLEMS.filter((p) => p.difficulty === 'Advanced');

    expect(beginner.length).toBeGreaterThanOrEqual(25);
    expect(intermediate.length).toBeGreaterThanOrEqual(40);
    expect(advanced.length).toBeGreaterThanOrEqual(10);
  });

  it('has valid categories mapping', () => {
    expect(WEB_PROTOCOL_CATEGORIES.length).toBe(18);
  });
});

