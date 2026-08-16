import type { Step, AlgorithmResult } from '../types';

export const naiveMatch = (text: string, pattern: string): AlgorithmResult => {
  const steps: Step[] = [];
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;

  for (let i = 0; i <= n - m; i++) {
    steps.push({
      index: i,
      innerIndex: 0,
      highlightedIndices: [i],
      secondaryHighlightedIndices: [0],
      matches: [...matches],
      state: { type: 'shift', textPos: i },
      description: `Checking for match at index ${i}`
    });

    let j = 0;
    while (j < m) {
      steps.push({
        index: i,
        innerIndex: j,
        highlightedIndices: [i + j],
        secondaryHighlightedIndices: [j],
        matches: [...matches],
        state: { type: 'compare', textPos: i + j, patPos: j },
        description: `Comparing text[${i + j}] ('${text[i + j]}') with pattern[${j}] ('${pattern[j]}')`
      });

      if (text[i + j] !== pattern[j]) {
        steps.push({
          index: i,
          innerIndex: j,
          highlightedIndices: [i + j],
          secondaryHighlightedIndices: [j],
          matches: [...matches],
          state: { type: 'mismatch', textPos: i + j, patPos: j },
          description: `Mismatch found at index ${i + j}. Shifting pattern.`
        });
        break;
      }
      j++;
    }

    if (j === m) {
      matches.push(i);
      steps.push({
        index: i,
        innerIndex: j - 1,
        highlightedIndices: Array.from({ length: m }, (_, k) => i + k),
        secondaryHighlightedIndices: Array.from({ length: m }, (_, k) => k),
        matches: [...matches],
        state: { type: 'match', startPos: i },
        description: `Full match found at index ${i}!`
      });
    }
  }

  return {
    steps,
    finalResult: matches
  };
};
