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
    codeSnippet: `interface AppendEntriesRPC {
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
    codeSnippet: `// Redis Atomic Lua Script for Token Bucket:
const tokenBucketLua = \`
  local key = KEYS[1]
  local maxTokens = tonumber(ARGV[1])
  local refillRate = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])
  
  local data = redis.call('HMGET', key, 'tokens', 'lastRefill')
  local tokens = tonumber(data[1]) or maxTokens
  local lastRefill = tonumber(data[2]) or now
  
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
    codeSnippet: `// PACELC Mapping:
// 1. DynamoDB / Cassandra: PA/EL (High availability on partition, Low latency normally)
// 2. MongoDB / HBase:      PC/EC (Strong consistency always, rejects writes on partition)
// 3. Spanner / Cockroach:  PC/EC with TrueTime Atomic Clocks`,
    takeaways: [
      'Partitions Are Inevitable: In real-world networks (cables cut, switch failure), P is non-negotiable; architects can only choose between C and A.',
      'Linearizability (CP): Every read returns the most recent write, but requests fail if a partition isolates a replica.',
      'Eventual Consistency (AP): All reads return immediately, but replicas may serve stale data until convergence.'
    ],
    commonPitfall: {
      mistake: 'Claiming a system is "CA" (Consistent and Available); network partitions are a physical reality of distributed infrastructure.',
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
    mentalModel: 'The Multi-Volume Encyclopedia: Instead of binding 1,000,000 pages into 1 gargantuan book that crushes the table, you divide the encyclopedia into 26 alphabetical volumes A-Z (horizontal sharding).',
    codeSnippet: `function getShardServer(userId: string, shardClusters: string[]): string {
  const hash = murmurHash3(userId);
  const shardId = hash % shardClusters.length;
  return shardClusters[shardId];
}`,
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
    codeSnippet: `function shouldRecomputeEarly(expiry: number, delta: number, beta: number = 1.0): boolean {
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
    codeSnippet: `async function processMessage(msg: Message) {
  try {
    await handlePayment(msg);
    await commitOffset(msg.offset);
  } catch (err) {
    if (msg.retryCount < 3) {
      await publishWithDelay(msg, Math.pow(2, msg.retryCount) * 1000);
    } else {
      await routeToDLQ(msg); // Dead-Letter Queue
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
    codeSnippet: `class CircuitBreaker {
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
    },
    nextTopicId: 'database-replication-lag-split-brain'
  },
  {
    id: 'database-replication-lag-split-brain',
    title: 'Database Replication: Read Replicas, Replication Lag & Split-Brain',
    category: 'distributed-data',
    difficulty: 'Intermediate',
    summary: 'Primary-Replica database topologies scale read throughput by offloading queries to asynchronous read replicas. Replication lag introduces read-your-own-writes inconsistencies, requiring sticky sessions or primary reads.',
    mentalModel: 'The Photocopy Bulletin Board: The manager writes a new schedule on the master board (Primary). Assistants photocopy it for the hallways (Replicas). If an employee walks into the hallway 3 seconds later, the photocopy may still show yesterday\'s schedule.',
    codeSnippet: `// Read-Your-Own-Writes Pattern:
async function getUserProfile(userId: string) {
  const lastWriteTime = await redis.get(\`user:\${userId}:last_write\`);
  if (lastWriteTime && Date.now() - Number(lastWriteTime) < 5000) {
    // Write occurred recently; route read to Primary DB to avoid replication lag!
    return primaryDB.query('SELECT * FROM users WHERE id = ?', [userId]);
  }
  return replicaDB.query('SELECT * FROM users WHERE id = ?', [userId]);
}`,
    takeaways: [
      'Asynchronous Replication: High write performance, but replicas can fall behind by hundreds of milliseconds.',
      'Semi-Synchronous Replication: Primary waits for at least 1 replica to acknowledge before returning success to client.'
    ],
    commonPitfall: {
      mistake: 'Reading from a read replica immediately after a user profile update, displaying stale old data to the user.',
      fix: 'Route reads to Primary DB for 5 seconds after a user write (Read-Your-Own-Writes consistency).'
    },
    nextTopicId: 'distributed-transactions-two-phase-saga'
  },
  {
    id: 'distributed-transactions-two-phase-saga',
    title: 'Distributed Transactions: 2-Phase Commit (2PC) vs Saga Pattern',
    category: 'distributed-data',
    difficulty: 'Expert',
    summary: '2-Phase Commit (Prepare -> Commit) guarantees ACID consistency across microservices but suffers from blocking coordinator bottlenecks. The Saga Pattern uses asynchronous choreography or orchestration with compensating transactions.',
    mentalModel: 'The Wedding Booking Saga: You reserve the flight, book the hotel, and rent the car. If the car rental fails, the Saga triggers compensating actions: cancel hotel booking and refund flight ticket.',
    codeSnippet: `// Saga Orchestrator Pattern:
// 1. OrderService: Create Pending Order -> Success
// 2. PaymentService: Charge Credit Card -> Success
// 3. InventoryService: Reserve Items -> FAILED!
// 4. Compensating Action: PaymentService.refund() -> OrderService.cancel()`,
    takeaways: [
      '2PC Blocking Problem: If the coordinator crashes during the Commit phase, all participant databases remain locked indefinitely.',
      'Sagas Tradeoff: Eventual consistency with compensation rather than synchronous distributed ACID locks.'
    ],
    commonPitfall: {
      mistake: 'Attempting to use distributed 2PC locking across dozens of independent microservices.',
      fix: 'Use Saga Orchestrators with idempotent compensating transactions.'
    },
    nextTopicId: 'load-balancing-l4-l7-algorithms'
  },
  {
    id: 'load-balancing-l4-l7-algorithms',
    title: 'Load Balancing: Layer-4 vs Layer-7 & Routing Algorithms',
    category: 'scaling',
    difficulty: 'Intermediate',
    summary: 'Layer-4 load balancers (IP/TCP port level, e.g. AWS NLB, IPVS) route millions of raw packets with microsecond latency. Layer-7 load balancers (HTTP/gRPC header inspection, e.g. NGINX, Envoy) route based on path, cookies, and TLS SNI.',
    mentalModel: 'The Post Office vs The Mail Sorting Clerk: Layer-4 is the postal truck driver who only looks at the zip code on the outside envelope. Layer-7 is the clerk who opens the letter, reads the recipient department name, and routes it to billing or support.',
    codeSnippet: `// NGINX Layer-7 Routing:
// location /api/v1/orders { proxy_pass http://order_cluster; }
// location /api/v1/users  { proxy_pass http://user_cluster; }`,
    takeaways: [
      'Layer-4 (Transport): Extremely high throughput (10M+ PPS), zero payload inspection, terminates TCP connections.',
      'Layer-7 (Application): Intelligent path routing, SSL/TLS termination, rate limiting, and sticky session cookies.'
    ],
    commonPitfall: {
      mistake: 'Using Round-Robin on long-lived WebSocket or gRPC HTTP/2 streams, resulting in severe server load imbalances.',
      fix: 'Use Least-Connections or Resource-Based load balancing for long-lived persistent streams.'
    },
    nextTopicId: 'reverse-proxy-api-gateway-service-mesh'
  },
  {
    id: 'reverse-proxy-api-gateway-service-mesh',
    title: 'API Gateways & Service Mesh: North-South vs East-West Traffic',
    category: 'scaling',
    difficulty: 'Advanced',
    summary: 'API Gateways (Kong, Envoy, AWS API Gateway) manage North-South external client traffic (auth, rate limiting, TLS). Service Meshes (Istio, Linkerd) manage East-West internal microservice-to-microservice traffic with mTLS sidecars.',
    mentalModel: 'The Airport Border Security vs Domestic Gate Shuttles: The API Gateway is the international customs border checkpoint (North-South). The Service Mesh is the secure automated tram system connecting domestic airport terminals (East-West).',
    codeSnippet: `// Service Mesh Sidecar Proxy (Envoy):
// App Container -> localhost:15001 -> Envoy Sidecar (mTLS Encryption) -> Network -> Envoy Sidecar -> Target App`,
    takeaways: [
      'North-South: Traffic entering from public internet into private VPC cluster.',
      'East-West: Inter-service communication between Kubernetes Pods in the same cluster.',
      'mTLS: Mutual TLS authentication automatically applied to every internal RPC call by sidecar proxies.'
    ],
    commonPitfall: {
      mistake: 'Adding heavy authentication JWT signature verification logic inside every individual microservice.',
      fix: 'Offload authentication, rate limiting, and TLS termination to the centralized API Gateway.'
    },
    nextTopicId: 'event-sourcing-cqrs-architecture'
  },
  {
    id: 'event-sourcing-cqrs-architecture',
    title: 'Event Sourcing & CQRS (Command Query Responsibility Segregation)',
    category: 'distributed-data',
    difficulty: 'Expert',
    summary: 'Event Sourcing stores state as an immutable sequence of domain events rather than current state snapshots. CQRS splits the write model (optimized for validation) from the read model (optimized for denormalized queries).',
    mentalModel: 'The Accountant\'s Transaction Ledger vs Bank Account Balance: The database does not just store "Balance = $100". It stores: +$500 Deposit, -$300 Rent, -$100 Groceries. You can rewind or replay history to any millisecond in time.',
    codeSnippet: `// Event Store:
// 1. AccountCreated { accountId: "acc_1", balance: 0 }
// 2. MoneyDeposited { accountId: "acc_1", amount: 500 }
// 3. MoneyWithdrawn { accountId: "acc_1", amount: 100 }
// Current State (Replayed) = $400`,
    takeaways: [
      'Complete Audit Trail: Impossible to lose history or transaction records.',
      'Read Model Projections: Background consumers project event streams into Elasticsearch, Redis, or SQL read replicas for instant queries.'
    ],
    commonPitfall: {
      mistake: 'Replaying 10,000,000 events from beginning of time on every read query.',
      fix: 'Create periodic snapshot checkpoints (e.g. every 1,000 events) and replay from the latest snapshot.'
    },
    nextTopicId: 'distributed-locking-redis-redlock-zookeeper'
  },
  {
    id: 'distributed-locking-redis-redlock-zookeeper',
    title: 'Distributed Locking: Redis Redlock vs ZooKeeper Fencing Tokens',
    category: 'consensus',
    difficulty: 'Expert',
    summary: 'Distributed locks coordinate exclusive access to shared resources across servers. Redlock acquires locks across N independent Redis nodes with TTLs. Fencing tokens prevent GC pause race conditions by issuing monotonically increasing sequence IDs.',
    mentalModel: 'The Hotel Keycard with Sequence Number: If guest 1 gets locked in the bathroom for 2 hours (GC pause) and their key expires, guest 2 gets card #102. When guest 1 emerges and tries card #101, the door rejects it because #102 is newer.',
    codeSnippet: `// Redis Distributed Lock (SET NX PX):
// SET resource_name my_random_token NX PX 30000

// Fencing Token Invariant:
// 1. Client acquires lock with fencing token = 42
// 2. Client executes write: UPDATE storage SET val = 10 WHERE token >= 42
// 3. If zombie client with token 41 attempts write, database REJECTS it!`,
    takeaways: [
      'Martin Kleppmann GC Pause Critique: A client can pause for 10 seconds during Java garbage collection while its lock TTL expires, allowing another client to acquire the lock.',
      'Fencing Tokens: Monotonically increasing numbers sent to storage backends guarantee safety even with clock skew.'
    ],
    commonPitfall: {
      mistake: 'Releasing a distributed lock by simply deleting the Redis key without verifying the random token value (accidentally releasing another server\'s lock).',
      fix: 'Always use an atomic Lua script that compares the token before deletion: if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]).'
    },
    nextTopicId: 'gossip-protocol-epidemic-dissemination'
  },
  {
    id: 'gossip-protocol-epidemic-dissemination',
    title: 'Gossip Protocols & Epidemic Cluster Membership (SWIM)',
    category: 'consensus',
    difficulty: 'Advanced',
    summary: 'Gossip protocols achieve decentralized cluster state dissemination and node failure detection in O(log N) rounds by having nodes periodically exchange heartbeat messages with random peers.',
    mentalModel: 'The Office Rumor: If employee A tells 3 random coworkers a secret, and they each tell 3 others, a company of 5,000 employees learns the rumor in just 8 conversation rounds.',
    codeSnippet: `// SWIM Protocol (Structured Weakly-Consistent Infection-Style):
// 1. Node A pings Node B
// 2. If no ACK within timeout, Node A asks Nodes C, D to ping Node B (Indirect Ping)
// 3. If no indirect ACK, Node B marked SUSPECT -> After timeout marked DEAD and gossiped.`,
    takeaways: [
      'Scalable Failure Detection: Constant network bandwidth per node regardless of cluster size (scales to 100,000+ nodes).',
      'Used in production: Apache Cassandra, HashiCorp Consul, Amazon DynamoDB, BitTorrent DHT.'
    ],
    commonPitfall: {
      mistake: 'Having every node broadcast heartbeats to ALL other nodes (O(N^2) network traffic), saturating network switches on 500+ node clusters.',
      fix: 'Use Gossip (random peer sampling) for O(log N) message dissemination.'
    },
    nextTopicId: 'lsm-trees-vs-b-trees-storage-engines'
  },
  {
    id: 'lsm-trees-vs-b-trees-storage-engines',
    title: 'Storage Engines: LSM-Trees (Write-Heavy) vs B+ Trees (Read-Heavy)',
    category: 'distributed-data',
    difficulty: 'Expert',
    summary: 'B+ Trees optimize for point and range reads via fixed 4KB-16KB disk pages. Log-Structured Merge (LSM) Trees optimize for high write throughput by buffering writes in memory (MemTable) and flushing immutable SSTables to disk with background compaction.',
    mentalModel: 'The Post-it Notes on the Fridge vs The Alphabetical Filing Cabinet: LSM-Trees jot down quick Post-it notes into a pile (MemTable) and sort them into folders later (Compaction). B+ Trees open the heavy steel drawer and place each sheet into its exact alphabetical folder slot on every single write.',
    codeSnippet: `// LSM-Tree Architecture (RocksDB / Cassandra / ClickHouse):
// 1. Write -> WAL (Disk) + MemTable (SkipList in RAM) [0ms latency!]
// 2. MemTable full -> Flushed as immutable SSTable (Sorted String Table) on Disk
// 3. Background Compaction: Merges overlapping SSTables, removes deleted keys (Tombstones).`,
    takeaways: [
      'LSM-Trees (RocksDB, Cassandra, Bigtable): High write throughput via sequential disk append, but higher read amplification.',
      'B+ Trees (PostgreSQL, MySQL InnoDB): Predictable O(log N) read latency, but slower random write performance.'
    ],
    commonPitfall: {
      mistake: 'Using B+ Tree databases for massive write-heavy timeseries ingestion (1,000,000 writes/sec), causing disk I/O bottlenecks.',
      fix: 'Use LSM-Tree based databases (ClickHouse, Cassandra, TimescaleDB, InfluxDB) for write-heavy telemetry.'
    },
    nextTopicId: 'cdn-edge-computing-geo-routing'
  },
  {
    id: 'cdn-edge-computing-geo-routing',
    title: 'Content Delivery Networks (CDNs), Anycast & Edge Computing',
    category: 'scaling',
    difficulty: 'Intermediate',
    summary: 'CDNs cache static assets and execute serverless edge compute at hundreds of Points of Presence (PoPs) worldwide. BGP Anycast routes client DNS/TCP requests to the topologically nearest physical data center.',
    mentalModel: 'The Global Franchise Bakery: Instead of shipping every croissant from Paris to Tokyo (200ms latency), the bakery builds 300 neighborhood franchise stores worldwide, delivering warm croissants in 5 milliseconds.',
    codeSnippet: `// BGP Anycast Routing:
// Single IP address (e.g. 1.1.1.1) announced by 300+ edge data centers.
// Internet BGP routers automatically route packets to the nearest geographic PoP.`,
    takeaways: [
      'Origin Shielding: Reduces origin server bandwidth and load by 95% via edge cache hits.',
      'Edge Compute (Cloudflare Workers / Vercel Edge): Runs authentication and A/B testing at the edge with <10ms latency.'
    ],
    commonPitfall: {
      mistake: 'Forgetting Cache-Control header directives on dynamic API endpoints, causing CDNs to serve stale user-specific data to all visitors.',
      fix: 'Set Cache-Control: private, no-store on sensitive user API responses.'
    },
    nextTopicId: 'distributed-id-generation-snowflake'
  },
  {
    id: 'distributed-id-generation-snowflake',
    title: 'Distributed ID Generation: Twitter Snowflake vs UUIDv4/v7',
    category: 'scaling',
    difficulty: 'Intermediate',
    summary: 'UUIDv4 (128-bit random) causes severe B+ Tree database index fragmentation. Twitter Snowflake generates 64-bit monotonically time-sortable IDs containing Timestamp, Machine ID, and Sequence counter.',
    mentalModel: 'The Manufacturing Serial Number: A car VIN number encodes the year of manufacture, factory location, and sequential chassis number in a single compact code.',
    codeSnippet: `// 64-bit Twitter Snowflake Layout:
// 1 bit:  Unused (sign bit = 0)
// 41 bits: Epoch Timestamp (69 years of millisecond precision)
// 10 bits: Machine ID (1,024 independent server instances)
// 12 bits: Sequence Counter (4,096 IDs per millisecond per machine!)

function generateSnowflake(epochMs: number, machineId: number, sequence: number): bigint {
  return (BigInt(epochMs) << 22n) | (BigInt(machineId) << 12n) | BigInt(sequence);
}`,
    takeaways: [
      '64-Bit Integer Efficiency: Fits in standard BIGINT column, indexed 2x faster than 128-bit UUIDs.',
      'Naturally Time-Sortable: Sorting by ID automatically orders records chronologically without secondary indexes.'
    ],
    commonPitfall: {
      mistake: 'Using random UUIDv4 as a primary key clustered index in MySQL/PostgreSQL, causing catastrophic B+ Tree page splits.',
      fix: 'Use time-sortable 64-bit Snowflake IDs or UUIDv7 for clustered database primary keys.'
    },
    nextTopicId: 'resilience-exponential-backoff-jitter'
  },
  {
    id: 'resilience-exponential-backoff-jitter',
    title: 'Retry Storms & Full Jitter Exponential Backoff Algorithms',
    category: 'resilience',
    difficulty: 'Intermediate',
    summary: 'When a database or service experiences an outage, thousands of client retries arrive simultaneously (Retry Storm). Full Jitter randomizes retry intervals across the entire backoff window to prevent synchronized thundering herds.',
    mentalModel: 'The Traffic Light Outage: If 500 cars wait at a broken traffic light and all accelerate simultaneously the instant the green light turns on, they immediately crash into each other. Staggering acceleration by random intervals lets everyone merge smoothly.',
    codeSnippet: `// AWS Full Jitter Backoff Algorithm:
function calculateFullJitterBackoff(attempt: number, baseMs = 100, maxMs = 20000): number {
  const exponentialCap = Math.min(maxMs, baseMs * Math.pow(2, attempt));
  // Random integer between 0 and exponentialCap:
  return Math.floor(Math.random() * exponentialCap);
}`,
    takeaways: [
      'Prevents Thundering Herds: Spreads retry traffic uniformly over time, allowing struggling backends to recover.',
      'Decorrelated Jitter: Alternative algorithm that uses sleep = min(max, rand(base, sleep * 3)).'
    ],
    commonPitfall: {
      mistake: 'Using deterministic exponential backoff (e.g. exactly 1s, 2s, 4s, 8s) without jitter; all clients still hit the server in synchronized waves.',
      fix: 'Always multiply or randomize backoff with full jitter.'
    },
    nextTopicId: 'distributed-tracing-opentelemetry-jaeger'
  },
  {
    id: 'distributed-tracing-opentelemetry-jaeger',
    title: 'Distributed Tracing & Observability (OpenTelemetry & Jaeger)',
    category: 'resilience',
    difficulty: 'Intermediate',
    summary: 'Distributed Tracing tracks requests across microservice boundaries by propagating W3C TraceContext headers (TraceID, SpanID). Spans capture timing, errors, and database queries across the distributed call graph.',
    mentalModel: 'The Postal Package Tracking Number: The single tracking number (TraceID) follows the package from the supplier to the airplane, customs warehouse, delivery truck, and your front door (Spans).',
    codeSnippet: `// W3C TraceContext HTTP Header Propagation:
// traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
// 00: Version
// 4bf92f35...: 128-bit Trace ID (Identifies the entire user request)
// 00f067aa...: 64-bit Parent Span ID
// 01: Trace Flags (Sampled = true)`,
    takeaways: [
      'Root Cause Analysis: Instantly isolates which microservice in a 20-service dependency chain is adding 800ms latency.',
      'OpenTelemetry Standard: Universal vendor-neutral telemetry standard supported by Datadog, Jaeger, Honeycomb, and New Relic.'
    ],
    commonPitfall: {
      mistake: 'Sampling 100% of traces on high-throughput systems (100,000 QPS), overloading tracing storage backends.',
      fix: 'Use Head-Based or Tail-Based Sampling (e.g. record 1% of normal requests and 100% of error/slow requests).'
    }
  }
];
