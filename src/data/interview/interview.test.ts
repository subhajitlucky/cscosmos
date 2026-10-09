import { describe, expect, it } from 'vitest';
import {
  DIFFICULTIES,
  FREQUENCIES,
  QUESTION_TYPES,
  ROUNDS,
  categories,
  getAdjacentQuestions,
  getCategoryByKey,
  getCategoryFacets,
  getQuestion,
  getQuestionsByCategory,
  interviewQuestions,
} from './index';

const VALID_ANIMATION_KINDS = [
  'step-flow',
  'code-trace',
  'timeline',
  'before-after',
  'memory-diagram',
  'custom',
];

describe('interview categories', () => {
  it('has exactly the five v1 categories with unique keys', () => {
    expect(categories.map((c) => c.key).sort()).toEqual(
      ['ai-ml', 'cybersecurity', 'dsa', 'fullstack', 'system-design'].sort(),
    );
  });

  it('every category has a description, accent and topics', () => {
    for (const c of categories) {
      expect(c.description.length).toBeGreaterThan(20);
      expect(c.accent).toMatch(/^text-/);
      expect(c.topics.length).toBeGreaterThan(0);
    }
  });
});

describe('interview questions', () => {
  it('has unique category+slug pairs', () => {
    const keys = interviewQuestions.map((q) => `${q.category}/${q.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('every question is valid and complete', () => {
    for (const q of interviewQuestions) {
      expect(getCategoryByKey(q.category), `unknown category for ${q.slug}`).toBeDefined();
      expect(DIFFICULTIES).toContain(q.difficulty);
      expect(FREQUENCIES).toContain(q.frequency);
      expect(ROUNDS).toContain(q.round);
      expect(QUESTION_TYPES).toContain(q.type);
      expect(q.oneLiner.length).toBeGreaterThan(20);
      expect(q.whyAsked.length).toBeGreaterThan(40);
      expect(q.mentalModel.length).toBeGreaterThan(40);
      expect(q.edgeCases.length).toBeGreaterThanOrEqual(2);
      expect(q.followUps.length).toBeGreaterThanOrEqual(2);
      if (q.relatedEngine) expect(q.relatedEngine.href.startsWith('/')).toBe(true);
    }
  });

  it('every question topic belongs to its category taxonomy', () => {
    for (const q of interviewQuestions) {
      const category = getCategoryByKey(q.category)!;
      expect(category.topics, `topic "${q.topic}" not in ${q.category}`).toContain(q.topic);
    }
  });

  it('every question has at least 5 steps, each with an animation', () => {
    for (const q of interviewQuestions) {
      expect(q.steps.length, `${q.slug} step count`).toBeGreaterThanOrEqual(5);
      for (const step of q.steps) {
        expect(step.title.length).toBeGreaterThan(3);
        expect(step.body.length).toBeGreaterThan(60);
        expect(VALID_ANIMATION_KINDS).toContain(step.animation.kind);
      }
    }
  });

  it('every category has at least 3 questions, each animation with >=3 frames', () => {
    for (const c of categories) {
      const qs = getQuestionsByCategory(c.key);
      expect(qs.length, `${c.key} question count`).toBeGreaterThanOrEqual(3);
      for (const q of qs) {
        for (const step of q.steps) {
          if (
            step.animation.kind !== 'custom'
          ) {
            const frames =
              step.animation.kind === 'step-flow' ? step.animation.phases : step.animation.frames;
            expect(frames.length, `${q.slug} frames`).toBeGreaterThanOrEqual(3);
          }
        }
      }
    }
  });
});

describe('interview aggregation helpers', () => {
  it('getCategoryFacets count and topic buckets are consistent with the question list', () => {
    for (const c of categories) {
      const questions = getQuestionsByCategory(c.key);
      const facets = getCategoryFacets(c.key);
      expect(facets.count).toBe(questions.length);
      const bucketTotal = facets.topics.reduce((sum, t) => sum + t.count, 0);
      expect(bucketTotal, `${c.key} topic bucket total`).toBe(facets.count);
      const values = facets.topics.map((t) => t.value);
      expect([...values].sort(), `${c.key} topics sorted`).toEqual(values);
    }
  });

  it('getAdjacentQuestions returns empty object for unknown slug', () => {
    expect(getAdjacentQuestions('fullstack', 'does-not-exist')).toEqual({});
  });

  it('getQuestion returns undefined for unknown slug', () => {
    expect(getQuestion('fullstack', 'does-not-exist')).toBeUndefined();
  });

  it('getCategoryByKey returns undefined for unknown key', () => {
    expect(getCategoryByKey('nope')).toBeUndefined();
  });
});
