import { describe, expect, it } from 'vitest';
import { cChapters, getCChapter } from './curriculum';
import { cLessons } from './lessons';
import { cProblems, getCProblem } from './problems';

describe('cviz curriculum data', () => {
  it('contains the 35-lesson C curriculum with unique ids and numbers', () => {
    expect(cChapters).toHaveLength(35);
    expect(new Set(cChapters.map((chapter) => chapter.id)).size).toBe(cChapters.length);
    expect(new Set(cChapters.map((chapter) => chapter.number)).size).toBe(cChapters.length);
    expect(cChapters.map((chapter) => chapter.number)).toEqual(
      Array.from({ length: 35 }, (_, index) => index + 1),
    );
  });

  it('has a lesson for every chapter and the chapter ids match', () => {
    for (const chapter of cChapters) {
      const lesson = cLessons[chapter.id];
      expect(lesson, `missing lesson for ${chapter.id}`).toBeDefined();
      expect(lesson.chapterId).toBe(chapter.id);
      expect(lesson.sections.length).toBeGreaterThanOrEqual(2);
      expect(lesson.keyTakeaways.length).toBeGreaterThan(0);
      expect(lesson.pitfalls.length).toBeGreaterThan(0);
      expect(lesson.examTips.length).toBeGreaterThan(0);
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('keeps every quiz answer inside its options array', () => {
    for (const lesson of Object.values(cLessons)) {
      for (const quiz of lesson.quiz) {
        expect(quiz.answer).toBeGreaterThanOrEqual(0);
        expect(quiz.answer).toBeLessThan(quiz.options.length);
        expect(quiz.explanation.length).toBeGreaterThan(20);
      }
    }
  });

  it('only references real prerequisite chapters', () => {
    for (const chapter of cChapters) {
      for (const prerequisite of chapter.prerequisites) {
        expect(getCChapter(prerequisite), `${chapter.id} -> ${prerequisite}`).toBeDefined();
      }
    }
  });

  it('has at least one valid drill per lesson with correct answer indexes', () => {
    expect(cProblems).toHaveLength(41);
    expect(new Set(cProblems.map((problem) => problem.id)).size).toBe(cProblems.length);
    expect(new Set(cProblems.map((problem) => problem.number)).size).toBe(cProblems.length);
    expect(cProblems.map((problem) => problem.number)).toEqual(
      Array.from({ length: cProblems.length }, (_, index) => index + 1),
    );

    for (const chapter of cChapters) {
      const matches = cProblems.filter((problem) => problem.chapterId === chapter.id);
      expect(matches.length, `${chapter.id} should have at least one drill`).toBeGreaterThanOrEqual(1);
    }

    for (const problem of cProblems) {
      expect(getCChapter(problem.chapterId), `${problem.id} chapter`).toBeDefined();
      expect(problem.answer).toBeGreaterThanOrEqual(0);
      expect(problem.answer).toBeLessThan(problem.options.length);
      expect(problem.explanation.length).toBeGreaterThan(20);
      expect(problem.hint.length).toBeGreaterThan(10);
      expect(getCProblem(problem.id)).toBe(problem);
    }
  });
});
