import type { ITLesson } from './lessons/types';
import { group1Lessons } from './lessons/group1';
import { group2Lessons } from './lessons/group2';
import { group3Lessons } from './lessons/group3';
import { group4Lessons } from './lessons/group4';

const allLessons: ITLesson[] = [
  ...group1Lessons,
  ...group2Lessons,
  ...group3Lessons,
  ...group4Lessons,
];

export const itLessons: Record<string, ITLesson> = Object.fromEntries(
  allLessons.map((lesson) => [lesson.chapterId, lesson]),
);

export function getITLesson(chapterId: string | undefined): ITLesson | undefined {
  return chapterId ? itLessons[chapterId] : undefined;
}

export type { ITLesson, ITLessonExample, ITLessonQuiz, ITLessonSection } from './lessons/types';
