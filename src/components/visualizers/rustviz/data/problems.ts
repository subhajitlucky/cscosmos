export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface RustProblem {
  id: string;
  number: number;
  title: string;
  slug: string;
  difficulty: ProblemDifficulty;
  category: string;
  timeEstimate: string;
  acceptanceRate: string;
  summary: string;
  starterCode: string;
  isComingSoon: boolean;
}

export const RUST_PROBLEM_CATEGORIES = [
  'All',
  'Basics & Primitives',
  'Control Flow & Pattern Matching',
  'Ownership & Memory',
  'Slices & Strings',
  'Structs & Enums',
  'Lifetimes & References',
  'Iterators & Closures',
  'Smart Pointers',
  'Concurrency & Async',
  'Systems & Unsafe',
] as const;

export const rustProblems: RustProblem[] = [
  // 1-10: Basics & Primitives
  {
    id: 'prob-001',
    number: 1,
    title: 'Two Sum with HashMap',
    slug: 'two-sum-hashmap',
    difficulty: 'Easy',
    category: 'Basics & Primitives',
    timeEstimate: '15 min',
    acceptanceRate: '92%',
    summary: 'Find two numbers in an array that add up to a target using std::collections::HashMap.',
    starterCode: `use std::collections::HashMap;

pub fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    let mut map = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&prev_idx) = map.get(&complement) {
            return Some((prev_idx, i));
        }
        map.insert(num, i);
    }
    None
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-002',
    number: 2,
    title: 'Reverse an Integer without Overflow',
    slug: 'reverse-integer-checked-math',
    difficulty: 'Easy',
    category: 'Basics & Primitives',
    timeEstimate: '15 min',
    acceptanceRate: '85%',
    summary: 'Reverse digits of a 32-bit signed integer using checked arithmetic.',
    starterCode: `pub fn reverse(mut x: i32) -> Option<i32> {
    let mut rev: i32 = 0;
    while x != 0 {
        let pop = x % 10;
        x /= 10;
        rev = rev.checked_mul(10)?.checked_add(pop)?;
    }
    Some(rev)
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-003',
    number: 3,
    title: 'Fibonacci with Constant Stack Memory',
    slug: 'fibonacci-constant-memory',
    difficulty: 'Easy',
    category: 'Basics & Primitives',
    timeEstimate: '10 min',
    acceptanceRate: '95%',
    summary: 'Compute the nth Fibonacci number in O(1) space avoiding heap allocations.',
    starterCode: `pub fn fib(n: u32) -> u64 {
    if n == 0 { return 0; }
    let mut a: u64 = 0;
    let mut b: u64 = 1;
    for _ in 1..n {
        let next = a + b;
        a = b;
        b = next;
    }
    b
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-004',
    number: 4,
    title: 'Bitwise Hamming Weight (Count Set Bits)',
    slug: 'bitwise-hamming-weight',
    difficulty: 'Easy',
    category: 'Basics & Primitives',
    timeEstimate: '10 min',
    acceptanceRate: '96%',
    summary: 'Count number of set bits (1s) in a u32 using Brian Kernighan bit manipulation.',
    starterCode: `pub fn hamming_weight(mut n: u32) -> u32 {
    let mut count = 0;
    while n != 0 {
        n &= n - 1;
        count += 1;
    }
    count
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-005',
    number: 5,
    title: 'Valid Palindrome with ASCII Slices',
    slug: 'valid-palindrome-ascii',
    difficulty: 'Easy',
    category: 'Basics & Primitives',
    timeEstimate: '15 min',
    acceptanceRate: '89%',
    summary: 'Determine if an alphanumeric string is a palindrome ignoring non-alphanumeric chars.',
    starterCode: `pub fn is_palindrome(s: &str) -> bool {
    let chars: Vec<char> = s.chars()
        .filter(|c| c.is_alphanumeric())
        .map(|c| c.to_ascii_lowercase())
        .collect();
    if chars.is_empty() { return true; }
    let mut left = 0;
    let mut right = chars.len() - 1;
    while left < right {
        if chars[left] != chars[right] { return false; }
        left += 1;
        right -= 1;
    }
    true
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-006',
    number: 6,
    title: 'Find the Single Non-Duplicate Number',
    slug: 'single-non-duplicate-number',
    difficulty: 'Easy',
    category: 'Basics & Primitives',
    timeEstimate: '10 min',
    acceptanceRate: '94%',
    summary: 'Find the element occurring once in an array where all others appear twice using XOR.',
    starterCode: `pub fn single_number(nums: &[i32]) -> i32 {
    nums.iter().fold(0, |acc, &x| acc ^ x)
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-007',
    number: 7,
    title: 'FizzBuzz with Zero Allocation Match',
    slug: 'fizzbuzz-zero-allocation',
    difficulty: 'Easy',
    category: 'Basics & Primitives',
    timeEstimate: '10 min',
    acceptanceRate: '98%',
    summary: 'Print FizzBuzz sequence using tuple matching on modulo 3 and 5.',
    starterCode: `pub fn fizzbuzz(n: u32) -> Vec<String> {
    (1..=n).map(|i| match (i % 3 == 0, i % 5 == 0) {
        (true, true) => "FizzBuzz".to_string(),
        (true, false) => "Fizz".to_string(),
        (false, true) => "Buzz".to_string(),
        (false, false) => i.to_string(),
    }).collect()
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-008',
    number: 8,
    title: 'Convert Celsius to Fahrenheit using Floating Types',
    slug: 'temperature-conversion',
    difficulty: 'Easy',
    category: 'Basics & Primitives',
    timeEstimate: '5 min',
    acceptanceRate: '99%',
    summary: 'Convert temperatures preserving f64 IEEE-754 precision.',
    starterCode: `pub fn celsius_to_fahrenheit(c: f64) -> f64 {
    c * 1.8 + 32.0
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-009',
    number: 9,
    title: 'Check Power of Two with Bitwise AND',
    slug: 'check-power-of-two',
    difficulty: 'Easy',
    category: 'Basics & Primitives',
    timeEstimate: '5 min',
    acceptanceRate: '93%',
    summary: 'Verify if an integer n is a power of 2 using n & (n - 1) == 0.',
    starterCode: `pub fn is_power_of_two(n: i32) -> bool {
    n > 0 && (n & (n - 1)) == 0
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-010',
    number: 10,
    title: 'Swap Variables Without Temporary Storage',
    slug: 'swap-variables-tuple',
    difficulty: 'Easy',
    category: 'Basics & Primitives',
    timeEstimate: '5 min',
    acceptanceRate: '97%',
    summary: 'Swap two mutable variables using idiomatic Rust tuple deconstruction.',
    starterCode: `pub fn swap_pair<T>(a: &mut T, b: &mut T) {
    std::mem::swap(a, b);
}`,
    isComingSoon: true,
  },

  // 11-20: Control Flow & Pattern Matching
  {
    id: 'prob-011',
    number: 11,
    title: 'Parse IP Address Octets with Result Matching',
    slug: 'parse-ip-octets-result',
    difficulty: 'Easy',
    category: 'Control Flow & Pattern Matching',
    timeEstimate: '20 min',
    acceptanceRate: '87%',
    summary: 'Validate IPv4 address string into a 4-byte array [u8; 4].',
    starterCode: `pub fn parse_ipv4(ip: &str) -> Option<[u8; 4]> {
    let parts: Vec<&str> = ip.split('.').collect();
    if parts.len() != 4 { return None; }
    let mut octets = [0u8; 4];
    for (i, part) in parts.iter().enumerate() {
        octets[i] = part.parse::<u8>().ok()?;
    }
    Some(octets)
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-012',
    number: 12,
    title: 'Roman to Integer with Pattern Guard Matching',
    slug: 'roman-to-integer-match',
    difficulty: 'Easy',
    category: 'Control Flow & Pattern Matching',
    timeEstimate: '15 min',
    acceptanceRate: '84%',
    summary: 'Convert Roman numeral string to integer using peekable iterator matching.',
    starterCode: `pub fn roman_to_int(s: &str) -> i32 {
    let mut total = 0;
    let mut prev = 0;
    for c in s.chars().rev() {
        let val = match c {
            'I' => 1, 'V' => 5, 'X' => 10, 'L' => 50,
            'C' => 100, 'D' => 500, 'M' => 1000,
            _ => 0,
        };
        if val < prev { total -= val; } else { total += val; }
        prev = val;
    }
    total
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-013',
    number: 13,
    title: 'Valid Parentheses using Stack Vec<char>',
    slug: 'valid-parentheses-stack',
    difficulty: 'Easy',
    category: 'Control Flow & Pattern Matching',
    timeEstimate: '15 min',
    acceptanceRate: '88%',
    summary: 'Verify bracket matching for (), {}, and [] using a LIFO stack.',
    starterCode: `pub fn is_valid(s: &str) -> bool {
    let mut stack = Vec::new();
    for c in s.chars() {
        match c {
            '(' => stack.push(')'),
            '{' => stack.push('}'),
            '[' => stack.push(']'),
            ')' | '}' | ']' => if stack.pop() != Some(c) { return false; },
            _ => {}
        }
    }
    stack.is_empty()
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-014',
    number: 14,
    title: 'Merge Two Sorted Slices into One Vec',
    slug: 'merge-sorted-slices',
    difficulty: 'Easy',
    category: 'Control Flow & Pattern Matching',
    timeEstimate: '15 min',
    acceptanceRate: '86%',
    summary: 'Merge two sorted ascending slices into a new sorted Vec in O(N + M) time.',
    starterCode: `pub fn merge_sorted(a: &[i32], b: &[i32]) -> Vec<i32> {
    let mut result = Vec::with_capacity(a.len() + b.len());
    let (mut i, mut j) = (0, 0);
    while i < a.len() && j < b.len() {
        if a[i] <= b[j] {
            result.push(a[i]);
            i += 1;
        } else {
            result.push(b[j]);
            j += 1;
        }
    }
    result.extend_from_slice(&a[i..]);
    result.extend_from_slice(&b[j..]);
    result
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-015',
    number: 15,
    title: 'Evaluate Reverse Polish Notation (RPN)',
    slug: 'eval-rpn-match',
    difficulty: 'Medium',
    category: 'Control Flow & Pattern Matching',
    timeEstimate: '20 min',
    acceptanceRate: '79%',
    summary: 'Evaluate arithmetic expression in postfix notation using pattern matching.',
    starterCode: `pub fn eval_rpn(tokens: &[&str]) -> i32 {
    let mut stack = Vec::new();
    for &t in tokens {
        match t {
            "+" | "-" | "*" | "/" => {
                let b = stack.pop().unwrap();
                let a = stack.pop().unwrap();
                let res = match t {
                    "+" => a + b,
                    "-" => a - b,
                    "*" => a * b,
                    "/" => a / b,
                    _ => unreachable!(),
                };
                stack.push(res);
            }
            num => stack.push(num.parse::<i32>().unwrap()),
        }
    }
    stack.pop().unwrap()
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-016',
    number: 16,
    title: 'State Machine Parser using Enum and Loops',
    slug: 'state-machine-parser-enum',
    difficulty: 'Medium',
    category: 'Control Flow & Pattern Matching',
    timeEstimate: '25 min',
    acceptanceRate: '75%',
    summary: 'Implement a lexical scanner for string tokens using a transition enum.',
    starterCode: `pub enum State { Start, InWord, InWhitespace }

pub fn count_words(input: &str) -> usize {
    let mut state = State::Start;
    let mut words = 0;
    for c in input.chars() {
        match state {
            State::Start | State::InWhitespace => {
                if !c.is_whitespace() {
                    state = State::InWord;
                    words += 1;
                }
            }
            State::InWord => {
                if c.is_whitespace() {
                    state = State::InWhitespace;
                }
            }
        }
    }
    words
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-017',
    number: 17,
    title: 'Binary Search with Exact Bound Handling',
    slug: 'binary-search-exact-bounds',
    difficulty: 'Easy',
    category: 'Control Flow & Pattern Matching',
    timeEstimate: '10 min',
    acceptanceRate: '91%',
    summary: 'Search sorted slice without integer overflow in midpoint calculation.',
    starterCode: `pub fn binary_search(nums: &[i32], target: i32) -> Option<usize> {
    let mut low = 0;
    let mut high = nums.len();
    while low < high {
        let mid = low + (high - low) / 2;
        match nums[mid].cmp(&target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => low = mid + 1,
            std::cmp::Ordering::Greater => high = mid,
        }
    }
    None
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-018',
    number: 18,
    title: 'Longest Common Prefix via Horizontal Scanning',
    slug: 'longest-common-prefix',
    difficulty: 'Easy',
    category: 'Control Flow & Pattern Matching',
    timeEstimate: '15 min',
    acceptanceRate: '82%',
    summary: 'Find the longest common prefix across an array of string slices.',
    starterCode: `pub fn longest_common_prefix<'a>(strs: &[&'a str]) -> &'a str {
    if strs.is_empty() { return ""; }
    let first = strs[0];
    for (i, byte) in first.bytes().enumerate() {
        for s in &strs[1..] {
            if i >= s.len() || s.as_bytes()[i] != byte {
                return &first[..i];
            }
        }
    }
    first
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-019',
    number: 19,
    title: 'Climbing Stairs via Tabulation Match',
    slug: 'climbing-stairs-dp',
    difficulty: 'Easy',
    category: 'Control Flow & Pattern Matching',
    timeEstimate: '10 min',
    acceptanceRate: '90%',
    summary: 'Calculate ways to climb n steps taking 1 or 2 steps at a time.',
    starterCode: `pub fn climb_stairs(n: u32) -> u32 {
    let (mut prev2, mut prev1) = (1, 1);
    for _ in 2..=n {
        let curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    prev1
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-020',
    number: 20,
    title: 'Generate Pascal Triangle with Capacity Hints',
    slug: 'pascals-triangle-vec',
    difficulty: 'Easy',
    category: 'Control Flow & Pattern Matching',
    timeEstimate: '15 min',
    acceptanceRate: '88%',
    summary: 'Generate the first num_rows of Pascal triangle allocating exact capacities.',
    starterCode: `pub fn generate_pascals_triangle(num_rows: usize) -> Vec<Vec<u32>> {
    let mut triangle = Vec::with_capacity(num_rows);
    for i in 0..num_rows {
        let mut row = vec![1; i + 1];
        for j in 1..i {
            row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
        }
        triangle.push(row);
    }
    triangle
}`,
    isComingSoon: true,
  },

  // 21-30: Ownership & Memory
  {
    id: 'prob-021',
    number: 21,
    title: 'In-Place Slice Inversion (Zero Allocation)',
    slug: 'reverse-slice-in-place',
    difficulty: 'Easy',
    category: 'Ownership & Memory',
    timeEstimate: '10 min',
    acceptanceRate: '95%',
    summary: 'Reverse an array in-place without heap allocations using mutable pointers.',
    starterCode: `pub fn reverse_in_place<T>(slice: &mut [T]) {
    let mut i = 0;
    let mut j = slice.len().saturating_sub(1);
    while i < j {
        slice.swap(i, j);
        i += 1;
        j -= 1;
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-022',
    number: 22,
    title: 'Vector Dedup Preserving First Occurrences',
    slug: 'dedup-sorted-vec-in-place',
    difficulty: 'Easy',
    category: 'Ownership & Memory',
    timeEstimate: '15 min',
    acceptanceRate: '87%',
    summary: 'Remove duplicate elements from a sorted mutable slice in O(1) extra memory.',
    starterCode: `pub fn remove_duplicates(nums: &mut Vec<i32>) -> usize {
    if nums.is_empty() { return 0; }
    let mut write = 1;
    for read in 1..nums.len() {
        if nums[read] != nums[write - 1] {
            nums[write] = nums[read];
            write += 1;
        }
    }
    nums.truncate(write);
    write
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-023',
    number: 23,
    title: 'Implement Custom Arena Buffer Transfer',
    slug: 'arena-buffer-transfer',
    difficulty: 'Medium',
    category: 'Ownership & Memory',
    timeEstimate: '25 min',
    acceptanceRate: '72%',
    summary: 'Simulate buffer ownership passing between worker threads with std::mem::take.',
    starterCode: `pub struct BufferPool {
    pool: Vec<Vec<u8>>,
}

impl BufferPool {
    pub fn new() -> Self { Self { pool: Vec::new() } }
    pub fn acquire(&mut self, capacity: usize) -> Vec<u8> {
        self.pool.pop().unwrap_or_else(|| Vec::with_capacity(capacity))
    }
    pub fn release(&mut self, mut buf: Vec<u8>) {
        buf.clear();
        self.pool.push(buf);
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-024',
    number: 24,
    title: 'Safe Split at Midpoint without Unsafe',
    slug: 'split-at-mut-safe',
    difficulty: 'Medium',
    category: 'Ownership & Memory',
    timeEstimate: '20 min',
    acceptanceRate: '78%',
    summary: 'Divide a mutable slice into two non-overlapping mutable slices safe from aliasing.',
    starterCode: `pub fn split_half<T>(slice: &mut [T]) -> (&mut [T], &mut [T]) {
    let mid = slice.len() / 2;
    slice.split_at_mut(mid)
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-025',
    number: 25,
    title: 'Move Semantics with Struct Transfer Drop',
    slug: 'custom-raii-guard',
    difficulty: 'Medium',
    category: 'Ownership & Memory',
    timeEstimate: '20 min',
    acceptanceRate: '80%',
    summary: 'Implement custom RAII guard that executes cleanup logic upon dropping.',
    starterCode: `pub struct ScopeGuard<F: FnOnce()> {
    cleanup: Option<F>,
}

impl<F: FnOnce()> ScopeGuard<F> {
    pub fn new(f: F) -> Self { Self { cleanup: Some(f) } }
    pub fn defuse(&mut self) { self.cleanup = None; }
}

impl<F: FnOnce()> Drop for ScopeGuard<F> {
    fn drop(&mut self) {
        if let Some(f) = self.cleanup.take() {
            f();
        }
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-026',
    number: 26,
    title: 'Zero-Copy Ring Buffer with VecDeque',
    slug: 'zero-copy-ring-buffer',
    difficulty: 'Medium',
    category: 'Ownership & Memory',
    timeEstimate: '25 min',
    acceptanceRate: '74%',
    summary: 'Implement a circular ring buffer that reuses allocated memory slots without resizing.',
    starterCode: `use std::collections::VecDeque;

pub struct RingBuffer<T> {
    capacity: usize,
    buf: VecDeque<T>,
}

impl<T> RingBuffer<T> {
    pub fn new(capacity: usize) -> Self {
        Self { capacity, buf: VecDeque::with_capacity(capacity) }
    }
    pub fn push(&mut self, item: T) {
        if self.buf.len() == self.capacity {
            self.buf.pop_front();
        }
        self.buf.push_back(item);
    }
    pub fn pop(&mut self) -> Option<T> {
        self.buf.pop_front()
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-027',
    number: 27,
    title: 'Move-Only Resource Pipeline',
    slug: 'move-only-resource-pipeline',
    difficulty: 'Medium',
    category: 'Ownership & Memory',
    timeEstimate: '20 min',
    acceptanceRate: '83%',
    summary: 'Enforce compile-time linear type state progression (Draft -> Sealed -> Published).',
    starterCode: `pub struct DraftDoc { content: String }
pub struct SealedDoc { content: String, hash: u64 }
pub struct PublishedDoc { content: String, url: String }

impl DraftDoc {
    pub fn seal(self, hash: u64) -> SealedDoc {
        SealedDoc { content: self.content, hash }
    }
}

impl SealedDoc {
    pub fn publish(self, url: String) -> PublishedDoc {
        PublishedDoc { content: self.content, url }
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-028',
    number: 28,
    title: 'Deep Copy vs Shallow Stack Descriptor',
    slug: 'deep-copy-vs-stack-descriptor',
    difficulty: 'Easy',
    category: 'Ownership & Memory',
    timeEstimate: '15 min',
    acceptanceRate: '91%',
    summary: 'Demonstrate difference between Clone (heap allocation) and Copy (stack bitwise copy).',
    starterCode: `#[derive(Clone, Debug, PartialEq)]
pub struct HeapPayload {
    pub data: Vec<u8>,
}

#[derive(Copy, Clone, Debug, PartialEq)]
pub struct StackPayload {
    pub id: u64,
    pub timestamp: u64,
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-029',
    number: 29,
    title: 'Reclaiming Memory with shrink_to_fit',
    slug: 'reclaiming-capacity-shrink-to-fit',
    difficulty: 'Easy',
    category: 'Ownership & Memory',
    timeEstimate: '10 min',
    acceptanceRate: '94%',
    summary: 'Optimize vector heap memory footprints after large batch de-allocations.',
    starterCode: `pub fn compact_storage<T>(mut list: Vec<T>, retain_count: usize) -> Vec<T> {
    list.truncate(retain_count);
    list.shrink_to_fit();
    list
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-030',
    number: 30,
    title: 'Manually Dropping Resources Early',
    slug: 'manual-drop-early-release',
    difficulty: 'Easy',
    category: 'Ownership & Memory',
    timeEstimate: '10 min',
    acceptanceRate: '96%',
    summary: 'Explicitly drop a lock guard early to prevent deadlocks in nested critical sections.',
    starterCode: `use std::sync::Mutex;

pub fn update_and_notify(data: &Mutex<i32>) -> i32 {
    let mut guard = data.lock().unwrap();
    *guard += 1;
    let val = *guard;
    drop(guard); // Explicitly release lock before expensive notification
    val
}`,
    isComingSoon: true,
  },

  // 31-40: Slices & Strings
  {
    id: 'prob-031',
    number: 31,
    title: 'Find First Non-Repeating Character in &str',
    slug: 'first-unique-char-str',
    difficulty: 'Easy',
    category: 'Slices & Strings',
    timeEstimate: '15 min',
    acceptanceRate: '90%',
    summary: 'Scan ASCII string and return first unique character index using array frequency table.',
    starterCode: `pub fn first_uniq_char(s: &str) -> Option<usize> {
    let mut counts = [0u16; 26];
    for b in s.bytes() {
        if b.is_ascii_lowercase() {
            counts[(b - b'a') as usize] += 1;
        }
    }
    for (i, b) in s.bytes().enumerate() {
        if b.is_ascii_lowercase() && counts[(b - b'a') as usize] == 1 {
            return Some(i);
        }
    }
    None
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-032',
    number: 32,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating',
    difficulty: 'Medium',
    category: 'Slices & Strings',
    timeEstimate: '25 min',
    acceptanceRate: '71%',
    summary: 'Find the length of the longest substring without duplicate characters using sliding window.',
    starterCode: `use std::collections::HashMap;

pub fn length_of_longest_substring(s: &str) -> usize {
    let mut map = HashMap::new();
    let (mut max_len, mut start) = (0, 0);
    for (i, c) in s.chars().enumerate() {
        if let Some(&prev) = map.get(&c) {
            if prev >= start {
                start = prev + 1;
            }
        }
        map.insert(c, i);
        max_len = max_len.max(i - start + 1);
    }
    max_len
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-033',
    number: 33,
    title: 'Group Anagrams with Zero Allocation Keying',
    slug: 'group-anagrams-hash',
    difficulty: 'Medium',
    category: 'Slices & Strings',
    timeEstimate: '25 min',
    acceptanceRate: '76%',
    summary: 'Group list of strings into anagram clusters using byte frequency arrays as keys.',
    starterCode: `use std::collections::HashMap;

pub fn group_anagrams(strs: Vec<String>) -> Vec<Vec<String>> {
    let mut map: HashMap<[u8; 26], Vec<String>> = HashMap::new();
    for s in strs {
        let mut key = [0u8; 26];
        for b in s.bytes() {
            key[(b - b'a') as usize] += 1;
        }
        map.entry(key).or_default().push(s);
    }
    map.into_values().collect()
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-034',
    number: 34,
    title: 'Safe UTF-8 Character Boundary Slicing',
    slug: 'safe-utf8-character-slicing',
    difficulty: 'Medium',
    category: 'Slices & Strings',
    timeEstimate: '20 min',
    acceptanceRate: '81%',
    summary: 'Truncate a string slice without panicking on multi-byte UTF-8 boundaries.',
    starterCode: `pub fn safe_truncate(s: &str, max_bytes: usize) -> &str {
    if max_bytes >= s.len() { return s; }
    let mut end = max_bytes;
    while end > 0 && !s.is_char_boundary(end) {
        end -= 1;
    }
    &s[..end]
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-035',
    number: 35,
    title: 'String Compression in In-Place Slice',
    slug: 'string-compression-in-place',
    difficulty: 'Medium',
    category: 'Slices & Strings',
    timeEstimate: '20 min',
    acceptanceRate: '75%',
    summary: 'Compress characters array in place with run-length encoding (e.g. [a,a,b] -> [a,2,b]).',
    starterCode: `pub fn compress(chars: &mut Vec<char>) -> usize {
    let mut write = 0;
    let mut i = 0;
    while i < chars.len() {
        let c = chars[i];
        let mut count = 0;
        while i < chars.len() && chars[i] == c {
            i += 1;
            count += 1;
        }
        chars[write] = c;
        write += 1;
        if count > 1 {
            for digit in count.to_string().chars() {
                chars[write] = digit;
                write += 1;
            }
        }
    }
    chars.truncate(write);
    write
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-036',
    number: 36,
    title: 'Subarray Sum Equals K with Prefix Map',
    slug: 'subarray-sum-equals-k',
    difficulty: 'Medium',
    category: 'Slices & Strings',
    timeEstimate: '20 min',
    acceptanceRate: '72%',
    summary: 'Find total number of contiguous subarrays whose sum equals target k.',
    starterCode: `use std::collections::HashMap;

pub fn subarray_sum(nums: &[i32], k: i32) -> i32 {
    let mut map = HashMap::new();
    map.insert(0, 1);
    let mut sum = 0;
    let mut count = 0;
    for &num in nums {
        sum += num;
        if let Some(&freq) = map.get(&(sum - k)) {
            count += freq;
        }
        *map.entry(sum).or_insert(0) += 1;
    }
    count
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-037',
    number: 37,
    title: 'Sliding Window Maximum with VecDeque',
    slug: 'sliding-window-maximum',
    difficulty: 'Hard',
    category: 'Slices & Strings',
    timeEstimate: '35 min',
    acceptanceRate: '58%',
    summary: 'Return maximum values in each sliding window of size k using monotonic queue.',
    starterCode: `use std::collections::VecDeque;

pub fn max_sliding_window(nums: &[i32], k: usize) -> Vec<i32> {
    let mut dq = VecDeque::new();
    let mut res = Vec::with_capacity(nums.len().saturating_sub(k) + 1);
    for (i, &x) in nums.iter().enumerate() {
        if let Some(&front) = dq.front() {
            if front + k <= i { dq.pop_front(); }
        }
        while let Some(&back) = dq.back() {
            if nums[back] <= x { dq.pop_back(); } else { break; }
        }
        dq.push_back(i);
        if i + 1 >= k {
            res.push(nums[*dq.front().unwrap()]);
        }
    }
    res
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-038',
    number: 38,
    title: 'Minimum Window Substring',
    slug: 'minimum-window-substring',
    difficulty: 'Hard',
    category: 'Slices & Strings',
    timeEstimate: '40 min',
    acceptanceRate: '52%',
    summary: 'Find the minimum window in s which will contain all characters in t.',
    starterCode: `pub fn min_window<'a>(s: &'a str, t: &str) -> &'a str {
    // Sliding window implementation
    if s.is_empty() || t.is_empty() { return ""; }
    ""
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-039',
    number: 39,
    title: 'Check If String Is Valid JSON Tokens',
    slug: 'check-json-token-stream',
    difficulty: 'Medium',
    category: 'Slices & Strings',
    timeEstimate: '30 min',
    acceptanceRate: '68%',
    summary: 'Build a zero-allocation tokenizer over a string slice detecting JSON literals.',
    starterCode: `pub fn validate_simple_json_tokens(input: &str) -> bool {
    let mut chars = input.chars().peekable();
    while let Some(&c) = chars.peek() {
        if c.is_whitespace() { chars.next(); }
        else { break; }
    }
    true
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-040',
    number: 40,
    title: 'Zero-Copy Word Splitter Iterator',
    slug: 'zero-copy-word-splitter',
    difficulty: 'Medium',
    category: 'Slices & Strings',
    timeEstimate: '20 min',
    acceptanceRate: '82%',
    summary: 'Implement custom Iterator yielding &str slices of whitespace-separated tokens.',
    starterCode: `pub struct WordSplitter<'a> {
    remainder: &'a str,
}

impl<'a> Iterator for WordSplitter<'a> {
    type Item = &'a str;
    fn next(&mut self) -> Option<Self::Item> {
        self.remainder = self.remainder.trim_start();
        if self.remainder.is_empty() { return None; }
        let end = self.remainder.find(char::is_whitespace).unwrap_or(self.remainder.len());
        let word = &self.remainder[..end];
        self.remainder = &self.remainder[end..];
        Some(word)
    }
}`,
    isComingSoon: true,
  },

  // 41-50: Structs & Enums
  {
    id: 'prob-041',
    number: 41,
    title: 'Implement Custom Option Map & AndThen',
    slug: 'custom-option-monadic-methods',
    difficulty: 'Medium',
    category: 'Structs & Enums',
    timeEstimate: '20 min',
    acceptanceRate: '85%',
    summary: 'Build custom MyOption enum implementing map, and_then, and unwrap_or.',
    starterCode: `pub enum MyOption<T> {
    Some(T),
    None,
}

impl<T> MyOption<T> {
    pub fn map<U, F: FnOnce(T) -> U>(self, f: F) -> MyOption<U> {
        match self {
            MyOption::Some(x) => MyOption::Some(f(x)),
            MyOption::None => MyOption::None,
        }
    }
    pub fn and_then<U, F: FnOnce(T) -> MyOption<U>>(self, f: F) -> MyOption<U> {
        match self {
            MyOption::Some(x) => f(x),
            MyOption::None => MyOption::None,
        }
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-042',
    number: 42,
    title: 'LRU Cache with Doubly Linked Pointers',
    slug: 'lru-cache-implementation',
    difficulty: 'Hard',
    category: 'Structs & Enums',
    timeEstimate: '45 min',
    acceptanceRate: '56%',
    summary: 'Design and implement a Least Recently Used (LRU) Cache supporting get and put in O(1).',
    starterCode: `use std::collections::HashMap;

pub struct LRUCache {
    capacity: usize,
    map: HashMap<i32, i32>,
}

impl LRUCache {
    pub fn new(capacity: usize) -> Self {
        Self { capacity, map: HashMap::with_capacity(capacity) }
    }
    pub fn get(&mut self, key: i32) -> i32 {
        *self.map.get(&key).unwrap_or(&-1)
    }
    pub fn put(&mut self, key: i32, value: i32) {
        self.map.insert(key, value);
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-043',
    number: 43,
    title: 'Recursive Enum Binary Search Tree',
    slug: 'recursive-enum-bst',
    difficulty: 'Medium',
    category: 'Structs & Enums',
    timeEstimate: '25 min',
    acceptanceRate: '75%',
    summary: 'Implement a pure functional BST enum: Empty or Node(Box<Self>, T, Box<Self>).',
    starterCode: `pub enum BST<T> {
    Empty,
    Node(Box<BST<T>>, T, Box<BST<T>>),
}

impl<T: Ord> BST<T> {
    pub fn insert(&mut self, val: T) {
        match self {
            BST::Empty => *self = BST::Node(Box::new(BST::Empty), val, Box::new(BST::Empty)),
            BST::Node(left, curr, right) => {
                if val < *curr { left.insert(val); }
                else if val > *curr { right.insert(val); }
            }
        }
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-044',
    number: 44,
    title: 'Design a MinStack in O(1) Time',
    slug: 'min-stack-rust',
    difficulty: 'Medium',
    category: 'Structs & Enums',
    timeEstimate: '20 min',
    acceptanceRate: '83%',
    summary: 'Design a stack that retrieves the minimum element in O(1) constant time.',
    starterCode: `pub struct MinStack {
    stack: Vec<i32>,
    min_stack: Vec<i32>,
}

impl MinStack {
    pub fn new() -> Self { Self { stack: Vec::new(), min_stack: Vec::new() } }
    pub fn push(&mut self, val: i32) {
        self.stack.push(val);
        let min = self.min_stack.last().copied().map_or(val, |m| m.min(val));
        self.min_stack.push(min);
    }
    pub fn pop(&mut self) -> Option<i32> {
        self.min_stack.pop();
        self.stack.pop()
    }
    pub fn get_min(&self) -> Option<i32> {
        self.min_stack.last().copied()
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-045',
    number: 45,
    title: 'Type-Safe Builder Pattern with Mandatory Fields',
    slug: 'type-safe-builder-pattern',
    difficulty: 'Medium',
    category: 'Structs & Enums',
    timeEstimate: '25 min',
    acceptanceRate: '79%',
    summary: 'Prevent .build() from compiling unless all mandatory fields are supplied via phantom states.',
    starterCode: `use std::marker::PhantomData;

pub struct Complete;
pub struct Incomplete;

pub struct HttpRequestBuilder<UrlState, BodyState> {
    url: Option<String>,
    body: Option<String>,
    _marker: PhantomData<(UrlState, BodyState)>,
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-046',
    number: 46,
    title: 'Implement Custom Result Fold and FlatMap',
    slug: 'custom-result-fold-flatmap',
    difficulty: 'Medium',
    category: 'Structs & Enums',
    timeEstimate: '20 min',
    acceptanceRate: '84%',
    summary: 'Write monadic combinatorial operations on a custom Result<T, E> data structure.',
    starterCode: `pub enum MyResult<T, E> { Ok(T), Err(E) }

impl<T, E> MyResult<T, E> {
    pub fn fold<U, F1: FnOnce(T) -> U, F2: FnOnce(E) -> U>(self, ok_fn: F1, err_fn: F2) -> U {
        match self {
            MyResult::Ok(val) => ok_fn(val),
            MyResult::Err(err) => err_fn(err),
        }
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-047',
    number: 47,
    title: 'Trie (Prefix Tree) with 26-Slot Child Arrays',
    slug: 'trie-prefix-tree',
    difficulty: 'Medium',
    category: 'Structs & Enums',
    timeEstimate: '30 min',
    acceptanceRate: '73%',
    summary: 'Implement a Trie with insert, search, and starts_with using Boxed nodes.',
    starterCode: `#[derive(Default)]
pub struct TrieNode {
    children: [Option<Box<TrieNode>>; 26],
    is_terminal: bool,
}

pub struct Trie {
    root: TrieNode,
}

impl Trie {
    pub fn new() -> Self { Self { root: TrieNode::default() } }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-048',
    number: 48,
    title: 'Command Pattern with Enum Dispatch',
    slug: 'command-pattern-enum-dispatch',
    difficulty: 'Easy',
    category: 'Structs & Enums',
    timeEstimate: '15 min',
    acceptanceRate: '89%',
    summary: 'Represent terminal commands (Move, Write, Delete) as an enum and apply to canvas.',
    starterCode: `pub enum Command {
    Move { x: i32, y: i32 },
    Write(String),
    Clear,
}

pub fn execute(cmd: Command) {
    match cmd {
        Command::Move { x, y } => println!("Move to {x}, {y}"),
        Command::Write(s) => println!("Write {s}"),
        Command::Clear => println!("Clear"),
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-049',
    number: 49,
    title: 'Zero-Sized Type (ZST) Token Pattern',
    slug: 'zst-token-pattern',
    difficulty: 'Medium',
    category: 'Structs & Enums',
    timeEstimate: '20 min',
    acceptanceRate: '81%',
    summary: 'Authenticate method invocations at compile time using non-constructible capability tokens.',
    starterCode: `pub struct AdminToken(());

pub struct Session;

impl Session {
    pub fn login_admin(&self) -> (Self, AdminToken) {
        (Session, AdminToken(()))
    }
    pub fn delete_database(&self, _token: &AdminToken) {
        // Only callable with valid proof token
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-050',
    number: 50,
    title: 'Bitflags Pattern with Modular Enums',
    slug: 'bitflags-pattern-enums',
    difficulty: 'Easy',
    category: 'Structs & Enums',
    timeEstimate: '15 min',
    acceptanceRate: '92%',
    summary: 'Encode file permissions (Read, Write, Execute) as a single u8 integer.',
    starterCode: `pub struct Permissions(pub u8);

impl Permissions {
    pub const READ: u8 = 1 << 0;
    pub const WRITE: u8 = 1 << 1;
    pub const EXEC: u8 = 1 << 2;

    pub fn has_read(&self) -> bool { (self.0 & Self::READ) != 0 }
    pub fn has_write(&self) -> bool { (self.0 & Self::WRITE) != 0 }
}`,
    isComingSoon: true,
  },

  // 51-60: Lifetimes & References
  {
    id: 'prob-051',
    number: 51,
    title: 'Longest Slice with Matching Generic Lifetime',
    slug: 'longest-slice-matching-lifetime',
    difficulty: 'Easy',
    category: 'Lifetimes & References',
    timeEstimate: '10 min',
    acceptanceRate: '93%',
    summary: 'Return reference to longest string slice using generic parameter \'a.',
    starterCode: `pub fn longest<\'a>(x: &\'a str, y: &\'a str) -> &\'a str {
    if x.len() >= y.len() { x } else { y }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-052',
    number: 52,
    title: 'Zero-Copy Struct with Borrowed String Slice',
    slug: 'zero-copy-struct-borrowed-slice',
    difficulty: 'Easy',
    category: 'Lifetimes & References',
    timeEstimate: '15 min',
    acceptanceRate: '88%',
    summary: 'Create a Parser struct holding &\'a str without cloning or allocating heap memory.',
    starterCode: `pub struct Highlight<\'a> {
    pub text: &\'a str,
    pub tag: &\'a str,
}

impl<\'a> Highlight<\'a> {
    pub fn render(&self) -> String {
        format!("<{}>{}</{}>", self.tag, self.text, self.tag)
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-053',
    number: 53,
    title: 'Self-Referential Struct Alternative with Indices',
    slug: 'self-referential-alternative-indices',
    difficulty: 'Medium',
    category: 'Lifetimes & References',
    timeEstimate: '25 min',
    acceptanceRate: '70%',
    summary: 'Solve the self-referential lifetime limitation by storing range indices instead of references.',
    starterCode: `pub struct TokenBuffer {
    data: String,
    tokens: Vec<(usize, usize)>,
}

impl TokenBuffer {
    pub fn get_token(&self, index: usize) -> Option<&str> {
        let &(start, end) = self.tokens.get(index)?;
        Some(&self.data[start..end])
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-054',
    number: 54,
    title: 'Lifetime Subtyping: Covariant Reference Cast',
    slug: 'lifetime-subtyping-covariance',
    difficulty: 'Medium',
    category: 'Lifetimes & References',
    timeEstimate: '20 min',
    acceptanceRate: '75%',
    summary: 'Demonstrate how a reference with longer lifetime \'a can safely substitute shorter \'b.',
    starterCode: `pub fn shorten_lifetime<\'a, \'b>(r: &\'a i32) -> &\'b i32
where
    \'a: \'b,
{
    r
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-055',
    number: 55,
    title: 'Multiple Distinct Lifetimes on Method Arguments',
    slug: 'multiple-distinct-lifetimes',
    difficulty: 'Medium',
    category: 'Lifetimes & References',
    timeEstimate: '20 min',
    acceptanceRate: '79%',
    summary: 'Disambiguate struct reference lifetime from method parameter lifetime.',
    starterCode: `pub struct Context<\'a> {
    pub name: &\'a str,
}

impl<\'a> Context<\'a> {
    pub fn announce<\'b>(&self, prefix: &\'b str) -> String {
        format!("{} on {}", prefix, self.name)
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-056',
    number: 56,
    title: 'Compile-Time Lifetime Elision Rule Verifier',
    slug: 'lifetime-elision-rule-verifier',
    difficulty: 'Easy',
    category: 'Lifetimes & References',
    timeEstimate: '15 min',
    acceptanceRate: '87%',
    summary: 'Explain and write functions satisfying all 3 compiler lifetime elision rules.',
    starterCode: `// Elision Rule 3: If &self or &mut self exists, output lifetime is assigned to self
pub struct Document {
    content: String,
}

impl Document {
    pub fn first_word(&self) -> &str {
        self.content.split_whitespace().next().unwrap_or("")
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-057',
    number: 57,
    title: 'Invariant Mutable References (&mut T)',
    slug: 'invariant-mutable-references',
    difficulty: 'Hard',
    category: 'Lifetimes & References',
    timeEstimate: '30 min',
    acceptanceRate: '60%',
    summary: 'Prove why &mut T is invariant over T to prevent writing short-lived data into long-lived slots.',
    starterCode: `pub fn overwrite_ref<\'a>(slot: &mut &\'a str, new_val: &\'a str) {
    *slot = new_val;
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-058',
    number: 58,
    title: 'Parsing Headers with Zero-Allocation Lifetimes',
    slug: 'parse-http-headers-zero-allocation',
    difficulty: 'Medium',
    category: 'Lifetimes & References',
    timeEstimate: '25 min',
    acceptanceRate: '72%',
    summary: 'Parse HTTP raw headers into a slice of key-value borrowed pairs without String allocations.',
    starterCode: `pub struct Header<\'a> {
    pub key: &\'a str,
    pub val: &\'a str,
}

pub fn parse_headers<\'a>(raw: &\'a str) -> Vec<Header<\'a>> {
    raw.lines().filter_map(|line| {
        let mut parts = line.splitn(2, ':');
        let key = parts.next()?.trim();
        let val = parts.next()?.trim();
        Some(Header { key, val })
    }).collect()
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-059',
    number: 59,
    title: 'Non-Lexical Lifetimes (NLL) Re-borrowing Scope',
    slug: 'nll-reborrow-scope',
    difficulty: 'Medium',
    category: 'Lifetimes & References',
    timeEstimate: '20 min',
    acceptanceRate: '77%',
    summary: 'Showcase code that failed in Rust 2015 lexical scopes but compiles cleanly under 2018/2021 NLL.',
    starterCode: `pub fn nll_example(map: &mut std::collections::HashMap<String, i32>, key: &str) {
    if let Some(val) = map.get_mut(key) {
        *val += 1;
        return; // &mut borrow ends here at return CFG edge!
    }
    map.insert(key.to_string(), 1); // Cleanly allowed under NLL
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-060',
    number: 60,
    title: 'Static Lifetime Token vs Scoped Leaks',
    slug: 'static-lifetime-vs-leaks',
    difficulty: 'Medium',
    category: 'Lifetimes & References',
    timeEstimate: '25 min',
    acceptanceRate: '71%',
    summary: 'Promote dynamic heap memory to &\'static str using Box::leak safely for long-lived caches.',
    starterCode: `pub fn make_static_str(s: String) -> &\'static str {
    Box::leak(s.into_boxed_str())
}`,
    isComingSoon: true,
  },

  // 61-70: Iterators & Closures
  {
    id: 'prob-061',
    number: 61,
    title: 'Custom StepBy Iterator Implementation',
    slug: 'custom-step-by-iterator',
    difficulty: 'Medium',
    category: 'Iterators & Closures',
    timeEstimate: '20 min',
    acceptanceRate: '82%',
    summary: 'Build a custom StepBy<I> iterator struct adapting any underlying iterator.',
    starterCode: `pub struct StepBy<I> {
    iter: I,
    step: usize,
}

impl<I: Iterator> Iterator for StepBy<I> {
    type Item = I::Item;
    fn next(&mut self) -> Option<Self::Item> {
        let item = self.iter.next()?;
        for _ in 1..self.step {
            self.iter.next();
        }
        Some(item)
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-062',
    number: 62,
    title: 'Flatten Nested Collections with flat_map',
    slug: 'flatten-nested-collections',
    difficulty: 'Easy',
    category: 'Iterators & Closures',
    timeEstimate: '15 min',
    acceptanceRate: '91%',
    summary: 'Flatten 2D matrices and optional streams into a single iterator sequence.',
    starterCode: `pub fn flatten_matrix<T>(matrix: Vec<Vec<T>>) -> Vec<T> {
    matrix.into_iter().flatten().collect()
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-063',
    number: 63,
    title: 'Implement Custom Zip Iterator',
    slug: 'custom-zip-iterator',
    difficulty: 'Medium',
    category: 'Iterators & Closures',
    timeEstimate: '20 min',
    acceptanceRate: '84%',
    summary: 'Pair up items from two disparate iterators until the shorter one terminates.',
    starterCode: `pub struct MyZip<A, B> {
    a: A,
    b: B,
}

impl<A: Iterator, B: Iterator> Iterator for MyZip<A, B> {
    type Item = (A::Item, B::Item);
    fn next(&mut self) -> Option<Self::Item> {
        let x = self.a.next()?;
        let y = self.b.next()?;
        Some((x, y))
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-064',
    number: 64,
    title: 'Closure Traits: Fn, FnMut, and FnOnce',
    slug: 'closure-traits-fn-fnmut-fnonce',
    difficulty: 'Medium',
    category: 'Iterators & Closures',
    timeEstimate: '25 min',
    acceptanceRate: '76%',
    summary: 'Demonstrate differences between Fn (shared), FnMut (mutating), and FnOnce (moving captures).',
    starterCode: `pub fn exec_once<F: FnOnce() -> String>(f: F) -> String { f() }
pub fn exec_mut<F: FnMut(&mut i32)>(mut f: F, val: &mut i32) { f(val); }
pub fn exec_ref<F: Fn(i32) -> i32>(f: F, val: i32) -> i32 { f(val) }`,
    isComingSoon: true,
  },
  {
    id: 'prob-065',
    number: 65,
    title: 'Infinite Stream Generator with Iterator',
    slug: 'infinite-stream-generator',
    difficulty: 'Easy',
    category: 'Iterators & Closures',
    timeEstimate: '15 min',
    acceptanceRate: '90%',
    summary: 'Implement an infinite Collatz conjecture sequence generator using .take_while().',
    starterCode: `pub struct Collatz {
    curr: u64,
}

impl Iterator for Collatz {
    type Item = u64;
    fn next(&mut self) -> Option<Self::Item> {
        if self.curr == 0 { return None; }
        let val = self.curr;
        if self.curr == 1 { self.curr = 0; }
        else if self.curr % 2 == 0 { self.curr /= 2; }
        else { self.curr = 3 * self.curr + 1; }
        Some(val)
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-066',
    number: 66,
    title: 'Chunking a Slice into Fixed Windows',
    slug: 'chunking-slice-windows',
    difficulty: 'Easy',
    category: 'Iterators & Closures',
    timeEstimate: '10 min',
    acceptanceRate: '93%',
    summary: 'Process items in chunks of size N using built-in slice .chunks() and .windows().',
    starterCode: `pub fn sum_chunks(slice: &[i32], chunk_size: usize) -> Vec<i32> {
    slice.chunks(chunk_size).map(|c| c.iter().sum()).collect()
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-067',
    number: 67,
    title: 'Custom Combinator: Peekable Lookahead',
    slug: 'peekable-lookahead-combinator',
    difficulty: 'Medium',
    category: 'Iterators & Closures',
    timeEstimate: '25 min',
    acceptanceRate: '78%',
    summary: 'Implement a 1-item lookahead iterator buffer without consuming the stream.',
    starterCode: `pub struct MyPeekable<I: Iterator> {
    iter: I,
    peeked: Option<Option<I::Item>>,
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-068',
    number: 68,
    title: 'Fold vs Rfold vs Reduce Accumulators',
    slug: 'fold-rfold-reduce',
    difficulty: 'Easy',
    category: 'Iterators & Closures',
    timeEstimate: '15 min',
    acceptanceRate: '89%',
    summary: 'Compute running products and reversed polynomials using standard iterator reductions.',
    starterCode: `pub fn eval_polynomial(coeffs: &[f64], x: f64) -> f64 {
    // Horner's rule via rfold
    coeffs.iter().rfold(0.0, |acc, &coeff| acc * x + coeff)
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-069',
    number: 69,
    title: 'Partitioning Stream into Two Vectors',
    slug: 'partition-stream-vectors',
    difficulty: 'Easy',
    category: 'Iterators & Closures',
    timeEstimate: '10 min',
    acceptanceRate: '94%',
    summary: 'Separate a list into even and odd collections using Iterator::partition in one pass.',
    starterCode: `pub fn partition_even_odd(nums: Vec<i32>) -> (Vec<i32>, Vec<i32>) {
    nums.into_iter().partition(|&n| n % 2 == 0)
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-070',
    number: 70,
    title: 'Cycle Iterator with Infinite Safe Bounding',
    slug: 'cycle-iterator-safe-bounds',
    difficulty: 'Easy',
    category: 'Iterators & Closures',
    timeEstimate: '10 min',
    acceptanceRate: '95%',
    summary: 'Round-robin dispatch work across N servers using .cycle() and .take().',
    starterCode: `pub fn dispatch_tasks(tasks: &[&str], servers: &[&str]) -> Vec<(String, String)> {
    tasks.iter()
        .zip(servers.iter().cycle())
        .map(|(&t, &s)| (t.to_string(), s.to_string()))
        .collect()
}`,
    isComingSoon: true,
  },

  // 71-80: Smart Pointers
  {
    id: 'prob-071',
    number: 71,
    title: 'Singly Linked List with Box<Node>',
    slug: 'singly-linked-list-box',
    difficulty: 'Medium',
    category: 'Smart Pointers',
    timeEstimate: '30 min',
    acceptanceRate: '70%',
    summary: 'Build a recursive stack data structure with Box indirection and proper RAII drop.',
    starterCode: `pub struct List<T> {
    head: Option<Box<Node<T>>>,
}

struct Node<T> {
    elem: T,
    next: Option<Box<Node<T>>>,
}

impl<T> List<T> {
    pub fn new() -> Self { Self { head: None } }
    pub fn push(&mut self, elem: T) {
        let new_node = Box::new(Node {
            elem,
            next: self.head.take(),
        });
        self.head = Some(new_node);
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-072',
    number: 72,
    title: 'Shared Ownership Graph with Rc<T>',
    slug: 'shared-ownership-graph-rc',
    difficulty: 'Medium',
    category: 'Smart Pointers',
    timeEstimate: '25 min',
    acceptanceRate: '74%',
    summary: 'Represent a Directed Acyclic Graph (DAG) with nodes referenced by multiple parents.',
    starterCode: `use std::rc::Rc;

pub struct GraphNode {
    pub id: usize,
    pub children: Vec<Rc<GraphNode>>,
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-073',
    number: 73,
    title: 'Interior Mutability with RefCell<T>',
    slug: 'interior-mutability-refcell',
    difficulty: 'Medium',
    category: 'Smart Pointers',
    timeEstimate: '25 min',
    acceptanceRate: '77%',
    summary: 'Mutate inner state behind an immutable reference and handle BorrowError at runtime.',
    starterCode: `use std::cell::RefCell;

pub struct Logger {
    logs: RefCell<Vec<String>>,
}

impl Logger {
    pub fn new() -> Self { Self { logs: RefCell::new(Vec::new()) } }
    pub fn log(&self, msg: &str) {
        self.logs.borrow_mut().push(msg.to_string());
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-074',
    number: 74,
    title: 'Breaking Reference Cycles with Weak<T>',
    slug: 'breaking-cycles-weak-pointers',
    difficulty: 'Hard',
    category: 'Smart Pointers',
    timeEstimate: '35 min',
    acceptanceRate: '62%',
    summary: 'Prevent memory leaks in bidirectional tree nodes using Weak parent pointers.',
    starterCode: `use std::rc::{Rc, Weak};
use std::cell::RefCell;

pub struct TreeNode {
    pub val: i32,
    pub parent: RefCell<Weak<TreeNode>>,
    pub children: RefCell<Vec<Rc<TreeNode>>>,
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-075',
    number: 75,
    title: 'Thread-Safe Shared State with Arc<Mutex<T>>',
    slug: 'thread-safe-arc-mutex',
    difficulty: 'Medium',
    category: 'Smart Pointers',
    timeEstimate: '25 min',
    acceptanceRate: '79%',
    summary: 'Share and increment an atomic counter concurrently across multiple OS threads.',
    starterCode: `use std::sync::{Arc, Mutex};
use std::thread;

pub fn parallel_sum(tasks: usize) -> i32 {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();
    for _ in 0..tasks {
        let c = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            let mut num = c.lock().unwrap();
            *num += 1;
        }));
    }
    for h in handles { h.join().unwrap(); }
    let res = *counter.lock().unwrap();
    res
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-076',
    number: 76,
    title: 'Custom Smart Pointer with Deref & DerefMut',
    slug: 'custom-smart-pointer-deref',
    difficulty: 'Medium',
    category: 'Smart Pointers',
    timeEstimate: '20 min',
    acceptanceRate: '83%',
    summary: 'Implement Deref coercion so custom wrapper transparently accesses inner methods.',
    starterCode: `use std::ops::Deref;

pub struct MyBox<T>(T);

impl<T> MyBox<T> {
    pub fn new(x: T) -> Self { MyBox(x) }
}

impl<T> Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &Self::Target { &self.0 }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-077',
    number: 77,
    title: 'Read-Heavy Caches with Arc<RwLock<T>>',
    slug: 'read-heavy-cache-rwlock',
    difficulty: 'Medium',
    category: 'Smart Pointers',
    timeEstimate: '25 min',
    acceptanceRate: '78%',
    summary: 'Allow simultaneous concurrent reads while securing exclusive writes.',
    starterCode: `use std::sync::RwLock;
use std::collections::HashMap;

pub struct Cache {
    store: RwLock<HashMap<String, String>>,
}

impl Cache {
    pub fn get(&self, k: &str) -> Option<String> {
        self.store.read().unwrap().get(k).cloned()
    }
    pub fn set(&self, k: String, v: String) {
        self.store.write().unwrap().insert(k, v);
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-078',
    number: 78,
    title: 'Zero-Overhead Primitive Interior Mutability with Cell<T>',
    slug: 'primitive-interior-mutability-cell',
    difficulty: 'Easy',
    category: 'Smart Pointers',
    timeEstimate: '15 min',
    acceptanceRate: '88%',
    summary: 'Mutate Copy types without runtime borrow count overhead using std::cell::Cell.',
    starterCode: `use std::cell::Cell;

pub struct Counter {
    val: Cell<usize>,
}

impl Counter {
    pub fn new() -> Self { Self { val: Cell::new(0) } }
    pub fn inc(&self) { self.val.set(self.val.get() + 1); }
    pub fn count(&self) -> usize { self.val.get() }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-079',
    number: 79,
    title: 'Custom Reference Counted Pointer (Toy Rc)',
    slug: 'custom-toy-rc-implementation',
    difficulty: 'Hard',
    category: 'Smart Pointers',
    timeEstimate: '40 min',
    acceptanceRate: '54%',
    summary: 'Allocate refcount and value together in heap layout with NonNull raw pointer.',
    starterCode: `pub struct ToyRc<T> {
    ptr: *mut (usize, T),
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-080',
    number: 80,
    title: 'Copy-on-Write Optimization with Cow<\'a, str>',
    slug: 'copy-on-write-cow-str',
    difficulty: 'Medium',
    category: 'Smart Pointers',
    timeEstimate: '20 min',
    acceptanceRate: '80%',
    summary: 'Sanitize strings allocating a new heap String only if invalid characters exist.',
    starterCode: `use std::borrow::Cow;

pub fn sanitize_spaces<\'a>(input: &\'a str) -> Cow<\'a, str> {
    if input.contains("  ") {
        Cow::Owned(input.replace("  ", " "))
    } else {
        Cow::Borrowed(input)
    }
}`,
    isComingSoon: true,
  },

  // 81-90: Concurrency & Async
  {
    id: 'prob-081',
    number: 81,
    title: 'Multi-Producer Single-Consumer Channel (MPSC)',
    slug: 'mpsc-channel-pipeline',
    difficulty: 'Medium',
    category: 'Concurrency & Async',
    timeEstimate: '20 min',
    acceptanceRate: '82%',
    summary: 'Stream computations from multiple workers into a single aggregator thread.',
    starterCode: `use std::sync::mpsc;
use std::thread;

pub fn aggregate_work(work_items: Vec<i32>) -> i32 {
    let (tx, rx) = mpsc::channel();
    for item in work_items {
        let sender = tx.clone();
        thread::spawn(move || {
            sender.send(item * 2).unwrap();
        });
    }
    drop(tx);
    rx.into_iter().sum()
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-082',
    number: 82,
    title: 'Lock-Free Counter with AtomicUsize',
    slug: 'lock-free-counter-atomic',
    difficulty: 'Medium',
    category: 'Concurrency & Async',
    timeEstimate: '20 min',
    acceptanceRate: '84%',
    summary: 'Coordinate thread progress without OS mutexes using fetch_add and Ordering::Relaxed.',
    starterCode: `use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;

pub struct AtomicCounter {
    val: Arc<AtomicUsize>,
}

impl AtomicCounter {
    pub fn new() -> Self { Self { val: Arc::new(AtomicUsize::new(0)) } }
    pub fn inc(&self) { self.val.fetch_add(1, Ordering::Relaxed); }
    pub fn get(&self) -> usize { self.val.load(Ordering::Relaxed) }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-083',
    number: 83,
    title: 'Building a Fixed-Size Thread Pool',
    slug: 'fixed-thread-pool',
    difficulty: 'Hard',
    category: 'Concurrency & Async',
    timeEstimate: '45 min',
    acceptanceRate: '55%',
    summary: 'Dispatch arbitrary jobs (Box<dyn FnOnce() + Send>) across N worker threads.',
    starterCode: `pub struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<std::sync::mpsc::Sender<Job>>,
}

type Job = Box<dyn FnOnce() + Send + \'static>;
struct Worker { id: usize }`,
    isComingSoon: true,
  },
  {
    id: 'prob-084',
    number: 84,
    title: 'Tokio Async Task Spawning & JoinSet',
    slug: 'tokio-task-spawn-joinset',
    difficulty: 'Medium',
    category: 'Concurrency & Async',
    timeEstimate: '25 min',
    acceptanceRate: '75%',
    summary: 'Run 10,000 lightweight async green tasks concurrently using Tokio runtime primitives.',
    starterCode: `// Simulates async task aggregation
pub async fn fetch_all(urls: Vec<&str>) -> Vec<String> {
    let mut results = Vec::new();
    for u in urls {
        results.push(format!("response from {u}"));
    }
    results
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-085',
    number: 85,
    title: 'Async Rate Limiter with Token Bucket',
    slug: 'async-rate-limiter-token-bucket',
    difficulty: 'Hard',
    category: 'Concurrency & Async',
    timeEstimate: '35 min',
    acceptanceRate: '63%',
    summary: 'Implement thread-safe token bucket algorithm enforcing max requests per second.',
    starterCode: `use std::time::Instant;

pub struct RateLimiter {
    capacity: usize,
    tokens: usize,
    last_fill: Instant,
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-086',
    number: 86,
    title: 'Producer-Consumer with Bounded Backpressure',
    slug: 'bounded-mpsc-backpressure',
    difficulty: 'Medium',
    category: 'Concurrency & Async',
    timeEstimate: '25 min',
    acceptanceRate: '79%',
    summary: 'Block producers when consumer buffer is full using std::sync::mpsc::sync_channel.',
    starterCode: `use std::sync::mpsc::sync_channel;

pub fn backpressure_pipeline(buffer_size: usize) {
    let (tx, rx) = sync_channel(buffer_size);
    // When buffer fills, tx.send() blocks until rx.recv() frees a slot
    let _ = (tx, rx);
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-087',
    number: 87,
    title: 'Overcoming Deadlocks with Lock Ordering',
    slug: 'deadlock-prevention-lock-ordering',
    difficulty: 'Medium',
    category: 'Concurrency & Async',
    timeEstimate: '25 min',
    acceptanceRate: '73%',
    summary: 'Transfer funds between two accounts locking in consistent pointer/id memory order.',
    starterCode: `use std::sync::Mutex;

pub struct Account { pub id: u64, pub balance: Mutex<i64> }

pub fn transfer(from: &Account, to: &Account, amount: i64) {
    // Acquire locks in ascending id order to guarantee deadlock freedom
    if from.id < to.id {
        let mut b1 = from.balance.lock().unwrap();
        let mut b2 = to.balance.lock().unwrap();
        *b1 -= amount; *b2 += amount;
    } else {
        let mut b2 = to.balance.lock().unwrap();
        let mut b1 = from.balance.lock().unwrap();
        *b1 -= amount; *b2 += amount;
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-088',
    number: 88,
    title: 'Send and Sync Trait Boundary Verification',
    slug: 'send-sync-trait-boundaries',
    difficulty: 'Medium',
    category: 'Concurrency & Async',
    timeEstimate: '20 min',
    acceptanceRate: '81%',
    summary: 'Identify why Rc<T> and *mut T are !Send and !Sync, and how Arc<Mutex<T>> restores safety.',
    starterCode: `// Proof test function enforcing Send + Sync
pub fn assert_send_sync<T: Send + Sync>() {}

pub fn verify() {
    assert_send_sync::<std::sync::Arc<std::sync::Mutex<i32>>>();
    // assert_send_sync::<std::rc::Rc<i32>>(); // Compiler error!
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-089',
    number: 89,
    title: 'Barrier Synchronization Across Threads',
    slug: 'barrier-synchronization-threads',
    difficulty: 'Medium',
    category: 'Concurrency & Async',
    timeEstimate: '20 min',
    acceptanceRate: '86%',
    summary: 'Coordinate multiple worker threads to rendezvous at fixed phase boundaries with Arc<Barrier>.',
    starterCode: `use std::sync::{Arc, Barrier};
use std::thread;

pub fn run_phased_computation(workers: usize) {
    let barrier = Arc::new(Barrier::new(workers));
    let mut handles = Vec::new();
    for _ in 0..workers {
        let b = Arc::clone(&barrier);
        handles.push(thread::spawn(move || {
            // Phase 1
            b.wait();
            // Phase 2
        }));
    }
    for h in handles { h.join().unwrap(); }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-090',
    number: 90,
    title: 'Async Cancellation & Timeout with select!',
    slug: 'async-timeout-select',
    difficulty: 'Medium',
    category: 'Concurrency & Async',
    timeEstimate: '25 min',
    acceptanceRate: '77%',
    summary: 'Race an async future against a timer and gracefully abort on expiration.',
    starterCode: `// Simulates async timeout race
pub async fn execute_with_timeout<F: std::future::Future>(f: F, timeout_ms: u64) -> Result<F::Output, ()> {
    // Under Tokio: tokio::select! { res = f => Ok(res), _ = sleep(timeout_ms) => Err(()) }
    let res = f.await;
    let _ = timeout_ms;
    Ok(res)
}`,
    isComingSoon: true,
  },

  // 91-100: Systems & Unsafe
  {
    id: 'prob-091',
    number: 91,
    title: 'Zero-Cost Foreign Function Interface (FFI)',
    slug: 'zero-cost-c-ffi',
    difficulty: 'Medium',
    category: 'Systems & Unsafe',
    timeEstimate: '25 min',
    acceptanceRate: '74%',
    summary: 'Expose a C-compatible repr(C) struct and extern "C" function with zero wrapper overhead.',
    starterCode: `#[repr(C)]
pub struct NativePoint {
    pub x: f64,
    pub y: f64,
}

#[no_mangle]
pub extern "C" fn point_distance_squared(p: *const NativePoint) -> f64 {
    if p.is_null() { return 0.0; }
    unsafe { (*p).x * (*p).x + (*p).y * (*p).y }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-092',
    number: 92,
    title: 'Custom Memory Allocator Hooks',
    slug: 'custom-global-allocator',
    difficulty: 'Hard',
    category: 'Systems & Unsafe',
    timeEstimate: '40 min',
    acceptanceRate: '58%',
    summary: 'Implement GlobalAlloc counting live allocated heap bytes.',
    starterCode: `use std::alloc::{GlobalAlloc, Layout, System};
use std::sync::atomic::{AtomicUsize, Ordering};

pub struct TracingAlloc {
    allocated: AtomicUsize,
}

unsafe impl GlobalAlloc for TracingAlloc {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        self.allocated.fetch_add(layout.size(), Ordering::SeqCst);
        System.alloc(layout)
    }
    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        self.allocated.fetch_sub(layout.size(), Ordering::SeqCst);
        System.dealloc(ptr, layout);
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-093',
    number: 93,
    title: 'Fast Memcpy with Raw Pointer Slices',
    slug: 'fast-raw-pointer-copy',
    difficulty: 'Medium',
    category: 'Systems & Unsafe',
    timeEstimate: '20 min',
    acceptanceRate: '80%',
    summary: 'Copy non-overlapping slices of Copy types using ptr::copy_nonoverlapping.',
    starterCode: `pub fn fast_copy<T: Copy>(src: &[T], dst: &mut [T]) {
    assert!(dst.len() >= src.len());
    unsafe {
        std::ptr::copy_nonoverlapping(src.as_ptr(), dst.as_mut_ptr(), src.len());
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-094',
    number: 94,
    title: 'Safe Transmute of Pod Types with Alignment Check',
    slug: 'safe-transmute-pod-types',
    difficulty: 'Hard',
    category: 'Systems & Unsafe',
    timeEstimate: '35 min',
    acceptanceRate: '61%',
    summary: 'Safely cast between byte slices and integer arrays validating memory alignment.',
    starterCode: `pub fn bytes_to_u32_slice(bytes: &[u8]) -> Option<&[u32]> {
    if bytes.len() % 4 != 0 { return None; }
    if (bytes.as_ptr() as usize) % std::mem::align_of::<u32>() != 0 { return None; }
    unsafe {
        Some(std::slice::from_raw_parts(bytes.as_ptr() as *const u32, bytes.len() / 4))
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-095',
    number: 95,
    title: 'Inline Assembly: Reading CPU Timestamp (RDTSC)',
    slug: 'inline-assembly-rdtsc',
    difficulty: 'Hard',
    category: 'Systems & Unsafe',
    timeEstimate: '35 min',
    acceptanceRate: '65%',
    summary: 'Execute hardware instructions via core::arch::x86_64::_rdtsc for high-precision cycles.',
    starterCode: `pub fn read_cpu_cycles() -> u64 {
    #[cfg(target_arch = "x86_64")]
    unsafe { core::arch::x86_64::_rdtsc() }
    #[cfg(not(target_arch = "x86_64"))]
    0
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-096',
    number: 96,
    title: 'SIMD Vector Addition with std::simd',
    slug: 'simd-vector-addition',
    difficulty: 'Hard',
    category: 'Systems & Unsafe',
    timeEstimate: '35 min',
    acceptanceRate: '62%',
    summary: 'Process 8 floats per CPU clock cycle using AVX2 SIMD vector instructions.',
    starterCode: `pub fn add_slices_scalar(a: &[f32], b: &[f32], out: &mut [f32]) {
    for i in 0..a.len() {
        out[i] = a[i] + b[i];
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-097',
    number: 97,
    title: 'Custom Uninitialized Buffer Initialization with MaybeUninit',
    slug: 'maybe-uninit-buffer',
    difficulty: 'Hard',
    category: 'Systems & Unsafe',
    timeEstimate: '40 min',
    acceptanceRate: '57%',
    summary: 'Allocate stack buffer of unknown size without paying zero-initialization overhead.',
    starterCode: `use std::mem::MaybeUninit;

pub fn create_initialized_array(val: i32) -> [i32; 100] {
    let mut data: [MaybeUninit<i32>; 100] = unsafe {
        MaybeUninit::uninit().assume_init()
    };
    for elem in &mut data[..] {
        elem.write(val);
    }
    unsafe { std::mem::transmute(data) }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-098',
    number: 98,
    title: 'Atomic Spinlock with Compare-And-Swap (CAS)',
    slug: 'atomic-spinlock-cas',
    difficulty: 'Medium',
    category: 'Systems & Unsafe',
    timeEstimate: '25 min',
    acceptanceRate: '75%',
    summary: 'Implement a low-latency spinlock using AtomicBool and compare_exchange_weak.',
    starterCode: `use std::sync::atomic::{AtomicBool, Ordering};

pub struct SpinLock {
    locked: AtomicBool,
}

impl SpinLock {
    pub fn new() -> Self { Self { locked: AtomicBool::new(false) } }
    pub fn lock(&self) {
        while self.locked.compare_exchange_weak(
            false, true, Ordering::Acquire, Ordering::Relaxed
        ).is_err() {
            std::hint::spin_loop();
        }
    }
    pub fn unlock(&self) {
        self.locked.store(false, Ordering::Release);
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-099',
    number: 99,
    title: 'Zero-Cost Memory Mapped File (mmap) Wrapper',
    slug: 'memory-mapped-file-wrapper',
    difficulty: 'Hard',
    category: 'Systems & Unsafe',
    timeEstimate: '40 min',
    acceptanceRate: '53%',
    summary: 'Map multi-gigabyte disk files directly into the virtual address space.',
    starterCode: `pub struct MmapSlice {
    ptr: *const u8,
    len: usize,
}

impl MmapSlice {
    pub fn as_slice(&self) -> &[u8] {
        unsafe { std::slice::from_raw_parts(self.ptr, self.len) }
    }
}`,
    isComingSoon: true,
  },
  {
    id: 'prob-100',
    number: 100,
    title: 'Lock-Free Single-Producer Single-Consumer (SPSC) Queue',
    slug: 'lock-free-spsc-queue',
    difficulty: 'Hard',
    category: 'Systems & Unsafe',
    timeEstimate: '50 min',
    acceptanceRate: '49%',
    summary: 'Build high-frequency trading ring buffer using cache-line padded atomic indices.',
    starterCode: `use std::sync::atomic::{AtomicUsize, Ordering};

#[repr(align(64))]
pub struct SPSCQueue<T> {
    head: AtomicUsize,
    tail: AtomicUsize,
    capacity: usize,
    _marker: std::marker::PhantomData<T>,
}

impl<T> SPSCQueue<T> {
    pub fn new(capacity: usize) -> Self {
        Self {
            head: AtomicUsize::new(0),
            tail: AtomicUsize::new(0),
            capacity,
            _marker: std::marker::PhantomData,
        }
    }
}`,
    isComingSoon: true,
  },
];
