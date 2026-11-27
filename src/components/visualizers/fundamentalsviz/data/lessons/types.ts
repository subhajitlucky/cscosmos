export interface ITNoteTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface ITNoteSection {
  title: string;
  body?: string;
  bullets?: string[];
  table?: ITNoteTable;
  code?: string;
}

export interface ITLessonQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface ITLesson {
  chapterId: string;
  intro: string;
  sections: ITNoteSection[];
  examPoints: string[];
  keyTerms: { term: string; definition: string }[];
  quiz: ITLessonQuiz[];
}
