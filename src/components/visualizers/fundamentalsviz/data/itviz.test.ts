import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getITChapter, itChapters } from './curriculum';
import { getITLesson, itLessons } from './lessons';
import { getITProblem, itProblems } from './problems';
import { IT_PROBLEM_COUNT, IT_PROBLEM_COUNTS_BY_CHAPTER } from './mcq/counts';
import { itProblemSeeds } from './mcq';

describe('IT Fundamentals curriculum', () => {
  it('contains exactly the seven requested topics', () => {
    expect(itChapters.map((chapter) => chapter.id)).toEqual([
      'computer-organization',
      'memory-storage',
      'number-systems',
      'boolean-algebra',
      'microprocessors',
      'computer-software',
      'ms-office',
    ]);
    expect(itChapters.map((chapter) => chapter.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    for (const chapter of itChapters) {
      expect(chapter.estimatedMinutes).toBe(8);
      expect(chapter.title.length).toBeGreaterThan(5);
      expect(chapter.subtitle.length).toBeGreaterThan(5);
      expect(chapter.summary.length).toBeGreaterThan(40);
      expect(chapter.concepts.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('has a complete, readable lesson for every topic', () => {
    for (const chapter of itChapters) {
      const lesson = itLessons[chapter.id];
      expect(lesson, `missing lesson for ${chapter.id}`).toBeDefined();
      if (!lesson) continue;
      expect(lesson.chapterId).toBe(chapter.id);
      expect(lesson.plainEnglish.length).toBeGreaterThan(30);
      expect(lesson.plainEnglish.split(/\s+/).length).toBeLessThanOrEqual(40);
      expect(lesson.oneIdea.length).toBeGreaterThan(30);
      expect(lesson.whyItMatters.length).toBeGreaterThan(40);
      expect(lesson.objectives.length).toBeGreaterThanOrEqual(4);
      expect(lesson.sections.length).toBeGreaterThanOrEqual(5);
      expect(lesson.example.steps.length).toBeGreaterThanOrEqual(3);
      expect(lesson.example.conclusion.length).toBeGreaterThan(40);
      expect(lesson.tradeoff.gain.length).toBeGreaterThan(20);
      expect(lesson.tradeoff.cost.length).toBeGreaterThan(20);
      expect(lesson.tradeoff.verdict.length).toBeGreaterThan(20);
      expect(lesson.terms.length).toBeGreaterThanOrEqual(2);
      expect(lesson.keyTakeaways.length).toBeGreaterThanOrEqual(3);
      expect(lesson.pitfalls.length).toBeGreaterThanOrEqual(3);
      expect(lesson.focusPoints.length).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(2);
      for (const quiz of lesson.quiz) {
        expect(quiz.options).toHaveLength(4);
        expect(quiz.answer).toBeGreaterThanOrEqual(0);
        expect(quiz.answer).toBeLessThan(4);
      }
      expect(getITLesson(chapter.id)).toBe(lesson);
    }
  });

  it('keeps prerequisites inside the module', () => {
    for (const chapter of itChapters) {
      for (const prerequisite of chapter.prerequisites) {
        expect(getITChapter(prerequisite), `${chapter.id} -> ${prerequisite}`).toBeDefined();
      }
    }
  });

  it('contains no gradients', () => {
    const root = fileURLToPath(new URL('..', import.meta.url));
    const sources = readdirSync(root, { recursive: true })
      .filter((file): file is string => typeof file === 'string' && /\.(css|tsx?)$/.test(file) && !file.includes('.test.'))
      .map((file) => readFileSync(join(root, file), 'utf8'))
      .join('\n');
    expect(sources).not.toMatch(/(linear|radial|conic)-gradient/i);
  });
});

describe('IT Fundamentals practice', () => {
  it('has exactly 140 questions, 20 per topic', () => {
    expect(IT_PROBLEM_COUNT).toBe(140);
    expect(itProblems).toHaveLength(140);
    expect(itProblemSeeds).toHaveLength(140);
    expect(Object.values(IT_PROBLEM_COUNTS_BY_CHAPTER).reduce((total, count) => total + count, 0)).toBe(140);
    for (const chapter of itChapters) {
      expect(itProblems.filter((problem) => problem.chapterId === chapter.id)).toHaveLength(20);
    }
    expect(new Set(itProblems.map((problem) => problem.id)).size).toBe(140);
    expect(itProblems.map((problem) => problem.number)).toEqual(Array.from({ length: 140 }, (_, index) => index + 1));
  });

  it('keeps every question valid and distinct', () => {
    expect(itProblems.filter((problem) => problem.difficulty === 'Hard').length).toBeGreaterThanOrEqual(20);
    expect(itProblems.filter((problem) => problem.type === 'scenario').length).toBeGreaterThanOrEqual(50);

    const prompts = new Set<string>();
    const answers = [0, 0, 0, 0];
    for (const problem of itProblems) {
      expect(getITChapter(problem.chapterId), `${problem.id} chapter`).toBeDefined();
      expect(problem.options).toHaveLength(4);
      expect(new Set(problem.options).size).toBe(4);
      expect(problem.answer).toBeGreaterThanOrEqual(0);
      expect(problem.answer).toBeLessThan(4);
      expect(problem.explanation.length).toBeGreaterThan(30);
      expect(problem.hint.length).toBeGreaterThan(10);
      expect(problem.prompt).not.toMatch(/\bTODO\b|undefined|placeholder/i);
      const key = `${problem.context ?? ''} ${problem.prompt}`.trim().toLowerCase().replace(/\s+/g, ' ');
      expect(prompts.has(key), `duplicate prompt: ${problem.id}`).toBe(false);
      prompts.add(key);
      answers[problem.answer] += 1;
      expect(getITProblem(problem.id)).toBe(problem);
    }
    for (const count of answers) expect(count).toBeGreaterThanOrEqual(20);
  });
});
