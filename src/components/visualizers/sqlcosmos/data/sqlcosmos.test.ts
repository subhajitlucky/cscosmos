import { describe, expect, it } from 'vitest';
import { SQL_TOPICS } from './topics';
import { SQL_FLASHCARDS } from './flashcards';
import { SQL_CHEATSHEET } from './cheatsheet';

describe('sqlcosmos data integrity', () => {
  it('defines 23 comprehensive SQL topics across all 5 categories', () => {
    expect(SQL_TOPICS).toHaveLength(23);

    const categories = new Set(SQL_TOPICS.map((t) => t.category));
    expect(categories).toEqual(
      new Set(['foundations', 'indexing', 'query-execution', 'transactions', 'architecture'])
    );

    // Ensure every category has substantial coverage
    for (const cat of ['foundations', 'indexing', 'query-execution', 'transactions', 'architecture']) {
      const inCat = SQL_TOPICS.filter((t) => t.category === cat);
      expect(inCat.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('ensures every topic has valid metadata, code snippets, takeaways, and pitfalls', () => {
    const topicIds = new Set<string>();

    for (const topic of SQL_TOPICS) {
      expect(topic.id).toBeTruthy();
      expect(topicIds.has(topic.id)).toBe(false);
      topicIds.add(topic.id);

      expect(topic.title).toBeTruthy();
      expect(topic.summary.length).toBeGreaterThan(30);
      expect(topic.mentalModel.length).toBeGreaterThan(20);
      expect(topic.codeSnippet.length).toBeGreaterThan(50);
      expect(topic.takeaways.length).toBeGreaterThanOrEqual(3);
      expect(topic.commonPitfall.mistake.length).toBeGreaterThan(15);
      expect(topic.commonPitfall.fix.length).toBeGreaterThan(10);

      if (topic.nextTopicId) {
        expect(SQL_TOPICS.some((t) => t.id === topic.nextTopicId)).toBe(true);
      }
    }
  });

  it('defines 18 interview flashcards with valid difficulties and tips', () => {
    expect(SQL_FLASHCARDS.length).toBeGreaterThanOrEqual(18);
    const validDifficulties = new Set(['Junior', 'Mid', 'Senior', 'Staff']);

    for (const card of SQL_FLASHCARDS) {
      expect(card.id).toBeTruthy();
      expect(card.question.length).toBeGreaterThan(15);
      expect(card.answer.length).toBeGreaterThan(30);
      expect(card.tip.length).toBeGreaterThan(15);
      expect(validDifficulties.has(card.difficulty)).toBe(true);
    }
  });

  it('defines 8 complete performance cheatsheet sections', () => {
    expect(SQL_CHEATSHEET).toHaveLength(8);

    for (const section of SQL_CHEATSHEET) {
      expect(section.id).toBeTruthy();
      expect(section.title).toBeTruthy();
      expect(section.snippets.length).toBeGreaterThanOrEqual(2);
      for (const snippet of section.snippets) {
        expect(snippet.sql).toBeTruthy();
        expect(snippet.tip).toBeTruthy();
      }
    }
  });
});
