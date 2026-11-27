export interface OSLessonSection {
  title: string;
  body: string;
  code?: string;
}

export interface OSLessonQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface OSLesson {
  chapterId: string;
  hook: string;
  objectives: string[];
  sections: OSLessonSection[];
  keyTakeaways: string[];
  pitfalls: string[];
  focusPoints: string[];
  quiz: OSLessonQuiz[];
}
