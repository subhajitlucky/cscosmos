export type DBMSProblemDifficulty = 'Easy' | 'Medium' | 'Hard';
export type DBMSProblemType = 'mcq' | 'scenario';

export interface DBMSProblemSeed {
  chapterId: string;
  title: string;
  difficulty: DBMSProblemDifficulty;
  type: DBMSProblemType;
  prompt: string;
  context?: string;
  options: string[];
  answer: number;
  explanation: string;
  hint: string;
}

export interface DBMSProblem extends DBMSProblemSeed {
  id: string;
  number: number;
}
