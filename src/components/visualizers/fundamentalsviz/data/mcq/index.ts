import type { ITProblemSeed } from './types';
import { part1Seeds } from './seeds/part1';
import { part2Seeds } from './seeds/part2';

export const itProblemSeeds: ITProblemSeed[] = [...part1Seeds, ...part2Seeds];

export type { ITProblem, ITProblemDifficulty, ITProblemSeed, ITProblemType } from './types';
