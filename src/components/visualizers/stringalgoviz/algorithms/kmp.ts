import type { Step, AlgorithmResult } from '../types';

export const computePrefixFunction = (pattern: string): { pi: number[], steps: Step[] } => {
  const m = pattern.length;
  const pi = new Array(m).fill(0);
  const steps: Step[] = [];
  
  steps.push({
    index: 0,
    highlightedIndices: [0],
    matches: [],
    state: { pi: [...pi], k: 0, q: 1 },
    description: "Initialize pi[0] = 0. Starting from the second character."
  });

  let k = 0;
  for (let q = 1; q < m; q++) {
    steps.push({
      index: q,
      innerIndex: k,
      highlightedIndices: [q],
      secondaryHighlightedIndices: [k],
      matches: [],
      state: { pi: [...pi], k, q },
      description: `Comparing pattern[${q}] ('${pattern[q]}') with pattern[${k}] ('${pattern[k]}')`
    });

    while (k > 0 && pattern[k] !== pattern[q]) {
      const prevK = k;
      k = pi[k - 1];
      steps.push({
        index: q,
        innerIndex: k,
        highlightedIndices: [q],
        secondaryHighlightedIndices: [k],
        matches: [],
        state: { pi: [...pi], k, q },
        description: `Mismatch! Backtracking k from ${prevK} to pi[${prevK}-1] = ${k}`
      });
    }

    if (pattern[k] === pattern[q]) {
      k++;
      steps.push({
        index: q,
        innerIndex: k - 1,
        highlightedIndices: [q],
        secondaryHighlightedIndices: [k - 1],
        matches: [],
        state: { pi: [...pi], k, q },
        description: `Match! Increasing k to ${k}`
      });
    }

    pi[q] = k;
    steps.push({
      index: q,
      highlightedIndices: [q],
      matches: [],
      state: { pi: [...pi], k, q },
      description: `Setting pi[${q}] = ${k}`
    });
  }

  return { pi, steps };
};

export const kmpMatch = (text: string, pattern: string): AlgorithmResult => {
  const { pi } = computePrefixFunction(pattern);
  const n = text.length;
  const m = pattern.length;
  const steps: Step[] = [];
  const matches: number[] = [];

  // Add a special state to mark end of prefix function computation
  steps.push({
    index: 0,
    highlightedIndices: [],
    matches: [],
    state: { pi, phase: 'matching' },
    description: "Prefix function computed. Starting pattern matching phase."
  });

  let q = 0; // number of characters matched
  for (let i = 0; i < n; i++) {
    steps.push({
      index: i,
      innerIndex: q,
      highlightedIndices: [i],
      secondaryHighlightedIndices: [q],
      matches: [...matches],
      state: { pi, q, i },
      description: `Comparing text[${i}] ('${text[i]}') with pattern[${q}] ('${pattern[q]}')`
    });

    while (q > 0 && pattern[q] !== text[i]) {
      const prevQ = q;
      q = pi[q - 1];
      steps.push({
        index: i,
        innerIndex: q,
        highlightedIndices: [i],
        secondaryHighlightedIndices: [q],
        matches: [...matches],
        state: { pi, q, i },
        description: `Mismatch! Jumping from q=${prevQ} to pi[${prevQ}-1]=${q}`
      });
    }

    if (pattern[q] === text[i]) {
      q++;
      steps.push({
        index: i,
        innerIndex: q - 1,
        highlightedIndices: [i],
        secondaryHighlightedIndices: [q - 1],
        matches: [...matches],
        state: { pi, q, i },
        description: `Match! Character matches. Pattern pointer q now at ${q}`
      });
    }

    if (q === m) {
      matches.push(i - m + 1);
      steps.push({
        index: i,
        innerIndex: q - 1,
        highlightedIndices: Array.from({ length: m }, (_, k) => i - m + 1 + k),
        secondaryHighlightedIndices: Array.from({ length: m }, (_, k) => k),
        matches: [...matches],
        state: { pi, q, i },
        description: `Full pattern match found at index ${i - m + 1}!`
      });
      q = pi[q - 1];
      steps.push({
        index: i,
        innerIndex: q,
        highlightedIndices: [i],
        secondaryHighlightedIndices: [q],
        matches: [...matches],
        state: { pi, q, i },
        description: `Resetting q to pi[${m}-1] = ${q} to look for next match.`
      });
    }
  }

  return {
    steps,
    finalResult: matches
  };
};
