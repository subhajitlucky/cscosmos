export type ITProblemDifficulty = 'Easy' | 'Medium' | 'Hard';
export type ITProblemType = 'mcq' | 'scenario';

export interface ITProblemSeed {
  chapterId: string;
  title: string;
  difficulty: ITProblemDifficulty;
  type: ITProblemType;
  prompt: string;
  context?: string;
  options: string[];
  answer: number;
  explanation: string;
  hint: string;
}

export interface ITProblem extends ITProblemSeed {
  id: string;
  number: number;
}
