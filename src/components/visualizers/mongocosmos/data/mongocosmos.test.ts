import { describe, it, expect } from 'vitest';
import { MONGO_TOPICS } from './topics';
import { MONGO_FLASHCARDS } from './flashcards';
import { MONGO_CHEATSHEET } from './cheatsheet';
import { MONGO_PROBLEMS } from './problems';
import { executeMqlQuery, MOCK_COLLECTIONS } from '../lib/mongoSubsetEvaluator';

describe('mongocosmos data integrity & evaluator', () => {
  it('defines 50 comprehensive MongoDB topics across all 5 categories', () => {
    expect(MONGO_TOPICS).toHaveLength(50);
    const validCategories = new Set([
      'bson-storage',
      'wiredtiger',
      'indexing',
      'aggregation',
      'distributed'
    ]);

    const seenIds = new Set<string>();
    for (const topic of MONGO_TOPICS) {
      expect(seenIds.has(topic.id)).toBe(false);
      seenIds.add(topic.id);
      expect(validCategories.has(topic.category)).toBe(true);
      expect(topic.title.length).toBeGreaterThan(5);
      expect(topic.summary.length).toBeGreaterThan(20);
      expect(topic.definition.length).toBeGreaterThan(30);
      expect(topic.eli5.length).toBeGreaterThan(20);
      expect(topic.syntaxSteps.length).toBeGreaterThanOrEqual(1);
      expect(topic.rulesTable.length).toBeGreaterThanOrEqual(1);
      expect(topic.deepDive.title.length).toBeGreaterThan(5);
      expect(topic.interviewQuestions.length).toBeGreaterThanOrEqual(1);
      expect(topic.quickTest.options).toHaveLength(4);
    }
  });

  it('defines 50 interview flashcards with valid categories and difficulties', () => {
    expect(MONGO_FLASHCARDS).toHaveLength(50);
    const validCategories = new Set([
      'Storage & BSON',
      'WiredTiger Internals',
      'Indexing & Querying',
      'Aggregation & Modeling',
      'Replication & Sharding'
    ]);
    const validDifficulties = new Set(['Junior', 'Mid', 'Senior', 'Staff']);

    const seenIds = new Set<string>();
    for (const card of MONGO_FLASHCARDS) {
      expect(seenIds.has(card.id)).toBe(false);
      seenIds.add(card.id);
      expect(validCategories.has(card.category)).toBe(true);
      expect(validDifficulties.has(card.difficulty)).toBe(true);
      expect(card.question.length).toBeGreaterThan(15);
      expect(card.answer.length).toBeGreaterThan(30);
      expect(card.tip.length).toBeGreaterThan(10);
    }
  });

  it('defines 8 complete performance cheatsheet sections', () => {
    expect(MONGO_CHEATSHEET).toHaveLength(8);
    for (const sec of MONGO_CHEATSHEET) {
      expect(sec.id).toBeTruthy();
      expect(sec.title).toBeTruthy();
      expect(sec.recipes.length).toBeGreaterThanOrEqual(2);
      for (const recipe of sec.recipes) {
        expect(recipe.title).toBeTruthy();
        expect(recipe.code).toBeTruthy();
      }
    }
  });

  it('defines 50 practice problems that validate correctly against mock data', () => {
    expect(MONGO_PROBLEMS).toHaveLength(50);
    for (const prob of MONGO_PROBLEMS) {
      expect(prob.id).toBeTruthy();
      expect(prob.solution).toBeTruthy();
      expect(MOCK_COLLECTIONS[prob.targetCollection]).toBeDefined();

      // Execute solution against evaluator
      const res = executeMqlQuery(prob.solution, MOCK_COLLECTIONS);
      const validation = prob.validate(res.documents, prob.solution);
      expect(validation.valid).toBe(true);
    }
  });
});
