import type { Step, AlgorithmResult } from '../types';

export const bwtTransform = (text: string): AlgorithmResult => {
  const steps: Step[] = [];
  const s = text + "$";
  const n = s.length;
  
  // 1. Generate rotations
  const rotations: string[] = [];
  for (let i = 0; i < n; i++) {
    const rotation = s.slice(i) + s.slice(0, i);
    rotations.push(rotation);
  }
  
  steps.push({
    index: 0,
    highlightedIndices: [],
    matches: [],
    state: { rotations: [...rotations], phase: 'rotations' },
    description: "Generate all cyclic rotations of the string with $ terminator."
  });

  // 2. Sort rotations
  const sortedRotations = [...rotations].sort();
  steps.push({
    index: 1,
    highlightedIndices: [],
    matches: [],
    state: { rotations: [...rotations], sortedRotations: [...sortedRotations], phase: 'sorting' },
    description: "Sort rotations lexicographically."
  });

  // 3. Extract last column
  const lastColumn = sortedRotations.map(r => r[n - 1]).join('');
  steps.push({
    index: 2,
    highlightedIndices: [],
    matches: [],
    state: { sortedRotations: [...sortedRotations], result: lastColumn, phase: 'result' },
    description: "Extract the last character of each sorted rotation to get the BWT."
  });

  return {
    steps,
    finalResult: lastColumn
  };
};
