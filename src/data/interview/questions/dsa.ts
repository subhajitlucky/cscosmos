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
          kind: 'story',
          cast: [
            { id: 'host', icon: '🧑‍💼', label: 'Host' },
            { id: 'cards', icon: '🃏', label: 'Cards: 3 2 4 3' },
          ],
          frames: [
            { id: 'f1', caption: 'Goal: find two cards that add up to 6. 🎯', shout: { text: 'MAKE SIX!', tone: 'info' }, cast: [{ id: 'host', state: 'working' }], tokens: [{ id: 'goal', icon: '🎯', label: 'sum = 6', at: 'host', effect: 'pop' }] },
            { id: 'f2', caption: 'Try card 1 + card 2: 3 + 2 = 5. Miss! 🙅', shout: { text: '3 + 2 = 5', tone: 'info' }, cast: [{ id: 'cards', state: 'working' }], tokens: [{ id: 'p1', icon: '🃏', label: '3 + 2', at: 'host', effect: 'pop' }] },
            { id: 'f3', caption: 'Try card 1 + card 3: 3 + 4 = 7. Miss again! 🙅', shout: { text: '3 + 4 = 7', tone: 'info' }, cast: [{ id: 'cards', state: 'working' }], tokens: [{ id: 'p2', icon: '🃏', label: '3 + 4', at: 'host', effect: 'pop' }] },
            { id: 'f4', caption: 'Card 1 + card 4: 3 + 3 = 6. MATCH! 🎉', shout: { text: '3 + 3 = 6 ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'host', state: 'happy' }], tokens: [{ id: 'win', icon: '🎉', label: 'found it!', at: 'host', effect: 'pop' }] },
            { id: 'f5', caption: 'But every pair needed a try — n×n tries as the pile grows. 😩', shout: { text: 'EVERY PAIR = SLOW', tone: 'bad' }, mood: 'bad', cast: [{ id: 'cards', state: 'crashed' }], tokens: [{ id: 'snail', icon: '🐌', label: 'n² tries', at: 'host', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Ask for the complement',
        body: `Brute force asks whether any other element pairs with this one, and answering costs a full rescan. Flip the question: if nums[i] must pair with an already-seen element, that partner's value is determined, complement = target - nums[i]. So before processing index i, the only question that matters is whether the complement has been seen. A hash map keyed by value answers that in one lookup. The animation shows the invariant taking shape: after processing each index, the map contains every value from indices before i. For [3, 2, 4, 3] and target 6, index 0 needs a 3 and finds nothing; index 1 needs a 4 and finds nothing; index 2 needs a 2 and finds it stored from index 1. That is the whole trick: the pair is discovered from the second element's point of view, so the array is walked exactly once.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'host', icon: '🧑‍💼', label: 'Host' },
            { id: 'cards', icon: '🃏', label: 'Cards: 3 2 4 3' },
            { id: 'shelf', icon: '🧤', label: 'Seen shelf' },
          ],
          frames: [
            { id: 'f1', caption: 'Flip the question: “What partner would complete ME?” 🤔', shout: { text: 'ASK FOR THE PARTNER', tone: 'info' }, cast: [{ id: 'host', state: 'working' }], tokens: [{ id: 'flip', icon: '🔄', label: 'flipped', at: 'host', effect: 'pop' }] },
            { id: 'f2', caption: 'Card 3 needs a 3. On the shelf? Not yet. ❌', shout: { text: 'NEED A 3…', tone: 'info' }, cast: [{ id: 'shelf', state: 'working' }], tokens: [{ id: 'need3', icon: '🔍', label: 'need 3', from: 'cards', to: 'shelf' }] },
            { id: 'f3', caption: 'Card 2 needs a 4. On the shelf? No. ❌', shout: { text: 'NEED A 4…', tone: 'info' }, cast: [{ id: 'shelf', state: 'working' }], tokens: [{ id: 'need4', icon: '🔍', label: 'need 4', from: 'cards', to: 'shelf' }] },
            { id: 'f4', caption: 'Card 4 needs a 2 — and a 2 is already on the shelf! ✅', shout: { text: 'NEED 2 → FOUND ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'host', state: 'happy' }], tokens: [{ id: 'found', icon: '🤝', label: '2 + 4 = 6', from: 'shelf', to: 'host' }] },
            { id: 'f5', caption: 'One single walk through the cards, never twice. 🚶', shout: { text: 'ONE PASS', tone: 'good' }, mood: 'good', cast: [{ id: 'cards', state: 'done' }], tokens: [{ id: 'pass', icon: '🚶', label: 'walk once', at: 'cards', effect: 'pop' }] },
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
          kind: 'story',
          cast: [
            { id: 'guest', icon: '🧑', label: 'Cards walk in' },
            { id: 'shelf', icon: '🧤', label: 'Seen shelf' },
          ],
          frames: [
            { id: 'f1', caption: 'Card 3 arrives. Anyone need a 3? Check first, then store. 🧤', shout: { text: 'CHECK, THEN STORE', tone: 'info' }, cast: [{ id: 'guest', state: 'working' }], tokens: [{ id: 'c3', icon: '🎫', label: '3', from: 'guest', to: 'shelf' }] },
            { id: 'f2', caption: 'Next card 2: needs a 4? Not on the shelf. Store it too. 📥', shout: { text: 'STORE 2', tone: 'info' }, cast: [{ id: 'shelf', state: 'working' }], tokens: [{ id: 'c2', icon: '🎫', label: '2', from: 'guest', to: 'shelf' }] },
            { id: 'f3', caption: 'Card 4 arrives: needs a 2? YES — it is on the shelf! 🎯', shout: { text: 'MATCH! [1, 2] ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'shelf', state: 'done' }], tokens: [{ id: 'found', icon: '🎯', label: '2 + 4 = 6', at: 'shelf', effect: 'pop' }] },
            { id: 'f4', caption: 'Order matters: check BEFORE storing, or a card finds itself. ⚠️', shout: { text: 'CHECK FIRST!', tone: 'info' }, cast: [{ id: 'guest', state: 'working' }], tokens: [{ id: 'order', icon: '⚠️', label: 'rule', at: 'guest', effect: 'pop' }] },
            { id: 'f5', caption: 'One pass, one shelf, answer found. Done in a single walk. ✅', shout: { text: 'ONE WALK ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'guest', state: 'happy' }], tokens: [{ id: 'done', icon: '✅', label: 'O(n)', at: 'shelf', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Why O(1) lookup pays',
        body: `A hash map is a time-for-space trade. The brute force spends O(1) memory and O(n²) time; the one-pass solution spends O(n) memory to buy O(1) average lookups. The map stores at most one entry per distinct value seen, so its footprint grows linearly with the input. Lookups are O(1) on average because a good hash function spreads keys across buckets; with many collisions, or a deliberately adversarial key set, operations can degrade toward O(n), which is why production hash maps randomize seeds to prevent hash-flooding attacks. Watch the animation: every insert lands in a bucket and every has/get probes that bucket instead of scanning the array. If memory were the tight constraint, sorting plus two pointers would give O(1) space at O(n log n) time. The trade is yours to defend, not a universal law.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'time', icon: '⏰', label: 'Time' },
            { id: 'memory', icon: '👛', label: 'Memory' },
          ],
          frames: [
            { id: 'f1', caption: 'Speed costs a shelf: you buy fast lookups with memory. 🛒', shout: { text: 'SPEED COSTS MEMORY', tone: 'info' }, cast: [{ id: 'memory', state: 'working' }], tokens: [{ id: 'pay', icon: '🪙', label: 'pay here', at: 'memory', effect: 'pop' }] },
            { id: 'f2', caption: 'The shelf grows one slot per new card. 📏', shout: { text: 'SHELF GROWS', tone: 'info' }, cast: [{ id: 'memory', state: 'working' }], tokens: [{ id: 'grow', icon: '📏', label: '1 per card', at: 'memory', effect: 'pop' }] },
            { id: 'f3', caption: 'Lookups jump straight to the slot — no re-walking! ⚡', shout: { text: 'JUMP = FAST ⚡', tone: 'good' }, mood: 'good', cast: [{ id: 'time', state: 'happy' }], tokens: [{ id: 'jump', icon: '⚡', label: 'instant peek', at: 'time', effect: 'pop' }] },
            { id: 'f4', caption: 'Bad luck with collisions? The shelf slows to a walk. 🐌', shout: { text: 'COLLISIONS SLOW IT', tone: 'bad' }, mood: 'bad', cast: [{ id: 'time', state: 'crashed' }], tokens: [{ id: 'snail', icon: '🐌', label: 'worst case', at: 'time', effect: 'pop' }] },
            { id: 'f5', caption: 'Or sort the cards and use two hands: zero extra memory. ✋🤚', shout: { text: 'TWO HANDS, NO SHELF', tone: 'info' }, cast: [{ id: 'memory', state: 'idle', face: '😌' }], tokens: [{ id: 'hands', icon: '✋', label: 'small + big', at: 'memory', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Duplicates and missing pairs',
        body: `Duplicate values are where candidates slip. With nums = [3, 3] and target 6, the correct output is [0, 1]. Check-then-insert handles it naturally: index 0 stores 3 -> 0, and index 1 finds the complement 3 at index 0 before it ever considers overwriting the entry. If you inserted first, index 0 would find itself and report [1, 1]. The map keeps only one index per value, so with many duplicates you get the most recent compatible partner, which is fine because the problem asks for any valid pair. Also decide what a missing pair returns: the standard contract returns an empty array, but some variants throw or guarantee exactly one answer, so state your assumption. Finally, complement arithmetic is safe with negative values and zeros, but fixed-width languages must watch for overflow when target - nums[i] crosses the integer bounds.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'first', icon: '🃏', label: 'First 3' },
            { id: 'second', icon: '🃏', label: 'Second 3' },
            { id: 'shelf', icon: '🧤', label: 'Seen shelf' },
          ],
          frames: [
            { id: 'f1', caption: 'Twins! Two cards both say 3 — and the target is 6. 🎯', shout: { text: 'TWINS: 3 & 3', tone: 'info' }, cast: [{ id: 'first', state: 'working' }], tokens: [{ id: 'twin', icon: '🎯', label: '3 + 3 = 6', at: 'first', effect: 'pop' }] },
            { id: 'f2', caption: 'The first 3 gets stored on the shelf. 📥', shout: { text: 'STORE THE FIRST', tone: 'info' }, cast: [{ id: 'shelf', state: 'working' }], tokens: [{ id: 'store', icon: '🎫', label: '3', from: 'first', to: 'shelf' }] },
            { id: 'f3', caption: 'The second 3 checks first: finds the first — pair found! ✅', shout: { text: 'FOUND THE TWIN ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'second', state: 'happy' }], tokens: [{ id: 'match', icon: '✅', label: '[0, 1]', at: 'shelf', effect: 'pop' }] },
            { id: 'f4', caption: 'Store first, check later? A card would match ITSELF. 🪞', shout: { text: 'NEVER SELF-MATCH!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shelf', state: 'crashed' }], tokens: [{ id: 'mirror', icon: '🪞', label: '[1, 1] ✗', at: 'shelf', effect: 'shake' }] },
            { id: 'f5', caption: 'No pair at all? Hand back an empty basket. 🧺', shout: { text: 'NO PAIR → EMPTY', tone: 'info' }, cast: [{ id: 'first', state: 'idle' }], tokens: [{ id: 'basket', icon: '🧺', label: '[]', at: 'first', effect: 'pop' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Duplicate values such as [3, 3] with target 6: check the map before inserting, or index 0 finds itself and returns [1, 1] instead of [0, 1].',
      'No valid pair: the loop should exit and return an empty array, but some variants guarantee exactly one solution - state the contract before coding.',
      'Negative values and zeros are safe: complement = target - nums[i] needs no special casing; absolute-value heuristics break them.',
      'Integer overflow in fixed-width languages: target - nums[i] can cross the integer bounds even when the final answer is valid - use 64-bit arithmetic or reorder the comparison.',
      'Huge duplicate runs overwrite one map entry per value: since the check happens first, you still get the most recent compatible partner, which satisfies any-valid-pair contracts.',
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
          kind: 'story',
          cast: [
            { id: 'reader', icon: '👀', label: 'Reader' },
            { id: 'letter', icon: '📜', label: 'Long letter' },
            { id: 'word', icon: '🧩', label: 'Word: ABABAC' },
          ],
          frames: [
            { id: 'f1', caption: 'Slide the word along the letter, comparing letter by letter. ➡️', shout: { text: 'SLIDE & CHECK', tone: 'info' }, cast: [{ id: 'word', state: 'working' }], tokens: [{ id: 'slide', icon: '➡️', label: 'one step', at: 'word', effect: 'pop' }] },
            { id: 'f2', caption: 'Five letters match: A-B-A-B-A! 🎉', shout: { text: '5 MATCHED!', tone: 'good' }, mood: 'good', cast: [{ id: 'reader', state: 'working' }], tokens: [{ id: 'five', icon: '✅', label: 'ABABA', at: 'letter', effect: 'pop' }] },
            { id: 'f3', caption: 'Then one letter fails: hoped for C, got A. 💥', shout: { text: 'MISMATCH!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'letter', state: 'crashed' }], tokens: [{ id: 'boom', icon: '💥', label: 'C ≠ A', at: 'letter', effect: 'burst' }] },
            { id: 'f4', caption: 'Restart the whole word from the very beginning — again. 🔁', shout: { text: 'RESTART. AGAIN.', tone: 'bad' }, mood: 'bad', cast: [{ id: 'reader', state: 'crashed' }], tokens: [{ id: 'restart', icon: '🔁', label: 'from zero', at: 'word', effect: 'shake' }] },
            { id: 'f5', caption: 'Same letters, checked over and over — tortoise-slow. 🐌', shout: { text: 'RECHECKING IS SLOW', tone: 'bad' }, mood: 'bad', cast: [{ id: 'word', state: 'crashed' }], tokens: [{ id: 'snail', icon: '🐌', label: 'n×m checks', at: 'word', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'The prefix that is a suffix',
        body: `Define lps[i] as the length of the longest proper prefix of pattern[0..i] that is also a suffix of pattern[0..i]. Proper means strictly shorter than the substring itself, so lps describes an overlap you can reuse rather than the whole match. For ABABA the longest such overlap is ABA, length 3; for ABAB it is AB, length 2; for a fresh character with no overlap it is 0. The table exists because of a fact about mismatches: when you have just matched j characters, the text you consumed ends with pattern[0..j-1]. If the next character breaks the match, any alignment that could still succeed must start inside that window, and the longest prefix that is also a suffix is exactly the largest chunk of progress that survives. The animation highlights those overlapping chunks - the same characters serving as both prefix and suffix - before the next step turns them into table entries.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'word', icon: '🧩', label: 'Word ABABA' },
            { id: 'mirror', icon: '🪞', label: 'Head ↔ Tail' },
          ],
          frames: [
            { id: 'f1', caption: 'Look closely at the matched word: A-B-A-B-A. 🔍', shout: { text: 'LOOK AT THE WORD', tone: 'info' }, cast: [{ id: 'word', state: 'working' }], tokens: [{ id: 'word', icon: '🧩', label: 'ABABA', at: 'word', effect: 'pop' }] },
            { id: 'f2', caption: 'Its HEAD “ABA” also fits its TAIL “ABA”! 🪞', shout: { text: 'HEAD FITS TAIL!', tone: 'good' }, mood: 'good', cast: [{ id: 'mirror', state: 'working' }], tokens: [{ id: 'fit', icon: '🪞', label: 'ABA = ABA', at: 'mirror', effect: 'pop' }] },
            { id: 'f3', caption: 'That means three letters are already right — keep them! 3️⃣', shout: { text: 'KEEP 3 LETTERS', tone: 'good' }, mood: 'good', cast: [{ id: 'word', state: 'done' }], tokens: [{ id: 'keep', icon: '3️⃣', label: 'saved work', at: 'word', effect: 'pop' }] },
            { id: 'f4', caption: 'No need to ever restart from zero! 🎉', shout: { text: 'NO FULL RESTART', tone: 'good' }, mood: 'good', cast: [{ id: 'mirror', state: 'happy' }], tokens: [{ id: 'party', icon: '🎉', label: 'skip ahead', at: 'mirror', effect: 'pop' }] },
            { id: 'f5', caption: 'Write all the overlaps into a cheat table: 0,0,1,2,3,0. 📋', shout: { text: 'CHEAT TABLE (LPS)', tone: 'info' }, cast: [{ id: 'word', state: 'happy' }], tokens: [{ id: 'table', icon: '📋', label: '0 0 1 2 3 0', at: 'word', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Build the LPS table',
        body: `The construction code is a tiny matching problem against the pattern itself. Keep a candidate length len and a scan index i, both starting small. If pattern[i] extends the current candidate, the overlap grows: increment len, write lps[i], advance i. On a mismatch, do not reset len to zero - that is the whole subtlety. Instead fall back to lps[len-1], the longest overlap that still fits, and retry the same i. Only when len is zero do you write zero and advance. The animation builds the table for ABABAC: three matches grow run lengths 1, 2, then 3; the final C mismatches and triggers two fallbacks, 3 to 1 to 0, before recording lps[5] = 0. Each index either advances i or shrinks len, and len never exceeds i, so the total work is linear in the pattern length.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'student', icon: '🧑‍🎓', label: 'The word' },
            { id: 'tablet', icon: '📋', label: 'Cheat sheet' },
          ],
          frames: [
            { id: 'f1', caption: 'The word studies itself, letter by letter. 🔍', shout: { text: 'SELF STUDY', tone: 'info' }, cast: [{ id: 'student', state: 'working' }], tokens: [{ id: 'study', icon: '🔍', label: 'ABABAC', at: 'student', effect: 'pop' }] },
            { id: 'f2', caption: '“A” alone → overlap 0. “AB” → still 0. 🔢', shout: { text: 'A:0  AB:0', tone: 'info' }, cast: [{ id: 'tablet', state: 'working' }], tokens: [{ id: 'zeros', icon: '0️⃣', label: 'nothing yet', at: 'tablet', effect: 'pop' }] },
            { id: 'f3', caption: '“ABA” → “A” fits! 1. “ABAB” → “AB” fits! 2. 📈', shout: { text: 'IT GROWS: 1, 2…', tone: 'good' }, mood: 'good', cast: [{ id: 'student', state: 'working' }], tokens: [{ id: 'grow', icon: '📈', label: 'overlap up', at: 'tablet', effect: 'pop' }] },
            { id: 'f4', caption: '“ABABA” → “ABA” fits! The best so far: 3. 3️⃣', shout: { text: 'BEST YET: 3', tone: 'good' }, mood: 'good', cast: [{ id: 'tablet', state: 'done' }], tokens: [{ id: 'three', icon: '3️⃣', label: 'keep 3', at: 'tablet', effect: 'pop' }] },
            { id: 'f5', caption: 'Then “C” fails — the overlap shrinks step by step: 3 → 1 → 0. 📉', shout: { text: 'SHRINK, DON’T STOP', tone: 'info' }, cast: [{ id: 'student', state: 'working' }], tokens: [{ id: 'shrink', icon: '📉', label: 'fall back', at: 'student', effect: 'pop' }] },
            { id: 'f6', caption: 'Table finished: 0, 0, 1, 2, 3, 0. Ready to match! ✅', shout: { text: 'TABLE READY ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'tablet', state: 'happy' }], tokens: [{ id: 'ready', icon: '✅', label: '0 0 1 2 3 0', at: 'tablet', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Match without moving backwards',
        body: `The search loop keeps one text pointer i and one pattern pointer j. On a character match both advance; when j reaches the pattern length, the match starts at i - j. On a mismatch the algorithm consults the table: if j is greater than zero, set j = lps[j - 1] and retry the same i; only when j is zero does i advance. That is the invariant that makes KMP linear - i is monotone, so the text is read once. The animation follows ABABAABABAC against ABABAC. At i = 5 the text has matched ABABA and fails on C; j falls back 5 to 3 to 1 to 0, and only then does i move to 6, where a fresh run matches all the way to i = 10 and returns 5. Notice the mismatch chain repeats a decision the naive algorithm would redo from scratch at several alignments.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'reader', icon: '🚶', label: 'The reader' },
            { id: 'tablet', icon: '📋', label: 'Cheat sheet' },
            { id: 'letter', icon: '📜', label: 'The letter' },
          ],
          frames: [
            { id: 'f1', caption: 'Mismatch at “C” — but the reader does NOT walk backwards. 🚶', shout: { text: 'NEVER GO BACK', tone: 'info' }, cast: [{ id: 'reader', state: 'working' }], tokens: [{ id: 'stop', icon: '✋', label: 'stay put', at: 'letter', effect: 'pop' }] },
            { id: 'f2', caption: 'The cheat sheet says: skip ahead to letter 3. 📋', shout: { text: 'TABLE SAYS: 3', tone: 'info' }, cast: [{ id: 'tablet', state: 'working' }], tokens: [{ id: 'skip', icon: '⏭️', label: 'skip to 3', at: 'tablet', effect: 'pop' }] },
            { id: 'f3', caption: 'Those three letters were already checked — they stay! ✅✅✅', shout: { text: 'KEEP THE 3', tone: 'good' }, mood: 'good', cast: [{ id: 'reader', state: 'working' }], tokens: [{ id: 'keep', icon: '✅', label: 'still counted', at: 'reader', effect: 'pop' }] },
            { id: 'f4', caption: 'A-B-A-B-A-C — found it at last! 🎯', shout: { text: 'FOUND IT!', tone: 'good' }, mood: 'good', cast: [{ id: 'letter', state: 'done' }], tokens: [{ id: 'found', icon: '🎯', label: 'position 5', at: 'letter', effect: 'pop' }] },
            { id: 'f5', caption: 'The reader walked forward just once — fast like a hare. 🐇', shout: { text: 'ONE FORWARD WALK ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'reader', state: 'happy' }], tokens: [{ id: 'hare', icon: '🐇', label: 'no rewinding', at: 'reader', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Why the fallback is correct',
        body: `The failure function is correct because of what the failed attempt leaves behind. When text[i] mismatches with j matched characters, the text's last j characters already equal pattern[0..j-1] - that is guaranteed by the loop's own history, not by an assumption. A shift of k requires the pattern's first j−k characters to equal its last j−k characters — i.e. a border of length j−k. The longest border length is lps[j-1], so the smallest valid shift is j − lps[j-1] — no alignment is skipped — which is exactly j ← lps[j-1], the alignment that keeps the longest still-possible overlap and discards only alignments that cannot match. The animation makes the chain concrete: the window ABABA has the suffix ABA equal to the prefix ABA, so after falling back the A that ended the window is already covered again. Every fallback is like that, which is why KMP never misses a match - and why the text pointer never rewinds.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'detective', icon: '🕵️', label: 'Detective' },
            { id: 'window', icon: '🪟', label: 'Matched window ABABA' },
            { id: 'trash', icon: '🗑️', label: 'Skipped starts' },
          ],
          frames: [
            { id: 'f1', caption: 'Why is skipping safe? No hidden match gets lost. 🕵️', shout: { text: 'PROVE SAFE', tone: 'info' }, cast: [{ id: 'detective', state: 'working' }], tokens: [{ id: 'case', icon: '🕵️', label: 'investigate', at: 'detective', effect: 'pop' }] },
            { id: 'f2', caption: 'The kept letters were just checked — they cannot be wrong. ✅', shout: { text: 'JUST-CHECKED ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'window', state: 'done' }], tokens: [{ id: 'proof', icon: '✅', label: 'ABA re-verified', at: 'window', effect: 'pop' }] },
            { id: 'f3', caption: 'Any skipped start would need an even longer overlap — impossible! 🚫', shout: { text: 'BIGGER OVERLAP? NO', tone: 'info' }, cast: [{ id: 'detective', state: 'working' }], tokens: [{ id: 'impossible', icon: '🚫', label: 'no longer fit', at: 'window', effect: 'pop' }] },
            { id: 'f4', caption: 'So each skip drops only starts that could never match. 🗑️', shout: { text: 'ONLY DROP LOSERS', tone: 'info' }, cast: [{ id: 'trash', state: 'done' }], tokens: [{ id: 'waste', icon: '🗑️', label: 'safe skips', at: 'trash', effect: 'pop' }] },
            { id: 'f5', caption: 'Result: the text is read once — the fastest possible. 🏁', shout: { text: 'ONE READ, FAST ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'detective', state: 'happy' }], tokens: [{ id: 'flag', icon: '🏁', label: 'O(n + m)', at: 'detective', effect: 'pop' }] },
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
          kind: 'story',
          cast: [
            { id: 'shelf', icon: '🗂️', label: 'Plain shelf' },
            { id: 'searcher', icon: '🔍', label: 'Cloakroom helper' },
          ],
          frames: [
            { id: 'f1', caption: 'The coats sit in one plain row — no labels, no order rules. 🗂️', shout: { text: 'PLAIN SHELF', tone: 'info' }, cast: [{ id: 'shelf', state: 'working' }], tokens: [{ id: 'coats', icon: '🧥', label: 'c b a', at: 'shelf', effect: 'pop' }] },
            { id: 'f2', caption: 'Looking up coat “a” means scanning the whole row. 🚶', shout: { text: 'SCAN, SCAN, SCAN…', tone: 'bad' }, mood: 'bad', cast: [{ id: 'searcher', state: 'working' }], tokens: [{ id: 'scan', icon: '🔍', label: 'check, check…', from: 'searcher', to: 'shelf' }] },
            { id: 'f3', caption: 'Pulling one coat out shifts every other coat over. 😩', shout: { text: 'EVERYTHING SHIFTS!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shelf', state: 'crashed' }], tokens: [{ id: 'shift', icon: '↔️', label: 'O(n) moves', at: 'shelf', effect: 'shake' }] },
            { id: 'f4', caption: 'One structure cannot be both: finder AND order-keeper. 🤷', shout: { text: 'NEED BOTH JOBS!', tone: 'info' }, cast: [{ id: 'searcher', state: 'idle', face: '🤔' }], tokens: [{ id: 'think', icon: '🤔', label: 'two jobs', at: 'searcher', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Hash map plus linked list',
        body: `The design splits responsibilities. A hash map stores key to node references, so lookup never scans - the map jumps straight to the node object. A doubly linked list stores recency, from the most recently used node at one end to the least recently used at the other, and because every node knows both neighbors, unlinking it and re-inserting it at the front are constant-time pointer updates. Two sentinel nodes, a dummy head and a dummy tail, bracket the list: head.next is always the MRU node and tail.prev is always the LRU node, so removing or inserting never special-cases an empty list. The animation lays out the wiring: map entries point at list nodes, nodes point at each other, and the two sentinels close the ends. Every operation now has a direct handle on the exact node it must move, which is the property neither structure has alone.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'finder', icon: '🗺️', label: 'Name index (map)' },
            { id: 'rope', icon: '🔗', label: 'Rope of coats' },
            { id: 'hooks', icon: '🪝', label: 'End hooks' },
          ],
          frames: [
            { id: 'f1', caption: 'Job one: the name index finds any coat instantly. 🗺️', shout: { text: 'INSTANT FIND', tone: 'info' }, cast: [{ id: 'finder', state: 'working' }], tokens: [{ id: 'find', icon: '⚡', label: 'no scanning', at: 'finder', effect: 'pop' }] },
            { id: 'f2', caption: 'Job two: the rope keeps the coats in “last used” order. 🔗', shout: { text: 'ROPE KEEPS ORDER', tone: 'info' }, cast: [{ id: 'rope', state: 'working' }], tokens: [{ id: 'order', icon: '🔗', label: 'front = newest', at: 'rope', effect: 'pop' }] },
            { id: 'f3', caption: 'Two end hooks make the rope easier to grab. 🪝', shout: { text: 'END HOOKS', tone: 'info' }, cast: [{ id: 'hooks', state: 'done' }], tokens: [{ id: 'hook', icon: '🪝', label: 'no special cases', at: 'hooks', effect: 'pop' }] },
            { id: 'f4', caption: 'Newest coat at the front, oldest at the back. ✅', shout: { text: 'FRONT = NEW, BACK = OLD', tone: 'good' }, mood: 'good', cast: [{ id: 'rope', state: 'done' }], tokens: [{ id: 'ready', icon: '✅', label: 'the rule', at: 'rope', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'A get promotes a node',
        body: `A get does three things in constant time: look up the node in the map, unlink it from its current position, and insert it right after the dummy head. The animation warms the cache to c <-> b <-> a, with c most recent and a the next eviction victim, then calls get on a. The map finds a's node immediately; remove rewires a's neighbors to point at each other, splicing the node out; addFront reattaches it between the head sentinel and the previous first node. The return value comes from the node, not from a re-read of any structure. Unlink and insert have to happen before returning, because recency is part of the contract: a hit widens the gap between the touched node and eviction, while a miss returns -1 and touches nothing, so failed lookups cannot reshape the list.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'rope', icon: '🔗', label: 'Rope: c b a' },
          ],
          frames: [
            { id: 'f1', caption: 'You ask for coat “a” by name. 🎫', shout: { text: 'GET “a”', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'ask', icon: '🎫', label: 'coat a', at: 'you', effect: 'pop' }] },
            { id: 'f2', caption: 'The index finds it instantly — no walking the rope. ⚡', shout: { text: 'INSTANT LOOKUP', tone: 'good' }, mood: 'good', cast: [{ id: 'rope', state: 'working' }], tokens: [{ id: 'grab', icon: '🤏', label: 'found!', from: 'rope', to: 'you' }] },
            { id: 'f3', caption: 'You wore it — so it moves to the FRONT of the rope. 🔗', shout: { text: 'TO THE FRONT!', tone: 'info' }, cast: [{ id: 'rope', state: 'working' }], tokens: [{ id: 'move', icon: '🔗', label: 'a first now', at: 'rope', effect: 'pop' }] },
            { id: 'f4', caption: 'New order: a, c, b. The order changed, nothing was scanned. ✅', shout: { text: 'O(1) REORDER ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'rope', state: 'done' }], tokens: [{ id: 'neworder', icon: '✅', label: 'a c b', at: 'rope', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Put inserts and evicts',
        body: `A put has two cases. If the key already exists, update the value and promote the node exactly like a get - no eviction, because the cache size did not change. If the key is new and the cache is at capacity, there is no room, so the least recently used node must leave first: it is exactly tail.prev, the sentinel's neighbor. The animation starts with capacity 3 and a full list b <-> c <-> a, then writes put(d, 4). The size check fires, the LRU node a is unlinked and its key is deleted from the map, and a fresh node is allocated, linked after the head, and registered in the map. Doing the eviction before the insertion is what keeps the cache from ever exceeding capacity, and using the tail sentinel means the victim costs no traversal - the structure already points at it.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'newcoat', icon: '🧥', label: 'New coat “d”' },
            { id: 'rope', icon: '🔗', label: 'Rope: b c a (full!)' },
            { id: 'old', icon: '🧣', label: 'Least recently used' },
          ],
          frames: [
            { id: 'f1', caption: 'Coat “d” arrives — but the rope is FULL (3 of 3). 🧥', shout: { text: 'ROPE IS FULL!', tone: 'info' }, cast: [{ id: 'newcoat', state: 'working' }], tokens: [{ id: 'arrive', icon: '🧥', label: 'let me in!', at: 'newcoat', effect: 'pop' }] },
            { id: 'f2', caption: 'One coat must leave first: the OLDEST one at the back. 🧣', shout: { text: 'OLDEST LEAVES FIRST', tone: 'info' }, cast: [{ id: 'old', state: 'crashed' }], tokens: [{ id: 'evict', icon: '👋', label: 'coat a', at: 'old', effect: 'pop' }] },
            { id: 'f3', caption: 'The old coat is off the rope and out of the index. 🗑️', shout: { text: 'EVICTED', tone: 'info' }, cast: [{ id: 'rope', state: 'working' }], tokens: [{ id: 'gone', icon: '🗑️', label: 'a removed', at: 'rope', effect: 'pop' }] },
            { id: 'f4', caption: 'New coat “d” goes right to the FRONT. 🔗', shout: { text: 'NEW COAT IN!', tone: 'good' }, mood: 'good', cast: [{ id: 'newcoat', state: 'happy' }], tokens: [{ id: 'front', icon: '🎉', label: 'd b c', at: 'rope', effect: 'pop' }] },
            { id: 'f5', caption: 'Residents: d, b, c — always the latest three. ✅', shout: { text: 'ALWAYS THE LATEST 3', tone: 'good' }, mood: 'good', cast: [{ id: 'rope', state: 'done' }], tokens: [{ id: 'rule', icon: '✅', label: 'the rule', at: 'rope', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Complexity and production notes',
        body: `The final accounting: get is O(1) average because the map lookup is the only hashing step and the two pointer operations are constant; put is O(1) average for the same reason, with eviction costing one unlink and one map delete; space is O(capacity) because each live key owns exactly one node and one map entry. The average qualifier matters: an adversarial key set that collides in the hash function can degrade lookups toward O(n), so production caches randomize hash seeds or accept the risk explicitly. Real systems rarely use exact LRU either. Redis, for example, samples a handful of keys and evicts the oldest among them, trading exactness for cheaper bookkeeping under concurrency. The animation tallies the pointer operations per call and shows the constant bound holding as the cache grows.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'stopwatch', icon: '⏱️', label: 'Speed check' },
            { id: 'rope', icon: '🔗', label: 'The rope' },
          ],
          frames: [
            { id: 'f1', caption: 'Check any coat: find + move = a fixed tiny number of steps. ⏱️', shout: { text: 'ALWAYS FEW STEPS', tone: 'good' }, mood: 'good', cast: [{ id: 'stopwatch', state: 'done' }], tokens: [{ id: 'o1', icon: '1️⃣', label: 'O(1)', at: 'stopwatch', effect: 'pop' }] },
            { id: 'f2', caption: 'Add a coat — same tiny cost, even when the rope is huge. 🧥', shout: { text: 'SIZE DOESN’T MATTER', tone: 'good' }, mood: 'good', cast: [{ id: 'rope', state: 'working' }], tokens: [{ id: 'huge', icon: '🪈', label: 'still O(1)', at: 'rope', effect: 'pop' }] },
            { id: 'f3', caption: 'One warning: bad name-luck (collisions) can slow the INDEX. ⚠️', shout: { text: 'COLLISIONS? WATCH OUT', tone: 'bad' }, mood: 'bad', cast: [{ id: 'stopwatch', state: 'crashed' }], tokens: [{ id: 'warn', icon: '⚠️', label: 'rare slow case', at: 'stopwatch', effect: 'shake' }] },
            { id: 'f4', caption: 'Giant cloakrooms (like Redis) shortcut: they check a few coats, not all. 🎯', shout: { text: 'GOOD ENOUGH LRU', tone: 'info' }, cast: [{ id: 'rope', state: 'done' }], tokens: [{ id: 'sample', icon: '🎯', label: 'sample & evict', at: 'rope', effect: 'pop' }] },
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
          kind: 'story',
          cast: [
            { id: 'track', icon: '🛤️', label: 'The path' },
            { id: 'walker', icon: '🚶', label: 'Walker' },
          ],
          frames: [
            { id: 'f1', caption: 'The path is 3 → 2 → 0 → -4 → 5… and then it LOOPS back to 0! 🛤️', shout: { text: 'IT LOOPS!', tone: 'info' }, cast: [{ id: 'track', state: 'working' }], tokens: [{ id: 'loop', icon: '🔁', label: 'no exit', at: 'track', effect: 'pop' }] },
            { id: 'f2', caption: 'A normal walker follows the path: 3, 2, 0… 🚶', shout: { text: 'WALK, WALK…', tone: 'info' }, cast: [{ id: 'walker', state: 'working' }], tokens: [{ id: 'step', icon: '👣', label: 'step', from: 'track', to: 'walker' }] },
            { id: 'f3', caption: '…-4, 5 — and back to 0. The same stones, forever. 😵', shout: { text: 'SAME STONES FOREVER', tone: 'bad' }, mood: 'bad', cast: [{ id: 'walker', state: 'crashed' }], tokens: [{ id: 'dizzy', icon: '😵', label: 'spinning', at: 'walker', effect: 'pop' }] },
            { id: 'f4', caption: 'We need a memory-free way to notice the loop. 🤔', shout: { text: 'HOW TO DETECT IT?', tone: 'info' }, cast: [{ id: 'walker', state: 'idle', face: '🤔' }], tokens: [{ id: 'think', icon: '🤔', label: 'no stamps allowed', at: 'track', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Slow and fast enter',
        body: `The algorithm is two pointers moving over the same list at different speeds. Slow advances one node per step; fast advances two. If the list ends, fast or fast.next becomes null and the answer is no cycle. If a cycle exists, both pointers are eventually trapped in it, because every next pointer inside the cycle stays inside. The animation follows the crossing point: head 3, then 2, then the entrance at 0. From then on fast keeps lapping the same three nodes. The key quantity is the forward distance from fast to slow inside the cycle. While moving, fast gains one position on slow per step, so that distance shrinks by exactly one each step - and once both pointers are on the cycle, a distance that starts below the cycle length must eventually reach zero. Fast can never jump over slow, because the gain is one node, not two.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'turtle', icon: '🐢', label: 'Slow' },
            { id: 'hare', icon: '🐇', label: 'Fast' },
            { id: 'track', icon: '🛤️', label: 'The looping path' },
          ],
          frames: [
            { id: 'f1', caption: 'Turtle walks 1 step; hare runs 2 steps. Same start! 🐢🐇', shout: { text: 'READY, SET, GO!', tone: 'info' }, cast: [{ id: 'turtle', state: 'working' }, { id: 'hare', state: 'working' }], tokens: [{ id: 'start', icon: '🚩', label: 'step 0', at: 'track', effect: 'pop' }] },
            { id: 'f2', caption: 'The hare is already inside the loop — the turtle follows. 🐇', shout: { text: 'HARE ENTERS THE LOOP', tone: 'info' }, cast: [{ id: 'track', state: 'working' }], tokens: [{ id: 'inside', icon: '🔁', label: 'lap begins', at: 'track', effect: 'pop' }] },
            { id: 'f3', caption: 'Both are on the loop. The hare gains 1 step on the turtle every turn. 📏', shout: { text: 'GAINING 1 EACH STEP', tone: 'info' }, cast: [{ id: 'hare', state: 'working' }], tokens: [{ id: 'gain', icon: '📏', label: 'gap -1', at: 'hare', effect: 'pop' }] },
            { id: 'f4', caption: 'The gap becomes 2… 1… 0 — the hare lands right on the turtle. 💥', shout: { text: 'THEY MEET!', tone: 'good' }, mood: 'good', cast: [{ id: 'turtle', state: 'done' }, { id: 'hare', state: 'done' }], tokens: [{ id: 'meet', icon: '🤝', label: 'caught you!', at: 'track', effect: 'pop' }] },
            { id: 'f5', caption: 'On a loop, catching is unavoidable — so a meeting proves the loop. ✅', shout: { text: 'MEETING = PROOF ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'turtle', state: 'happy' }], tokens: [{ id: 'proof', icon: '✅', label: 'cycle found', at: 'track', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Meeting proves a cycle',
        body: `Trace the race from the top with the full sequence. Both pointers leave the head 3 together. After one step slow is at 2 and fast is at 0, already inside the loop. After two steps slow is at 0 and fast is at 5 - both are on the cycle, with a forward gap of one node. After three steps both land on -4, and that shared node is the meeting. The animation highlights the wrap: fast has no null to stop at, because node 5 points back to node 0. If fast reached null instead, the list would be acyclic and no meeting could occur, which is why the loop must also test fast.next for even-length lists. The meeting proves a cycle exists, but the meeting node depends on the head-to-entrance distance and usually is not the entrance itself.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'turtle', icon: '🐢', label: 'Slow' },
            { id: 'hare', icon: '🐇', label: 'Fast' },
            { id: 'track', icon: '🛤️', label: 'The looping path' },
          ],
          frames: [
            { id: 'f1', caption: 'The race starts at stone 3, both together. 🚩', shout: { text: 'GO!', tone: 'info' }, cast: [{ id: 'turtle', state: 'working' }, { id: 'hare', state: 'working' }], tokens: [{ id: 'gate', icon: '🚩', label: 'stone 3', at: 'track', effect: 'pop' }] },
            { id: 'f2', caption: 'Turtle on 2; hare storms to 0 and enters the loop early. 🐇', shout: { text: 'HARE AHEAD', tone: 'info' }, cast: [{ id: 'hare', state: 'working' }], tokens: [{ id: 'fast', icon: '💨', label: 'zoom!', at: 'hare', effect: 'pop' }] },
            { id: 'f3', caption: 'Turtle enters at 0; the hare is one speed-lap behind it. 🔁', shout: { text: 'TURTLE JOINS THE LOOP', tone: 'info' }, cast: [{ id: 'turtle', state: 'working' }], tokens: [{ id: 'enter', icon: '🔁', label: 'lap time', at: 'track', effect: 'pop' }] },
            { id: 'f4', caption: 'MET at stone -4! Two racers share a stone only if the path loops. 💥', shout: { text: 'PROOF: IT LOOPS!', tone: 'good' }, mood: 'good', cast: [{ id: 'turtle', state: 'done' }, { id: 'hare', state: 'done' }], tokens: [{ id: 'meet', icon: '🤝', label: 'stone -4', at: 'track', effect: 'pop' }] },
            { id: 'f5', caption: 'On a straight path the hare would just run off the end instead. 🏁', shout: { text: 'STRAIGHT = NO MEETING', tone: 'info' }, cast: [{ id: 'hare', state: 'idle', face: '😌' }], tokens: [{ id: 'straight', icon: '➡️', label: 'safe exit', at: 'hare', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Reset to find the entrance',
        body: `A meeting proves a cycle exists but usually not where it begins - the meeting point depends on the head-to-entrance distance and the cycle length. The entrance is found with one elegant move: leave fast at the meeting point, reset slow to the head, and then advance both pointers one node at a time. They meet again, and this time the meeting node is the cycle entrance. The distance argument is short: when they first meet at index a + b, slow has walked a + b steps, fast has walked a + b + kL for some whole number k, and fast walked twice as far, so a + b = kL. That makes the distance from the head to the entrance equal to the distance from the meeting point to the entrance, modulo the cycle length - two equal-speed pointers leaving those positions must arrive together. The animation shows exactly that: reset to 3, advance to 2, advance to 0, entrance found.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'turtle', icon: '🐢', label: 'Slow (reset)' },
            { id: 'hare', icon: '🐇', label: 'Fast (stays)' },
            { id: 'track', icon: '🛤️', label: 'The path' },
          ],
          frames: [
            { id: 'f1', caption: 'Meeting at -4 found the loop — but not its ENTRANCE yet. 🤔', shout: { text: 'WHERE DOES IT START?', tone: 'info' }, cast: [{ id: 'track', state: 'working' }], tokens: [{ id: 'question', icon: '🤔', label: 'entrance?', at: 'track', effect: 'pop' }] },
            { id: 'f2', caption: 'Turtle goes back to the start (stone 3). Hare stays put. 🐢', shout: { text: 'TURTLE RESETS', tone: 'info' }, cast: [{ id: 'turtle', state: 'working' }, { id: 'hare', state: 'idle' }], tokens: [{ id: 'reset', icon: '↩️', label: 'back to 3', at: 'turtle', effect: 'pop' }] },
            { id: 'f3', caption: 'Now BOTH walk one step at a time, same speed. 🚶🚶', shout: { text: 'EQUAL SPEED NOW', tone: 'info' }, cast: [{ id: 'hare', state: 'working' }], tokens: [{ id: 'same', icon: '🤝', label: 'step by step', at: 'track', effect: 'pop' }] },
            { id: 'f4', caption: 'They meet again — this time exactly at the loop’s entrance: stone 0! 🚪', shout: { text: 'ENTRANCE FOUND!', tone: 'good' }, mood: 'good', cast: [{ id: 'turtle', state: 'done' }, { id: 'hare', state: 'done' }], tokens: [{ id: 'door', icon: '🚪', label: 'stone 0', at: 'track', effect: 'pop' }] },
            { id: 'f5', caption: 'Why? The distances balance out — like magic, but it is math. ✨', shout: { text: 'EQUAL DISTANCES ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'turtle', state: 'happy' }], tokens: [{ id: 'magic', icon: '✨', label: 'the math works', at: 'track', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'O(1) space beats a set',
        body: `The alternative detector is a visited set: walk the list, insert each node, and stop when a node repeats. It is simpler to reason about and reports the first repeated node immediately, but it allocates one entry per node, so it uses O(n) memory and cannot run where allocation is expensive or forbidden. Floyd uses two references and no allocation at all. Its cost is still O(n) time: the pointers traverse the list at most a few times before meeting, and the reset phase adds at most one more pass, so the constants are small even though the asymptotics match the set approach. The animation contrasts the two: the set version accumulates five entries for this list, while the pointer version carries only slow and fast. When memory is cheap the set is easier to defend; when it is not, the two pointers are the answer.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'stamper', icon: '🚶', label: 'Stamp collector' },
            { id: 'turtle', icon: '🐢', label: 'Slow' },
            { id: 'hare', icon: '🐇', label: 'Fast' },
          ],
          frames: [
            { id: 'f1', caption: 'One plan: stamp every stone you pass. 📮', shout: { text: 'STAMP EVERYTHING', tone: 'info' }, cast: [{ id: 'stamper', state: 'working' }], tokens: [{ id: 'stamp', icon: '📮', label: 'visited!', at: 'stamper', effect: 'pop' }] },
            { id: 'f2', caption: 'But the stamps pile up — one per stone, forever. 🗂️', shout: { text: 'STAMPS GROW…', tone: 'bad' }, mood: 'bad', cast: [{ id: 'stamper', state: 'crashed' }], tokens: [{ id: 'pile', icon: '🗂️', label: 'O(n) memory', at: 'stamper', effect: 'pop' }] },
            { id: 'f3', caption: 'The racing pair carries NOTHING — just two racers. 🐢🐇', shout: { text: 'NO BAGS AT ALL', tone: 'good' }, mood: 'good', cast: [{ id: 'turtle', state: 'done' }, { id: 'hare', state: 'done' }], tokens: [{ id: 'light', icon: '🪶', label: 'weightless', at: 'hare', effect: 'pop' }] },
            { id: 'f4', caption: 'Same speed of discovery, zero extra luggage. The racers win. 🏆', shout: { text: 'O(1) SPACE WINS ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'turtle', state: 'happy' }], tokens: [{ id: 'trophy', icon: '🏆', label: 'two pointers', at: 'turtle', effect: 'pop' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Cycle at the head: the reset phase still converges at the head, but code that assumes the entrance differs from the meeting point breaks - trace [1, 2] with 2 pointing back to 1 to verify.',
      'A single node pointing to itself: fast must check fast and fast.next before the double step, or the second hop dereferences null.',
      'Even-length acyclic lists: fast.next is null while fast is not, so the loop must test both conditions rather than only fast.',
      'Stopping at the first meeting: the meeting node is the entrance when the head-to-entrance distance is congruent to 0 modulo the cycle length (a ≡ 0 (mod L)), not only when a = 0 — always run the reset phase before claiming the entrance.',
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
