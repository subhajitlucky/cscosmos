import type { Step, AlgorithmResult } from '../types';

export const boyerMooreMatch = (text: string, pattern: string): AlgorithmResult => {
  const n = text.length;
  const m = pattern.length;
  const steps: Step[] = [];
  const matches: number[] = [];

  if (m === 0) return { steps, finalResult: [] };

  // 1. Bad Character Heuristic
  const badChar: Record<string, number> = {};
  for (let i = 0; i < m; i++) {
    badChar[pattern[i]] = i;
  }

  let s = 0; // shift of the pattern with respect to text
  while (s <= n - m) {
    let j = m - 1;

    steps.push({
      index: s,
      innerIndex: j,
      highlightedIndices: [s + j],
      secondaryHighlightedIndices: [j],
      matches: [...matches],
      state: { phase: 'compare', s, j, badChar },
      description: `Aligning pattern at index ${s}. Comparing from right-to-left: pattern[${j}] ('${pattern[j]}') vs text[${s+j}] ('${text[s+j]}')`
    });

    while (j >= 0 && pattern[j] === text[s + j]) {
      j--;
      if (j >= 0) {
        steps.push({
          index: s,
          innerIndex: j,
          highlightedIndices: [s + j],
          secondaryHighlightedIndices: [j],
          matches: [...matches],
          state: { phase: 'match-char', s, j, badChar },
          description: `Match! Moving left to index ${j}`
        });
      }
    }

    if (j < 0) {
      matches.push(s);
      steps.push({
        index: s,
        innerIndex: 0,
        highlightedIndices: Array.from({ length: m }, (_, k) => s + k),
        secondaryHighlightedIndices: Array.from({ length: m }, (_, k) => k),
        matches: [...matches],
        state: { phase: 'match-full', s, j: 0, badChar },
        description: `Full match found at index ${s}!`
      });
      s += (s + m < n) ? m - (badChar[text[s + m]] ?? -1) : 1;
    } else {
      const bcShift = Math.max(1, j - (badChar[text[s + j]] ?? -1));
      steps.push({
        index: s,
        innerIndex: j,
        highlightedIndices: [s + j],
        secondaryHighlightedIndices: [j],
        matches: [...matches],
        state: { phase: 'mismatch', s, j, badChar, shift: bcShift },
        description: `Mismatch at text[${s+j}] ('${text[s+j]}'). Bad Character shift: ${bcShift}`
      });
      s += bcShift;
    }
  }

  return {
    steps,
    finalResult: matches
  };
};
