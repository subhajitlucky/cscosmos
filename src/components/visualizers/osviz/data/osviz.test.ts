import { describe, expect, it } from 'vitest';
import { getOSChapter, osChapters } from './curriculum';
import { osLessons } from './lessons';
import { getOSProblem, osProblems } from './problems';
import { runFCFS, runPriority, runRoundRobin, type OSProcess } from '../lib/scheduling';
import { pageOffsetBits, translateAddress } from '../lib/paging';
import { walkFAT } from '../lib/fat';

const processes: OSProcess[] = [
  { id: 'P1', arrival: 0, burst: 5, priority: 2 },
  { id: 'P2', arrival: 1, burst: 3, priority: 1 },
];

describe('osviz curriculum data', () => {
  it('contains 12 lessons with unique ids and numbers', () => {
    expect(osChapters).toHaveLength(12);
    expect(new Set(osChapters.map((chapter) => chapter.id)).size).toBe(osChapters.length);
    expect(osChapters.map((chapter) => chapter.number)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1),
    );
  });

  it('has a lesson for every chapter with valid quiz answers', () => {
    for (const chapter of osChapters) {
      const lesson = osLessons[chapter.id];
      expect(lesson, `missing lesson for ${chapter.id}`).toBeDefined();
      expect(lesson.chapterId).toBe(chapter.id);
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

  it('has valid practice drills covering every lesson', () => {
    expect(osProblems).toHaveLength(15);
    expect(new Set(osProblems.map((problem) => problem.id)).size).toBe(osProblems.length);
    expect(new Set(osProblems.map((problem) => problem.number)).size).toBe(osProblems.length);

    for (const chapter of osChapters) {
      expect(
        osProblems.some((problem) => problem.chapterId === chapter.id),
        `missing drill for ${chapter.id}`,
      ).toBe(true);
    }

    for (const problem of osProblems) {
      expect(getOSChapter(problem.chapterId), `${problem.id} chapter`).toBeDefined();
      expect(problem.answer).toBeGreaterThanOrEqual(0);
      expect(problem.answer).toBeLessThan(problem.options.length);
      expect(problem.explanation.length).toBeGreaterThan(20);
      expect(getOSProblem(problem.id)).toBe(problem);
    }
  });
});

describe('scheduling engine', () => {
  it('computes FCFS completion and waiting times', () => {
    const result = runFCFS(processes);
    const p1 = result.metrics.find((metric) => metric.id === 'P1');
    const p2 = result.metrics.find((metric) => metric.id === 'P2');
    expect(p1?.completion).toBe(5);
    expect(p2?.completion).toBe(8);
    expect(p1?.waiting).toBe(0);
    expect(p2?.waiting).toBe(4);
    expect(result.averageWaiting).toBe(2);
  });

  it('rotates processes with a Round Robin quantum', () => {
    const result = runRoundRobin(
      [
        { id: 'P1', arrival: 0, burst: 5, priority: 1 },
        { id: 'P2', arrival: 0, burst: 3, priority: 1 },
        { id: 'P3', arrival: 0, burst: 1, priority: 1 },
      ],
      2,
    );
    expect(result.metrics.find((metric) => metric.id === 'P1')?.completion).toBe(9);
    expect(result.metrics.find((metric) => metric.id === 'P2')?.completion).toBe(8);
    expect(result.metrics.find((metric) => metric.id === 'P3')?.completion).toBe(5);
  });

  it('runs the highest-priority ready process first', () => {
    const result = runPriority([
      { id: 'P1', arrival: 0, burst: 5, priority: 2 },
      { id: 'P2', arrival: 0, burst: 3, priority: 1 },
    ]);
    expect(result.metrics.find((metric) => metric.id === 'P2')?.completion).toBe(3);
    expect(result.metrics.find((metric) => metric.id === 'P1')?.completion).toBe(8);
  });
});

describe('paging engine', () => {
  it('splits a virtual address into page number and offset', () => {
    const result = translateAddress(0x1a2b, 4096, [4, 7, -1, 2, 9, -1, 5, 1]);
    expect(result.pageNumber).toBe(1);
    expect(result.offset).toBe(0xa2b);
    expect(result.frame).toBe(7);
    expect(result.physicalAddress).toBe(0x7a2b);
    expect(result.fault).toBe(false);
  });

  it('reports a page fault for an invalid page-table entry', () => {
    const result = translateAddress(0x2000, 4096, [4, 7, -1, 2, 9, -1, 5, 1]);
    expect(result.fault).toBe(true);
    expect(result.physicalAddress).toBeNull();
  });

  it('computes the offset width for 4 KB pages', () => {
    expect(pageOffsetBits(4096)).toBe(12);
  });
});

describe('FAT engine', () => {
  it('follows a FAT chain until EOF', () => {
    const fat = Array.from({ length: 24 }, () => -2);
    fat[5] = 9;
    fat[9] = 2;
    fat[2] = 14;
    fat[14] = 20;
    fat[20] = -1;
    expect(walkFAT(5, fat)).toEqual({ blocks: [5, 9, 2, 14, 20] });
  });

  it('detects a cycle in a corrupt FAT', () => {
    const fat = Array.from({ length: 8 }, () => -2);
    fat[1] = 2;
    fat[2] = 1;
    expect(walkFAT(1, fat).error).toBe('cycle');
  });
});
