import type { DBMSProblemSeed } from './types';
import { group1Seeds } from './seeds/group1';
import { group2Seeds } from './seeds/group2';
import { group3Seeds } from './seeds/group3';
import { group4Seeds } from './seeds/group4';
import { group5Seeds } from './seeds/group5';
import { group6Seeds } from './seeds/group6';
import { group7Seeds } from './seeds/group7';
import { group8Seeds } from './seeds/group8';

export const dbmsProblemSeeds: DBMSProblemSeed[] = [
  ...group1Seeds,
  ...group2Seeds,
  ...group3Seeds,
  ...group4Seeds,
  ...group5Seeds,
  ...group6Seeds,
  ...group7Seeds,
  ...group8Seeds,
];

export type { DBMSProblem, DBMSProblemDifficulty, DBMSProblemSeed, DBMSProblemType } from './types';
