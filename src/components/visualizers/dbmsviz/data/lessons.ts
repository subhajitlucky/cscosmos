import type { DBMSLesson } from './lessons/types';
import { foundationLessons } from './lessons/foundations';
import { modelingLessons } from './lessons/modeling';
import { relationalLessons } from './lessons/relational';
import { normalizationLessons } from './lessons/normalization';
import { transactionLessons } from './lessons/transactions';
import { concurrencyLessons } from './lessons/concurrency';
import { distributedLessons } from './lessons/distributed';

const allLessons: DBMSLesson[] = [
  ...foundationLessons,
  ...modelingLessons,
  ...relationalLessons,
  ...normalizationLessons,
  ...transactionLessons,
  ...concurrencyLessons,
  ...distributedLessons,
];

export const dbmsLessons: Record<string, DBMSLesson> = Object.fromEntries(
  allLessons.map((lesson) => [lesson.chapterId, lesson]),
);

export type { DBMSLesson, DBMSLessonQuiz, DBMSLessonSection } from './lessons/types';

export const dbmsLessonByChapter = (chapterId: string): DBMSLesson | undefined =>
  dbmsLessons[chapterId];
