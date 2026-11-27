export interface DBMSLessonSection {
  title: string;
  body: string;
  code?: string;
}

export interface DBMSLessonQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

import type { DBMSWalkthrough } from '../walkthrough-types';

export interface DBMSLesson {
  chapterId: string;
  hook: string;
  objectives: string[];
  walkthrough?: DBMSWalkthrough;
  sections: DBMSLessonSection[];
  keyTakeaways: string[];
  pitfalls: string[];
  focusPoints: string[];
  quiz: DBMSLessonQuiz[];
}
