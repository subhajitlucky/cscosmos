export interface SystemDesignFlashcard {
  id: string;
  category: 'Distributed Systems & Consensus' | 'Data Partitioning & Replication' | 'Resilience & High Availability' | 'High Scale Architecture';
  question: string;
  answer: string;
  code?: string;
  tip: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export const SYSTEM_DESIGN_FLASHCARDS: SystemDesignFlashcard[] = [
  {
    id: 'sf-1',
    category: 'Distributed Systems & Consensus',
    difficulty: 'Senior',
    question: 'Why does Raft consensus require an odd number of nodes (3, 5, 7) instead of an even number (4, 6)?',
    answer: 'A cluster of N nodes requires a quorum of floor(N/2) + 1 votes to elect a leader or commit logs. A 4-node cluster requires 3 votes (tolerating only 1 failure). A 3-node cluster also requires 2 votes and tolerates 1 failure. Adding the 4th node adds network overhead and failure risk without increasing fault tolerance at all.',
    code: `// 3 nodes: Quorum = 2, Fault tolerance = 1
// 4 nodes: Quorum = 3, Fault tolerance = 1 (Zero advantage!)
// 5 nodes: Quorum = 3, Fault tolerance = 2`,
    tip: 'Always deploy odd numbers of consensus nodes in production clusters.'
  },
  {
    id: 'sf-2',
    category: 'Data Partitioning & Replication',
    difficulty: 'Senior',
    question: 'How do Virtual Nodes in Consistent Hashing solve the Hotspot and Non-Uniform Distribution problem?',
    answer: 'With few physical nodes, random hash distribution can allocate 60% of the ring to 1 server. Virtual Nodes map each physical server to 100+ virtual tokens across the ring. Keys are distributed evenly by the Law of Large Numbers, and if a server fails, its load is split evenly across all remaining servers rather than overwhelming its single immediate successor.',
    code: `for (let i = 0; i < 150; i++) {
  ring.set(hash(nodeId + "#" + i), nodeId);
}`,
    tip: 'Virtual nodes ensure smooth linear load balancing without manual intervention.'
  },
  {
    id: 'sf-3',
    category: 'Resilience & High Availability',
    difficulty: 'Staff',
    question: 'What is the mathematical proof behind Probabilistic Early Expiration (XFetch) for cache stampede defense?',
    answer: 'XFetch recomputes the cache item in the background before it expires with probability: -beta * delta * ln(random()) > (expiry - now), where delta is computation time and beta is aggressiveness factor. As expiration approaches (expiry - now -> 0), the threshold probability approaches 100%, guaranteeing exactly one background worker refreshes the cache without thundering herd spikes.',
    code: `if (-beta * delta * Math.log(Math.random()) > (expiry - now)) {
  recomputeInBackground(key);
}`,
    tip: 'XFetch eliminates both cache stampedes and mutex lock contention.'
  },
  {
    id: 'sf-4',
    category: 'High Scale Architecture',
    difficulty: 'Mid',
    question: 'Why should you never use timestamp-based columns (e.g. created_at) as a primary database Shard Key?',
    answer: 'Because time monotonically increases, 100% of current write traffic (INSERTs) will be directed to the single shard responsible for the latest time range, creating a severe write bottleneck while all other historical shards sit idle. It also prevents uniform write scaling.',
    code: `// ❌ Bad: Shard by created_at (100% hot shard write bottleneck)
// ✅ Good: Shard by hash(userId) (Uniform write distribution across N shards)`,
    tip: 'Choose shard keys with high cardinality and uniform read/write distribution.'
  }
];
