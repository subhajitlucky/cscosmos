export interface ArrayCheatSheetSection {
  id: string;
  title: string;
  category: string;
  snippets: {
    title: string;
    description: string;
    code: string;
    tip: string;
  }[];
}

export const ARRAY_CHEATSHEET: ArrayCheatSheetSection[] = [
  {
    id: 'two-pointer-patterns',
    title: 'Two-Pointer & Sliding Window Templates',
    category: 'Algorithmic Patterns',
    snippets: [
      {
        title: 'Opposite-Ends Two Pointer Template',
        description: 'Standard template for sorted array searches and reversals',
        code: `function oppositeEnds(arr: number[], target: number) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const val = arr[left] + arr[right];
    if (val === target) return [left, right];
    else if (val < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
        tip: 'Ensure array is sorted before initializing left and right at opposite boundaries.'
      },
      {
        title: 'Dynamic Sliding Window Template',
        description: 'Find longest/shortest valid contiguous subarray in O(N)',
        code: `function slidingWindow(s: string) {
  let left = 0;
  let ans = 0;
  const map = new Map<string, number>();

  for (let right = 0; right < s.length; right++) {
    // 1. Expand right boundary:
    map.set(s[right], (map.get(s[right]) || 0) + 1);

    // 2. Shrink left boundary until window is valid:
    while (/* window is invalid condition */ false) {
      map.set(s[left], map.get(s[left])! - 1);
      left++;
    }

    // 3. Update answer:
    ans = Math.max(ans, right - left + 1);
  }
  return ans;
}`,
        tip: 'Both left and right pointers only move forward, guaranteeing strict O(N) linear time.'
      }
    ]
  },
  {
    id: 'string-algorithms',
    title: 'Linear String Matching Algorithms',
    category: 'String Search',
    snippets: [
      {
        title: 'KMP LPS Array Construction',
        description: 'Precompute Longest Prefix Suffix table in O(M)',
        code: `function computeLPS(pattern: string): number[] {
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
        tip: 'lps[i] tells you where to fall back on mismatch without retreating the text pointer.'
      }
    ]
  }
];
