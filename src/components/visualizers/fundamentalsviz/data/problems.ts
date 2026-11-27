import { itChapters } from './curriculum';
import { itProblemSeeds } from './mcq';
import { IT_PROBLEM_COUNT, IT_PROBLEM_COUNTS_BY_CHAPTER } from './mcq/counts';
import type { ITProblem, ITProblemDifficulty, ITProblemSeed, ITProblemType } from './mcq/types';

export type { ITProblem, ITProblemDifficulty, ITProblemType };

const seedsByChapter = new Map<string, ITProblemSeed[]>();
for (const seed of itProblemSeeds) {
  const bucket = seedsByChapter.get(seed.chapterId);
  if (bucket) bucket.push(seed);
  else seedsByChapter.set(seed.chapterId, [seed]);
}

const knownChapterIds = new Set(itChapters.map((chapter) => chapter.id));
const unknownChapterIds = [...seedsByChapter.keys()].filter((chapterId) => !knownChapterIds.has(chapterId));
if (unknownChapterIds.length > 0) {
  throw new Error(`Unknown IT problem chapter ids: ${unknownChapterIds.join(', ')}`);
}

const merged: ITProblem[] = [];
for (const chapter of itChapters) {
  const target = IT_PROBLEM_COUNTS_BY_CHAPTER[chapter.id];
  if (!target) throw new Error(`Missing IT problem count for ${chapter.id}`);

  const seeds = (seedsByChapter.get(chapter.id) ?? []).slice(0, target);
  if (seeds.length !== target) {
    throw new Error(`Expected ${target} IT problems for ${chapter.id}, found ${seeds.length}`);
  }

  seeds.forEach((seed, index) => {
    merged.push({
      ...seed,
      id: `it-mcq-${chapter.id}-${String(index + 1).padStart(2, '0')}`,
      number: 0,
    });
  });
}

if (merged.length !== IT_PROBLEM_COUNT) {
  throw new Error(`Expected ${IT_PROBLEM_COUNT} IT problems, built ${merged.length}`);
}

export const itProblems: ITProblem[] = merged.map((problem, index) => ({
  ...problem,
  number: index + 1,
}));

export const itProblemById = new Map(itProblems.map((problem) => [problem.id, problem]));

export function getITProblem(id: string | undefined): ITProblem | undefined {
  return id ? itProblemById.get(id) : undefined;
}

export function getAdjacentITProblems(id: string): {
  previous?: ITProblem;
  next?: ITProblem;
} {
  const index = itProblems.findIndex((problem) => problem.id === id);
  if (index < 0) return {};
  return {
    previous: index > 0 ? itProblems[index - 1] : undefined,
    next: index < itProblems.length - 1 ? itProblems[index + 1] : undefined,
  };
}
