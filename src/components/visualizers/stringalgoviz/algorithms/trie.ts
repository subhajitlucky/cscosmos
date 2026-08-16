import type { Step, AlgorithmResult } from '../types';

export type TrieNode = {
  children: Record<string, TrieNode>;
  isEndOfWord: boolean;
  char?: string;
  id: string;
};

export const trieInsert = (words: string[]): AlgorithmResult => {
  const steps: Step[] = [];
  const root: TrieNode = { children: {}, isEndOfWord: false, id: 'root' };
  let nodeCounter = 0;

  words.forEach((word, wordIdx) => {
    let curr = root;
    steps.push({
      index: wordIdx,
      highlightedIndices: [],
      matches: [],
      state: { root: JSON.parse(JSON.stringify(root)), currentWord: word, phase: 'start' },
      description: `Inserting word: "${word}"`
    });

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!curr.children[char]) {
        curr.children[char] = { 
          children: {}, 
          isEndOfWord: false, 
          char, 
          id: `node-${nodeCounter++}` 
        };
      }
      curr = curr.children[char];
      
      steps.push({
        index: wordIdx,
        innerIndex: i,
        highlightedIndices: [i],
        matches: [],
        state: { root: JSON.parse(JSON.stringify(root)), currentWord: word, activeNodeId: curr.id },
        description: `Processing '${char}' in "${word}"`
      });
    }
    curr.isEndOfWord = true;
    steps.push({
      index: wordIdx,
      highlightedIndices: [],
      matches: [],
      state: { root: JSON.parse(JSON.stringify(root)), currentWord: word, activeNodeId: curr.id },
      description: `Marked end of word: "${word}"`
    });
  });

  return {
    steps,
    finalResult: root
  };
};
