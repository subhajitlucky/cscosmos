export interface SystemDesignTopic {
  id: string;
  title: string;
  category: 'distributed-data' | 'consensus' | 'availability' | 'caching-queues' | 'resilience' | 'scaling';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
}

export const SYSTEM_DESIGN_TOPICS: SystemDesignTopic[] = [
  {
    id: 'consistent-hashing-virtual-nodes',
    title: 'Consistent Hashing & Virtual Nodes (Dynamo Ring)',
    category: 'distributed-data',
    difficulty: 'Advanced',
    summary: 'Consistent Hashing maps both servers and data keys to a 2^32-1 hash ring. When a node is added or removed, only K/N keys are migrated (where K is total keys and N is servers), preventing cluster-wide cache invalidation.',
    mentalModel: 'The Carousel of Coat Checkers: Instead of re-assigning all 1,000 coats whenever 1 coat checker takes a lunch break, you place coat checkers evenly on a rotating carousel. Coats are handed to the next clockwise checker. If one leaves, only their coats shift to the neighbor.',
    codeSnippet: `class ConsistentHashRing {
  private ring: Map<number, string> = new Map();
  private sortedKeys: number[] = [];
  private vNodes: number = 100; // Virtual nodes per server

  addServer(server: string) {
    for (let i = 0; i < this.vNodes; i++) {
      const hash = this.hash(server + "#" + i);
      this.ring.set(hash, server);
      this.sortedKeys.push(hash);
    }
    this.sortedKeys.sort((a, b) => a - b);
  }

  getServer(key: string): string {
    const hash = this.hash(key);
    // Binary search (std::upper_bound) to find first node >= hash clockwise
    const idx = this.binarySearch(hash);
    return this.ring.get(this.sortedKeys[idx % this.sortedKeys.length])!;
  }
}`,
    takeaways: [
      'Minimal Key Migration: Only K/N keys move when scaling out or handling node failure, compared to ~100% in key % N modulo hashing.',
      'Virtual Nodes: Solves non-uniform key distribution and hot-spotting by mapping each physical server to 100+ virtual points across the ring.',
      'Used in production: Apache Cassandra, Amazon DynamoDB, Akamai CDN, Discord gateway routing.'
    ],
    commonPitfall: {
      mistake: 'Using naive hash(key) % N modulo routing in distributed caches; adding a single server causes 100% cache misses across the fleet (thundering herd).',
      fix: 'Always use Consistent Hashing with virtual nodes for distributed state and cache partitioning.'
    },
    nextTopicId: 'raft-consensus-leader-election'
  },
  {
    id: 'raft-consensus-leader-election',
    title: 'Raft Distributed Consensus & Quorum Log Replication',
    category: 'consensus',
    difficulty: 'Expert',
    summary: 'Raft provides fault-tolerant distributed consensus via Leader Election, Heartbeats, Log Replication, and strict Quorum Supermajority (N/2 + 1) voting, preventing split-brain states.',
    mentalModel: 'The Parliamentary Council: The council elects 1 Prime Minister (Leader). Every new law (Log Entry) proposed by the PM must be stamped and approved by a majority (3 out of 5 ministers) before becoming permanent law.',
    codeSnippet: `// Raft State Machine:
// Node States: Follower -> Candidate (Election Timeout) -> Leader (Majority Votes)
// Term: Monotonically increasing logical epoch number

// Heartbeat & AppendEntries RPC:
interface AppendEntriesRPC {
  term: number;         // Leader's current term
  leaderId: string;
  prevLogIndex: number; // Index of log entry immediately preceding new ones
  prevLogTerm: number;
  entries: LogEntry[];  // State machine commands to replicate
  leaderCommit: number; // Leader's commitIndex
}`,
    takeaways: [
      'Quorum Rule: An N-node cluster tolerates up to floor((N-1)/2) server failures (e.g. 5 nodes tolerate 2 failures).',
      'Leader Completeness: Any committed log entry is guaranteed to be present in all future leaders\' logs.',
      'Used in production: Kubernetes etcd, CockroachDB, HashiCorp Consul, Apache Kafka (KRaft).'
    ],
    commonPitfall: {
      mistake: 'Deploying even-numbered consensus clusters (e.g. 4 nodes); 4 nodes require 3 votes for quorum (tolerating only 1 failure—identical to a 3-node cluster).',
      fix: 'Always deploy odd numbers of nodes (3, 5, or 7) to maximize fault tolerance.'
    },
    nextTopicId: 'distributed-rate-limiting-token-bucket'
  },
  {
    id: 'distributed-rate-limiting-token-bucket',
    title: 'Distributed Rate Limiting: Token Bucket vs Sliding Window Counter',
    category: 'resilience',
    difficulty: 'Intermediate',
    summary: 'Rate limiters protect downstream services from cascading failure and abusive traffic. Sliding Window Counters combine boundary precision with O(1) memory overhead by interpolating previous window weight.',
    mentalModel: 'The Nightclub Bouncer: The Token Bucket bouncer adds 5 wristbands into a bowl every second. Guests take 1 wristband to enter. If a group of 10 arrives instantly, they consume the accumulated burst without waiting, as long as tokens exist.',
    codeSnippet: `// Sliding Window Counter Interpolation Formula:
// Current Request Count = Count(CurrentWindow) + Count(PreviousWindow) * (1 - CurrentWindowTimeElapsed / WindowSize)

// Redis Atomic Lua Script for Token Bucket:
const tokenBucketLua = \`
  local key = KEYS[1]
  local maxTokens = tonumber(ARGV[1])
  local refillRate = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])
  
  local data = redis.call('HMGET', key, 'tokens', 'lastRefill')
  local tokens = tonumber(data[1]) or maxTokens
  local lastRefill = tonumber(data[2]) or now
  
  -- Refill tokens based on elapsed time:
  local delta = math.max(0, now - lastRefill)
  tokens = math.min(maxTokens, tokens + delta * refillRate)
  
  if tokens >= 1 then
    tokens = tokens - 1
    redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', now)
    return 1 -- Allowed
  else
    return 0 -- Rate limited (HTTP 429)
  end
\`;`,
    takeaways: [
      'Token Bucket: Ideal for handling bursty traffic (allows sudden spikes up to capacity).',
      'Leaky Bucket: Enforces a strict, smoothed output processing rate (no bursts).',
      'Sliding Window Counter: Memory-efficient (stores 2 integer keys in Redis) and eliminates fixed-window 2x boundary spikes.'
    ],
    commonPitfall: {
      mistake: 'Using Fixed Window Counters (e.g. 100 req/min); an attacker sends 100 requests at 00:59 and 100 requests at 01:01, pushing 200 req in 2 seconds.',
      fix: 'Use Sliding Window Counter or Token Bucket in Redis via atomic Lua scripts.'
    },
    nextTopicId: 'cap-theorem-pacelc'
  },
  {
    id: 'cap-theorem-pacelc',
    title: 'CAP Theorem & PACELC Tradeoffs in Distributed Databases',
    category: 'availability',
    difficulty: 'Advanced',
    summary: 'The CAP Theorem states that in the presence of a Network Partition (P), a distributed system must choose between Consistency (C) or Availability (A). PACELC extends this to normal operating conditions (Latency vs Consistency).',
    mentalModel: 'The Bank Branch Phone Line Cut: If the phone line between the New York and London bank branches is severed (Partition), the bank can either reject transactions to guarantee identical balances (CP), or allow both branches to accept deposits independently and sync later (AP).',
    codeSnippet: `// PACELC Taxonomy:
// If Partition (P): choose Availability (A) or Consistency (C)
// Else (E): choose Latency (L) or Consistency (C)

// Systems Mapping:
// 1. DynamoDB / Cassandra: PA/EL (High availability on partition, Low latency normally)
// 2. MongoDB / HBase:      PC/EC (Strong consistency always, rejects writes on partition)
// 3. Spanner / Cockroach:  PC/EC with TrueTime Atomic Clocks`,
    takeaways: [
      'Partitions Are Inevitable: In real-world networks (cables cut, switch failure), P is non-negotiable; architects can only choose between C and A.',
      'Linearizability (CP): Every read returns the most recent write, but requests fail if a partition isolates a replica.',
      'Eventual Consistency (AP): All reads return immediately, but replicas may serve stale data until convergence.'
    ],
    commonPitfall: {
      mistake: 'Claiming a system is "CA" (Consistent and Available); network partitions are a physical reality of distributed infrastructure, making "CA" mathematically impossible across networks.',
      fix: 'Design distributed architectures acknowledging network partitions and choosing CP or AP deliberately.'
    },
    nextTopicId: 'database-sharding-wal'
  },
  {
    id: 'database-sharding-wal',
    title: 'Database Sharding, Partition Keys & Write-Ahead Logging (WAL)',
    category: 'distributed-data',
    difficulty: 'Expert',
    summary: 'Sharding horizontally splits huge database tables across independent physical database servers using a Shard Key. Write-Ahead Logs (WAL) append sequential disk writes before mutating in-memory buffers to guarantee ACID durability.',
    mentalModel: 'The Multi-Volume Encyclopedia: Instead of binding 1,000,000 pages into 1 gargantuan book that crushes the table (vertical scaling limit), you divide the encyclopedia into 26 alphabetical volumes A-Z (horizontal sharding).',
    codeSnippet: `// Shard Key Routing Hash:
function getShardServer(userId: string, shardClusters: string[]): string {
  const hash = murmurHash3(userId);
  const shardId = hash % shardClusters.length;
  return shardClusters[shardId];
}

// Write-Ahead Log (WAL) Crash Recovery Invariant:
// 1. Transaction starts
// 2. Append { txId, key, oldVal, newVal } to WAL sequential disk file (fsync)
// 3. Update in-memory B+ Tree / MemTable buffer
// 4. Return success to client! (If power cuts here, WAL replays state on reboot).`,
    takeaways: [
      'Shard Key Selection: Must have high cardinality and uniform query distribution to prevent celebrity hot-spot shards.',
      'WAL Sequential IO: Appending to an append-only log file on NVMe disk is orders of magnitude faster than random B+ Tree disk page mutations.',
      'Re-sharding: Requires dual-writing, background data backfill, and dynamic routing updates.'
    ],
    commonPitfall: {
      mistake: 'Choosing a timestamp (e.g. created_at) as a shard key, which routes 100% of current write traffic to the single most recent shard (hot-spotting).',
      fix: 'Use a high-cardinality, uniformly distributed hash of UUIDs or user IDs combined with range lookup routing.'
    },
    nextTopicId: 'caching-strategies-cache-stampede'
  },
  {
    id: 'caching-strategies-cache-stampede',
    title: 'Caching Strategies & Thundering Herd (Cache Stampede) Defense',
    category: 'caching-queues',
    difficulty: 'Advanced',
    summary: 'Caching patterns (Cache-Aside, Write-Through, Write-Behind) optimize latency. Cache Stampedes occur when high-traffic keys expire, causing 10,000 concurrent database queries; resolved via Distributed Mutexes or Probabilistic Early Expiration (XFetch).',
    mentalModel: 'The Supermarket Free Samples Table: When the sample plate empties, 500 shoppers do not all rush into the kitchen at once; one store clerk locks the kitchen door, prepares a fresh tray, and restocks the table.',
    codeSnippet: `// XFetch Algorithm (Probabilistic Early Expiration):
// Recompute cache in background if: -beta * delta * ln(random()) > (expiry - now)
function shouldRecomputeEarly(expiry: number, delta: number, beta: number = 1.0): boolean {
  const now = Date.now();
  const timeRemaining = expiry - now;
  const probabilisticThreshold = -beta * delta * Math.log(Math.random());
  return probabilisticThreshold > timeRemaining;
}`,
    takeaways: [
      'Cache-Aside (Lazy Loading): Application reads cache first; on miss, queries DB and populates cache.',
      'Write-Through: Writes data to cache and database synchronously.',
      'Write-Behind (Write-Back): Writes to cache immediately and flushes to database asynchronously in batches.',
      'Thundering Herd Defense: Use Redis distributed locks (Redlock) or Probabilistic Early Expiration (XFetch).'
    ],
    commonPitfall: {
      mistake: 'Setting identical fixed TTLs (e.g. exactly 3600 seconds) on 1,000,000 cached records, causing simultaneous mass expiration and database collapse.',
      fix: 'Add random jitter to TTLs: TTL = baseTTL + random(0, 300).'
    },
    nextTopicId: 'message-queues-kafka-pubsub'
  },
  {
    id: 'message-queues-kafka-pubsub',
    title: 'Message Queues: Kafka Partitions, Consumer Groups & DLQ',
    category: 'caching-queues',
    difficulty: 'Advanced',
    summary: 'Distributed message queues (Kafka, RabbitMQ, SQS) decouple microservices. Kafka uses partitioned append-only commit logs where consumer groups maintain offset pointers, supporting millions of events/sec.',
    mentalModel: 'The Assembly Line Conveyor Belts: 4 parallel conveyor belts (Partitions). 4 workers (Consumer Group) each monitor 1 belt. Each worker has a clicker counter (Offset) remembering which box they processed last.',
    codeSnippet: `// Kafka Consumer Group Architecture:
// Topic: "orders" (4 Partitions: P0, P1, P2, P3)
// Consumer Group: "payment-service" (4 Instances: C0 -> P0, C1 -> P1, C2 -> P2, C3 -> P3)

// Dead-Letter Queue (DLQ) Retry Policy:
async function processMessage(msg: Message) {
  try {
    await handlePayment(msg);
    await commitOffset(msg.offset);
  } catch (err) {
    if (msg.retryCount < 3) {
      await publishWithDelay(msg, Math.pow(2, msg.retryCount) * 1000);
    } else {
      await routeToDLQ(msg); // Dead-Letter Queue for manual engineering review
      await commitOffset(msg.offset);
    }
  }
}`,
    takeaways: [
      'Strict Ordering Within Partition: Kafka guarantees message ordering within a single partition, but not across partitions.',
      'Consumer Rebalancing: If an instance crashes, its assigned partition is reallocated to remaining group consumers.',
      'Dead-Letter Queue (DLQ): Isolates poisonous or malformed payloads from blocking the entire event stream.'
    ],
    commonPitfall: {
      mistake: 'Having more consumers in a group than partitions in a Kafka topic; idle consumers will sit completely dormant doing zero work.',
      fix: 'Scale topic partition count to match maximum desired consumer parallelism.'
    },
    nextTopicId: 'microservices-circuit-breaker-bulkhead'
  },
  {
    id: 'microservices-circuit-breaker-bulkhead',
    title: 'Fault Tolerance: Circuit Breaker, Bulkhead & Exponential Backoff',
    category: 'resilience',
    difficulty: 'Advanced',
    summary: 'Microservice architectures prevent cascading death spirals using Circuit Breakers (Closed -> Open -> Half-Open), Bulkhead Thread Isolation, and Exponential Backoff with Random Jitter.',
    mentalModel: 'The Submarine Watertight Doors (Bulkheads): If torpedo shrapnel floods Compartment 3, the submarine closes the bulkhead doors to isolate the leak, keeping the other 9 compartments dry and the ship floating.',
    codeSnippet: `// Circuit Breaker State Machine:
class CircuitBreaker {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  failureCount = 0;
  failureThreshold = 5;
  resetTimeoutMs = 10000;
  lastFailureTime = 0;

  async call(fn: () => Promise<any>) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('CircuitBreaker: OPEN (Fast Fail)');
      }
    }
    try {
      const res = await fn();
      this.reset();
      return res;
    } catch (err) {
      this.recordFailure();
      throw err;
    }
  }
}`,
    takeaways: [
      'Circuit Breaker (Fast Fail): Stops sending requests to broken downstream dependencies, preventing thread pool starvation.',
      'Bulkhead Isolation: Partitions thread pools so a failing recommendation service cannot consume all API Gateway threads.',
      'Exponential Backoff + Full Jitter: Sleep = random(0, min(maxBackoff, base * 2^attempt)).'
    ],
    commonPitfall: {
      mistake: 'Retrying failed network calls immediately in a tight loop across thousands of clients, instantly taking down a recovering backend.',
      fix: 'Always use Exponential Backoff with randomized full jitter on retries.'
    }
  }
];
