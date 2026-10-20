import type { DomainKey } from './domains';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  domain: DomainKey;
  difficulty: ExerciseDifficulty;
  prompt: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
  topicSlug?: string;
}

export const exercises: Exercise[] = [
  {
    id: 'event-loop-order',
    domain: 'fullstack',
    difficulty: 'beginner',
    prompt: 'What is logged first?',
    code: `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`,
    options: ['A, D, C, B', 'A, B, C, D', 'A, C, D, B', 'A, D, B, C'],
    answer: 0,
    explanation:
      'Synchronous code runs first (A, D). Promises are microtasks and run before the timer macrotask (C), then B.',
    topicSlug: 'jsviz',
  },
  {
    id: 'css-specificity',
    domain: 'fullstack',
    difficulty: 'beginner',
    prompt: 'Which color wins for the paragraph?',
    code: `.card p { color: blue; }
#intro { color: green; }
p { color: red; }`,
    options: ['blue', 'green', 'red', 'Browser default'],
    answer: 1,
    explanation:
      'An ID selector (0,1,0,0) outranks a class plus type selector (0,0,1,1), so the ID rule wins.',
    topicSlug: 'css-cosmos',
  },
  {
    id: 'react-key',
    domain: 'fullstack',
    difficulty: 'intermediate',
    prompt: 'Why does React need a stable key in a list?',
    options: [
      'To make CSS selectors deterministic',
      'To identify which items changed, moved, or were removed',
      'To force every child to re-render',
      'To sort the list automatically',
    ],
    answer: 1,
    explanation:
      'Keys are reconciliation identities. Stable keys let React preserve component state and move DOM nodes instead of re-creating them.',
    topicSlug: 'reactcosmos',
  },
  {
    id: 'http-301',
    domain: 'fullstack',
    difficulty: 'beginner',
    prompt: 'What does HTTP 301 mean?',
    options: [
      'Temporary redirect; keep the original method',
      'Permanent redirect; clients may cache it',
      'Resource not modified',
      'Authentication required',
    ],
    answer: 1,
    explanation:
      '301 is a permanent redirect. 302/307 are temporary; 304 means not modified; 401 means unauthorized.',
    topicSlug: 'webprotocols',
  },
  {
    id: 'hashmap-average',
    domain: 'dsa',
    difficulty: 'beginner',
    prompt: 'What is the average lookup time for a well-sized hash map?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answer: 0,
    explanation:
      'With a good hash function and load factor, lookups are average O(1). Worst case can degrade to O(n) under heavy collisions.',
  },
  {
    id: 'binary-search',
    domain: 'dsa',
    difficulty: 'beginner',
    prompt: 'Binary search on a sorted array of 1,024 elements takes at most how many comparisons?',
    options: ['10', '32', '512', '1,024'],
    answer: 0,
    explanation: 'Binary search is O(log n). log2(1024) = 10.',
    topicSlug: 'arrayviz',
  },
  {
    id: 'monotonic-stack',
    domain: 'dsa',
    difficulty: 'intermediate',
    prompt: 'A monotonic stack is most useful for which task?',
    options: [
      'Finding the next greater element',
      'Sorting a linked list',
      'Detecting a cycle in a graph',
      'Computing a hash',
    ],
    answer: 0,
    explanation:
      'Monotonic stacks maintain an ordered frontier and answer next-greater/previous-smaller queries in O(n) total.',
  },
  {
    id: 'tlb-purpose',
    domain: 'corecs',
    difficulty: 'intermediate',
    prompt: 'What is the main purpose of a TLB?',
    options: [
      'Cache virtual-to-physical address translations',
      'Store the process scheduler run queue',
      'Buffer disk writes',
      'Compress network packets',
    ],
    answer: 0,
    explanation:
      'The Translation Lookaside Buffer caches page-table entries so most virtual address translations avoid walking the page table.',
    topicSlug: 'operating-systems-internals-processes-memory',
  },
  {
    id: 'tcp-handshake',
    domain: 'corecs',
    difficulty: 'beginner',
    prompt: 'Which sequence starts a TCP connection?',
    options: ['SYN, SYN-ACK, ACK', 'ACK, SYN, FIN', 'SYN, ACK, RST', 'FIN, ACK, SYN'],
    answer: 0,
    explanation: 'TCP uses a three-way handshake: SYN, SYN-ACK, ACK.',
    topicSlug: 'webprotocols',
  },
  {
    id: 'docker-namespaces',
    domain: 'devops',
    difficulty: 'intermediate',
    prompt: 'Which Linux feature isolates a container process from the host process list?',
    options: ['PID namespace', 'cgroup v1', 'OverlayFS', 'iptables'],
    answer: 0,
    explanation:
      'PID namespaces give a process its own view of process IDs. cgroups limit resources; OverlayFS layers the filesystem.',
    topicSlug: 'dockercosmos',
  },
  {
    id: 'jwt-localstorage',
    domain: 'security',
    difficulty: 'intermediate',
    prompt: 'Why is storing a long-lived JWT in localStorage risky?',
    options: [
      'Any script on the origin can read it after an XSS',
      'The browser deletes it on refresh',
      'It cannot be sent in an Authorization header',
      'It is automatically shared across domains',
    ],
    answer: 0,
    explanation:
      'localStorage is readable by JavaScript. An XSS payload can exfiltrate the bearer token. HttpOnly cookies move it out of script reach.',
    topicSlug: 'websecurity',
  },
  {
    id: 'attention-complexity',
    domain: 'ai',
    difficulty: 'advanced',
    prompt: 'Self-attention over a sequence of length n has what time complexity?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
    answer: 2,
    explanation:
      'Every token attends to every other token, producing an n x n score matrix, so the standard computation is O(n²).',
    topicSlug: 'aicosmos',
  },
  {
    id: 'merkle-proof',
    domain: 'web3',
    difficulty: 'intermediate',
    prompt: 'How many hashes are needed to verify one leaf in a Merkle tree of 1,024 leaves?',
    options: ['10', '32', '512', '1,024'],
    answer: 0,
    explanation:
      'A Merkle proof walks one sibling per level. log2(1024) = 10 hashes.',
    topicSlug: 'merkletreeviz',
  },
  {
    id: 'cache-stampede',
    domain: 'advanced',
    difficulty: 'advanced',
    prompt: 'What is a cache stampede?',
    options: [
      'Many concurrent requests miss an expired key and hit the database together',
      'A cache returning stale data forever',
      'A cache evicting keys too slowly',
      'A write-through cache losing writes',
    ],
    answer: 0,
    explanation:
      'When a hot key expires, concurrent misses can all rebuild it at once. Coalescing/locking or stale-while-revalidate prevents the stampede.',
    topicSlug: 'systemdesignviz',
  },
  {
    id: 'token-bucket',
    domain: 'advanced',
    difficulty: 'intermediate',
    prompt: 'A token bucket rate limiter primarily controls what?',
    options: [
      'Average rate with a bounded burst',
      'Total lifetime requests only',
      'Database transaction isolation',
      'DNS resolution order',
    ],
    answer: 0,
    explanation:
      'Tokens refill at a steady rate; the bucket size bounds bursts. That gives an average rate plus controlled short-term spikes.',
    topicSlug: 'systemdesignviz',
  },
];
