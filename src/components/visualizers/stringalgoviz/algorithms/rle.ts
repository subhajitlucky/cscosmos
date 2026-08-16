import type { Step, AlgorithmResult } from '../types';

export const rleEncode = (text: string): AlgorithmResult => {
  const steps: Step[] = [];
  let result = "";
  const n = text.length;
  
  if (n === 0) return { steps, finalResult: "" };

  let i = 0;
  while (i < n) {
    let count = 1;
    steps.push({
      index: i,
      highlightedIndices: [i],
      matches: [],
      state: { current: text[i], count, result },
      description: `Starting new run for character '${text[i]}'`
    });

    while (i + 1 < n && text[i] === text[i + 1]) {
      i++;
      count++;
      steps.push({
        index: i,
        highlightedIndices: [i],
        matches: [],
        state: { current: text[i], count, result },
        description: `Character matches! Run length for '${text[i]}' is now ${count}`
      });
    }
    
    result += text[i] + count;
    steps.push({
      index: i,
      highlightedIndices: [i],
      matches: [],
      state: { current: text[i], count, result },
      description: `Run ended. Added '${text[i]}${count}' to result.`
    });
    i++;
  }

  return {
    steps,
    finalResult: result
  };
};
