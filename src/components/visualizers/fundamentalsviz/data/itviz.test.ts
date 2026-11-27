import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getITChapter, itChapters, itTracks } from './curriculum';
import { getITLesson, itLessons } from './lessons';
import { getITProblem, itProblems } from './problems';
import { IT_PROBLEM_COUNT, IT_PROBLEM_COUNTS_BY_CHAPTER } from './mcq/counts';
import { itProblemSeeds } from './mcq';

describe('fundamentalsviz curriculum', () => {
  it('contains 24 unique chapters across six tracks', () => {
    expect(itChapters).toHaveLength(24);
    expect(new Set(itChapters.map((chapter) => chapter.id)).size).toBe(24);
    expect(itChapters.map((chapter) => chapter.number)).toEqual(Array.from({ length: 24 }, (_, index) => index + 1));
    expect(new Set(itChapters.map((chapter) => chapter.track)).size).toBe(6);
    expect(itTracks).toHaveLength(6);
  });

  it('has a complete lesson for every chapter', () => {
    for (const chapter of itChapters) {
      const lesson = itLessons[chapter.id];
      expect(lesson, `missing lesson for ${chapter.id}`).toBeDefined();
      if (!lesson) continue;
      expect(lesson.chapterId).toBe(chapter.id);
      expect(lesson.plainEnglish.length).toBeGreaterThan(30);
      expect(lesson.plainEnglish.split(/\s+/).length).toBeLessThanOrEqual(40);
      expect(lesson.oneIdea.length).toBeGreaterThan(30);
      expect(lesson.whyItMatters.length).toBeGreaterThan(40);
      expect(lesson.objectives.length).toBeGreaterThanOrEqual(3);
      expect(lesson.sections.length).toBeGreaterThanOrEqual(3);
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
        expect(quiz.answer).toBeGreaterThanOrEqual(0);
        expect(quiz.answer).toBeLessThan(quiz.options.length);
        expect(quiz.options).toHaveLength(4);
      }
      expect(getITLesson(chapter.id)).toBe(lesson);
    }
  });

  it('uses valid walkthroughs and chapter references', () => {
    for (const chapter of itChapters) {
      for (const prerequisite of chapter.prerequisites) {
        expect(getITChapter(prerequisite), `${chapter.id} -> ${prerequisite}`).toBeDefined();
      }
    }
    expect(getITLesson('binary-number-systems')?.walkthrough).toBe('binary');
    expect(getITLesson('networks-internet')?.walkthrough).toBe('network');
  });

  it('keeps every Fundamentals of IT surface free of gradient fills', () => {
    const root = fileURLToPath(new URL('..', import.meta.url));
    const sources = readdirSync(root, { recursive: true })
      .filter((file): file is string => typeof file === 'string' && /\.(css|tsx?)$/.test(file) && !file.includes('.test.'))
      .map((file) => readFileSync(join(root, file), 'utf8'))
      .join('\n');

    expect(sources).not.toMatch(/(linear|radial|conic)-gradient/i);
  });
});

describe('fundamentalsviz question bank', () => {
  it('has exactly 500 questions, 20 or 21 per chapter', () => {
    expect(IT_PROBLEM_COUNT).toBe(500);
    expect(itProblems).toHaveLength(500);
    expect(itProblemSeeds).toHaveLength(500);
    expect(Object.values(IT_PROBLEM_COUNTS_BY_CHAPTER).reduce((total, count) => total + count, 0)).toBe(500);
    expect(new Set(itProblems.map((problem) => problem.id)).size).toBe(500);
    expect(itProblems.map((problem) => problem.number)).toEqual(Array.from({ length: 500 }, (_, index) => index + 1));

    for (const chapter of itChapters) {
      const count = itProblems.filter((problem) => problem.chapterId === chapter.id).length;
      expect(IT_PROBLEM_COUNTS_BY_CHAPTER[chapter.id]).toBe(count);
      expect(count).toBeGreaterThanOrEqual(20);
      expect(count).toBeLessThanOrEqual(21);
    }
  });

  it('keeps every question answerable and distinct', () => {
    expect(itProblems.filter((problem) => problem.difficulty === 'Hard').length).toBeGreaterThanOrEqual(70);
    expect(itProblems.filter((problem) => problem.type === 'scenario').length).toBeGreaterThanOrEqual(150);

    const answerCounts = [0, 0, 0, 0];
    const prompts = new Set<string>();
    for (const problem of itProblems) {
      answerCounts[problem.answer] += 1;
      expect(getITChapter(problem.chapterId), `${problem.id} chapter`).toBeDefined();
      expect(problem.options).toHaveLength(4);
      expect(new Set(problem.options).size).toBe(4);
      expect(problem.answer).toBeGreaterThanOrEqual(0);
      expect(problem.answer).toBeLessThan(4);
      expect(problem.explanation.length).toBeGreaterThan(30);
      expect(problem.hint.length).toBeGreaterThan(10);
      expect(problem.prompt).not.toMatch(/\bTODO\b|undefined|placeholder/i);
      const normalized = `${problem.context ?? ''} ${problem.prompt}`.trim().toLowerCase().replace(/\s+/g, ' ');
      expect(prompts.has(normalized), `duplicate prompt: ${problem.id}`).toBe(false);
      prompts.add(normalized);
      expect(getITProblem(problem.id)).toBe(problem);
    }

    for (const count of answerCounts) {
      expect(count).toBeGreaterThanOrEqual(75);
    }
  });
});
