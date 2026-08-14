export interface RedisFlashcard {
  id: string;
  category: 'Foundations' | 'Data Structures' | 'Caching & Eviction' | 'Persistence & Scale';
  question: string;
  answer: string;
  code?: string;
  tip: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export const REDIS_FLASHCARDS: RedisFlashcard[] = [
  {
    id: 'rf-1',
    category: 'Foundations',
    difficulty: 'Junior',
    question: 'Why is Redis single-threaded yet capable of handling 100,000+ operations/second?',
    answer: 'Redis operates entirely in RAM (no slow disk I/O per query) and uses an efficient non-blocking I/O multiplexing event loop (epoll/kqueue). Being single-threaded eliminates lock contention, mutex overhead, and CPU thread context-switching.',
    code: `# Single-threaded execution guarantees atomic commands:
INCR counter # No race condition or locks needed!`,
    tip: 'Redis 6.0+ introduced multi-threaded I/O purely for network read/write socket handling, while command execution remains strictly single-threaded.'
  },
  {
    id: 'rf-2',
    category: 'Data Structures',
    difficulty: 'Mid',
    question: 'How is a Redis Sorted Set (ZSET) implemented under the hood?',
    answer: 'A Sorted Set uses two data structures simultaneously: a Hash Table (dict) mapping member -> score in O(1) time, and a SkipList (zskiplist) ordering members by score in O(log N) time for fast range queries and ranking.',
    code: `ZADD leaderboard 100 "Alice"
ZADD leaderboard 250 "Bob"
ZREVRANGE leaderboard 0 10 WITHSCORES # O(log N + M) via SkipList`,
    tip: 'SkipLists are easier to implement and require less memory rebalancing than Red-Black trees for concurrent range searches.'
  },
  {
    id: 'rf-3',
    category: 'Caching & Eviction',
    difficulty: 'Senior',
    question: 'Explain the difference between Cache Penetration, Cache Breakdown, and Cache Avalanche.',
    answer: '1. Penetration: Queries for non-existent keys bypass cache to hit DB (Fix: Bloom filter or cache null). 2. Breakdown: A single hot key expires, and 10,000 concurrent requests hammer the DB (Fix: Mutex lock or logical expiration). 3. Avalanche: Thousands of keys expire at the exact same second, overwhelming DB (Fix: Add random jitter to TTLs).',
    code: `// Avoid Avalanche with TTL Jitter:
const baseTTL = 3600;
const jitter = Math.floor(Math.random() * 300); // 0-5 mins
await redis.set(key, val, 'EX', baseTTL + jitter);`,
    tip: 'Always add a 5-10% random jitter to TTL expirations when writing batch cache records.'
  },
  {
    id: 'rf-4',
    category: 'Persistence & Scale',
    difficulty: 'Senior',
    question: 'How does Redis perform background RDB snapshots without locking the database?',
    answer: 'Redis executes BGSAVE using the Linux fork() system call. The child process writes the memory dump to disk while the parent continues serving queries. The OS uses Copy-on-Write (COW), copying only modified memory pages during the save process.',
    code: `# Check background save status:
BGSAVE
INFO persistence # rdb_bgsave_in_progress: 0`,
    tip: 'Ensure Linux vm.overcommit_memory = 1 is enabled so fork() does not fail when memory utilization is high.'
  },
  {
    id: 'rf-5',
    category: 'Caching & Eviction',
    difficulty: 'Mid',
    question: 'What is the difference between allkeys-lru and volatile-lru eviction policies?',
    answer: 'allkeys-lru evicts the least recently used keys across the entire database when maxmemory is full. volatile-lru only evicts LRU keys that have an explicit expiration (TTL) set; if no keys have TTL, Redis returns OOM errors.',
    code: `# redis.conf
maxmemory-policy allkeys-lru`,
    tip: 'Default to allkeys-lru for pure caching clusters where any cached item can be safely re-fetched.'
  }
];
