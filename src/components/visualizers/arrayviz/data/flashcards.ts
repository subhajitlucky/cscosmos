export interface ArrayFlashcard {
  id: string;
  category: 'Memory & Hardware Caches' | 'Two-Pointer & Sliding Window' | 'String Pattern Matching' | 'Advanced Algorithms';
  question: string;
  answer: string;
  code?: string;
  tip: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export const ARRAY_FLASHCARDS: ArrayFlashcard[] = [
  {
    id: 'af-1',
    category: 'Memory & Hardware Caches',
    difficulty: 'Junior',
    question: 'Why does accessing an array element arr[i] take O(1) time regardless of the size of the array?',
    answer: 'Because arrays are stored contiguously in RAM. The CPU computes the exact physical memory address in a single multiplication and addition instruction: BaseAddress + (i * sizeof(Type)), jumping directly to the memory address in constant hardware cycles.',
    code: `// Hardware address formula:
uintptr_t target = base + (index * 4); // for 4-byte integers`,
    tip: 'Contiguous memory layout enables instantaneous address computation without traversing pointers.'
  },
  {
    id: 'af-2',
    category: 'Memory & Hardware Caches',
    difficulty: 'Mid',
    question: 'Why is traversing a 2D matrix in Row-Major order drastically faster than Column-Major order?',
    answer: 'Modern CPUs load memory in 64-byte Cache Lines into L1/L2 caches. Row-major traversal accesses adjacent sequential memory bytes, causing 1 cache miss every 16 integers while the other 15 are instant cache hits. Column-major traversal jumps across rows (stride = row size), causing a cache miss on almost every single access.',
    code: `// Row-Major: matrix[i][j] (Sequential, 99% L1 cache hits)
// Column-Major: matrix[j][i] (Strided, severe cache thrashing)`,
    tip: 'Always order nested loops so the innermost loop iterates across contiguous memory.'
  },
  {
    id: 'af-3',
    category: 'String Pattern Matching',
    difficulty: 'Senior',
    question: 'How does the KMP algorithm achieve O(N + M) time without backtracking the text pointer?',
    answer: 'By precomputing the Longest Prefix Suffix (LPS) array on the pattern. When a character mismatch occurs at pattern index j, instead of resetting the text pointer i to the beginning, KMP sets j = LPS[j - 1], preserving previously matched prefix characters and keeping the text pointer strictly moving forward.',
    code: `if (text[i] != pattern[j]) {
  if (j != 0) j = lps[j - 1]; // Shift pattern without moving i!
  else i++;
}`,
    tip: 'The text pointer i NEVER decreases in KMP, guaranteeing linear O(N) traversal.'
  },
  {
    id: 'af-4',
    category: 'Two-Pointer & Sliding Window',
    difficulty: 'Mid',
    question: 'What is the key condition required to use the Two-Pointer technique for target sum problems?',
    answer: 'The array must possess a monotonic property (e.g. sorted order). Moving the left pointer to the right must strictly increase the sum, and moving the right pointer to the left must strictly decrease the sum. Without monotonicity, pointer movement decisions cannot be made deterministically in O(1).',
    code: `// if sum < target: left++ (Increases sum)
// if sum > target: right-- (Decreases sum)`,
    tip: 'If the array is unsorted, either sort it in O(N log N) or use a Hash Map in O(N) time and space.'
  },
  {
    id: 'af-5',
    category: 'Advanced Algorithms',
    difficulty: 'Staff',
    question: 'How does the aggregate method prove amortized O(1) time complexity for dynamic array doubling?',
    answer: 'When an array doubles from N to 2N, N elements are copied. Across N insertions, the total number of element copies is 1 + 2 + 4 + 8 + ... + N/2 + N = 2N - 1 copies. Total operations for N insertions = N (direct inserts) + 2N (copies) = 3N operations. Dividing total cost by N gives 3N / N = 3 operations per insert = strictly O(1) amortized.',
    code: `// Total Cost <= 3N operations for N pushes -> Amortized O(1)`,
    tip: 'Geometric doubling is mathematically required; linear resizing (+K) degrades performance to O(N^2).'
  }
];
