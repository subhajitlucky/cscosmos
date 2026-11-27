export interface ITLessonSection {
  title: string;
  body: string;
  code?: string;
}

export interface ITExampleStep {
  action: string;
  result: string;
}

export interface ITLessonExample {
  title: string;
  scenario: string;
  steps: ITExampleStep[];
  conclusion: string;
}

export interface ITLessonTradeoff {
  gain: string;
  cost: string;
  verdict: string;
}

export interface ITLessonTerm {
  term: string;
  definition: string;
}

export interface ITLessonQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface ITLesson {
  chapterId: string;
  hook: string;
  plainEnglish: string;
  oneIdea: string;
  whyItMatters: string;
  objectives: string[];
  sections: ITLessonSection[];
  example: ITLessonExample;
  tradeoff: ITLessonTradeoff;
  terms: ITLessonTerm[];
  keyTakeaways: string[];
  pitfalls: string[];
  focusPoints: string[];
  quiz: ITLessonQuiz[];
}
