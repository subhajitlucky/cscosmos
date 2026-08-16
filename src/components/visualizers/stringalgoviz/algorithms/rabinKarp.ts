import type { Step, AlgorithmResult } from '../types';

export const rabinKarpMatch = (text: string, pattern: string): AlgorithmResult => {
  const n = text.length;
  const m = pattern.length;
  const steps: Step[] = [];
  const matches: number[] = [];
  
  const d = 256; // Radix
  const q = 101; // A prime number
  
  let h = 1;
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }
  
  let p = 0; // hash value for pattern
  let t = 0; // hash value for text
  
  // Precompute initial hashes
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }
  
  steps.push({
    index: 0,
    highlightedIndices: Array.from({ length: m }, (_, k) => k),
    matches: [],
    state: { p, t, phase: 'initial' },
    description: `Initial hashes computed. Pattern hash: ${p}, Text window hash: ${t}`
  });

  for (let i = 0; i <= n - m; i++) {
    steps.push({
      index: i,
      highlightedIndices: Array.from({ length: m }, (_, k) => i + k),
      matches: [...matches],
      state: { p, t, currentPos: i },
      description: `Comparing hashes at index ${i}. Text hash: ${t}, Pattern hash: ${p}`
    });

    if (p === t) {
      steps.push({
        index: i,
        highlightedIndices: Array.from({ length: m }, (_, k) => i + k),
        matches: [...matches],
        state: { p, t, currentPos: i, phase: 'collision' },
        description: `Hash match! Verifying character by character...`
      });

      let j = 0;
      for (j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) break;
      }
      
      if (j === m) {
        matches.push(i);
        steps.push({
          index: i,
          highlightedIndices: Array.from({ length: m }, (_, k) => i + k),
          matches: [...matches],
          state: { p, t, currentPos: i, phase: 'match' },
          description: `Full match found at index ${i}!`
        });
      }
    }
    
    if (i < n - m) {
      const prevT = t;
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t = (t + q);
      
      steps.push({
        index: i + 1,
        highlightedIndices: Array.from({ length: m }, (_, k) => i + 1 + k),
        matches: [...matches],
        state: { p, t, prevT, i, nextChar: text[i+m], outChar: text[i] },
        description: `Rolling hash: Removing '${text[i]}', adding '${text[i+m]}'. New hash: ${t}`
      });
    }
  }

  return {
    steps,
    finalResult: matches
  };
};
