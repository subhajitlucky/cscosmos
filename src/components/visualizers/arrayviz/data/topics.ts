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
    codeSnippet: `function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++; // Sum is too small, move left pointer right
    } else {
      right--; // Sum is too large, move right pointer left
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
    nextTopicId: 'fast-and-slow-pointers'
  },
  {
    id: 'fast-and-slow-pointers',
    title: 'Fast and Slow Pointers (Floyd\'s Cycle Finding Algorithm)',
    category: 'two-pointer',
    difficulty: 'Intermediate',
    summary: 'Two pointers moving at different speeds (slow by 1 step, fast by 2 steps) detect cycles and find middle elements in linear O(N) time with O(1) space.',
    mentalModel: 'The Runners on a Circular Track: If two runners jog on a circular running track where one runs twice as fast as the other, the faster runner is mathematically guaranteed to lap and meet the slower runner.',
    codeSnippet: `function findDuplicate(nums: number[]): number {
  let slow = nums[0];
  let fast = nums[0];

  // Phase 1: Detect cycle
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  // Phase 2: Find cycle entrance
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
    takeaways: [
      'Cycle Detection: Fast and slow pointers meet inside the cycle in O(N) time.',
      'Middle of Array/List: When fast reaches the end, slow is precisely at the midpoint N/2.'
    ],
    commonPitfall: {
      mistake: 'Using hash sets for cycle detection on memory-constrained systems, wasting O(N) auxiliary RAM.',
      fix: 'Use Floyd\'s fast and slow pointer algorithm for O(1) space.'
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
    codeSnippet: `function lengthOfLongestSubstring(s: string): number {
  const seen = new Map<string, number>();
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (seen.has(char) && seen.get(char)! >= left) {
      left = seen.get(char)! + 1;
    }
    seen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    takeaways: [
      'Avoids O(N^2) Recomputation: Calculates running window state incrementally in O(1) per step.',
      'Fixed Window: Window size K remains constant.',
      'Dynamic Window: Expands on right and contracts on left to maintain validity.'
    ],
    commonPitfall: {
      mistake: 'Re-evaluating the entire window content on every iteration with a nested loop.',
      fix: 'Update the window state incrementally in O(1).'
    },
    nextTopicId: 'prefix-sum-range-queries'
  },
  {
    id: 'prefix-sum-range-queries',
    title: 'Prefix Sums & O(1) Range Queries',
    category: 'optimization',
    difficulty: 'Intermediate',
    summary: 'A Prefix Sum array precomputes cumulative totals: P[i] = P[i-1] + arr[i]. Any range sum query sum(L, R) is answered in O(1) time via P[R] - P[L-1].',
    mentalModel: 'The Mileage Markers on a Highway: Marker at Mile 50 and Mile 120. Distance between them = 120 - 50 = 70 miles in a single subtraction without measuring each road segment.',
    codeSnippet: `class PrefixSum {
  prefix: number[];
  constructor(nums: number[]) {
    this.prefix = [0];
    for (let i = 0; i < nums.length; i++) {
      this.prefix.push(this.prefix[i] + nums[i]);
    }
  }
  query(L: number, R: number): number {
    return this.prefix[R + 1] - this.prefix[L]; // O(1) instant range sum!
  }
}`,
    takeaways: [
      'O(1) Range Queries: Reduces Q range queries from O(Q * N) down to O(Q + N).',
      'Difference Array: Allows range updates arr[L..R] += V in O(1) time.'
    ],
    commonPitfall: {
      mistake: 'Off-by-one errors with array bounds when L = 0.',
      fix: 'Use a 1-indexed prefix array with prefix[0] = 0.'
    },
    nextTopicId: 'kadane-maximum-subarray'
  },
  {
    id: 'kadane-maximum-subarray',
    title: 'Kadane\'s Algorithm: Maximum Subarray Sum in Linear Time',
    category: 'optimization',
    difficulty: 'Intermediate',
    summary: 'Kadane\'s algorithm finds the contiguous subarray with maximum sum in O(N) time by making a greedy dynamic programming choice at each element: currMax = max(arr[i], currMax + arr[i]).',
    mentalModel: 'The Gambling Streak: If your past cumulative profit is positive, you keep playing; if past losses exceed current earnings, you cut your losses, throw away past history, and start a fresh streak today.',
    codeSnippet: `function maxSubArray(nums: number[]): number {
  let maxSoFar = nums[0];
  let currMax = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currMax = Math.max(nums[i], currMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
}`,
    takeaways: [
      'Linear O(N) Time: Evaluates all contiguous subarray combinations in a single forward pass.',
      'O(1) Space: Maintains only two running scalar variables.'
    ],
    commonPitfall: {
      mistake: 'Initializing maxSoFar to 0 instead of nums[0], failing when all array numbers are negative.',
      fix: 'Initialize both maxSoFar and currMax to nums[0].'
    },
    nextTopicId: 'dutch-national-flag-three-way'
  },
  {
    id: 'dutch-national-flag-three-way',
    title: 'Dutch National Flag: In-Place 3-Way Partitioning',
    category: 'two-pointer',
    difficulty: 'Advanced',
    summary: 'Dijkstra\'s Dutch National Flag algorithm partitions an array into three buckets (e.g. 0s, 1s, 2s or < pivot, == pivot, > pivot) in-place in a single pass with 3 pointers (low, mid, high).',
    mentalModel: 'The Sorting Hopper: Items drop into the middle (mid). Red balls (0) are tossed left (low++), blue balls (2) are tossed right (high--), and white balls (1) stay in place (mid++).',
    codeSnippet: `function sortColors(nums: number[]): void {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--; // mid pointer stays to evaluate swapped item
    }
  }
}`,
    takeaways: [
      'Dual-Pivot QuickSort: Fundamental partitioning subroutine in high-performance sorting engines.',
      'O(N) Time, O(1) Space: Guarantees every element is examined at most twice.'
    ],
    commonPitfall: {
      mistake: 'Incrementing the mid pointer after swapping with high, missing un-evaluated elements.',
      fix: 'Only increment mid when swapping with low or when nums[mid] == 1.'
    },
    nextTopicId: 'monotonic-stack-next-greater'
  },
  {
    id: 'monotonic-stack-next-greater',
    title: 'Monotonic Stack: Next Greater Element & Range Minimums',
    category: 'optimization',
    difficulty: 'Advanced',
    summary: 'A Monotonic Stack maintains elements in strictly increasing or decreasing order, solving Next Greater Element, Trapping Rain Water, and Largest Rectangle in Histogram in linear O(N) time.',
    mentalModel: 'The Shadow Cast by Skyscrapers: Taller buildings in front block your view of shorter buildings behind them. Shorter buildings are popped from the skyline stack.',
    codeSnippet: `function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const ans = new Array(n).fill(0);
  const stack: number[] = []; // Indices of temps

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prev = stack.pop()!;
      ans[prev] = i - prev;
    }
    stack.push(i);
  }
  return ans;
}`,
    takeaways: [
      'Strictly O(N) Total Work: Every element is pushed and popped at most once.',
      'Resolves O(N^2) Brute Force: Ideal for finding nearest larger/smaller elements to left or right.'
    ],
    commonPitfall: {
      mistake: 'Storing element values instead of element indices in the monotonic stack.',
      fix: 'Always store indices to calculate distances and positions.'
    },
    nextTopicId: 'string-encoding-utf8-utf16'
  },
  {
    id: 'string-encoding-utf8-utf16',
    title: 'String Memory: UTF-8 vs UTF-16, Code Points & Graphemes',
    category: 'memory',
    difficulty: 'Intermediate',
    summary: 'Strings in modern systems use variable-length encodings: UTF-8 (1 to 4 bytes per code point) vs UTF-16 (2 or 4 bytes via surrogate pairs). Indexing by byte length != indexing by visual character glyphs.',
    mentalModel: 'The Accordion Files: ASCII letters take 1 thin folder (1 byte); emojis take 4 expanded folders (4 bytes). Asking for "character #3" by raw byte offset can slice an emoji in half.',
    codeSnippet: `// JavaScript UTF-16 Surrogate Pair Gotcha:
