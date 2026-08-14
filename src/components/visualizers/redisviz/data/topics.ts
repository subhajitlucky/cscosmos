export interface RedisTopic {
  id: string;
  title: string;
  category: 'foundations' | 'data-structures' | 'caching' | 'internals' | 'scale';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
}

export const REDIS_TOPICS: RedisTopic[] = [
  {
    id: 'what-is-redis',
    title: 'What is Redis? (In-Memory Key-Value & Single-Threaded Event Loop)',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Redis (Remote Dictionary Server) is an open-source, ultra-fast in-memory data structure store used as a database, cache, message broker, and streaming engine.',
    mentalModel: 'The Master Chef in a Small Kitchen: One world-class chef (single thread) handles orders sequentially with zero lock contention or mutex overhead, operating at lightning RAM speed (sub-millisecond latency).',
    codeSnippet: `# Basic Key-Value Operations:
SET user:1000 '{"name": "Alice", "role": "admin"}' EX 3600
GET user:1000

# Atomic Counters:
INCR page:views:homepage
INCRBY user:1000:credits 50

# Key existence & TTL:
EXISTS user:1000
TTL user:1000`,
    takeaways: [
      'In-memory RAM execution delivers 100,000+ operations per second per core with sub-millisecond latencies.',
      'Single-threaded I/O multiplexing (epoll/kqueue) eliminates race conditions, thread deadlocks, and context-switching overhead.',
      'Rich native data structures (Lists, Hashes, Sets, Sorted Sets, Streams) perform work on the server without client roundtrips.'
    ],
    commonPitfall: {
      mistake: 'Running long O(N) blocking commands (e.g. KEYS * or FLUSHALL) on a production cluster, freezing the single thread for seconds.',
      fix: 'Use SCAN instead of KEYS * to incrementally iterate over keys without blocking the event loop.'
    },
    nextTopicId: 'sds-strings'
  },
  {
    id: 'sds-strings',
    title: 'Simple Dynamic Strings (SDS) vs C Strings',
    category: 'data-structures',
    difficulty: 'Intermediate',
    summary: 'Redis replaces standard null-terminated C strings with SDS (Simple Dynamic Strings), storing explicit length headers, allocated capacity, and pre-allocation buffers.',
    mentalModel: 'The Elastic Tape Measure: Instead of walking the entire length of a fence every time to measure it (O(N) strlen in C), the tape measure has a digital screen at the handle showing exact length in O(1).',
    codeSnippet: `// Internal SDS Structure (simplified):
struct sdshdr {
  uint32_t len;   // Exact length of string (O(1) lookup, no null-byte scan)
  uint32_t alloc; // Total allocated memory buffer
  unsigned char flags; // Header type (sdshdr8, sdshdr16, sdshdr32)
  char buf[];     // Raw byte payload (binary safe, can contain \\0)
};

// Redis Commands:
SET key "Hello"
APPEND key " World" # Uses pre-allocated spare capacity, avoiding realloc!
STRLEN key          # Instant O(1) response`,
    takeaways: [
      'O(1) string length lookup: strlen takes O(1) time because len is stored explicitly in the header.',
      'Binary Safe: Can store arbitrary binary data (images, compressed protobufs, raw bytes) containing null characters \\0.',
      'Space Pre-allocation & Lazy Deallocation reduce expensive OS memory reallocation syscalls.'
    ],
    commonPitfall: {
      mistake: 'Storing massive multi-megabyte JSON blobs inside a single string key, causing memory fragmentation during updates.',
      fix: 'Use Redis Hashes (HSET) or compression (gzip/lz4) before saving large payloads.'
    },
    nextTopicId: 'hashes-ziplist-dict'
  },
  {
    id: 'hashes-ziplist-dict',
    title: 'Hashes: ZipList vs Dict & Incremental Rehashing',
    category: 'data-structures',
    difficulty: 'Intermediate',
    summary: 'Redis Hashes map string fields to string values. Small hashes use compact ZipLists / Listpacks to save RAM; large hashes automatically upgrade to full Hash Tables with incremental rehashing.',
    mentalModel: 'The Accordion Wallet: A compact slim cardholder (ZipList) when you only carry 3 cards. When you add 50 receipts, it seamlessly expands into a multi-drawer filing cabinet (Dict).',
    codeSnippet: `# Hash creation and manipulation:
HSET user:42 name "Bob" email "bob@test.com" age 30
HGET user:42 email
HINCRBY user:42 age 1

# Batch fetch all fields:
HGETALL user:42

# Memory encoding check:
OBJECT ENCODING user:42 # Returns "listpack" for small hashes, "hashtable" for large`,
    takeaways: [
      'Small Hashes (under hash-max-listpack-entries: 128) use contiguous memory listpacks, slashing RAM overhead by up to 80%.',
      'Incremental Rehashing migrates bucket entries gradually during read/write queries without freezing the server.',
      'Ideal for representing objects, user sessions, and database row models.'
    ],
    commonPitfall: {
      mistake: 'Using HGETALL on hashes containing 50,000+ fields in high-traffic endpoints, choking network bandwidth.',
      fix: 'Use HSCAN or targeted HMGET to fetch only necessary object attributes.'
    },
    nextTopicId: 'lists-quicklist'
  },
  {
    id: 'lists-quicklist',
    title: 'Lists & QuickList (Doubly-Linked Listpacks)',
    category: 'data-structures',
    difficulty: 'Intermediate',
    summary: 'Redis Lists are ordered collections of strings backed by QuickList—a hybrid doubly-linked list of compact memory Listpacks.',
    mentalModel: 'The Freight Train: Each train car is a compact container (Listpack) holding multiple boxes, connected together by couplers (pointers) to maximize cargo density.',
    codeSnippet: `# Push to head and tail:
LPUSH queue:tasks "task_1"
LPUSH queue:tasks "task_2"
RPUSH queue:tasks "task_3"

# Pop operations:
RPOP queue:tasks # Returns "task_3" (FIFO Queue)
LPOP queue:tasks # Returns "task_2" (LIFO Stack)

# Blocking queue worker (waits up to 5s):
BRPOP queue:tasks 5`,
    takeaways: [
      'LPUSH and RPOP provide O(1) constant time insertions and removals at list boundaries.',
      'QuickList solves memory fragmentation by grouping items into contiguous chunks with optional LZF compression.',
      'Blocking commands (BLPOP, BRPOP) form the backbone of simple distributed job queues.'
    ],
    commonPitfall: {
      mistake: 'Using LINDEX or LRANGE with large offsets (LRANGE 0 100000) which takes O(N) traversal time.',
      fix: 'Keep list sizes bounded using LTRIM to enforce fixed-length sliding windows.'
    },
    nextTopicId: 'sets-intset-hashtable'
  },
  {
    id: 'sets-intset-hashtable',
    title: 'Sets: IntSets, Hash Tables & O(1) Membership',
    category: 'data-structures',
    difficulty: 'Intermediate',
    summary: 'Redis Sets are unordered collections of unique strings supporting instant O(1) membership checks, unions, intersections, and differences.',
    mentalModel: 'The VIP Guestlist: The bouncer glances at the alphabetical clipboard in O(1) time to confirm if a guest is allowed, rejecting duplicate names automatically.',
    codeSnippet: `# Adding unique members:
SADD user:100:tags "developer" "golang" "typescript" "redis"
SADD user:100:tags "golang" # Duplicate ignored, returns 0

# Membership test:
SISMEMBER user:100:tags "redis" # Returns 1 (true) in O(1)

# Set intersections (Common tags between two users):
SADD user:200:tags "golang" "python" "redis"
SINTER user:100:tags user:200:tags # Returns ["golang", "redis"]`,
    takeaways: [
      'IntSet encoding automatically stores 16/32/64-bit integers in contiguous sorted arrays with minimal memory.',
      'Supports powerful set operations: SUNION, SINTER, and SDIFF on the server side.',
      'Ideal for unique visitor tracking, tagging systems, and relationship graphs (followers/following).'
    ],
    commonPitfall: {
      mistake: 'Running SINTER on sets with millions of members synchronously, blocking the main thread.',
      fix: 'Use SINTERSTORE to compute intersections asynchronously into a target destination key.'
    },
    nextTopicId: 'sorted-sets-skiplist'
  },
  {
    id: 'sorted-sets-skiplist',
    title: 'Sorted Sets (ZSET) & SkipList Multi-Level Indexing',
    category: 'data-structures',
    difficulty: 'Advanced',
    summary: 'Sorted Sets map members to floating-point scores. Backed by a SkipList + Hash Table, they provide O(log N) insertions, removals, and range queries.',
    mentalModel: 'The Multi-Tier Express Train: The local train stops at every station (Level 0), while express trains skip 4 stations (Level 1) or 16 stations (Level 2) to reach distant scores instantly in O(log N).',
    codeSnippet: `# Gaming Leaderboard:
ZADD leaderboard 1500 "Player_Alice"
ZADD leaderboard 2400 "Player_Bob"
ZADD leaderboard 1850 "Player_Charlie"

# Top 3 High Scores (highest to lowest):
ZREVRANGE leaderboard 0 2 WITHSCORES

# Get specific player rank & score:
ZREVRANK leaderboard "Player_Alice"
ZSCORE leaderboard "Player_Alice"

# Range query by score:
ZRANGEBYSCORE leaderboard 1500 2000`,
    takeaways: [
      'Dual Data Structure: Hash Table provides O(1) score lookup; SkipList provides O(log N) range ranking.',
      'SkipLists avoid the rebalancing overhead of Red-Black / AVL trees using randomized geometric heights.',
      'Perfect for real-time leaderboards, rate limiters (sliding window), and delayed task scheduling.'
    ],
    commonPitfall: {
      mistake: 'Using string timestamps as scores instead of epoch numbers, causing lexicographical sort bugs.',
      fix: 'Use millisecond unix timestamps (e.g. 1718000000000) for time-based ZSET scheduling.'
    },
    nextTopicId: 'cache-aside-strategy'
  },
  {
    id: 'cache-aside-strategy',
    title: 'Cache-Aside Pattern & Lazy Loading',
    category: 'caching',
    difficulty: 'Intermediate',
    summary: 'The most popular caching pattern: application reads from Redis first; on cache miss, reads from database, updates Redis, and returns.',
    mentalModel: 'The Study Desk: You check your desk surface (Redis) for your notebook. If it is not there (cache miss), you walk to the basement bookshelf (PostgreSQL), copy it to your desk, and continue working.',
    codeSnippet: `// Cache-Aside Implementation (Node/TypeScript):
async function getUser(id: string): Promise<User> {
  const cacheKey = \`user:\${id}\`;
  
  // 1. Check Redis Cache:
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached); // Cache Hit! (0.5ms)
  }

  // 2. Cache Miss: Query SQL DB
  const user = await db.users.findById(id);

  // 3. Populate Redis with TTL (e.g. 1 hour):
  await redis.set(cacheKey, JSON.stringify(user), 'EX', 3600);

  return user;
}`,
    takeaways: [
      'Resilient to cache outages: if Redis crashes, the application falls back directly to the primary database.',
      'Data is only cached when requested (lazy loading), avoiding wasteful pre-caching of unused data.',
      'Requires explicit cache invalidation or TTL to prevent stale reads when DB updates occur.'
    ],
    commonPitfall: {
      mistake: 'Updating the database and forgetting to delete/invalidate the matching Redis cache key.',
      fix: 'Always execute redis.del(cacheKey) immediately after successful DB transactions.'
    },
    nextTopicId: 'eviction-policies-lru-lfu'
  },
  {
    id: 'eviction-policies-lru-lfu',
    title: 'Memory Eviction Policies (LRU vs LFU vs TTL)',
    category: 'caching',
    difficulty: 'Advanced',
    summary: 'When maxmemory is reached, Redis reclaims RAM by evicting keys according to configured policies (allkeys-lru, volatile-lru, allkeys-lfu, volatile-ttl).',
    mentalModel: 'The Closet Cleanout: LRU throws away clothes you haven’t worn in 6 months; LFU throws away clothes you only wore once; TTL throws away expiring milk cartons.',
    codeSnippet: `# redis.conf configuration:
maxmemory 4gb
maxmemory-policy allkeys-lru

# Available Eviction Policies:
# 1. noeviction: Return OOM error on writes when full
# 2. allkeys-lru: Evict least recently used keys across all keys
# 3. volatile-lru: Evict LRU keys with an explicit expiration (TTL) set
# 4. allkeys-lfu: Evict least frequently used keys (access frequency counter)
# 5. volatile-ttl: Evict keys with the shortest remaining TTL first`,
    takeaways: [
      'Redis uses Approximated LRU/LFU (sampling 5 keys by default) to save memory rather than tracking true linked list pointers.',
      'Use allkeys-lru when key popularity follows a power-law distribution (80/20 rule).',
      'Use allkeys-lfu when recent bursts should not displace consistently popular items.'
    ],
    commonPitfall: {
      mistake: 'Using volatile-lru while forgetting to set TTLs on keys, causing Redis to crash with Out-Of-Memory errors.',
      fix: 'Use allkeys-lru for general caching clusters, or ensure all written keys have EX expiration.'
    },
    nextTopicId: 'rdb-persistence'
  },
  {
    id: 'rdb-persistence',
    title: 'RDB Persistence (Snapshots & Copy-on-Write)',
    category: 'internals',
    difficulty: 'Advanced',
    summary: 'RDB produces point-in-time binary snapshots (dump.rdb) of your dataset at specified intervals using Linux fork() and Copy-on-Write (COW).',
    mentalModel: 'The Photograph: The camera takes an instantaneous snapshot of the room without freezing the party, saving a compact JPEG file to the hard drive.',
    codeSnippet: `# redis.conf RDB Snapshot rules:
save 900 1   # Snapshot if 1 key changed in 15 mins
save 300 10  # Snapshot if 10 keys changed in 5 mins
save 60 10000 # Snapshot if 10,000 keys changed in 1 min

# Trigger background snapshot manually:
BGSAVE

# Last save timestamp:
LASTSAVE`,
    takeaways: [
      'RDB creates compact, compressed binary dumps perfect for offsite S3 backups and disaster recovery.',
      'Fast startup: Redis loads RDB files into memory much faster than replaying millions of AOF command lines.',
      'Potential data loss: If server crashes between snapshot intervals, changes since the last snapshot are lost.'
    ],
    commonPitfall: {
      mistake: 'Running BGSAVE on a memory-saturated server without swap, causing Linux OOM killer to terminate Redis.',
      fix: 'Set vm.overcommit_memory = 1 in Linux sysctl to allow fork() Copy-on-Write allocation.'
    },
    nextTopicId: 'aof-persistence'
  },
  {
    id: 'aof-persistence',
    title: 'AOF Persistence (Append Only File & Fsync Policies)',
    category: 'internals',
    difficulty: 'Advanced',
    summary: 'AOF logs every write command received by the server to disk. Upon restart, Redis replays the log to reconstruct the complete state with zero or 1s data loss.',
    mentalModel: 'The Accounting Ledger: Every transaction is recorded line-by-line in ink on a physical ledger book as soon as money changes hands.',
    codeSnippet: `# redis.conf AOF Settings:
appendonly yes
appendfilename "appendonly.aof"

# Fsync Disk Policies:
# appendfsync always   - Fsync on every single write (Safest, Slowest)
# appendfsync everysec - Fsync once per second (Recommended, 1s max loss)
# appendfsync no       - Let OS buffer flushes (Fastest, Unsafe)

# Trigger AOF Rewrite (compresses log size):
BGREWRITEAOF`,
    takeaways: [
      'appendfsync everysec offers the best balance: fantastic write performance with at most 1 second of lost data on crash.',
      'AOF Rewriting (BGREWRITEAOF) compacts the log in the background by writing current memory state rather than historical mutations.',
      'Combine RDB + AOF for maximum durability (AOF for zero data loss, RDB for fast disaster recovery).'
    ],
    commonPitfall: {
      mistake: 'Setting appendfsync always on standard magnetic spinning disks, bottlenecking writes to 200 ops/sec.',
      fix: 'Default to appendfsync everysec for SSD/NVMe high-throughput workloads.'
    },
    nextTopicId: 'pub-sub-messaging'
  },
  {
    id: 'pub-sub-messaging',
    title: 'Pub/Sub Messaging & Event Broadcasting',
    category: 'scale',
    difficulty: 'Intermediate',
    summary: 'Redis Pub/Sub decouples publishers and subscribers: publishers broadcast messages to named channels, delivering instantaneously to all active listeners.',
    mentalModel: 'The Radio Station: The radio station broadcasts music to channel FM 101.1. Any car radio tuned in hears the song; cars not tuned in miss the broadcast.',
    codeSnippet: `# Subscriber 1 (Terminal A):
SUBSCRIBE notifications:orders
# Output: Reading messages...

# Pattern Subscriber (Wildcard):
PSUBSCRIBE notifications:*

# Publisher (Terminal B):
PUBLISH notifications:orders '{"orderId": 9821, "status": "PAID"}'
# (integer) 1 (delivered to 1 subscriber)`,
    takeaways: [
      'At-most-once delivery: Messages are ephemeral and NOT stored; if a subscriber is offline, the message is lost.',
      'Pattern subscriptions (PSUBSCRIBE) allow listening to wildcard channels like events:users:*',
      'Ultra-lightweight: Great for chat rooms, live dashboard notifications, and cache invalidation signals across microservices.'
    ],
    commonPitfall: {
      mistake: 'Using Pub/Sub for critical billing or payment tasks where dropped messages cause data loss.',
      fix: 'Use Redis Streams (XADD) or Kafka when message persistence and delivery acknowledgments are required.'
    },
    nextTopicId: 'redis-streams-consumer-groups'
  },
  {
    id: 'redis-streams-consumer-groups',
    title: 'Redis Streams & Consumer Groups',
    category: 'scale',
    difficulty: 'Expert',
    summary: 'Redis Streams (XADD, XREAD, XREADGROUP) provide a persistent, append-only log with consumer groups, message acknowledgment (XACK), and pending entry lists (PEL).',
    mentalModel: 'The Airport Baggage Carousel: Bags (messages) are placed onto the conveyor belt with unique IDs. Handlers (Consumer Group workers) pick bags, scan them (XACK), and return unhandled bags to the queue.',
    codeSnippet: `# 1. Add message to stream:
XADD orders:stream * user_id 1001 total 89.99

# 2. Create consumer group:
XGROUP CREATE orders:stream order_workers $ MKSTREAM

# 3. Consumer reads 1 message:
XREADGROUP GROUP order_workers worker_1 COUNT 1 BLOCK 2000 STREAMS orders:stream >

# 4. Acknowledge message processing:
XACK orders:stream order_workers "1718000000000-0"`,
    takeaways: [
      'Persistent log: Messages remain in the stream until explicitly deleted or trimmed with MAXLEN.',
      'Consumer groups allow distributing messages across multiple worker instances for horizontal scaling.',
      'Pending Entries List (PEL) tracks unacknowledged messages for automatic retry after worker failure (XCLAIM).'
    ],
    commonPitfall: {
      mistake: 'Failing to execute XACK after processing, causing the Pending Entries List (PEL) to grow indefinitely and consume RAM.',
      fix: 'Always acknowledge messages with XACK or inspect stuck entries with XPENDING.'
    }
  }
];
