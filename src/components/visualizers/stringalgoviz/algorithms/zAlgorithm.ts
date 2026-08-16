import type { Step, AlgorithmResult } from '../types';

export const computeZArray = (s: string): { z: number[], steps: Step[] } => {
  const n = s.length;
  const z = new Array(n).fill(0);
  const steps: Step[] = [];
  let l = 0, r = 0;

  steps.push({
    index: 0,
    highlightedIndices: [0],
    matches: [],
    state: { z: [...z], l, r },
    description: "Initializing Z-array. Z[0] is usually not defined or 0."
  });

  for (let i = 1; i < n; i++) {
    steps.push({
      index: i,
      highlightedIndices: [i],
      matches: [],
      state: { z: [...z], l, r },
      description: `Computing Z[${i}]`
    });

    if (i <= r) {
      z[i] = Math.min(r - i + 1, z[i - l]);
      steps.push({
        index: i,
        highlightedIndices: [i, i - l],
        secondaryHighlightedIndices: [l, r],
        matches: [],
        state: { z: [...z], l, r },
        description: `i (${i}) is within [L, R] ([${l}, ${r}]). Initializing Z[${i}] using Z[${i-l}] = ${z[i-l]}`
      });
    }

    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
      steps.push({
        index: i,
        innerIndex: z[i],
        highlightedIndices: [i + z[i]],
        secondaryHighlightedIndices: [z[i]],
        matches: [],
        state: { z: [...z], l, r },
        description: `Comparing s[${z[i]}] ('${s[z[i]]}') with s[${i + z[i]}] ('${s[i + z[i]]}') - Match!`
      });
      z[i]++;
    }

    if (i + z[i] - 1 > r) {
      l = i;
      r = i + z[i] - 1;
      steps.push({
        index: i,
        highlightedIndices: [i],
        matches: [],
        state: { z: [...z], l, r },
        description: `Updating [L, R] to [${l}, ${r}]`
      });
    }

    steps.push({
      index: i,
      highlightedIndices: [i],
      matches: [],
      state: { z: [...z], l, r },
      description: `Z[${i}] = ${z[i]}`
    });
  }

  return { z, steps };
};

export const zMatch = (text: string, pattern: string): AlgorithmResult => {
  const concat = pattern + "$" + text;
  const { z, steps: zSteps } = computeZArray(concat);
  const m = pattern.length;
  const matches: number[] = [];

  // Filter Z-array for matches (where Z[i] == m)
  for (let i = m + 1; i < concat.length; i++) {
    if (z[i] === m) {
      matches.push(i - m - 1);
    }
  }

  // Combine steps with a bit of mapping if needed, 
  // but for simplicity we'll just return the steps of the Z-computation on the concatenated string
  return {
    steps: zSteps,
    finalResult: matches
  };
};
