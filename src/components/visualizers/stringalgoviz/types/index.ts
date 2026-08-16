export type Step = {
  index: number;
  innerIndex?: number;
  highlightedIndices: number[];
  secondaryHighlightedIndices?: number[];
  matches: number[];
  state: any;
  description: string;
};

export type AlgorithmResult = {
  steps: Step[];
  finalResult: any;
};

export type Topic = {
  id: string;
  title: string;
  description: string;
  path: string;
  category: 'Basics' | 'Naive' | 'Efficient' | 'Prefix/Suffix' | 'Multiple' | 'Advanced';
  complexity: {
    time: string;
    space: string;
  };
};