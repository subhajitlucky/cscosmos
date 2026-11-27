import type { OSLesson } from './lessons/types';
import { foundationLessons } from './lessons/foundations';
import { processLessons } from './lessons/processes';
import { schedulingLessons } from './lessons/scheduling';
import { memoryLessons } from './lessons/memory';
import { ioLessons } from './lessons/io';
import { fileLessons } from './lessons/files';
import { architectureLessons } from './lessons/architecture';
import { familyLessons } from './lessons/families';

const allLessons: OSLesson[] = [
  ...foundationLessons,
  ...processLessons,
  ...schedulingLessons,
  ...memoryLessons,
  ...ioLessons,
  ...fileLessons,
  ...architectureLessons,
  ...familyLessons,
];

export const osLessons: Record<string, OSLesson> = Object.fromEntries(
  allLessons.map((lesson) => [lesson.chapterId, lesson]),
);

export type { OSLesson, OSLessonQuiz, OSLessonSection } from './lessons/types';

export const osLessonByChapter = (chapterId: string): OSLesson | undefined =>
  osLessons[chapterId];
