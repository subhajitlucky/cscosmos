import type { ITProblemSeed } from './types';
import { group1Seeds } from './seeds/group1';
import { group2Seeds } from './seeds/group2';
import { group3Seeds } from './seeds/group3';
import { group4Seeds } from './seeds/group4';

export const itProblemSeeds: ITProblemSeed[] = [
  ...group1Seeds,
  ...group2Seeds,
  ...group3Seeds,
  ...group4Seeds,
];

export type { ITProblem, ITProblemDifficulty, ITProblemSeed, ITProblemType } from './types';
