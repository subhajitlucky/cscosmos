import { describe, it, expect } from 'vitest';
import {
  foundationSubtopics,
  foundationCategories,
  getFoundationSubtopic,
} from './foundations';

describe('AI Engineering Foundations Catalog', () => {
  it('contains exactly 26 subtopics', () => {
    expect(foundationSubtopics).toHaveLength(26);
  });

  it('has strictly sequential numbers from 1 to 26', () => {
    const numbers = foundationSubtopics.map((t) => t.number);
    const expected = Array.from({ length: 26 }, (_, i) => i + 1);
    expect(numbers).toEqual(expected);
  });

  it('has unique subtopic IDs', () => {
    const ids = foundationSubtopics.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('assigns valid categories from foundationCategories to every subtopic', () => {
    const validCategories = new Set(foundationCategories.filter((c) => c !== 'All'));
    for (const subtopic of foundationSubtopics) {
      expect(validCategories.has(subtopic.category)).toBe(true);
    }
  });

  it('ensures every subtopic has rich educational content', () => {
    for (const subtopic of foundationSubtopics) {
      expect(subtopic.title.trim().length).toBeGreaterThan(3);
      expect(subtopic.definition.trim().length).toBeGreaterThan(20);
      expect(subtopic.keyPoints.length).toBeGreaterThanOrEqual(2);
      expect(subtopic.analogy.trim().length).toBeGreaterThan(15);
      expect(subtopic.pitfall.trim().length).toBeGreaterThan(15);
      expect(subtopic.codeSnippet.trim().length).toBeGreaterThan(10);
      expect(subtopic.visualization).toBeDefined();
    }
  });

  it('correctly retrieves subtopic by ID with getFoundationSubtopic', () => {
    const first = getFoundationSubtopic('what-is-artificial-intelligence');
    expect(first).toBeDefined();
    expect(first?.number).toBe(1);
    expect(first?.title).toBe('What is Artificial Intelligence?');

    const last = getFoundationSubtopic('tiny-ai-pipeline-project');
    expect(last).toBeDefined();
    expect(last?.number).toBe(26);

    const nonExistent = getFoundationSubtopic('non-existent-subtopic');
    expect(nonExistent).toBeUndefined();
  });
});

describe('Micro-Model Computational Math & Activations', () => {
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
  const relu = (z: number) => Math.max(0, z);

  it('computes linear combination correctly z = w * x + b', () => {
    const w = 1.5;
    const x = 0.8;
    const b = -0.2;
    const z = w * x + b;
    expect(z).toBeCloseTo(1.0, 5);
  });

  it('evaluates sigmoid activation within bounded (0, 1) probability range', () => {
    expect(sigmoid(0)).toBeCloseTo(0.5, 5);
    expect(sigmoid(10)).toBeGreaterThan(0.999);
    expect(sigmoid(-10)).toBeLessThan(0.001);
  });

  it('evaluates ReLU activation with non-linear threshold at zero', () => {
    expect(relu(5.2)).toBe(5.2);
    expect(relu(0)).toBe(0);
    expect(relu(-3.7)).toBe(0);
  });

  it('correctly classifies outcomes against decision threshold', () => {
    const threshold = 0.5;
    const predict = (prob: number) => (prob >= threshold ? 'POSITIVE' : 'NEGATIVE');
    expect(predict(0.51)).toBe('POSITIVE');
    expect(predict(0.50)).toBe('POSITIVE');
    expect(predict(0.49)).toBe('NEGATIVE');
  });
});
