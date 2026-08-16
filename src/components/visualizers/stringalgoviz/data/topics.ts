import type { Topic } from '../types';

export const TOPICS: Topic[] = [
  // Basics & Encoding
  {
    id: 'intro-to-strings',
    title: 'What is a String?',
    description: 'The fundamental building block of text processing and memory representation.',
    path: '/learn/intro-to-strings',
    category: 'Basics',
    complexity: { time: 'O(1)', space: 'O(N)' }
  },
  {
    id: 'ascii-encoding',
    title: 'ASCII Encoding',
    description: 'How characters were originally mapped to 7-bit numeric values.',
    path: '/learn/ascii-encoding',
    category: 'Basics',
    complexity: { time: 'O(1)', space: 'O(1)' }
  },
  {
    id: 'utf8-encoding',
    title: 'Unicode & UTF-8',
    description: 'The variable-width standard for global text representation.',
    path: '/learn/utf8-encoding',
    category: 'Basics',
    complexity: { time: 'O(1)', space: 'O(1-4 bytes)' }
  },
  {
    id: 'utf16-utf32',
    title: 'UTF-16 and UTF-32',
    description: 'Fixed and variable width encodings used in modern environments.',
    path: '/learn/utf16-utf32',
    category: 'Basics',
    complexity: { time: 'O(1)', space: 'O(2-4 bytes)' }
  },
  {
    id: 'code-points-units',
    title: 'Code Units vs Code Points',
    description: 'Understanding the difference between storage units and character identities.',
    path: '/learn/code-points-units',
    category: 'Basics',
    complexity: { time: 'O(1)', space: 'O(1)' }
  },
  {
    id: 'grapheme-clusters',
    title: 'Grapheme Clusters',
    description: 'Why one "user-perceived character" might be multiple code points.',
    path: '/learn/grapheme-clusters',
    category: 'Basics',
    complexity: { time: 'O(N)', space: 'O(1)' }
  },
  {
    id: 'indexing-pitfalls',
    title: 'String Indexing Pitfalls',
    description: 'Why O(1) indexing is often a lie in modern string implementations.',
    path: '/learn/indexing-pitfalls',
    category: 'Basics',
    complexity: { time: 'O(N)', space: 'O(1)' }
  },
  {
    id: 'substring-ops',
    title: 'Substring Operations',
    description: 'Visualizing slicing, concatenation, and memory views.',
    path: '/learn/substring-ops',
    category: 'Basics',
    complexity: { time: 'O(K)', space: 'O(K)' }
  },

  // Naive Pattern Matching
  {
    id: 'naive-matching',
    title: 'Naive Pattern Matching',
    description: 'The brute-force approach to finding a substring.',
    path: '/learn/naive-matching',
    category: 'Naive',
    complexity: { time: 'O(N * M)', space: 'O(1)' }
  },

  // Efficient Pattern Matching
  {
    id: 'prefix-function',
    title: 'Prefix Function',
    description: 'Precomputing the Pi table for optimized jumping.',
    path: '/learn/prefix-function',
    category: 'Prefix/Suffix',
    complexity: { time: 'O(M)', space: 'O(M)' }
  },
  {
    id: 'kmp-algorithm',
    title: 'KMP Algorithm',
    description: 'Linear time pattern matching using the prefix function.',
    path: '/learn/kmp-algorithm',
    category: 'Efficient',
    complexity: { time: 'O(N + M)', space: 'O(M)' }
  },
  {
    id: 'boyer-moore',
    title: 'Boyer-Moore Algorithm',
    description: 'The standard for practical string search, skipping text using two heuristics.',
    path: '/learn/boyer-moore',
    category: 'Efficient',
    complexity: { time: 'O(N/M) avg', space: 'O(M + alphabet)' }
  },
  {
    id: 'z-algorithm',
    title: 'Z Algorithm',
    description: 'Pattern matching using the Z-array technique.',
    path: '/learn/z-algorithm',
    category: 'Efficient',
    complexity: { time: 'O(N + M)', space: 'O(N)' }
  },
  {
    id: 'rabin-karp',
    title: 'Rabin-Karp Algorithm',
    description: 'Pattern matching using rolling hashes.',
    path: '/learn/rabin-karp',
    category: 'Efficient',
    complexity: { time: 'O(N + M)', space: 'O(1)' }
  },
  {
    id: 'rolling-hash',
    title: 'Rolling Hash',
    description: 'How to update a hash in O(1) as a window slides.',
    path: '/learn/rolling-hash',
    category: 'Efficient',
    complexity: { time: 'O(1)', space: 'O(1)' }
  },
  {
    id: 'collision-handling',
    title: 'Collision Handling',
    description: 'Dealing with hash collisions in string matching.',
    path: '/learn/collision-handling',
    category: 'Efficient',
    complexity: { time: 'O(1)', space: 'O(1)' }
  },

  // Advanced String Algorithms
  {
    id: 'suffix-arrays',
    title: 'Suffix Arrays',
    description: 'A sorted array of all suffixes of a string.',
    path: '/learn/suffix-arrays',
    category: 'Advanced',
    complexity: { time: 'O(N log N)', space: 'O(N)' }
  },
  {
    id: 'suffix-trees',
    title: 'Suffix Trees',
    description: 'The ultimate compressed trie of all suffixes.',
    path: '/learn/suffix-trees',
    category: 'Advanced',
    complexity: { time: 'O(N)', space: 'O(N)' }
  },
  {
    id: 'lcp-array',
    title: 'Longest Common Prefix (LCP)',
    description: 'Computing common prefixes between sorted suffixes.',
    path: '/learn/lcp-array',
    category: 'Advanced',
    complexity: { time: 'O(N)', space: 'O(N)' }
  },
  {
    id: 'aho-corasick',
    title: 'Aho-Corasick Algorithm',
    description: 'Multiple pattern matching using an automaton.',
    path: '/learn/aho-corasick',
    category: 'Multiple',
    complexity: { time: 'O(N + M + K)', space: 'O(M)' }
  },
  {
    id: 'trie-search',
    title: 'Trie-Based String Search',
    description: 'Building and searching prefix trees.',
    path: '/learn/trie-search',
    category: 'Multiple',
    complexity: { time: 'O(M)', space: 'O(M * alphabet)' }
  },

  // Compression & Practical
  {
    id: 'compression-concepts',
    title: 'String Compression Concepts',
    description: 'The fundamentals of reducing string storage size.',
    path: '/learn/compression-concepts',
    category: 'Advanced',
    complexity: { time: 'O(N)', space: 'O(N)' }
  },
  {
    id: 'run-length-encoding',
    title: 'Run-Length Encoding',
    description: 'The simplest lossless compression technique.',
    path: '/learn/run-length-encoding',
    category: 'Advanced',
    complexity: { time: 'O(N)', space: 'O(1)' }
  },
  {
    id: 'burrows-wheeler',
    title: 'Burrows-Wheeler Transform',
    description: 'Rearranging strings for better compression.',
    path: '/learn/burrows-wheeler',
    category: 'Advanced',
    complexity: { time: 'O(N)', space: 'O(N)' }
  },
  {
    id: 'matching-in-practice',
    title: 'String Matching in Practice',
    description: 'How real-world tools like grep and ripgrep work.',
    path: '/learn/matching-in-practice',
    category: 'Advanced',
    complexity: { time: 'O(N)', space: 'O(1)' }
  }
];

export const CATEGORIES = [
  'Basics',
  'Naive',
  'Efficient',
  'Prefix/Suffix',
  'Multiple',
  'Advanced'
] as const;