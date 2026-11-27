import { describe, expect, it } from 'vitest';
import { getDBMSChapter, dbmsChapters } from './curriculum';
import { dbmsLessons } from './lessons';
import { getDBMSProblem, dbmsProblems } from './problems';

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
      expect(lesson.objectives.length).toBeGreaterThan(0);
      expect(lesson.sections.length).toBeGreaterThanOrEqual(2);
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

  it('has one valid drill per lesson', () => {
    expect(dbmsProblems).toHaveLength(32);
    expect(new Set(dbmsProblems.map((problem) => problem.id)).size).toBe(dbmsProblems.length);
    expect(new Set(dbmsProblems.map((problem) => problem.number)).size).toBe(dbmsProblems.length);
    expect(dbmsProblems.map((problem) => problem.number)).toEqual(
      Array.from({ length: 32 }, (_, index) => index + 1),
    );

    for (const chapter of dbmsChapters) {
      expect(
        dbmsProblems.some((problem) => problem.chapterId === chapter.id),
        `missing drill for ${chapter.id}`,
      ).toBe(true);
    }

    for (const problem of dbmsProblems) {
      expect(getDBMSChapter(problem.chapterId), `${problem.id} chapter`).toBeDefined();
      expect(problem.answer).toBeGreaterThanOrEqual(0);
      expect(problem.answer).toBeLessThan(problem.options.length);
      expect(problem.explanation.length).toBeGreaterThan(20);
      expect(getDBMSProblem(problem.id)).toBe(problem);
    }
  });
});
