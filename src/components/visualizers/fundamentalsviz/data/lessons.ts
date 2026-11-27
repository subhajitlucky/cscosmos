import type { ITLesson } from './lessons/types';
import { part1Lessons } from './lessons/part1';
import { part2Lessons } from './lessons/part2';
import { part3Lessons } from './lessons/part3';

const allLessons: ITLesson[] = [...part1Lessons, ...part2Lessons, ...part3Lessons];

export const itLessons: Record<string, ITLesson> = Object.fromEntries(
  allLessons.map((lesson) => [lesson.chapterId, lesson]),
);

export function getITLesson(chapterId: string | undefined): ITLesson | undefined {
  return chapterId ? itLessons[chapterId] : undefined;
}

export type { ITLesson, ITLessonQuiz, ITNoteSection, ITNoteTable } from './lessons/types';
