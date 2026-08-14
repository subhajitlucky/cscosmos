export interface ArrayTopic {
  id: string;
  title: string;
  category: 'memory' | 'two-pointer' | 'sliding-window' | 'string-search' | 'advanced-strings' | 'optimization';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
}

export const ARRAY_TOPICS: ArrayTopic[] = [
  {
    id: 'contiguous-memory-indexing',
    title: 'Contiguous Physical RAM Layout & O(1) Address Arithmetic',
    category: 'memory',
    difficulty: 'Beginner',
    summary: 'An array stores elements in adjacent, unbroken physical memory bytes. Finding any index i takes strictly O(1) time via the pointer arithmetic formula: Address(A[i]) = BaseAddress + i * sizeof(Type).',
    mentalModel: 'The Street of Identical Townhouses: The first house is #100. Each house is exactly 8 meters wide. To visit house #5, you do not walk past houses 1, 2, 3, and 4; you calculate 100 + 5 * 8 = 140 meters and teleport directly to the door.',
    codeSnippet: `// Pointer arithmetic in C / Low-level systems:
// int arr[5] = { 10, 20, 30, 40, 50 }; // sizeof(int) = 4 bytes
// Base Address = 0x1000

// Address of arr[3]:
// 0x1000 + (3 * 4) = 0x100C -> Direct O(1) hardware CPU memory fetch!`,
    takeaways: [
      'Constant Time Random Access: Accessing arr[0] and arr[1,000,000] takes the exact same number of CPU cycles.',
      'Contiguity Requirement: Arrays cannot be fragmented across different RAM regions; they require a single contiguous free block in virtual memory.',
      '0-Indexed Offset: The index represents the distance (offset) from the base memory pointer.'
    ],
    commonPitfall: {
      mistake: 'Assuming linked lists have similar cache performance to arrays because both represent sequences of data.',
      fix: 'Remember that linked list nodes are scattered across arbitrary heap locations, causing severe CPU cache misses on every pointer hop.'
    },
    nextTopicId: 'cpu-cache-lines-spatial-locality'
  },
  {
    id: 'cpu-cache-lines-spatial-locality',
    title: 'CPU Cache Lines (64-Byte) & Spatial Locality of Reference',
    category: 'memory',
    difficulty: 'Intermediate',
    summary: 'CPUs fetch memory in 64-byte chunks called Cache Lines into ultra-fast L1/L2/L3 caches. Traversing arrays sequentially triggers automatic hardware prefetching, achieving 100x faster execution than random pointer chasing.',
    mentalModel: 'The Egg Carton in the Kitchen: When you cook breakfast, you do not walk to the grocery store for 1 egg; you bring home a 12-egg carton to the kitchen counter. Accessing the next 11 eggs takes zero travel time.',
    codeSnippet: `// Row-Major (Cache-Friendly - Fast Sequential 64-byte prefetch):
for (int i = 0; i < ROWS; i++) {
  for (int j = 0; j < COLS; j++) {
    sum += matrix[i][j]; // 1 Cache Miss every 16 integers!
  }
}

// Column-Major (Cache-Catastrophic - 100x slower strided access):
for (int j = 0; j < COLS; j++) {
  for (int i = 0; i < ROWS; i++) {
    sum += matrix[i][j]; // Cache Miss on EVERY single iteration!
  }
}`,
    takeaways: [
      'Spatial Locality: If memory address X is accessed, addresses X+1 through X+15 are preloaded into L1 cache for free.',
      '64-Byte Cache Line: Holds 16 32-bit integers or 8 64-bit pointers.',
      'Sequential iteration over arrays is one of the fastest operations modern CPUs can perform.'
    ],
    commonPitfall: {
      mistake: 'Iterating 2D arrays in column-major order (matrix[i][j] where outer loop is j), destroying CPU cache hit ratios.',
      fix: 'Always loop over the innermost contiguous dimension first (row-major order in C/C++/Java/JS).'
    },
    nextTopicId: 'dynamic-array-amortized-doubling'
  },
  {
    id: 'dynamic-array-amortized-doubling',
    title: 'Dynamic Array Resizing & Amortized O(1) Complexity',
    category: 'memory',
    difficulty: 'Intermediate',
    summary: 'Dynamic arrays (std::vector, ArrayList, Python list, JS Array) automatically double their backing storage capacity (2 -> 4 -> 8 -> 16) when full, reallocating memory and copying elements in amortized O(1) time.',
    mentalModel: 'The Growing Family Home: Instead of moving house every time you buy 1 new shirt, you build a home with twice as many rooms as you currently need. Moving is expensive, but it happens so rarely that the cost per shirt is negligible.',
    codeSnippet: `// Dynamic Array Amortized Analysis (Geometric Doubling):
// Insertions: 1, 2, 3, 4, 5, 6, 7, 8
// Resizing Copies: 1 + 2 + 4 = 7 copies total for 8 insertions!
// Total Cost = N insertions + (2N - 1) copies <= 3N operations -> O(1) Amortized!

function push(element) {
  if (this.size === this.capacity) {
    this.resize(this.capacity * 2); // Double capacity
  }
  this.buffer[this.size++] = element;
}`,
    takeaways: [
      'Amortized O(1): While a single insertion may take O(N) during reallocation, the average cost across N insertions is strictly O(1).',
      'Geometric Doubling: Multiplying capacity by a constant factor (typically 1.5x or 2.0x) is required for amortized O(1); adding a fixed amount (+10) causes catastrophic O(N^2) total runtime.'
    ],
    commonPitfall: {
      mistake: 'Growing an array by a fixed constant size (e.g. capacity += 10), resulting in O(N^2) total copy overhead.',
      fix: 'Always use geometric doubling (capacity *= 2) or preallocate capacity with vector.reserve(N).'
    },
    nextTopicId: 'two-pointer-opposite-ends'
  },
  {
    id: 'two-pointer-opposite-ends',
    title: 'Two-Pointer Technique: Opposite Ends & In-Place Convergence',
    category: 'two-pointer',
    difficulty: 'Intermediate',
    summary: 'Two pointers starting at opposite ends (left = 0, right = N - 1) converge toward the center, eliminating nested loops from O(N^2) down to O(N) by exploiting monotonicity in sorted arrays.',
    mentalModel: 'The Vice Grips: Two metal clamps move toward each other from the left and right ends of a wooden beam, narrowing down the target location in a single pass.',
    codeSnippet: `// Two Sum II (Sorted Array) - O(N) Time, O(1) Space:
function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++; // Sum is too small, move left pointer right to increase sum
    } else {
      right--; // Sum is too large, move right pointer left to decrease sum
    }
  }
  return [];
}`,
    takeaways: [
      'Monotonicity Requirement: Moving left pointer strictly increases sum; moving right pointer strictly decreases sum.',
      'Space Optimization: Operates with O(1) auxiliary memory without requiring hash maps.',
      'Classic Applications: Palindrome verification, Container With Most Water, 3Sum, Trapping Rain Water.'
    ],
    commonPitfall: {
      mistake: 'Applying opposite-end two pointers to unsorted arrays without sorting first, breaking the monotonic direction invariant.',
      fix: 'Ensure the array is sorted before applying directional convergence.'
    },
    nextTopicId: 'sliding-window-fixed-variable'
  },
  {
    id: 'sliding-window-fixed-variable',
    title: 'Sliding Window Technique: Fixed vs Dynamic Windows',
    category: 'sliding-window',
    difficulty: 'Intermediate',
    summary: 'A sliding window maintains a contiguous subarray [left, right], incrementally adding elements at the right boundary and removing elements at the left boundary in linear O(N) time.',
    mentalModel: 'The Magnifying Glass on a Sentence: You slide a magnifying glass of width K along a text line. As new letters enter on the right, old letters leave on the left, keeping track of letter frequencies with zero re-scanning.',
    codeSnippet: `// Dynamic Sliding Window: Longest Substring Without Repeating Characters:
function lengthOfLongestSubstring(s: string): number {
  const seen = new Map<string, number>();
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (seen.has(char) && seen.get(char)! >= left) {
      left = seen.get(char)! + 1; // Shrink window past duplicate
    }
    seen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    takeaways: [
      'Avoids O(N^2) Recomputation: Calculates running window state (sum, character frequency, minimum) incrementally in O(1) per step.',
      'Fixed Window: Window size K remains constant (e.g. Max Subarray of size K).',
      'Dynamic Window: Window expands on the right to satisfy a condition, and contracts on the left to restore validity.'
    ],
    commonPitfall: {
      mistake: 'Re-evaluating the entire window content on every iteration (e.g. recalculating window sum from scratch with a loop).',
      fix: 'Update the window state incrementally: windowSum += nums[right] - nums[left].'
    },
    nextTopicId: 'kmp-knuth-morris-pratt'
  },
  {
    id: 'kmp-knuth-morris-pratt',
    title: 'Knuth-Morris-Pratt (KMP) String Pattern Matching & LPS Array',
    category: 'string-search',
    difficulty: 'Advanced',
    summary: 'KMP eliminates backtracking in naive string matching (O(N * M)) down to linear O(N + M) by precomputing the Longest Prefix Suffix (LPS) table to skip redundant character comparisons.',
    mentalModel: 'The Bookmark in the Book: When reading and encountering a typo at letter 6 of a word, you do not flip back to the beginning of the chapter; your bookmark tells you exactly which prefix letters you already matched.',
    codeSnippet: `// Build Longest Prefix Suffix (LPS) Array:
function buildLPS(pattern: string): number[] {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1]; // Fallback to previous longest prefix
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  return lps;
}`,
    takeaways: [
      'LPS[i]: Stores the length of the longest proper prefix of pattern[0..i] that is also a suffix of pattern[0..i].',
      'Zero Backtracking: The text index pointer i NEVER moves backward, ensuring strictly linear O(N) execution time.',
      'Optimal for searching repetitive patterns (e.g. searching "AAAAAB" in "AAAAAAAAB").'
    ],
    commonPitfall: {
      mistake: 'Resetting the pattern index to 0 upon mismatch instead of using lps[j - 1], degrading KMP into naive O(N * M) search.',
      fix: 'Always transition to j = lps[j - 1] on mismatch when j > 0.'
    },
    nextTopicId: 'rabin-karp-rolling-hash'
  },
  {
    id: 'rabin-karp-rolling-hash',
    title: 'Rabin-Karp Rolling Hash & Modular String Matching',
    category: 'string-search',
    difficulty: 'Advanced',
    summary: 'Rabin-Karp computes a polynomial rolling hash over sliding string windows, enabling O(1) hash updates by shifting the window: Hash_new = ((Hash_old - OutChar * Base^(M-1)) * Base + InChar) % Modulo.',
    mentalModel: 'The Odometer on a Car: When your car odometer rolls from 199 to 200, the computer does not recount every mile from 0; it subtracts the leading 100 and adds the new digit in a single turn.',
    codeSnippet: `// Rabin-Karp Rolling Hash Update in O(1):
// Given pattern length M, Base B = 256, Prime Q = 101:
// NewHash = ((OldHash - oldChar * B^(M-1)) * B + newChar) % Q

function rollingHash(oldHash: number, outChar: string, inChar: string, highPower: number, base = 256, prime = 1000000007): number {
  let h = (oldHash - outChar.charCodeAt(0) * highPower) % prime;
  if (h < 0) h += prime;
  h = (h * base + inChar.charCodeAt(0)) % prime;
  return h;
}`,
    takeaways: [
      'Average Time Complexity: O(N + M) expected time when using a large prime modulus.',
      'Plagiarism Detection: Excellent for multi-pattern search where millions of document hashes are stored in a hash table.',
      'Spurious Hits: When hashes match, a character-by-character check verifies against hash collisions.'
    ],
    commonPitfall: {
      mistake: 'Ignoring integer overflow and negative modulo results in JavaScript/C++ during rolling hash subtraction.',
      fix: 'Always add the prime modulus if the intermediate hash becomes negative: if (h < 0) h += prime.'
    }
  }
];
