export interface ApiTopic {
  id: string;
  title: string;
  category: 'graphql' | 'rest-design' | 'grpc-trpc' | 'resilience-security' | 'architecture';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
}

export const API_TOPICS: ApiTopic[] = [
  {
    id: 'graphql-ast-parsing-validation',
    title: 'GraphQL Execution Engine: AST Parsing, Validation & Field Resolvers',
    category: 'graphql',
    difficulty: 'Advanced',
    summary: 'When a GraphQL query string arrives, the engine Lexes it into Tokens, parses it into an Abstract Syntax Tree (AST), validates it against Schema Types (SDL), and executes field resolvers recursively.',
    mentalModel: 'The Restaurant Custom Menu Order: Instead of receiving a fixed set meal (REST), you hand the waiter a custom checklist requesting only 2 cherry tomatoes and 1 slice of steak. The kitchen parses the checklist and assembles the exact plate.',
    codeSnippet: `// GraphQL Query:
// query { user(id: "u_1") { name, posts { title } } }

// Resolvers Execution Pipeline:
const resolvers = {
  Query: {
    user: (parent, args, context, info) => db.users.findById(args.id),
  },
  User: {
    posts: (parentUser, args, context, info) => db.posts.findByUserId(parentUser.id),
  }
};`,
    takeaways: [
      'AST Document: Represents operations, selection sets, arguments, and directives in a hierarchical tree structure.',
      'Field Resolution Signature: (parent, args, context, info) passes parent object results down the selection hierarchy.',
      'Single Endpoint: All GraphQL queries and mutations execute via a single HTTP POST /graphql endpoint.'
    ],
    commonPitfall: {
      mistake: 'Assuming GraphQL automatically optimizes database queries out of the box without resolver-level batching.',
      fix: 'Use DataLoader to batch and deduplicate database requests across nested resolvers.'
    },
    nextTopicId: 'n-plus-one-dataloader-batching'
  },
  {
    id: 'n-plus-one-dataloader-batching',
    title: 'The N+1 Problem & DataLoader Batching & Caching Engine',
    category: 'graphql',
    difficulty: 'Expert',
    summary: 'Nested resolvers cause the catastrophic N+1 query problem (1 query for N posts + N separate SQL queries for authors = N+1 total queries). DataLoader batches keys within a single event-loop tick into 1 SQL "WHERE id IN (...)" query.',
    mentalModel: 'The Carpool to Work: Instead of 10 coworkers driving 10 separate cars to the same office (10 database connections), DataLoader has everyone wait at the bus stop for 1 millisecond and drives all 10 passengers in a single bus.',
    codeSnippet: `import DataLoader from 'dataloader';

// Batch loading function executed in next microtask tick:
const userLoader = new DataLoader<string, User>(async (userIds) => {
  // Executes strictly ONE SQL query for all batched user IDs:
  const users = await db.query('SELECT * FROM users WHERE id IN (?)', [userIds]);
  // Return array in exact matching order:
  const userMap = new Map(users.map((u) => [u.id, u]));
  return userIds.map((id) => userMap.get(id)!);
});

// Resolver:
const postResolvers = {
  author: (post, args, context) => context.userLoader.load(post.authorId)
};`,
    takeaways: [
      'Event Loop Microtask Tick: DataLoader collects all load(id) calls during synchronous execution and flushes the batch function in the next process.nextTick.',
      'Per-Request Memoization Cache: Repeated calls for the same ID within a single HTTP request return instantly from memory with zero database reads.',
      'Order Guarantee: The batch function must return an array of identical length and matching index order to the input keys.'
    ],
    commonPitfall: {
      mistake: 'Instantiating DataLoader as a global singleton across requests, leaking user data across HTTP sessions.',
      fix: 'Always instantiate new DataLoader instances inside the request context (per-request lifecycle).'
    },
    nextTopicId: 'rest-vs-graphql-vs-grpc-vs-trpc'
  },
  {
    id: 'rest-vs-graphql-vs-grpc-vs-trpc',
    title: 'Modern API Protocols: REST vs GraphQL vs gRPC vs tRPC',
    category: 'architecture',
    difficulty: 'Intermediate',
    summary: 'REST relies on standard HTTP methods and URL resources. GraphQL solves over/under-fetching with client-specified schemas. gRPC utilizes Protocol Buffers and HTTP/2 for ultra-fast microservices. tRPC provides end-to-end TypeScript inference with zero codegen.',
    mentalModel: 'The Transportation Comparison: REST is the public bus (fixed stops, fixed schedule). GraphQL is the Uber (picks you up and drops you off at your exact address). gRPC is the supersonic bullet train (ultra-fast binary cargo between industrial hubs).',
    codeSnippet: `// 1. REST:    GET /api/v1/users/42 -> Returns full 50-field JSON
// 2. GraphQL: POST /graphql { user(id: 42) { name } } -> Returns only name
// 3. gRPC:    userClient.GetUser(req) -> Compact 14-byte Protocol Buffer binary stream
// 4. tRPC:    trpc.user.getById.useQuery({ id: 42 }) -> End-to-end TypeScript types!`,
    takeaways: [
      'REST: Universal standard, easy HTTP caching, standard status codes (200, 404, 500).',
      'GraphQL: Ideal for complex client applications needing aggregated data from multiple backends.',
      'gRPC: 10x faster serialization than JSON, low latency for internal microservices.',
      'tRPC: Unbeatable developer experience for full-stack TypeScript (Next.js / React).'
    ],
    commonPitfall: {
      mistake: 'Using gRPC for public web browser clients without gRPC-Web proxies (standard browser fetch() cannot send raw HTTP/2 frames directly).',
      fix: 'Use REST, GraphQL, or tRPC for browser clients, and gRPC for internal backend microservice RPCs.'
    },
    nextTopicId: 'idempotency-keys-stripe-retries'
  },
  {
    id: 'idempotency-keys-stripe-retries',
    title: 'Idempotency Keys & Distributed Safe Payment Retries',
    category: 'resilience-security',
    difficulty: 'Advanced',
    summary: 'Network timeouts leave clients unsure if an operation succeeded. Supplying an "Idempotency-Key: uuid" HTTP header ensures the server processes mutations at most once, safely returning the cached result on retries.',
    mentalModel: 'The Mailbox Tracking Stamped Envelope: When sending money in the mail, you write a unique tracking number on the envelope. If the postal service loses contact and you send a duplicate letter with the same number, the bank recognizes the duplicate stamp and only deposits the funds once.',
    codeSnippet: `// Stripe Idempotency Key Flow:
async function chargeCustomer(req: Request, res: Response) {
  const idempotencyKey = req.headers['idempotency-key'];
  
  // 1. Check Redis for existing idempotency key:
  const cached = await redis.get(\`idempotency:\${idempotencyKey}\`);
  if (cached) {
    return res.status(200).json(JSON.parse(cached)); // Safe replay
  }
  
  // 2. Acquire distributed lock:
  const locked = await redis.set(\`lock:\${idempotencyKey}\`, 'locked', 'NX', 'EX', 30);
  if (!locked) return res.status(409).json({ error: 'Concurrent request in progress' });
  
  // 3. Process payment & save result:
  const paymentResult = await paymentGateway.charge(req.body);
  await redis.set(\`idempotency:\${idempotencyKey}\`, JSON.stringify(paymentResult), 'EX', 86400);
  
  return res.status(200).json(paymentResult);
}`,
    takeaways: [
      'At-Most-Once Execution: Guarantees POST/PATCH mutations will never duplicate business side-effects.',
      'Distributed Locking: Prevents race conditions when a client fires 2 identical retry requests simultaneously.',
      '24-Hour TTL: Idempotency keys are typically cached in Redis for 24 hours.'
    ],
    commonPitfall: {
      mistake: 'Failing to return the exact original HTTP status code and response payload on idempotency key replay.',
      fix: 'Store both the HTTP status code and full JSON body in the idempotency cache.'
    },
    nextTopicId: 'api-pagination-cursor-vs-offset'
  },
  {
    id: 'api-pagination-cursor-vs-offset',
    title: 'API Pagination: Offset/Limit Drift vs Keyset Cursor Pagination',
    category: 'rest-design',
    difficulty: 'Intermediate',
    summary: 'Offset-based pagination (LIMIT 20 OFFSET 1000) causes quadratic database page scanning (O(N)) and data drift when rows are inserted. Keyset Cursor pagination (WHERE id > cursor LIMIT 20) executes in constant O(1) B+ Tree index seek.',
    mentalModel: 'The Bookmark in a 1,000-Page Book: Offset pagination counts from Page 1 to Page 900 every single time you read a chapter. Cursor pagination places a physical bookmark at Page 900 and opens directly to that page in 1 millisecond.',
    codeSnippet: `// ❌ Offset Pagination (Slow O(N) scan & duplicate drift):
// SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 50000;

// ✅ Cursor Pagination (Fast O(1) index seek & drift-immune):
// SELECT * FROM posts WHERE (created_at, id) < ('2026-08-14 10:00:00', 492)
// ORDER BY created_at DESC, id DESC LIMIT 20;`,
    takeaways: [
      'Eliminates Pagination Drift: New records added at the top of the feed will not cause duplicate posts to appear on Page 2.',
      'O(1) Performance: The database seeks directly to the cursor index position without reading discarded rows.',
      'GraphQL Relay Specification: Standardizes edges, node, pageInfo, hasNextPage, and endCursor.'
    ],
    commonPitfall: {
      mistake: 'Using non-unique columns (e.g. only created_at) as a pagination cursor, dropping records that share identical timestamps.',
      fix: 'Use compound cursors combining timestamp and unique primary key: (created_at, id).'
    },
    nextTopicId: 'webhook-architecture-signatures-retries'
  },
  {
    id: 'webhook-architecture-signatures-retries',
    title: 'Webhook Architecture: HMAC Signatures & Exponential Backoff',
    category: 'resilience-security',
    difficulty: 'Advanced',
    summary: 'Webhooks deliver real-time server-to-server push notifications. Security requires HMAC SHA-256 signature verification (X-Signature) and timestamp validation to prevent payload tampering and replay attacks.',
    mentalModel: 'The Wax-Sealed Certified Courier: The sender seals the envelope with a unique HMAC wax stamp. The receiver verifies the stamp with their shared secret key and checks that the date on the letter was stamped within the last 5 minutes.',
    codeSnippet: `import { createHmac, timingSafeEqual } from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string, timestamp: string): boolean {
  // 1. Prevent Replay Attacks (Reject if older than 5 minutes):
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  // 2. Compute expected HMAC SHA-256 signature:
  const signedPayload = \`\${timestamp}.\${payload}\`;
  const expectedSig = createHmac('sha256', secret).update(signedPayload).digest('hex');

  // 3. Constant-time comparison to prevent timing attacks:
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
}`,
    takeaways: [
      'HMAC-SHA256: Proves the webhook payload originated from the authentic vendor and was not modified in transit.',
      'Replay Protection: Combining timestamp in the signature hash prevents attackers from capturing and re-sending valid webhooks.',
      'Async Processing: Webhook receiver endpoints must return HTTP 200 immediately and process the payload asynchronously via background workers.'
    ],
    commonPitfall: {
      mistake: 'Using standard string comparison (sig === expectedSig) for webhook verification, opening the door to timing attacks.',
      fix: 'Always use crypto.timingSafeEqual() for cryptographic signature comparisons.'
    }
  }
];
