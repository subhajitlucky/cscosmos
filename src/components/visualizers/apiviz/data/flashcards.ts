export interface ApiFlashcard {
  id: string;
  category: 'GraphQL Internals' | 'REST & HTTP Standards' | 'gRPC & Microservices' | 'API Security & Resilience';
  question: string;
  answer: string;
  code?: string;
  tip: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export const API_FLASHCARDS: ApiFlashcard[] = [
  {
    id: 'af-1',
    category: 'GraphQL Internals',
    difficulty: 'Senior',
    question: 'How does DataLoader batch requests using JavaScript event-loop microtasks?',
    answer: 'DataLoader queues all keys requested synchronously within a single tick of the event loop. When synchronous resolver execution yields, DataLoader executes its batch loading function in the next process.nextTick / Promise microtask, combining individual IDs into a single database WHERE id IN (...) query and resolving individual Promises in-memory.',
    code: `// Collects ids in tick 0 -> Executes single SQL in tick 1:
const loader = new DataLoader(keys => batchFetchUsers(keys));`,
    tip: 'DataLoader instances must be created per-request to avoid cross-user data caching leaks.'
  },
  {
    id: 'af-2',
    category: 'API Security & Resilience',
    difficulty: 'Senior',
    question: 'How do Idempotency Keys prevent duplicate credit card charges during network timeouts?',
    answer: 'The client generates a unique UUID (Idempotency-Key) and sends it in the HTTP header. The server attempts an atomic Redis SET NX lock. If the key exists, it returns the previously cached response immediately. If not, it executes the payment, caches the result in Redis with a 24-hour TTL, and returns the response. Retrying on a timeout safely yields the existing transaction result without charging again.',
    code: `// Redis atomic lock:
SET lock:idempotency_key "locked" NX EX 30`,
    tip: 'Always cache both the HTTP response status code and response body together.'
  },
  {
    id: 'af-3',
    category: 'REST & HTTP Standards',
    difficulty: 'Mid',
    question: 'Why is Keyset Cursor Pagination far superior to Offset/Limit pagination for large datasets?',
    answer: 'Offset pagination requires the database to scan and discard OFFSET rows sequentially (O(N) cost) and suffers from data drift (newly inserted rows push items across pages, causing duplicate reads). Keyset cursor pagination uses WHERE (created_at, id) < (cursor_time, cursor_id) to seek directly to the exact B+ tree index entry in constant O(1) time with zero duplicate drift.',
    code: `// Fast O(1) B+ tree seek:
WHERE (created_at, id) < (:cursor_time, :cursor_id) LIMIT 20;`,
    tip: 'Always include a unique tie-breaker column (e.g. primary key ID) in compound cursors.'
  },
  {
    id: 'af-4',
    category: 'gRPC & Microservices',
    difficulty: 'Senior',
    question: 'Why is gRPC Protocol Buffers serialization up to 10x faster and smaller than JSON over REST?',
    answer: 'Protocol Buffers encode structured data into a compact binary wire format using integer field tags (varints and zigzag encoding) rather than verbose string field names ("first_name": "Alice"). It skips CPU-heavy string parsing and floating-point conversions, and leverages HTTP/2 binary framing and header compression (HPACK).',
    code: `// Protobuf definition:
message User { int64 id = 1; string name = 2; }`,
    tip: 'Field numbers (e.g. = 1) identify fields on the binary wire; never change field numbers once deployed.'
  }
];