const emoji = "🔥";
console.log(emoji.length); // 2 (UTF-16 code units, NOT 1!)
console.log([...emoji].length); // 1 (True Unicode code point!)

// In Rust / Go (UTF-8 bytes):
// "🔥".len() == 4 bytes`,
    takeaways: [
      'UTF-8 Efficiency: Backwards compatible with 7-bit ASCII, using 1 byte for English text.',
      'Grapheme Clusters: Complex emojis (family emojis, flags) combine multiple code points via Zero Width Joiners (ZWJ).'
    ],
    commonPitfall: {
      mistake: 'Using s.substring(0, N) on strings containing emojis, creating corrupted surrogate half-characters.',
      fix: 'Use Intl.Segmenter or Array.from(s) for true Unicode character segmentation.'
    },
    nextTopicId: 'kmp-knuth-morris-pratt'
  },
  {
    id: 'kmp-knuth-morris-pratt',
    title: 'Knuth-Morris-Pratt (KMP) String Pattern Matching & LPS Array',
    category: 'string-search',
    difficulty: 'Advanced',
    summary: 'KMP eliminates backtracking in naive string matching (O(N * M)) down to linear O(N + M) by precomputing the Longest Prefix Suffix (LPS) table to skip redundant character comparisons.',
    mentalModel: 'The Bookmark in the Book: When encountering a typo at letter 6 of a word, you do not flip back to page 1; your bookmark tells you exactly which prefix letters you already matched.',
    codeSnippet: `function buildLPS(pattern: string): number[] {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len;
    } else {
      if (len !== 0) len = lps[len - 1];
      else lps[i++] = 0;
    }
  }
  return lps;
}`,
    takeaways: [
      'LPS[i]: Stores the length of the longest proper prefix of pattern[0..i] that is also a suffix.',
      'Zero Backtracking: The text index pointer i NEVER moves backward, ensuring linear O(N) execution time.'
    ],
    commonPitfall: {
      mistake: 'Resetting the pattern index to 0 upon mismatch instead of using lps[j - 1].',
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
    mentalModel: 'The Odometer on a Car: When your car odometer rolls from 199 to 200, the computer subtracts the leading 100 and adds the new digit in a single turn.',
    codeSnippet: `function rollingHash(oldHash: number, outChar: string, inChar: string, highPower: number, base = 256, prime = 1000000007): number {
  let h = (oldHash - outChar.charCodeAt(0) * highPower) % prime;
  if (h < 0) h += prime;
  h = (h * base + inChar.charCodeAt(0)) % prime;
  return h;
}`,
    takeaways: [
      'Average Time Complexity: O(N + M) expected time when using a large prime modulus.',
      'Plagiarism Detection: Excellent for multi-pattern search with millions of documents.'
    ],
    commonPitfall: {
      mistake: 'Ignoring negative modulo results during rolling hash subtraction.',
      fix: 'Always add the prime modulus if intermediate hash becomes negative: if (h < 0) h += prime.'
    },
    nextTopicId: 'z-algorithm-linear-pattern'
  },
  {
    id: 'z-algorithm-linear-pattern',
    title: 'Z-Algorithm: Linear Pattern Matching via Z-Array',
    category: 'string-search',
    difficulty: 'Advanced',
    summary: 'The Z-Algorithm constructs a Z-array in O(N) time where Z[i] is the length of the longest substring starting from s[i] that is also a prefix of s, maintaining a rightmost matching window [L, R].',
    mentalModel: 'The Laser Rangefinder: As you sweep along a wall, you remember the farthest point reached by your previous laser beam [L, R] to skip measuring overlapping sections.',
    codeSnippet: `function buildZArray(s: string): number[] {
  const n = s.length;
  const Z = new Array(n).fill(0);
  let L = 0, R = 0;

  for (let i = 1; i < n; i++) {
    if (i <= R) Z[i] = Math.min(R - i + 1, Z[i - L]);
    while (i + Z[i] < n && s[Z[i]] === s[i + Z[i]]) Z[i]++;
    if (i + Z[i] - 1 > R) {
      L = i;
      R = i + Z[i] - 1;
    }
  }
  return Z;
}`,
    takeaways: [
      'Pattern Matching: Concatenate pattern + "$" + text and find indices where Z[i] == pattern.length.',
      'Strictly O(N) Execution: Inner while loop executes at most N total times across the entire algorithm.'
    ],
    commonPitfall: {
      mistake: 'Omitting a unique delimiter (like "$") when concatenating pattern and text.',
      fix: 'Always use a character not present in the alphabet as a separator.'
    },
    nextTopicId: 'manacher-algorithm-palindromes'
  },
  {
    id: 'manacher-algorithm-palindromes',
    title: 'Manacher\'s Algorithm: Longest Palindromic Substring in O(N)',
    category: 'advanced-strings',
    difficulty: 'Expert',
    summary: 'Manacher\'s algorithm finds the longest palindromic substring in strictly linear O(N) time by inserting virtual delimiters to unify odd/even lengths and exploiting palindromic symmetry around a center.',
    mentalModel: 'The Butterfly Wings: If you know the left wing has a 3cm yellow spot 2cm from the spine, the right wing must have the exact same spot without measuring it again.',
    codeSnippet: `function longestPalindrome(s: string): string {
  const t = "^#" + s.split("").join("#") + "#$";
  const p = new Array(t.length).fill(0);
  let C = 0, R = 0;

  for (let i = 1; i < t.length - 1; i++) {
    const iMirror = 2 * C - i;
    if (R > i) p[i] = Math.min(R - i, p[iMirror]);
    while (t[i + 1 + p[i]] === t[i - 1 - p[i]]) p[i]++;
    if (i + p[i] > R) {
      C = i;
      R = i + p[i];
    }
  }
  // Extract maximum radius palindrome...
  return s;
}`,
    takeaways: [
      'Unifies Odd & Even Palindromes: "#a#b#a#" handles both 3-letter and 4-letter palindromes uniformly.',
      'Linear O(N) Time: Replaces standard O(N^2) center expansion.'
    ],
    commonPitfall: {
      mistake: 'Forgetting to map delimited indices back to original string coordinates.',
      fix: 'Original start index = (center - maxRadius) / 2.'
    },
    nextTopicId: 'boyer-moore-bad-character'
  },
  {
    id: 'boyer-moore-bad-character',
    title: 'Boyer-Moore Search: Bad Character & Good Suffix Rules',
    category: 'string-search',
    difficulty: 'Advanced',
    summary: 'Boyer-Moore searches strings by matching pattern characters right-to-left, skipping up to M characters in a single jump to achieve sublinear O(N/M) average search speed (used in GNU grep).',
    mentalModel: 'Reading From Right to Left: When looking for "ELEPHANT" in text, you check the \'T\' first. If you see \'Z\', you immediately know "ELEPHANT" cannot exist anywhere in those 8 characters and skip past all 8 letters in 1 jump.',
    codeSnippet: `// Boyer-Moore Bad Character Shift Table:
function buildBadCharTable(pattern: string): Map<string, number> {
  const table = new Map<string, number>();
  for (let i = 0; i < pattern.length; i++) {
    table.set(pattern[i], i);
  }
  return table;
}`,
    takeaways: [
      'Sublinear Average Time: O(N / M) average search speed on large alphabets.',
      'Industry Standard: The algorithm behind GNU grep and code editor search engines.'
    ],
    commonPitfall: {
      mistake: 'Assuming Boyer-Moore is always faster on small alphabets (e.g. binary strings where bad character shifts are minimal).',
      fix: 'Use KMP or Bitap on small binary alphabets.'
    },
    nextTopicId: 'trie-prefix-tree-indexing'
  },
  {
    id: 'trie-prefix-tree-indexing',
    title: 'Trie (Prefix Tree) & Autocomplete Dictionaries',
    category: 'advanced-strings',
    difficulty: 'Intermediate',
    summary: 'A Trie is a multi-way tree structure where each node represents a character. Searching, inserting, and prefix matching ("app", "apple", "apply") executes in O(L) time where L is word length.',
    mentalModel: 'The Phonebook Keypad: Pressing \'A\' filters to all A-words; pressing \'P\' narrows to AP-words; pressing \'P\' narrows to APP-words.',
    codeSnippet: `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord = false;
}

class Trie {
  root = new TrieNode();
  insert(word: string): void {
    let curr = this.root;
    for (const ch of word) {
      if (!curr.children.has(ch)) curr.children.set(ch, new TrieNode());
      curr = curr.children.get(ch)!;
    }
    curr.isEndOfWord = true;
  }
}`,
    takeaways: [
      'O(L) Prefix Search: Time complexity depends only on the query word length L, independent of dictionary size N.',
      'Autocomplete & IP Routing: Used for Longest Prefix Match in router CIDR routing tables.'
    ],
    commonPitfall: {
      mistake: 'Using a fixed array TrieNode[26] in memory-constrained environments with large alphabets (Unicode), wasting huge heap RAM.',
      fix: 'Use HashMaps or Radix Trees (Compressed Tries) for sparse node allocations.'
    },
    nextTopicId: 'suffix-array-lcp-construction'
  },
  {
    id: 'suffix-array-lcp-construction',
    title: 'Suffix Arrays & Kasai\'s Longest Common Prefix (LCP)',
    category: 'advanced-strings',
    difficulty: 'Expert',
    summary: 'A Suffix Array contains sorted indices of all string suffixes. Paired with Kasai\'s LCP array in O(N) time, it enables instantaneous full-text substring search, counting, and repeat detection.',
    mentalModel: 'The Sorted Index in the Back of the Encyclopedia: Sorting all sentence endings alphabetically allows binary searching any phrase in the entire book in O(M log N).',
    codeSnippet: `// For string "banana":
// Suffixes: [ "banana" (0), "anana" (1), "nana" (2), "ana" (3), "na" (4), "a" (5) ]
// Suffix Array (Sorted): [ 5 ("a"), 3 ("ana"), 1 ("anana"), 0 ("banana"), 4 ("na"), 2 ("nana") ]
// LCP Array: [ 0, 1, 3, 0, 0, 2 ]`,
    takeaways: [
      'Memory Lightweight: Uses 4x less memory than Suffix Trees while offering identical algorithmic power.',
      'Full-Text Search: Binary search on Suffix Array finds any substring pattern of length M in O(M log N).'
    ],
    commonPitfall: {
      mistake: 'Building Suffix Arrays naively with O(N^2 log N) string sorting.',
      fix: 'Use SA-IS (Suffix Array by Induced Sorting) for strictly linear O(N) construction.'
    },
    nextTopicId: 'aho-corasick-multi-pattern'
  },
  {
    id: 'aho-corasick-multi-pattern',
    title: 'Aho-Corasick Multi-Pattern Dictionary Matching',
    category: 'advanced-strings',
    difficulty: 'Expert',
    summary: 'Aho-Corasick constructs a Finite State Machine combining a Trie with KMP-style failure transitions, finding all occurrences of K dictionary keywords in a text in O(N + M + Z) time.',
    mentalModel: 'The Security Checkpoint Scanner: As luggage moves along the conveyor belt (text stream), the scanner matches against 1,000 banned items simultaneously in a single forward pass without pausing.',
    codeSnippet: `// Aho-Corasick State Machine:
// 1. Build Trie over Dictionary keywords { "he", "she", "his", "hers" }
// 2. Compute BFS Failure Links (Fallback on mismatch)
// 3. Scan Text in O(N) single pass: All keyword matches emitted simultaneously!`,
    takeaways: [
      'Single Pass Multi-Pattern: Searches for 10,000 patterns in text simultaneously in O(TextLength + TotalMatches).',
      'Antivirus & Intrusion Detection: Used in Snort, ClamAV, and packet inspection firewalls.'
    ],
    commonPitfall: {
      mistake: 'Running KMP K separate times for K patterns (O(K * N)), multiplying execution time by 1,000x.',
      fix: 'Use Aho-Corasick for simultaneous multi-keyword dictionary matching.'
    },
    nextTopicId: 'string-compression-run-length-huffman'
  },
  {
    id: 'string-compression-run-length-huffman',
    title: 'Lossless String Compression: RLE, Huffman & Burrows-Wheeler',
    category: 'optimization',
    difficulty: 'Expert',
    summary: 'Lossless compression algorithms reduce string storage: Run-Length Encoding (RLE) compresses contiguous repeats, Huffman Coding assigns variable-length prefix codes based on entropy, and BWT groups identical characters together.',
    mentalModel: 'Morse Code: Common letters like \'E\' get a short single dot (.), while rare letters like \'Q\' get long dashes (--.-), minimizing the total telegraph wire time.',
    codeSnippet: `// Run-Length Encoding (RLE):
// Input:  "WWWWWWAAAAAABBB"
// Output: "6W6A3B" (15 chars compressed to 6 chars!)

// Huffman Optimal Prefix Code:
// Frequent char 'a' (50% freq) -> Code: "0" (1 bit)
// Rare char 'z' (1% freq) -> Code: "1101" (4 bits)`,
    takeaways: [
      'Shannon Entropy Limit: Sets the theoretical minimum average bit length per symbol for lossless compression.',
      'Deflate (gzip/zlib): Combines LZ77 sliding window dictionary matching with Huffman coding.'
    ],
    commonPitfall: {
      mistake: 'Applying RLE to random uncompressed text without repeating runs, which doubles the file size.',
      fix: 'Use BWT (Burrows-Wheeler Transform) to group identical characters before RLE.'
    }
  }
];
