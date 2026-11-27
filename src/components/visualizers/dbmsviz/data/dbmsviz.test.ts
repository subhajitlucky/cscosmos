import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getDBMSChapter, dbmsChapters } from './curriculum';
import { dbmsLessons } from './lessons';
import { dbmsDeepDives, getDBMSDeepDive } from './deep-dives';
import { getDBMSProblem, dbmsProblems } from './problems';
import { DBMS_PROBLEM_COUNT, DBMS_PROBLEM_COUNTS_BY_CHAPTER } from './mcq/counts';
import { dbmsProblemSeeds } from './mcq';

describe('dbmsviz curriculum data', () => {
  it('contains 32 lessons with unique ids and numbers', () => {
    expect(dbmsChapters).toHaveLength(32);
    expect(new Set(dbmsChapters.map((chapter) => chapter.id)).size).toBe(dbmsChapters.length);
    expect(dbmsChapters.map((chapter) => chapter.number)).toEqual(
      Array.from({ length: 32 }, (_, index) => index + 1),
    );
  });

  it('has a lesson for every chapter with valid quiz answers', () => {
    for (const chapter of dbmsChapters) {
      const lesson = dbmsLessons[chapter.id];
      expect(lesson, `missing lesson for ${chapter.id}`).toBeDefined();
      expect(lesson.chapterId).toBe(chapter.id);
      expect(lesson.plainEnglish.length).toBeGreaterThan(20);
      expect(lesson.plainEnglish.split(/\s+/).length).toBeLessThanOrEqual(40);
      expect(lesson.objectives.length).toBeGreaterThan(0);
      expect(lesson.sections.length).toBeGreaterThanOrEqual(2);
      expect(
        lesson.sections.some((section) => Boolean(section.code)),
        `missing worked example for ${chapter.id}`,
      ).toBe(true);
      expect(lesson.keyTakeaways.length).toBeGreaterThan(0);
      expect(lesson.pitfalls.length).toBeGreaterThan(0);
      expect(lesson.focusPoints.length).toBeGreaterThan(0);
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);
      for (const quiz of lesson.quiz) {
        expect(quiz.answer).toBeGreaterThanOrEqual(0);
        expect(quiz.answer).toBeLessThan(quiz.options.length);
      }
    }
  });

  it('keeps every DBMS surface free of gradient fills', () => {
    const root = fileURLToPath(new URL('..', import.meta.url));
    const sources = readdirSync(root, { recursive: true })
      .filter(
        (file): file is string =>
          typeof file === 'string' &&
          /\.(css|tsx?)$/.test(file) &&
          !file.includes('.test.'),
      )
      .map((file) => readFileSync(join(root, file), 'utf8'))
      .join('\n');

    expect(sources).not.toMatch(/(linear|radial|conic)-gradient/i);
  });

  it('has a deep dive with a worked example for every chapter', () => {
    expect(Object.keys(dbmsDeepDives)).toHaveLength(dbmsChapters.length);

    for (const chapter of dbmsChapters) {
      const deepDive = getDBMSDeepDive(chapter.id);
      expect(deepDive, `missing deep dive for ${chapter.id}`).toBeDefined();
      if (!deepDive) continue;
      expect(deepDive.oneIdea.length).toBeGreaterThan(40);
      expect(deepDive.whyItMatters.length).toBeGreaterThan(40);
      expect(deepDive.example.title.length).toBeGreaterThan(5);
      expect(deepDive.example.scenario.length).toBeGreaterThan(40);
      expect(deepDive.example.steps.length).toBeGreaterThanOrEqual(3);
      expect(deepDive.example.conclusion.length).toBeGreaterThan(40);
      expect(deepDive.tradeoff.gain.length).toBeGreaterThan(20);
      expect(deepDive.tradeoff.cost.length).toBeGreaterThan(20);
      expect(deepDive.tradeoff.verdict.length).toBeGreaterThan(20);
      expect(deepDive.terms.length).toBeGreaterThanOrEqual(2);
      for (const step of deepDive.example.steps) {
        expect(step.action.length).toBeGreaterThan(10);
        expect(step.result.length).toBeGreaterThan(10);
      }
    }
  });

  it('has a thousand valid drills spanning every chapter', () => {
    expect(DBMS_PROBLEM_COUNT).toBe(1000);
    expect(dbmsProblemSeeds).toHaveLength(968);
    expect(
      Object.values(DBMS_PROBLEM_COUNTS_BY_CHAPTER).reduce((total, count) => total + count, 0),
    ).toBe(1000);
    expect(dbmsProblems).toHaveLength(1000);
    expect(new Set(dbmsProblems.map((problem) => problem.id)).size).toBe(dbmsProblems.length);
    expect(new Set(dbmsProblems.map((problem) => problem.number)).size).toBe(dbmsProblems.length);
    expect(dbmsProblems.map((problem) => problem.number)).toEqual(
      Array.from({ length: 1000 }, (_, index) => index + 1),
    );

    for (const chapter of dbmsChapters) {
      const chapterProblems = dbmsProblems.filter((problem) => problem.chapterId === chapter.id);
      expect(DBMS_PROBLEM_COUNTS_BY_CHAPTER[chapter.id], `${chapter.id} count`).toBe(chapterProblems.length);
      expect(chapterProblems.length, `${chapter.id} should have at least 30 drills`).toBeGreaterThanOrEqual(30);
      expect(
        new Set(chapterProblems.map((problem) => problem.title)).size,
        `${chapter.id} should have unique titles`,
      ).toBe(chapterProblems.length);
    }

    expect(dbmsProblems.filter((problem) => problem.difficulty === 'Hard').length).toBeGreaterThanOrEqual(150);
    expect(dbmsProblems.filter((problem) => problem.type === 'scenario').length).toBeGreaterThanOrEqual(300);

    const answerCounts = [0, 0, 0, 0];
    const prompts = new Set<string>();
    for (const problem of dbmsProblems) {
      answerCounts[problem.answer] += 1;
      expect(getDBMSChapter(problem.chapterId), `${problem.id} chapter`).toBeDefined();
      expect(problem.options).toHaveLength(4);
      expect(new Set(problem.options).size).toBe(4);
      expect(problem.answer).toBeGreaterThanOrEqual(0);
      expect(problem.answer).toBeLessThan(problem.options.length);
      expect(problem.explanation.length).toBeGreaterThan(20);
      expect(problem.hint.length).toBeGreaterThan(10);
      expect(problem.title.length).toBeGreaterThan(2);
      expect(problem.prompt).not.toMatch(/\bTODO\b|undefined|placeholder/i);


      const normalizedPrompt = problem.prompt.trim().toLowerCase().replace(/\s+/g, ' ');
      expect(prompts.has(normalizedPrompt), `duplicate prompt: ${problem.id}`).toBe(false);
      prompts.add(normalizedPrompt);
      expect(getDBMSProblem(problem.id)).toBe(problem);
    }

    for (const count of answerCounts) {
      expect(count).toBeGreaterThanOrEqual(100);
    }
  });
});
