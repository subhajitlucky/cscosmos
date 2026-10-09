import type { InterviewQuestion } from '../types';

export const dsaQuestions: InterviewQuestion[] = [
  {
    slug: 'two-sum-brute-force-to-hashmap',
    category: 'dsa',
    topic: 'Arrays & Hashing',
    title: 'Two Sum: from brute force to a one-pass hash map',
    difficulty: 'beginner',
    frequency: 'very-often',
    round: 'coding',
    type: 'coding',
    tags: ['arrays', 'hash-map', 'complexity', 'two-sum'],
    oneLiner:
      'The gateway question: replace the nested loops with a hash map and turn the search inside out in one pass.',
    whyAsked:
      'Two Sum is the standard opening coding question because almost everyone can write the brute force, yet far fewer can derive the one-pass hash map and justify the switch. Interviewers watch how you reframe the problem from comparing pairs to querying for a complement, whether you keep the scan single-pass, and whether you can state the space-time trade-off without prompting. The follow-ups reveal whether you noticed the duplicate-value trap and can adapt the same idea to sorted input and to Three Sum.',
    mentalModel:
      'For each element the partner you need is fully determined: complement = target - nums[i]. Instead of scanning the rest of the array for that partner, remember every value already visited in a hash map keyed by value. If the complement is in the map, its index and the current index are the answer; otherwise store the current value and move on. One pass, average O(n) time, O(n) extra space.',
    steps: [
      {
        title: 'Brute force checks every pair',
        body: `Start with the honest solution so the improvement has something to beat. For each index i, scan every j greater than i and test whether nums[i] + nums[j] equals the target. The animation follows the loops on nums = [3, 2, 4, 3] with target 6: the first two probes miss, and the third finds 3 + 3. Every element is compared with every later element, so the work is (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparisons, which is O(n²) time and O(1) extra space. On a ten-thousand-element array that is roughly fifty million additions, all to find a pair that a single organized pass could locate with ten thousand lookups. The brute force is the right baseline to say out loud: it proves you can solve the problem and isolates exactly what the faster solution must remove, namely the repeated rescanning.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
          frames: [
            { id: 'f1', caption: 'i = 0, j = 1: 3 + 2 = 5 misses the target 6.', activeLines: [2, 3, 4], variables: [{ name: 'i', value: '0' }, { name: 'j', value: '1' }, { name: 'probe', value: '3 + 2 = 5' }, { name: 'comparisons', value: '1', changed: true }] },
            { id: 'f2', caption: 'i = 0, j = 2: 3 + 4 = 7 also misses.', activeLines: [3, 4], variables: [{ name: 'i', value: '0' }, { name: 'j', value: '2' }, { name: 'probe', value: '3 + 4 = 7' }, { name: 'comparisons', value: '2', changed: true }] },
            { id: 'f3', caption: 'i = 0, j = 3: 3 + 3 = 6 hits, so the pair is returned.', activeLines: [4, 5], variables: [{ name: 'i', value: '0' }, { name: 'j', value: '3' }, { name: 'probe', value: '3 + 3 = 6' }, { name: 'comparisons', value: '3', changed: true }], output: '[0, 3]' },
            { id: 'f4', caption: 'A worst case keeps probing pairs that cannot match.', activeLines: [2, 3, 4], variables: [{ name: 'i', value: '...' }, { name: 'j', value: '...' }, { name: 'probe', value: 'no hit' }, { name: 'comparisons', value: 'n(n-1)/2', changed: true }] },
            { id: 'f5', caption: 'The nested loops cost O(n²) time and O(1) extra space.', activeLines: [1, 9], variables: [{ name: 'time', value: 'O(n²)' }, { name: 'space', value: 'O(1)' }, { name: 'comparisons', value: 'n(n-1)/2' }] },
          ],
        },
      },
      {
        title: 'Ask for the complement',
        body: `Brute force asks whether any other element pairs with this one, and answering costs a full rescan. Flip the question: if nums[i] must pair with an already-seen element, that partner's value is determined, complement = target - nums[i]. So before processing index i, the only question that matters is whether the complement has been seen. A hash map keyed by value answers that in one lookup. The animation shows the invariant taking shape: after processing each index, the map contains every value from indices before i. For [3, 2, 4, 3] and target 6, index 0 needs a 3 and finds nothing; index 1 needs a 4 and finds nothing; index 2 needs a 2 and finds it stored from index 1. That is the whole trick: the pair is discovered from the second element's point of view, so the array is walked exactly once.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `// Invariant: after step i, seen holds nums[0..i] -> index.
// At step i we need a value equal to target - nums[i].
const complement = target - nums[i];
if (seen.has(complement)) {
  return [seen.get(complement), i];
}
// Otherwise store nums[i] so a later element can find it.
seen.set(nums[i], i);`,
          frames: [
            { id: 'f1', caption: 'i = 0 needs 6 - 3 = 3, and nothing is stored yet.', activeLines: [3, 4], variables: [{ name: 'i', value: '0' }, { name: 'needed', value: '3' }, { name: 'seen', value: '{}' }] },
            { id: 'f2', caption: 'Store 3 -> 0 so later elements can find a 3.', activeLines: [8], variables: [{ name: 'i', value: '0' }, { name: 'needed', value: '3' }, { name: 'seen', value: '{3: 0}', changed: true }] },
            { id: 'f3', caption: 'i = 2 needs 6 - 4 = 2, and the map already holds 2 -> 1.', activeLines: [3, 4, 5], variables: [{ name: 'i', value: '2' }, { name: 'needed', value: '2' }, { name: 'seen', value: '{3: 0, 2: 1}', changed: true }], output: '[1, 2]' },
            { id: 'f4', caption: 'The rescan is gone: each index is examined once.', activeLines: [1, 3, 8], variables: [{ name: 'time', value: 'O(n)' }, { name: 'seen', value: '{3: 0, 2: 1}' }] },
          ],
        },
      },
      {
        title: 'One pass with a hash map',
        body: `The complete JavaScript solution is nine lines: create a Map, loop once, compute the complement, check membership, and insert on a miss. Order matters - check before insert. If you inserted first, nums[i] could match itself, and an input like [3, 3] with target 6 would be reported with the same index twice. Watch the animation walk [3, 2, 4, 3]: index 0 asks for 3, misses, and stores 3 -> 0; index 1 asks for 4, misses, and stores 2 -> 1; index 2 asks for 2, hits the stored index 1, and returns [1, 2] without ever looking at index 3. Notice that the hash-map answer differs from the brute-force answer [0, 3] - both are valid because the problem accepts any qualifying pair. This is the version interviewers want you to arrive at by derivation, not recollection.`,
        code: {
          language: 'javascript',
          source: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
        },
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
          frames: [
            { id: 'f1', caption: 'i = 0: complement 3 is missing, so store 3 -> 0.', activeLines: [2, 3, 4, 5, 8], variables: [{ name: 'i', value: '0' }, { name: 'nums[i]', value: '3' }, { name: 'complement', value: '3' }, { name: 'seen', value: '{}' }] },
            { id: 'f2', caption: 'i = 1: complement 4 is missing; the map now holds 2 -> 1 as well.', activeLines: [3, 4, 5, 8], variables: [{ name: 'i', value: '1' }, { name: 'nums[i]', value: '2' }, { name: 'complement', value: '4' }, { name: 'seen', value: '{3: 0, 2: 1}', changed: true }] },
            { id: 'f3', caption: 'i = 2: complement 2 is in the map, so the pair is found.', activeLines: [5], variables: [{ name: 'i', value: '2' }, { name: 'nums[i]', value: '4' }, { name: 'complement', value: '2' }, { name: 'seen', value: '{3: 0, 2: 1}' }] },
            { id: 'f4', caption: 'Return the stored index and the current index.', activeLines: [6], variables: [{ name: 'i', value: '2' }, { name: 'complement', value: '2' }, { name: 'result', value: '[1, 2]', changed: true }], output: '[1, 2]' },
            { id: 'f5', caption: 'One evaluation per element: O(n) time bought with O(n) space.', activeLines: [2, 3, 8], variables: [{ name: 'time', value: 'O(n)' }, { name: 'space', value: 'O(n)' }, { name: 'result', value: '[1, 2]' }] },
          ],
        },
      },
      {
        title: 'Why O(1) lookup pays',
        body: `A hash map is a time-for-space trade. The brute force spends O(1) memory and O(n²) time; the one-pass solution spends O(n) memory to buy O(1) average lookups. The map stores at most one entry per distinct value seen, so its footprint grows linearly with the input. Lookups are O(1) on average because a good hash function spreads keys across buckets; with many collisions, or a deliberately adversarial key set, operations can degrade toward O(n), which is why production hash maps randomize seeds to prevent hash-flooding attacks. Watch the animation: every insert lands in a bucket and every has/get probes that bucket instead of scanning the array. If memory were the tight constraint, sorting plus two pointers would give O(1) space at O(n log n) time. The trade is yours to defend, not a universal law.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `function twoSum(nums, target) {
  const seen = new Map();               // O(n) extra space
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);               // O(1) average insert
  }
  return [];
}`,
          frames: [
            { id: 'f1', caption: 'The map starts empty - we are buying speed with memory.', activeLines: [2], variables: [{ name: 'seenSize', value: '0' }, { name: 'space', value: 'O(n) reserved' }] },
            { id: 'f2', caption: 'Each distinct value is inserted once: O(1) average, O(n) footprint.', activeLines: [6], variables: [{ name: 'seenSize', value: '1..n', changed: true }, { name: 'insert', value: 'O(1) average' }] },
            { id: 'f3', caption: 'has and get probe one bucket instead of scanning the array.', activeLines: [5], variables: [{ name: 'lookup', value: 'O(1) average' }, { name: 'seenSize', value: '1..n' }] },
            { id: 'f4', caption: 'Total: linear time bought with linear space; collisions are the caveat.', activeLines: [2, 5, 6], variables: [{ name: 'time', value: 'O(n) average' }, { name: 'space', value: 'O(n)' }, { name: 'worst', value: 'O(n) per op' }] },
          ],
        },
      },
      {
        title: 'Duplicates and missing pairs',
        body: `Duplicate values are where candidates slip. With nums = [3, 3] and target 6, the correct output is [0, 1]. Check-then-insert handles it naturally: index 0 stores 3 -> 0, and index 1 finds the complement 3 at index 0 before it ever considers overwriting the entry. If you inserted first, index 0 would find itself and report [1, 1]. The map keeps only one index per value, so with many duplicates you get the earliest compatible partner, which is fine because the problem asks for any valid pair. Also decide what a missing pair returns: the standard contract returns an empty array, but some variants throw or guarantee exactly one answer, so state your assumption. Finally, complement arithmetic is safe with negative values and zeros, but fixed-width languages must watch for overflow when target - nums[i] crosses the integer bounds.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `// nums = [3, 3], target = 6
const seen = new Map();
// i = 0: complement 3 is absent, so store 3 -> 0.
seen.set(3, 0);
// i = 1: complement 3 is present at index 0.
return [seen.get(3), 1]; // [0, 1] - never [1, 1]`,
          frames: [
            { id: 'f1', caption: 'i = 0: the complement 3 is absent and the map is empty.', activeLines: [1, 3], variables: [{ name: 'i', value: '0' }, { name: 'complement', value: '3' }, { name: 'seen', value: '{}' }] },
            { id: 'f2', caption: 'Store 3 -> 0 before moving on.', activeLines: [4], variables: [{ name: 'i', value: '0' }, { name: 'complement', value: '3' }, { name: 'seen', value: '{3: 0}', changed: true }] },
            { id: 'f3', caption: 'i = 1: the complement 3 is found at index 0.', activeLines: [5, 6], variables: [{ name: 'i', value: '1' }, { name: 'complement', value: '3' }, { name: 'seen', value: '{3: 0}' }], output: '[0, 1]' },
            { id: 'f4', caption: 'Checking before inserting is what prevents returning the same index twice.', activeLines: [3, 5], variables: [{ name: 'ordering', value: 'check then insert' }, { name: 'result', value: '[0, 1]' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Duplicate values such as [3, 3] with target 6: check the map before inserting, or index 0 finds itself and returns [1, 1] instead of [0, 1].',
      'No valid pair: the loop should exit and return an empty array, but some variants guarantee exactly one solution - state the contract before coding.',
      'Negative values and zeros are safe: complement = target - nums[i] needs no special casing; absolute-value heuristics break them.',
      'Integer overflow in fixed-width languages: target - nums[i] can cross the integer bounds even when the final answer is valid - use 64-bit arithmetic or reorder the comparison.',
      'Huge duplicate runs overwrite one map entry per value: since the check happens first, you still get the earliest compatible partner, which satisfies any-valid-pair contracts.',
    ],
    followUps: [
      { q: 'What changes if the input array is already sorted?', a: 'Use two pointers from both ends: move the left pointer in when the sum is too small and the right pointer in when it is too large. That is O(n) time and O(1) space, beating the hash map on memory.' },
      { q: 'How would you return all unique pairs, or solve Three Sum?', a: 'Sort and use the two-pointer scan with deduplication, or keep counts in a hash map. Three Sum nests that routine inside an outer loop and skips repeated values.' },
      { q: 'Would a hash set be enough instead of a hash map?', a: 'Only if you return values. Returning indices requires the map because the set discards positions, and the answer needs both indices.' },
    ],
    relatedEngine: { label: 'Explore the Array Visualizer', href: '/dsa/arrayviz' },
  },
  {
    slug: 'kmp-linear-string-matching',
    category: 'dsa',
    topic: 'Strings',
    title: 'KMP: linear-time substring search with LPS',
    difficulty: 'advanced',
    frequency: 'sometimes',
    round: 'coding',
    type: 'coding',
    tags: ['strings', 'kmp', 'pattern-matching', 'lps'],
    oneLiner:
      'Naive search rewinds the text pointer on every mismatch; KMP precomputes a failure table so the text is read once and never revisited.',
    whyAsked:
      'KMP is the classic proof that string matching does not have to be quadratic, and it separates candidates who can define a prefix function from those who can actually run it. Interviewers watch whether you build the LPS table and apply the fallback j = lps[j - 1] correctly, and whether you can explain why the fallback preserves every still-possible match. It is also a calibration question: strong candidates derive the failure function instead of reciting it.',
    mentalModel:
      'Every time you match j characters of the pattern and then fail, the last j characters of the text already equal pattern[0..j-1]. Instead of restarting the pattern at zero and re-reading text, look at the largest proper prefix of those matched characters that is also a suffix - that is lps[j-1] - and resume from there. The text pointer i only ever moves forward, so matching costs O(n) and building the table costs O(m).',
    steps: [
      {
        title: 'Naive search rechecks everything',
        body: `The naive algorithm slides the pattern one position at a time and compares characters from scratch at every alignment. When a partial match fails near the end, all of that matching work is thrown away and the text pointer is rewritten to the next start position. The animation runs pattern ABABAC against ABABAABABAC. At alignment 0 the first five characters match, then C fails against A, so alignment 1 restarts from scratch and immediately fails; alignment 2 matches three characters and fails again. The text positions around the failure were already examined, but the algorithm has no memory of what they contained. In the worst case - think pattern AAAAAB over a long run of A characters - each alignment compares almost m characters, giving O(n times m) character comparisons. The animation's comparison counter makes the repeated work visible: the same text characters are tested several times across adjacent alignments.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `function naiveSearch(text, pattern) {
  for (let i = 0; i <= text.length - pattern.length; i++) {
    let j = 0;
    while (j < pattern.length && text[i + j] === pattern[j]) {
      j++;
    }
    if (j === pattern.length) return i;
  }
  return -1;
}`,
          frames: [
            { id: 'f1', caption: 'Alignment i = 0 matches five characters: ABABA.', activeLines: [2, 3, 4], variables: [{ name: 'i', value: '0' }, { name: 'j', value: '5' }, { name: 'matched', value: 'ABABA' }, { name: 'comparisons', value: '5', changed: true }] },
            { id: 'f2', caption: 'text[5] = A mismatches pattern[5] = C; the whole alignment dies.', activeLines: [4], variables: [{ name: 'i', value: '0' }, { name: 'j', value: '5' }, { name: 'compare', value: 'A vs C' }, { name: 'comparisons', value: '6', changed: true }] },
            { id: 'f3', caption: 'Alignment 1 restarts from scratch and fails on the first character.', activeLines: [2], variables: [{ name: 'i', value: '1' }, { name: 'j', value: '0' }, { name: 'compare', value: 'B vs A' }, { name: 'comparisons', value: '7', changed: true }] },
            { id: 'f4', caption: 'Alignment 4 rechecks characters the earlier attempt had already matched.', activeLines: [2, 3, 4], variables: [{ name: 'i', value: '4' }, { name: 'j', value: '1' }, { name: 'compare', value: 'A vs B' }, { name: 'comparisons', value: '14', changed: true }] },
            { id: 'f5', caption: 'The match finally lands at index 5 after twenty comparisons.', activeLines: [7], variables: [{ name: 'i', value: '5' }, { name: 'j', value: '6' }, { name: 'matched', value: 'ABABAC' }, { name: 'comparisons', value: '20', changed: true }], output: '5' },
          ],
        },
      },
      {
        title: 'The prefix that is a suffix',
        body: `Define lps[i] as the length of the longest proper prefix of pattern[0..i] that is also a suffix of pattern[0..i]. Proper means strictly shorter than the substring itself, so lps describes an overlap you can reuse rather than the whole match. For ABABA the longest such overlap is ABA, length 3; for ABAB it is AB, length 2; for a fresh character with no overlap it is 0. The table exists because of a fact about mismatches: when you have just matched j characters, the text you consumed ends with pattern[0..j-1]. If the next character breaks the match, any alignment that could still succeed must start inside that window, and the longest prefix that is also a suffix is exactly the largest chunk of progress that survives. The animation highlights those overlapping chunks - the same characters serving as both prefix and suffix - before the next step turns them into table entries.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `// lps[i] = longest proper prefix of pattern[0..i]
//          that is also a suffix of pattern[0..i].
const pattern = 'ABABAC';
// A  B  A  B  A  C   pattern prefix
// A  B  A  B  A  C   text consumed so far
// 0  0  1  2  3  0   lps
const fallback = lps[4]; // 3 - the suffix "ABA" is already matched`,
          frames: [
            { id: 'f1', caption: 'For the window A the longest proper prefix-suffix is empty - length 0.', activeLines: [1, 2, 4, 5, 6], variables: [{ name: 'window', value: 'A' }, { name: 'overlap', value: 'none' }, { name: 'lps', value: '[0]' }] },
            { id: 'f2', caption: 'For AB the overlap is still empty - length 0.', activeLines: [1, 2, 4, 5, 6], variables: [{ name: 'window', value: 'AB' }, { name: 'overlap', value: 'none' }, { name: 'lps', value: '[0, 0]' }] },
            { id: 'f3', caption: 'For ABA the prefix A equals the suffix A - length 1.', activeLines: [1, 2, 4, 5, 6], variables: [{ name: 'window', value: 'ABA' }, { name: 'overlap', value: 'A' }, { name: 'lps', value: '[0, 0, 1]' }] },
            { id: 'f4', caption: 'For ABAB the overlap grows to AB - length 2.', activeLines: [1, 2, 4, 5, 6], variables: [{ name: 'window', value: 'ABAB' }, { name: 'overlap', value: 'AB' }, { name: 'lps', value: '[0, 0, 1, 2]' }] },
            { id: 'f5', caption: 'lps[4] = 3: after matching the full ABABA, ABA is already aligned again.', activeLines: [7], variables: [{ name: 'window', value: 'ABABA' }, { name: 'overlap', value: 'ABA' }, { name: 'lps', value: '[0, 0, 1, 2, 3]' }] },
          ],
        },
      },
      {
        title: 'Build the LPS table',
        body: `The construction code is a tiny matching problem against the pattern itself. Keep a candidate length len and a scan index i, both starting small. If pattern[i] extends the current candidate, the overlap grows: increment len, write lps[i], advance i. On a mismatch, do not reset len to zero - that is the whole subtlety. Instead fall back to lps[len-1], the longest overlap that still fits, and retry the same i. Only when len is zero do you write zero and advance. The animation builds the table for ABABAC: three matches grow run lengths 1, 2, then 3; the final C mismatches and triggers two fallbacks, 3 to 1 to 0, before recording lps[5] = 0. Each index either advances i or shrinks len, and len never exceeds i, so the total work is linear in the pattern length.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `function buildLps(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  for (let i = 1; i < pattern.length; ) {
    if (pattern[i] === pattern[len]) {
      lps[i] = ++len;
      i++;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i++;
    }
  }
  return lps;
}`,
          frames: [
            { id: 'f1', caption: 'i = 1: B does not extend the empty candidate, so lps[1] = 0.', activeLines: [4, 5, 8, 10, 11, 12], variables: [{ name: 'i', value: '1' }, { name: 'len', value: '0' }, { name: 'lps', value: '[0, 0, 0, 0, 0, 0]' }, { name: 'compare', value: 'B vs A' }] },
            { id: 'f2', caption: 'i = 2: A matches pattern[0], so len becomes 1 and lps[2] = 1.', activeLines: [5, 6, 7], variables: [{ name: 'i', value: '2' }, { name: 'len', value: '1', changed: true }, { name: 'lps', value: '[0, 0, 1, 0, 0, 0]', changed: true }, { name: 'compare', value: 'A vs A' }] },
            { id: 'f3', caption: 'i = 3: B matches pattern[1], so the candidate grows to 2.', activeLines: [5, 6, 7], variables: [{ name: 'i', value: '3' }, { name: 'len', value: '2', changed: true }, { name: 'lps', value: '[0, 0, 1, 2, 0, 0]', changed: true }, { name: 'compare', value: 'B vs B' }] },
            { id: 'f4', caption: 'i = 4: A matches pattern[2]; lps[4] = 3 is the longest overlap so far.', activeLines: [5, 6, 7], variables: [{ name: 'i', value: '4' }, { name: 'len', value: '3', changed: true }, { name: 'lps', value: '[0, 0, 1, 2, 3, 0]', changed: true }, { name: 'compare', value: 'A vs A' }] },
            { id: 'f5', caption: 'i = 5: C mismatches pattern[3], so fall back to lps[2] = 1.', activeLines: [5, 8, 9], variables: [{ name: 'i', value: '5' }, { name: 'len', value: '1', changed: true }, { name: 'lps', value: '[0, 0, 1, 2, 3, 0]' }, { name: 'compare', value: 'C vs B' }] },
            { id: 'f6', caption: 'The fallback shrinks to 0, lps[5] is written, and the table is done.', activeLines: [5, 8, 9, 10, 11, 12], variables: [{ name: 'i', value: '6' }, { name: 'len', value: '0', changed: true }, { name: 'lps', value: '[0, 0, 1, 2, 3, 0]' }, { name: 'compare', value: 'C vs A' }] },
          ],
        },
      },
      {
        title: 'Match without moving backwards',
        body: `The search loop keeps one text pointer i and one pattern pointer j. On a character match both advance; when j reaches the pattern length, the match starts at i - j. On a mismatch the algorithm consults the table: if j is greater than zero, set j = lps[j - 1] and retry the same i; only when j is zero does i advance. That is the invariant that makes KMP linear - i is monotone, so the text is read once. The animation follows ABABAABABAC against ABABAC. At i = 5 the text has matched ABABA and fails on C; j falls back 5 to 3 to 1 to 0, and only then does i move to 6, where a fresh run matches all the way to i = 10 and returns 5. Notice the mismatch chain repeats a decision the naive algorithm would redo from scratch at several alignments.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `function kmpSearch(text, pattern, lps) {
  let i = 0;
  let j = 0;
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) return i - j;
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }
  return -1;
}`,
          frames: [
            { id: 'f1', caption: 'i = 5, j = 5: text and pattern agree on ABABA.', activeLines: [4, 5, 6, 7], variables: [{ name: 'i', value: '5' }, { name: 'j', value: '5' }, { name: 'matched', value: 'ABABA' }, { name: 'i moves back?', value: 'no' }] },
            { id: 'f2', caption: 'text[5] = A mismatches pattern[5] = C; j is positive, so fall back.', activeLines: [5, 9], variables: [{ name: 'i', value: '5' }, { name: 'j', value: '5' }, { name: 'compare', value: 'A vs C' }, { name: 'i moves back?', value: 'no' }] },
            { id: 'f3', caption: 'j = lps[4] = 3: the matched suffix ABA is reused without touching i.', activeLines: [10], variables: [{ name: 'i', value: '5' }, { name: 'j', value: '3', changed: true }, { name: 'compare', value: 'A vs B' }, { name: 'fallback', value: 'lps[4] = 3' }] },
            { id: 'f4', caption: 'Two more fallbacks shrink j to 0; i is still 5.', activeLines: [5, 9, 10], variables: [{ name: 'i', value: '5' }, { name: 'j', value: '0', changed: true }, { name: 'compare', value: 'A vs B' }, { name: 'fallback', value: 'lps[0] = 0' }] },
            { id: 'f5', caption: 'With j = 0 the mismatch is absorbed by advancing i; A matches pattern[0].', activeLines: [5, 6, 7], variables: [{ name: 'i', value: '6', changed: true }, { name: 'j', value: '1', changed: true }, { name: 'matched', value: 'A' }, { name: 'i moves back?', value: 'no' }] },
            { id: 'f6', caption: 'The run continues through C; j reaches 6 and the match starts at i - j = 5.', activeLines: [5, 6, 7, 8], variables: [{ name: 'i', value: '11' }, { name: 'j', value: '6', changed: true }, { name: 'matched', value: 'ABABAC' }, { name: 'result', value: '5' }], output: '5' },
          ],
        },
      },
      {
        title: 'Why the fallback is correct',
        body: `The failure function is correct because of what the failed attempt leaves behind. When text[i] mismatches with j matched characters, the text's last j characters already equal pattern[0..j-1] - that is guaranteed by the loop's own history, not by an assumption. Any next alignment whose pattern index is k greater than zero requires that pattern[0..j-k-1] matches the tail of that same window, which is exactly a prefix-equals-suffix relation. The largest k for which this can hold is lps[j-1], so setting j = lps[j-1] keeps the longest alignment that is still possible and discards only alignments that cannot match. The animation makes the chain concrete: the window ABABA has the suffix ABA equal to the prefix ABA, so after falling back the A that ended the window is already covered again. Every fallback is like that, which is why KMP never misses a match - and why the text pointer never rewinds.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `// After matching j characters, the consumed text ends with pattern[0..j-1].
// A still-possible alignment starts at some k <= j with
//   pattern[0..j-k-1] === text window suffix
// which is a prefix-equals-suffix overlap of pattern[0..j-1].
// lps[j-1] is the longest such overlap, so j = lps[j-1].
j = lps[j - 1];
// The text pointer i is untouched: the window already validated these chars.`,
          frames: [
            { id: 'f1', caption: 'Matched window ABABA: the suffix ABA equals the prefix ABA.', activeLines: [1, 2, 3], variables: [{ name: 'matched', value: 'ABABA' }, { name: 'overlap', value: 'ABA' }, { name: 'lps[j-1]', value: '3' }] },
            { id: 'f2', caption: 'Setting j = 3 keeps the three overlap characters matched.', activeLines: [5, 6], variables: [{ name: 'matched', value: 'ABABA' }, { name: 'overlap', value: 'ABA' }, { name: 'j', value: '5 -> 3', changed: true }] },
            { id: 'f3', caption: 'The next comparison resumes at pattern[3] instead of pattern[0].', activeLines: [3, 6], variables: [{ name: 'j', value: '3' }, { name: 'i', value: 'untouched' }, { name: 'compare', value: 'against pattern[3]' }] },
            { id: 'f4', caption: 'If that fails too, the next fallback is the longest remaining overlap.', activeLines: [5, 6], variables: [{ name: 'matched', value: 'ABA' }, { name: 'overlap', value: 'A' }, { name: 'j', value: '3 -> 1', changed: true }] },
            { id: 'f5', caption: 'Every fallback only removes alignments that cannot match, so none are missed.', activeLines: [5, 6, 7], variables: [{ name: 'i', value: 'never decreases' }, { name: 'total time', value: 'O(n + m)' }, { name: 'skips', value: '0 matches lost' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Empty pattern: return 0 before touching lps[j - 1], or the loop indexes the pattern out of bounds; decide whether an empty needle matches at position 0.',
      'Pattern longer than the text: the scan ends and returns -1; never allocate or scan past text.length.',
      'A single-character pattern or repeated characters: proper means strictly shorter, so lps[0] is always 0 and fallback chains can be long - the amortized bound still holds.',
      'Patterns like AAAAAB over a long run of A characters produce deep fallback chains; they are linear in total because every fallback was paid for by an earlier match.',
      'Unicode text: JavaScript indexing walks UTF-16 code units, so patterns with surrogate pairs can match half a code point - iterate code points when the alphabet needs it.',
    ],
    followUps: [
      { q: 'Why is KMP O(n + m) even though fallbacks can repeat?', a: 'The text pointer i never decreases, and j grows by at most one per character, so all fallbacks together can shrink j no more than it ever grew. Both pointers make at most linear passes.' },
      { q: 'How do you report every occurrence instead of the first?', a: 'Record i - j on each full match, then set j = lps[j - 1] and keep scanning rather than returning. Overlapping occurrences are found naturally.' },
      { q: 'How does KMP compare with Rabin-Karp and Boyer-Moore?', a: 'Rabin-Karp uses rolling hashes for average-case linear matching with simpler code; Boyer-Moore skips ahead using the bad-character rule and is faster in practice on long alphabets; KMP guarantees linear time with constant extra space beyond the table.' },
    ],
    relatedEngine: { label: 'Explore the String Algorithms visualizer', href: '/dsa/stringalgoviz' },
  },
  {
    slug: 'lru-cache-hashmap-doubly-linked-list',
    category: 'dsa',
    topic: 'Caching & Design',
    title: 'Design an LRU cache with O(1) get and put',
    difficulty: 'advanced',
    frequency: 'very-often',
    round: 'system-design',
    type: 'design',
    tags: ['lru', 'cache', 'hash-map', 'linked-list', 'design'],
    oneLiner:
      'Everything hinges on one design move: a hash map to find the node and a doubly linked list to reorder it, both in constant time.',
    whyAsked:
      'LRU is the most common design question in coding rounds because it forces you to combine two data structures instead of pattern-matching one. Interviewers watch whether you decompose the operations first - lookup, unlink, move to front, evict - and whether your node management makes get and put O(1) without leaking stale links. It also reveals production awareness: the same design appears in Redis and database buffer pools, where approximation and concurrency change the answer.',
    mentalModel:
      'Two independent requirements must hold at once: find any key node in O(1) with a hash map, and reorder recency in O(1) with a doubly linked list. The map stores key to node, so you never search a list. The list stores recency order with the most recently used node at the head and the least recently used at the tail; a get unlinks its node and re-inserts it at the head, and a put at capacity evicts the tail. Sentinels remove null checks at both ends.',
    steps: [
      {
        title: 'One structure cannot do both',
        body: `Start by ruling out the obvious single structures. An array gives O(1) access by index, but a cache is keyed by arbitrary keys, so a get first has to find the key with a linear scan; even after that, removing an item from the middle shifts every later element, which is O(n) again. A plain object or dictionary gives O(1) keyed access, but it offers no supported move-to-front operation: deleting and re-adding a key is engine-dependent, integer-like keys iterate in numeric order rather than recency order, and nothing in the contract promises that iteration reflects access time. The animation shows each candidate operation and its cost: indexOf to locate, splice to unlink, unshift to promote. The pattern that emerges is the hint: one structure is good at lookup by key, another at reordering by position. Use one for each job and let node references connect them.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `// Naive: recency tracked in an array, MRU at index 0.
const order = ['c', 'b', 'a']; // most recent first
function get(key) {
  const i = order.indexOf(key); // O(n) scan
  if (i === -1) return -1;
  order.splice(i, 1);           // O(n) shift left
  order.unshift(key);           // O(n) shift right
  return store.get(key);
}`,
          frames: [
            { id: 'f1', caption: "get('a') scans the array from the front; the key sits at index 2.", activeLines: [3, 4], variables: [{ name: 'order', value: "[c, b, a]" }, { name: 'key', value: 'a' }, { name: 'scan', value: '3 comparisons' }] },
            { id: 'f2', caption: 'splice(2, 1) removes the key and shifts every later element left.', activeLines: [6], variables: [{ name: 'order', value: '[c, b]' }, { name: 'cost', value: 'O(n)', changed: true }] },
            { id: 'f3', caption: 'unshift puts it back at the front and shifts everything right.', activeLines: [7], variables: [{ name: 'order', value: '[a, c, b]' }, { name: 'cost', value: 'O(n)' }] },
            { id: 'f4', caption: 'Three linear steps for one get; a plain object has no recency contract at all.', activeLines: [1, 4, 6, 7], variables: [{ name: 'get', value: 'O(n)' }, { name: 'reorder', value: 'O(n)' }, { name: 'map alone', value: 'no order API' }] },
          ],
        },
      },
      {
        title: 'Hash map plus linked list',
        body: `The design splits responsibilities. A hash map stores key to node references, so lookup never scans - the map jumps straight to the node object. A doubly linked list stores recency, from the most recently used node at one end to the least recently used at the other, and because every node knows both neighbors, unlinking it and re-inserting it at the front are constant-time pointer updates. Two sentinel nodes, a dummy head and a dummy tail, bracket the list: head.next is always the MRU node and tail.prev is always the LRU node, so removing or inserting never special-cases an empty list. The animation lays out the wiring: map entries point at list nodes, nodes point at each other, and the two sentinels close the ends. Every operation now has a direct handle on the exact node it must move, which is the property neither structure has alone.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `// map: key -> node            O(1) node lookup
// list: head <-> ... <-> tail O(1) unlink and re-insert
this.map = new Map();
this.head = { key: null, value: null, prev: null, next: null };
this.tail = { key: null, value: null, prev: null, next: null };
this.head.next = this.tail; // sentinels delete null checks
this.tail.prev = this.head;`,
          frames: [
            { id: 'f1', caption: 'The map owns key lookup; the list owns recency order.', activeLines: [1, 2], variables: [{ name: 'map', value: 'key -> node' }, { name: 'list', value: 'head <-> ... <-> tail' }] },
            { id: 'f2', caption: 'Only node references live in the map - no data is duplicated.', activeLines: [3], variables: [{ name: 'map', value: '{}' }, { name: 'nodes', value: '0' }] },
            { id: 'f3', caption: 'Two sentinel nodes bracket the list so the ends need no null checks.', activeLines: [4, 5, 6, 7], variables: [{ name: 'head', value: 'dummy' }, { name: 'tail', value: 'dummy' }] },
            { id: 'f4', caption: 'Invariant: head.next is the MRU node and tail.prev is the LRU node.', activeLines: [6, 7], variables: [{ name: 'MRU', value: 'head.next' }, { name: 'LRU', value: 'tail.prev' }] },
          ],
        },
      },
      {
        title: 'A get promotes a node',
        body: `A get does three things in constant time: look up the node in the map, unlink it from its current position, and insert it right after the dummy head. The animation warms the cache to c <-> b <-> a, with c most recent and a the next eviction victim, then calls get on a. The map finds a's node immediately; remove rewires a's neighbors to point at each other, splicing the node out; addFront reattaches it between the head sentinel and the previous first node. The return value comes from the node, not from a re-read of any structure. Unlink and insert have to happen before returning, because recency is part of the contract: a hit widens the gap between the touched node and eviction, while a miss returns -1 and touches nothing, so failed lookups cannot reshape the list.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = { key: null, value: null, prev: null, next: null };
    this.tail = { key: null, value: null, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this.remove(node);
    this.addFront(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this.remove(node);
      this.addFront(node);
      return;
    }
    if (this.map.size === this.capacity) {
      const lru = this.tail.prev;
      this.remove(lru);
      this.map.delete(lru.key);
    }
    const node = { key, value, prev: null, next: null };
    this.addFront(node);
    this.map.set(key, node);
  }

  remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  addFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
}`,
          frames: [
            { id: 'f1', caption: "get('a') finds the node in the map without walking the list.", activeLines: [12, 13], variables: [{ name: 'key', value: 'a' }, { name: 'map', value: '{a, b, c}' }, { name: 'list', value: 'c <-> b <-> a' }] },
            { id: 'f2', caption: 'remove(a) splices the node out; its neighbors now point at each other.', activeLines: [14, 38, 39], variables: [{ name: 'list', value: 'c <-> b' }, { name: 'node', value: 'a unlinked', changed: true }] },
            { id: 'f3', caption: 'addFront(a) inserts it between the head sentinel and c.', activeLines: [15, 43, 44, 45, 46], variables: [{ name: 'list', value: 'a <-> c <-> b', changed: true }, { name: 'MRU', value: 'a' }] },
            { id: 'f4', caption: 'get returns the value; a is now the most recently used key.', activeLines: [16], variables: [{ name: 'return', value: 'a.value' }, { name: 'MRU', value: 'a' }, { name: 'LRU', value: 'b' }], output: 'a.value' },
            { id: 'f5', caption: 'All of it was pointer work: O(1) regardless of cache size.', activeLines: [12, 14, 15, 16], variables: [{ name: 'get', value: 'O(1)' }, { name: 'pointers touched', value: '4 writes' }] },
          ],
        },
      },
      {
        title: 'Put inserts and evicts',
        body: `A put has two cases. If the key already exists, update the value and promote the node exactly like a get - no eviction, because the cache size did not change. If the key is new and the cache is at capacity, there is no room, so the least recently used node must leave first: it is exactly tail.prev, the sentinel's neighbor. The animation starts with capacity 3 and a full list b <-> c <-> a, then writes put(d, 4). The size check fires, the LRU node a is unlinked and its key is deleted from the map, and a fresh node is allocated, linked after the head, and registered in the map. Doing the eviction before the insertion is what keeps the cache from ever exceeding capacity, and using the tail sentinel means the victim costs no traversal - the structure already points at it.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = { key: null, value: null, prev: null, next: null };
    this.tail = { key: null, value: null, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this.remove(node);
    this.addFront(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this.remove(node);
      this.addFront(node);
      return;
    }
    if (this.map.size === this.capacity) {
      const lru = this.tail.prev;
      this.remove(lru);
      this.map.delete(lru.key);
    }
    const node = { key, value, prev: null, next: null };
    this.addFront(node);
    this.map.set(key, node);
  }

  remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  addFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
}`,
          frames: [
            { id: 'f1', caption: "put('d', 4): the map has no entry for d, so this is an insertion.", activeLines: [19, 20], variables: [{ name: 'key', value: 'd' }, { name: 'map', value: '{a, b, c}' }, { name: 'capacity', value: '3' }] },
            { id: 'f2', caption: 'The cache is full, so the victim is tail.prev - the LRU node a.', activeLines: [27, 28], variables: [{ name: 'size', value: '3' }, { name: 'victim', value: 'a', changed: true }] },
            { id: 'f3', caption: "remove(a) unlinks it and map.delete('a') frees the entry.", activeLines: [29, 30], variables: [{ name: 'map', value: '{b, c}', changed: true }, { name: 'list', value: 'b <-> c' }] },
            { id: 'f4', caption: 'A new node for d is linked directly behind the head sentinel.', activeLines: [32, 33], variables: [{ name: 'list', value: 'd <-> b <-> c', changed: true }, { name: 'map', value: '{b, c}' }] },
            { id: 'f5', caption: "map.set('d', node) registers it; the cache is back at capacity.", activeLines: [34], variables: [{ name: 'map', value: '{b, c, d}', changed: true }, { name: 'size', value: '3' }] },
            { id: 'f6', caption: 'Evict-first insertion: every operation touched a constant number of pointers.', activeLines: [27, 29, 30, 32, 33, 34], variables: [{ name: 'put', value: 'O(1)' }, { name: 'space', value: 'O(capacity)' }] },
          ],
        },
      },
      {
        title: 'Complexity and production notes',
        body: `The final accounting: get is O(1) average because the map lookup is the only hashing step and the two pointer operations are constant; put is O(1) average for the same reason, with eviction costing one unlink and one map delete; space is O(capacity) because each live key owns exactly one node and one map entry. The average qualifier matters: an adversarial key set that collides in the hash function can degrade lookups toward O(n), so production caches randomize hash seeds or accept the risk explicitly. Real systems rarely use exact LRU either. Redis, for example, samples a handful of keys and evicts the oldest among them, trading exactness for cheaper bookkeeping under concurrency. The animation tallies the pointer operations per call and shows the constant bound holding as the cache grows.`,
        animation: {
          kind: 'code-trace',
          language: 'javascript',
          code: `// get(key):  map.get(node) O(1) + remove O(1) + addFront O(1) = O(1)
// put(key):  map.has O(1) + remove O(1) + addFront O(1)
//            + eviction (map.delete + remove) O(1)            = O(1)
// space:     one node and one map entry per live key          = O(capacity)`,
          frames: [
            { id: 'f1', caption: 'get touches the map once and rewires two pointer pairs.', activeLines: [1], variables: [{ name: 'get', value: 'O(1)' }, { name: 'pointers', value: '4 writes' }] },
            { id: 'f2', caption: 'put on an existing key follows the same promotion path.', activeLines: [2], variables: [{ name: 'put', value: 'O(1)' }, { name: 'evictions', value: '0' }] },
            { id: 'f3', caption: 'put on a new key adds one eviction: unlink and delete.', activeLines: [2, 3], variables: [{ name: 'put', value: 'O(1)' }, { name: 'evictions', value: '1', changed: true }] },
            { id: 'f4', caption: 'An adversarial collision set can degrade the map toward O(n).', activeLines: [1, 3], variables: [{ name: 'hashing', value: 'average O(1)' }, { name: 'caveat', value: 'collisions' }] },
            { id: 'f5', caption: 'Exact LRU here; Redis samples keys for an approximate LRU under load.', activeLines: [1, 2, 3, 4], variables: [{ name: 'space', value: 'O(capacity)' }, { name: 'policy', value: 'exact LRU' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Capacity 0: put must be a no-op (or evict immediately) instead of inserting a node and then evicting it; decide the contract and document it.',
      'Capacity 1: an insert-then-evict order would remove the node just added - evict before inserting so the new node survives.',
      'Updating an existing key must not count as a new entry or trigger eviction, but it must still refresh recency by moving the node to the front.',
      'get on a missing key returns -1 and must leave the order untouched, or a read storm reshapes the cache and evicts hot data.',
      'Languages without GC: an unlinked node can still be reachable from elsewhere, so clear prev/next and erase the map entry to avoid dangling pointers and leaks.',
    ],
    followUps: [
      { q: 'Why doubly linked and not singly linked?', a: 'Removing an arbitrary node needs its predecessor. A singly linked list would require scanning for it, which breaks O(1) unlink; the prev pointer makes removal constant.' },
      { q: 'Do we really need the dummy head and tail?', a: 'They remove boundary null checks: insertions always have a predecessor and removals always have neighbors, so there is one code path instead of four.' },
      { q: 'How would you make it thread-safe?', a: 'A single mutex serializes everything but caps throughput; a sharded design locks independent segments. Redis sidesteps it with a single-threaded command loop and approximate sampling.' },
      { q: 'Could a JavaScript Map alone implement this?', a: 'In JS, Map preserves insertion order, so delete plus re-set moves a key to the end in average O(1) - a valid shortcut in that language, though interviews still expect the general hash-map plus linked-list design.' },
    ],
    relatedEngine: { label: 'Explore the Redis visualizer', href: '/fullstack/redisviz' },
  },
  {
    slug: 'floyd-cycle-detection',
    category: 'dsa',
    topic: 'Linked Lists',
    title: "Floyd's cycle detection: slow, fast, then reset",
    difficulty: 'intermediate',
    frequency: 'sometimes',
    round: 'coding',
    type: 'coding',
    tags: ['linked-list', 'two-pointers', 'cycle-detection', 'floyd'],
    oneLiner:
      'Two pointers, no extra memory: the fast one laps the slow one inside a cycle, and one reset finds exactly where the loop begins.',
    whyAsked:
      "Floyd's tortoise-and-hare is a favorite because the code is five lines but the proof is not. Interviewers watch whether you can argue that the pointers must meet, and whether you realize the meeting point is not necessarily the cycle entrance. The reset trick and the distance argument behind it separate candidates who memorized the algorithm from those who can derive it. It also tests space-awareness: a visited set works, but interviewers want to hear why O(1) space matters here.",
    mentalModel:
      'A slow pointer moves one node per step and a fast pointer moves two. If the list ends, there is no cycle. If there is a cycle, both pointers eventually enter it, and once they are inside, the forward distance from fast to slow shrinks by exactly one node per step, so it must reach zero. That meeting proves a cycle; resetting slow to the head and then advancing both one step at a time makes them meet again, this time at the cycle entrance.',
    steps: [
      {
        title: 'The loop that never ends',
        body: `Traversal code usually assumes the list ends: follow next until null. A cycle breaks that assumption, and the traversal spins forever without any error - the classic production hang in parsers, walkers, and garbage collectors. Before doing expensive work like reversing a list or serializing it, you need to know whether the structure terminates. The brute-force detector keeps a set of every visited node and flags the first repeated reference; it works, but it stores one entry per node, so it costs O(n) extra memory and cannot run where memory is tight. The animation shows a walk over 3 -> 2 -> 0 -> -4 -> 5 -> back to 0: after five steps the walk revisits node 0 and would keep repeating the same three nodes forever. That picture is the motivation for a detector that uses constant memory.`,
        animation: {
          kind: 'memory-diagram',
          regions: [
            {
              id: 'heap',
              label: 'Linked list nodes (heap)',
              kind: 'heap',
              boxes: [
                { id: 'n1', label: 'node 1', value: '3' },
                { id: 'n2', label: 'node 2', value: '2' },
                { id: 'n3', label: 'node 3', value: '0' },
                { id: 'n4', label: 'node 4', value: '-4' },
                { id: 'n5', label: 'node 5', value: '5' },
              ],
            },
          ],
          frames: [
            { id: 'f1', caption: 'The list is 3 -> 2 -> 0 -> -4 -> 5, and node 5 points back to node 0: there is no null tail.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n1', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n1', tone: 'danger' }], highlightBoxIds: ['n1'] },
            { id: 'f2', caption: 'A naive walk follows next through 3, then 2, then 0 ...', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n2', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n3', tone: 'danger' }] },
            { id: 'f3', caption: '... then -4 and 5, and next brings the walk back to 0: the same three nodes repeat forever.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n3', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n5', tone: 'danger' }], highlightBoxIds: ['n3', 'n4', 'n5'] },
            { id: 'f4', caption: 'Floyd starts both pointers at the head instead; no visited set and no node rewrites are needed.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n1', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n1', tone: 'danger' }], highlightBoxIds: ['n1'] },
          ],
        },
      },
      {
        title: 'Slow and fast enter',
        body: `The algorithm is two pointers moving over the same list at different speeds. Slow advances one node per step; fast advances two. If the list ends, fast or fast.next becomes null and the answer is no cycle. If a cycle exists, both pointers are eventually trapped in it, because every next pointer inside the cycle stays inside. The animation follows the crossing point: head 3, then 2, then the entrance at 0. From then on fast keeps lapping the same three nodes. The key quantity is the forward distance from fast to slow inside the cycle. While moving, fast gains one position on slow per step, so that distance shrinks by exactly one each step - and once both pointers are on the cycle, a distance that starts below the cycle length must eventually reach zero. Fast can never jump over slow, because the gain is one node, not two.`,
        animation: {
          kind: 'memory-diagram',
          regions: [
            {
              id: 'heap',
              label: 'Linked list nodes (heap)',
              kind: 'heap',
              boxes: [
                { id: 'n1', label: 'node 1', value: '3' },
                { id: 'n2', label: 'node 2', value: '2' },
                { id: 'n3', label: 'node 3', value: '0' },
                { id: 'n4', label: 'node 4', value: '-4' },
                { id: 'n5', label: 'node 5', value: '5' },
              ],
            },
          ],
          frames: [
            { id: 'f1', caption: 'Both pointers start at the head: slow moves one node per step, fast moves two.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n1', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n1', tone: 'danger' }], highlightBoxIds: ['n1'] },
            { id: 'f2', caption: 'After one step slow is at 2 and fast is at 0 - fast has entered the cycle first.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n2', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n3', tone: 'danger' }] },
            { id: 'f3', caption: 'Both are inside the cycle now; the forward distance from fast to slow is one node.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n3', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n5', tone: 'danger' }], highlightBoxIds: ['n3', 'n4', 'n5'] },
            { id: 'f4', caption: 'One more step closes the distance to zero - fast lands exactly on slow at -4.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n4', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n4', tone: 'danger' }], highlightBoxIds: ['n4'] },
            { id: 'f5', caption: 'The gap shrinks by one every step and can never be jumped, so a meeting is unavoidable.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n4', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n4', tone: 'danger' }], highlightBoxIds: ['n3', 'n4', 'n5'] },
          ],
        },
      },
      {
        title: 'Meeting proves a cycle',
        body: `Trace the race from the top with the full sequence. Both pointers leave the head 3 together. After one step slow is at 2 and fast is at 0, already inside the loop. After two steps slow is at 0 and fast is at 5 - both are on the cycle, with a forward gap of one node. After three steps both land on -4, and that shared node is the meeting. The animation highlights the wrap: fast has no null to stop at, because node 5 points back to node 0. If fast reached null instead, the list would be acyclic and no meeting could occur, which is why the loop must also test fast.next for even-length lists. The meeting proves a cycle exists, but the meeting node depends on the head-to-entrance distance and usually is not the entrance itself.`,
        animation: {
          kind: 'memory-diagram',
          regions: [
            {
              id: 'heap',
              label: 'Linked list nodes (heap)',
              kind: 'heap',
              boxes: [
                { id: 'n1', label: 'node 1', value: '3' },
                { id: 'n2', label: 'node 2', value: '2' },
                { id: 'n3', label: 'node 3', value: '0' },
                { id: 'n4', label: 'node 4', value: '-4' },
                { id: 'n5', label: 'node 5', value: '5' },
              ],
            },
          ],
          frames: [
            { id: 'f1', caption: 'Both pointers leave the head 3 together at the start of the race.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n1', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n1', tone: 'danger' }], highlightBoxIds: ['n1'] },
            { id: 'f2', caption: 'Slow reaches 2; fast reaches 0 and is already inside the cycle.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n2', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n3', tone: 'danger' }] },
            { id: 'f3', caption: 'Slow enters at 0; fast is at 5, one step behind it in cycle order.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n3', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n5', tone: 'danger' }], highlightBoxIds: ['n3', 'n4', 'n5'] },
            { id: 'f4', caption: 'They meet at -4. Two pointers can only share a node if some next pointer loops.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n4', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n4', tone: 'danger' }], highlightBoxIds: ['n4'] },
            { id: 'f5', caption: 'A meeting inside the list is the proof: an acyclic list would send fast to null instead.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n4', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n4', tone: 'danger' }], highlightBoxIds: ['n3', 'n4', 'n5'] },
          ],
        },
      },
      {
        title: 'Reset to find the entrance',
        body: `A meeting proves a cycle exists but usually not where it begins - the meeting point depends on the head-to-entrance distance and the cycle length. The entrance is found with one elegant move: leave fast at the meeting point, reset slow to the head, and then advance both pointers one node at a time. They meet again, and this time the meeting node is the cycle entrance. The distance argument is short: when they first meet at index a + b, slow has walked a + b steps, fast has walked a + b + kL for some whole number k, and fast walked twice as far, so a + b = kL. That makes the distance from the head to the entrance equal to the distance from the meeting point to the entrance, modulo the cycle length - two equal-speed pointers leaving those positions must arrive together. The animation shows exactly that: reset to 3, advance to 2, advance to 0, entrance found.`,
        animation: {
          kind: 'memory-diagram',
          regions: [
            {
              id: 'heap',
              label: 'Linked list nodes (heap)',
              kind: 'heap',
              boxes: [
                { id: 'n1', label: 'node 1', value: '3' },
                { id: 'n2', label: 'node 2', value: '2' },
                { id: 'n3', label: 'node 3', value: '0' },
                { id: 'n4', label: 'node 4', value: '-4' },
                { id: 'n5', label: 'node 5', value: '5' },
              ],
            },
          ],
          frames: [
            { id: 'f1', caption: 'The first meeting is at -4: proof of a cycle, but not necessarily the entrance.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n4', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n4', tone: 'danger' }], highlightBoxIds: ['n4'] },
            { id: 'f2', caption: 'Reset slow to the head (3) and leave fast at the meeting point.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n1', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n4', tone: 'danger' }], highlightBoxIds: ['n1', 'n4'] },
            { id: 'f3', caption: 'Advance both one step: slow moves to 2, fast wraps from -4 to 5.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n2', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n5', tone: 'danger' }] },
            { id: 'f4', caption: 'Advance again: both land on 0 - this meeting node is the cycle entrance.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n3', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n3', tone: 'danger' }], highlightBoxIds: ['n3'] },
            { id: 'f5', caption: 'Head-to-entrance equals meeting-to-entrance, so equal-speed pointers must arrive together.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n3', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n3', tone: 'danger' }], highlightBoxIds: ['n3', 'n4', 'n5'] },
          ],
        },
      },
      {
        title: 'O(1) space beats a set',
        body: `The alternative detector is a visited set: walk the list, insert each node, and stop when a node repeats. It is simpler to reason about and reports the first repeated node immediately, but it allocates one entry per node, so it uses O(n) memory and cannot run where allocation is expensive or forbidden. Floyd uses two references and no allocation at all. Its cost is still O(n) time: the pointers traverse the list at most a few times before meeting, and the reset phase adds at most one more pass, so the constants are small even though the asymptotics match the set approach. The animation contrasts the two: the set version accumulates five entries for this list, while the pointer version carries only slow and fast. When memory is cheap the set is easier to defend; when it is not, the two pointers are the answer.`,
        animation: {
          kind: 'memory-diagram',
          regions: [
            {
              id: 'heap',
              label: 'Linked list nodes (heap)',
              kind: 'heap',
              boxes: [
                { id: 'n1', label: 'node 1', value: '3' },
                { id: 'n2', label: 'node 2', value: '2' },
                { id: 'n3', label: 'node 3', value: '0' },
                { id: 'n4', label: 'node 4', value: '-4' },
                { id: 'n5', label: 'node 5', value: '5' },
              ],
            },
          ],
          frames: [
            { id: 'f1', caption: 'The visited-set detector stores every node it passes: one entry for node 3.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n1', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n1', tone: 'danger' }], highlightBoxIds: ['n1'] },
            { id: 'f2', caption: 'The set keeps growing with the walk - O(n) extra memory for n nodes.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n2', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n3', tone: 'danger' }], highlightBoxIds: ['n1', 'n2', 'n3'] },
            { id: 'f3', caption: 'Five entries for this list, and the cost scales with the input, not with the cycle.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n3', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n5', tone: 'danger' }], highlightBoxIds: ['n1', 'n2', 'n3', 'n4', 'n5'] },
            { id: 'f4', caption: 'Floyd carries only two pointers: O(1) space and O(n) time, same asymptotics, tiny constant.', cursors: [{ id: 'slow', label: 'slow', targetBoxId: 'n3', tone: 'primary' }, { id: 'fast', label: 'fast', targetBoxId: 'n3', tone: 'danger' }], highlightBoxIds: ['n3', 'n4', 'n5'] },
          ],
        },
      },
    ],
    edgeCases: [
      'Cycle at the head: the reset phase still converges at the head, but code that assumes the entrance differs from the meeting point breaks - trace [1, 2] with 2 pointing back to 1 to verify.',
      'A single node pointing to itself: fast must check fast and fast.next before the double step, or the second hop dereferences null.',
      'Even-length acyclic lists: fast.next is null while fast is not, so the loop must test both conditions rather than only fast.',
      'Stopping at the first meeting: the meeting node is the entrance only when the head-to-entrance distance is zero - always run the reset phase before claiming the entrance.',
      'Mutating nodes to mark visited (for example stealing a spare flag) corrupts the list for concurrent readers; when no allocation is allowed, Floyd is the safe alternative.',
    ],
    followUps: [
      { q: 'Why must the pointers meet inside the cycle?', a: 'Once both are on the cycle, fast closes the forward distance to slow by exactly one node per step, so a finite gap must reach zero. Fast cannot jump over slow because the closure is one, not two.' },
      { q: 'Why does resetting to the head find the entrance?', a: 'At the meeting, slow walked a + b and fast walked a + b + kL - twice as far - so a + b = kL. That makes the head-to-entrance distance equal to the meeting-to-entrance distance modulo L, so equal-speed pointers converge at the entrance.' },
      { q: 'When would you prefer the visited set?', a: 'When memory is plentiful and you want the simplest correct code, or when the first repeated node must be reported immediately; Floyd wins when allocation is expensive or forbidden.' },
      { q: 'Does Floyd work outside linked lists?', a: 'Yes - any structure with a deterministic next function, such as LeetCode 202 (Happy Number) or 287 (Find the Duplicate Number), is the same two-pointer argument over a virtual list.' },
    ],
  },
];
