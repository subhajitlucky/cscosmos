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
    },
    nextTopicId: 'apollo-federation-v2-supergraphs'
  },
  {
    id: 'apollo-federation-v2-supergraphs',
    title: 'Apollo Federation v2 & Distributed Supergraph Subgraph Composition',
    category: 'graphql',
    difficulty: 'Expert',
    summary: 'Apollo Federation composes multiple independent subgraph microservice schemas into a single unified Supergraph API. The gateway builds query plans, fetching entity keys via @_entities resolvers across subgraphs.',
    mentalModel: 'The Universal Concierge: The hotel concierge (Gateway) takes your request. He asks the Chef for the menu (Products Subgraph) and the Sommelier for the wine pairing (Reviews Subgraph), presenting a seamless single dining experience.',
    codeSnippet: `// Products Subgraph:
type Product @key(fields: "id") {
  id: ID!
  name: String!
  price: Float!
}

// Reviews Subgraph (Extends Product):
type Product @key(fields: "id") {
  id: ID!
  reviews: [Review!]!
}`,
    takeaways: [
      '@key directive: Defines the primary key identifier for entities resolved across subgraphs.',
      'Query Planner: The router splits client queries into minimal parallel subgraph requests.',
      'Independent Deployment: Subgraph teams can deploy changes independently without breaking the Supergraph.'
    ],
    commonPitfall: {
      mistake: 'Creating circular subgraph dependencies, causing the gateway router to enter infinite query planning loops.',
      fix: 'Structure subgraph entity ownership cleanly with unidirectional entity extensions.'
    },
    nextTopicId: 'graphql-query-complexity-rate-limiting'
  },
  {
    id: 'graphql-query-complexity-rate-limiting',
    title: 'GraphQL Query Complexity, Depth Limiting & Cost Analysis',
    category: 'resilience-security',
    difficulty: 'Advanced',
    summary: 'GraphQL gives clients arbitrary query flexibility, opening risks for Denial of Service (DoS) attacks via cyclic nested queries (author { posts { author { posts ... } } }). Solved using Query Depth Limiting and Cost Complexity Points.',
    mentalModel: 'The Casino Chips Budget: Every table game (field in the query) costs chips based on computational weight (e.g. 1 point for scalar, 10 points for paginated database list). If your total bet exceeds 100 chips, the dealer halts the game before running the query.',
    codeSnippet: `import { createComplexityRule } from 'graphql-query-complexity';

const complexityRule = createComplexityRule({
  maximumComplexity: 1000,
  variables: {},
  estimators: [
    fieldExtensionsEstimator(),
    simpleEstimator({ defaultComplexity: 1 }),
  ],
});`,
    takeaways: [
      'Query Depth Limiting: Rejects queries exceeding a fixed nested selection depth (e.g. max depth = 6).',
      'Cost Complexity Points: Assigns point weights to fields, calculating total cost during AST validation before executing resolvers.'
    ],
    commonPitfall: {
      mistake: 'Using standard HTTP request rate limiting (e.g. 100 req/min) for GraphQL; an attacker can send 1 single deeply nested query that exhausts server CPU.',
      fix: 'Implement GraphQL AST cost complexity analysis alongside transport rate limiting.'
    },
    nextTopicId: 'grpc-protocol-buffers-http2'
  },
  {
    id: 'grpc-protocol-buffers-http2',
    title: 'gRPC & Protocol Buffers: Binary Serialization & HTTP/2 Framing',
    category: 'grpc-trpc',
    difficulty: 'Expert',
    summary: 'gRPC leverages Protocol Buffers (.proto) to encode data into compact binary wire streams, utilizing HTTP/2 features like binary framing, multiplexing multiple calls over 1 TCP connection, and HPACK header compression.',
    mentalModel: 'The Vacuum-Packed Luggage: Instead of throwing loose clothes into a suitcase with bulky labels (JSON), Protocol Buffers vacuum-seals everything into an ultra-tight, numbered binary package (9 bytes instead of 500 bytes).',
    codeSnippet: `// service.proto
syntax = "proto3";

service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
}

message UserRequest {
  int64 user_id = 1;
}

message UserResponse {
  int64 user_id = 1;
  string name = 2;
  string email = 3;
}`,
    takeaways: [
      'HTTP/2 Multiplexing: Hundreds of concurrent RPC requests share a single persistent TCP connection without head-of-line blocking.',
      'Strict Polyglot Schemas: Generates type-safe client/server stubs in Go, Rust, Java, Python, and TypeScript from a single .proto file.'
    ],
    commonPitfall: {
      mistake: 'Modifying existing field numbers in .proto definitions (e.g. changing user_id = 1 to user_id = 2), corrupting backwards compatibility.',
      fix: 'Never change existing field tag numbers; use reserved tag keywords for deprecated fields.'
    },
    nextTopicId: 'openapi-swagger-contract-first'
  },
  {
    id: 'openapi-swagger-contract-first',
    title: 'Contract-First API Design with OpenAPI 3.1 & Schema Validation',
    category: 'rest-design',
    difficulty: 'Intermediate',
    summary: 'Design-first API workflows author OpenAPI (OAS 3.1) YAML specifications before writing code. Specifications generate interactive Swagger documentation, client SDKs, mock servers, and runtime JSON schema validation middleware.',
    mentalModel: 'The Architectural Blueprints: You draw the precise structural blueprints before pouring concrete. The plumbers, electricians, and inspectors all build against the agreed blueprint without miscommunication.',
    codeSnippet: `openapi: 3.1.0
info:
  title: Orders API
  version: 1.0.0
paths:
  /orders/{orderId}:
    get:
      summary: Retrieve order by ID
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Order details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'`,
    takeaways: [
      'Contract-First Workflow: Frontend and backend teams work in parallel against generated mock servers from day 1.',
      'Runtime Validation: API gateways validate request payloads against OpenAPI schemas before hitting backend business logic.'
    ],
    commonPitfall: {
      mistake: 'Code-first API development without auto-generating OpenAPI specs, causing documentation to drift out of sync with actual server behavior.',
      fix: 'Use schema-first OpenAPI design or automated TypeScript schema generators (e.g. Zod-to-OpenAPI).'
    },
    nextTopicId: 'graphql-subscriptions-sse-websockets'
  },
  {
    id: 'graphql-subscriptions-sse-websockets',
    title: 'Real-Time APIs: GraphQL Subscriptions, WebSockets & SSE',
    category: 'graphql',
    difficulty: 'Advanced',
    summary: 'Real-time APIs push updates to clients. GraphQL Subscriptions use WebSockets or Server-Sent Events (SSE) combined with Pub/Sub engines (Redis, Kafka) to push live query updates when specific mutations occur.',
    mentalModel: 'The Radio Broadcaster: Instead of calling the station every 5 seconds asking "Is the song over?" (Polling), you turn on your radio tuner (Subscription) and listen as music streams continuously.',
    codeSnippet: `// GraphQL Subscription Definition:
// subscription { orderUpdated(orderId: "123") { status, eta } }

// Resolver with Redis PubSub:
const resolvers = {
  Subscription: {
    orderUpdated: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator([\`ORDER_\${args.orderId}\`]),
    },
  },
};`,
    takeaways: [
      'WebSockets (graphql-ws): Bidirectional full-duplex persistent TCP connection for interactive clients.',
      'Server-Sent Events (SSE): Unidirectional server-to-client streaming over standard HTTP/2, simpler to proxy through corporate firewalls.'
    ],
    commonPitfall: {
      mistake: 'Running in-memory PubSub across multiple clustered API servers; subscriptions on Server A miss events published on Server B.',
      fix: 'Use a distributed pub/sub backbone like Redis Pub/Sub, Kafka, or AWS EventBridge.'
    },
    nextTopicId: 'graphql-caching-normalized-vs-document'
  },
  {
    id: 'graphql-caching-normalized-vs-document',
    title: 'Client-Side Caching: Normalized In-Memory Cache (Apollo / Relay)',
    category: 'graphql',
    difficulty: 'Expert',
    summary: 'Unlike REST which caches whole HTTP URLs, GraphQL clients (Apollo Client, Urql, Relay) normalize response trees into flat tables of entities keyed by __typename:id, updating all UI components automatically when a single entity mutates.',
    mentalModel: 'The Single Source Database in the Browser: If Alice updates her avatar in the Settings page, every component displaying Alice (Navbar, Comments, Profile) updates immediately because they all read from the same normalized User:42 in-memory cache record.',
    codeSnippet: `// Apollo Client Normalized Cache Structure:
// ROOT_QUERY: { "user({\\"id\\":42})": { "__ref": "User:42" } }
// User:42: { "id": "42", "__typename": "User", "name": "Alice", "avatar": "https://..." }`,
    takeaways: [
      'Automatic UI Synchronization: Mutating a record in one screen updates all active screens reading that entity.',
      'Garbage Collection: Evicting unreferenced normalized entities frees browser RAM automatically.'
    ],
    commonPitfall: {
      mistake: 'Omitting the id or __typename field in GraphQL queries, causing Apollo Client to fail normalization and treat data as ephemeral.',
      fix: 'Always select id and __typename on all queryable object types.'
    },
    nextTopicId: 'rest-hateoas-richardson-maturity'
  },
  {
    id: 'rest-hateoas-richardson-maturity',
    title: 'REST Architecture: Richardson Maturity Model & HATEOAS',
    category: 'rest-design',
    difficulty: 'Intermediate',
    summary: 'The Richardson Maturity Model ranks REST APIs: Level 0 (RPC POX), Level 1 (Resources), Level 2 (HTTP Verbs & Status Codes), and Level 3 (HATEOAS - Hypermedia As The Engine Of Application State).',
    mentalModel: 'The Interactive Webpage: A web browser does not hardcode every URL in advance; it renders HTML hyperlinks that tell you what actions you can take next. HATEOAS embeds next-action hypermedia links inside JSON API responses.',
    codeSnippet: `// Level 3 HATEOAS Response (HAL Format):
{
  "orderId": 492,
  "status": "pending_payment",
  "amount": 100.00,
  "_links": {
    "self": { "href": "/orders/492" },
    "payment": { "href": "/orders/492/pay", "method": "POST" },
    "cancel": { "href": "/orders/492/cancel", "method": "DELETE" }
  }
}`,
    takeaways: [
      'Self-Describing APIs: Clients dynamically discover allowable state transitions from hypermedia links.',
      'Decoupled Workflows: The backend can change business state machine transitions without requiring frontend app updates.'
    ],
    commonPitfall: {
      mistake: 'Returning HTTP 200 OK for errors with a custom JSON payload: { "status": "error", "code": 404 }.',
      fix: 'Adhere to Level 2 REST: Use proper HTTP status codes (404 Not Found, 401 Unauthorized, 500 Internal Error).'
    },
    nextTopicId: 'api-gateway-bff-pattern'
  },
  {
    id: 'api-gateway-bff-pattern',
    title: 'Backend-for-Frontend (BFF) Pattern & Edge API Aggregation',
    category: 'architecture',
    difficulty: 'Advanced',
    summary: 'The Backend-for-Frontend (BFF) pattern deploys dedicated lightweight API adapters for each client platform (iOS Mobile BFF, Desktop Web BFF, Smart TV BFF), tailoring payloads, authentication, and bandwidth to device constraints.',
    mentalModel: 'The Tailored Suit: Instead of wearing a generic "one-size-fits-all" poncho (Monolithic API), the mobile app gets a lightweight fitted jacket and the desktop web gets a feature-rich tuxedo.',
    codeSnippet: `// Mobile BFF: Strips 80% of unused desktop payload and aggregates 3 calls:
async function getMobileHomeScreen(userId: string) {
  const [user, unreadCount, topStories] = await Promise.all([
    userService.getCompact(userId),
    notificationService.getCount(userId),
    feedService.getTop(userId, { limit: 5 })
  ]);
  return { user, unreadCount, topStories }; // 1 single optimized network roundtrip!
}`,
    takeaways: [
      'Bandwidth Optimization: Mobile devices on 3G/4G cellular networks receive compact, pruned payloads.',
      'Frontend Team Autonomy: Mobile engineers can refactor their own BFF without touching backend core services.'
    ],
    commonPitfall: {
      mistake: 'Putting heavy core business logic inside the BFF layer, duplicating rules across Mobile and Web BFFs.',
      fix: 'Keep BFFs as lightweight presentation aggregators, delegating business rules to core domain services.'
    },
    nextTopicId: 'graphql-directives-custom-execution'
  },
  {
    id: 'graphql-directives-custom-execution',
    title: 'GraphQL Schema Directives: @auth, @cacheControl & @rateLimit',
    category: 'graphql',
    difficulty: 'Advanced',
    summary: 'Directives (@directive) decorate GraphQL schema types and fields with custom behavior, enabling declarative field-level authentication, cache control max-age headers, and rate limiting.',
    mentalModel: 'The Security Clearance Badges: A schema directive is like pinning a "Top Secret" badge on the salary field in the employee schema; the security scanner checks the user\'s badge before allowing them to see that field.',
    codeSnippet: `type User {
  id: ID!
  name: String!
  email: String! @auth(requires: USER)
  ssn: String! @auth(requires: ADMIN)
  avatar: String @cacheControl(maxAge: 3600)
}`,
    takeaways: [
      'Declarative Security: Enforces field-level RBAC authorization at the schema layer without cluttering business resolvers.',
      'Cache Headers: Generates Cache-Control: max-age HTTP headers based on the lowest maxAge field in the query selection set.'
    ],
    commonPitfall: {
      mistake: 'Checking user authorization solely inside UI components, allowing unauthorized users to query sensitive fields via raw GraphQL HTTP requests.',
      fix: 'Always enforce authorization server-side using schema directives or resolver context checks.'
    },
    nextTopicId: 'grpc-bidirectional-streaming'
  },
  {
    id: 'grpc-bidirectional-streaming',
    title: 'gRPC Streaming: Unary, Client Streaming, Server & Bidirectional Duplex',
    category: 'grpc-trpc',
    difficulty: 'Expert',
    summary: 'gRPC supports 4 distinct communication models: Unary (1 req -> 1 res), Server Streaming (1 req -> N res stream), Client Streaming (N req stream -> 1 res), and Bidirectional Streaming (duplex parallel streams).',
    mentalModel: 'The Walkie-Talkie vs Telephone: Unary is sending a letter. Server streaming is listening to a podcast. Bidirectional streaming is a full-duplex phone conversation where both parties speak and listen simultaneously.',
    codeSnippet: `// Protobuf Duplex Stream Definition:
service ChatService {
  rpc ChatStream (stream ChatMessage) returns (stream ChatMessage);
}`,
    takeaways: [
      'Server Streaming: Ideal for live telemetry, LLM token streaming (ChatGPT-style), and stock price tickers.',
      'Bidirectional Duplex: Full two-way real-time messaging with low overhead over HTTP/2.'
    ],
    commonPitfall: {
      mistake: 'Leaving long-lived gRPC streams open indefinitely without keep-alive pings, causing intermediary cloud firewalls to silently terminate TCP connections.',
      fix: 'Configure gRPC keepalive parameters (keepalive_time_ms, keepalive_timeout_ms).'
    },
    nextTopicId: 'api-error-handling-rfc-7807'
  },
  {
    id: 'api-error-handling-rfc-7807',
    title: 'API Error Handling: RFC 7807 Problem Details vs GraphQL Partial Errors',
    category: 'rest-design',
    difficulty: 'Intermediate',
    summary: 'Standardized error formats allow client SDKs to handle errors programmatically. RFC 7807 defines Problem Details for HTTP APIs. GraphQL returns partial errors in an errors array while still serving valid data fields.',
    mentalModel: 'The Hospital Medical Report: Instead of a doctor saying "Something went wrong" (500 Internal Error), they hand you a standardized chart listing the exact symptom (type), diagnostic code (status), and treatment instructions (detail).',
    codeSnippet: `// RFC 7807 Error Response:
// Content-Type: application/problem+json
{
  "type": "https://api.example.com/errors/card-declined",
  "title": "Payment Card Declined",
  "status": 402,
  "detail": "The card has insufficient funds for this transaction.",
  "invalid-params": [{ "name": "card_number", "reason": "Expired" }]
}`,
    takeaways: [
      'RFC 7807 Standard: Standardizes type, title, status, detail, and instance attributes across enterprise REST APIs.',
      'GraphQL Partial Data: A query can return data: { user: {...} } alongside errors: [...] if a non-null child resolver failed.'
    ],
    commonPitfall: {
      mistake: 'Leaking internal server stack traces and SQL query strings in production API error responses, exposing vulnerability details.',
      fix: 'Sanitize production errors; return generic error messages with correlation Trace IDs and log details internally.'
    },
    nextTopicId: 'zero-overhead-trpc-typescript-rpc'
  },
  {
    id: 'zero-overhead-trpc-typescript-rpc',
    title: 'tRPC: End-to-End Type Safety Without Code Generation',
    category: 'grpc-trpc',
    difficulty: 'Intermediate',
    summary: 'tRPC leverages TypeScript type inference to export backend router types directly to client React/Next.js components. When backend procedures change, frontend components fail TypeScript compilation instantly with zero build-time codegen.',
    mentalModel: 'The Telepathic Bridge: The frontend and backend speak the same native TypeScript dialect; changing a function parameter on the server immediately updates the IDE autocomplete on the frontend.',
    codeSnippet: `// Backend Router (Server):
export const appRouter = router({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => db.users.findUnique({ where: { id: input.id } })),
});

// Frontend Component (Client):
const { data } = trpc.getUser.useQuery({ id: "42" });
// 'data' is strongly typed as User with full autocomplete!`,
    takeaways: [
      'Zero Codegen: No GraphQL schema generation, no .proto compilation step, no stale schema files.',
      'Zod Input Validation: Automatically parses and validates incoming HTTP request payloads at runtime.'
    ],
    commonPitfall: {
      mistake: 'Attempting to use tRPC for public third-party APIs with non-TypeScript clients (e.g. Swift, Kotlin, Python).',
      fix: 'Use tRPC for internal full-stack TypeScript apps, and OpenAPI REST / GraphQL for public third-party developers.'
    },
    nextTopicId: 'api-versioning-url-header-graphql'
  },
  {
    id: 'api-versioning-url-header-graphql',
    title: 'API Evolution: URI Path vs Accept Header Versioning vs Schema Evolution',
    category: 'architecture',
    difficulty: 'Intermediate',
    summary: 'APIs evolve over time. REST uses URI path versioning (/v1/users), Query parameters (?version=2), or Accept headers (Accept: application/vnd.api.v2+json). GraphQL avoids breaking versions via schema evolution and @deprecated directives.',
    mentalModel: 'The Traffic Detour: URI path versioning builds an entirely new Highway 2 alongside Highway 1. GraphQL schema evolution gradually repaves the existing highway, placing a "Road Work Ahead" sign (@deprecated) on old lanes while opening new lanes.',
    codeSnippet: `// GraphQL Continuous Schema Evolution:
type User {
  id: ID!
  fullName: String!
  name: String! @deprecated(reason: "Use fullName instead for internationalized names.")
}`,
    takeaways: [
      'URI Versioning (/v1, /v2): Simple to route at API Gateways, but leads to duplicated codebases.',
      'GraphQL Additive Evolution: Fields are only added, never removed; old fields are marked with @deprecated until telemetry confirms zero traffic.'
    ],
    commonPitfall: {
      mistake: 'Removing or renaming an active API field without tracking consumer telemetry, breaking mobile apps in production.',
      fix: 'Use schema registry analytics (Apollo Studio, Inigo) to monitor field query volume before removal.'
    },
    nextTopicId: 'content-negotiation-accept-headers'
  },
  {
    id: 'content-negotiation-accept-headers',
    title: 'HTTP Content Negotiation: Accept, Content-Type & Compression',
    category: 'rest-design',
    difficulty: 'Beginner',
    summary: 'Content Negotiation enables clients and servers to agree on the optimal representation format (Accept: application/json vs text/csv), character set, and compression encoding (Accept-Encoding: gzip, br, zstd).',
    mentalModel: 'The Multilingual Diplomat: When meeting an international guest, you check their preferred language pin (Accept Header: French) and converse in French, switching to English if that is the common fallback.',
    codeSnippet: `// Express.js Content Negotiation:
app.get('/api/reports', (req, res) => {
  const format = req.accepts(['json', 'csv']);
  if (format === 'json') {
    res.json(reportData);
  } else if (format === 'csv') {
    res.type('text/csv').send(convertToCsv(reportData));
  } else {
    res.status(406).send('Not Acceptable');
  }
});`,
    takeaways: [
      'Brotli (br) Compression: Reduces text API payload sizes by 15-25% compared to standard Gzip.',
      'HTTP 406 Not Acceptable: Standard status code returned when the server cannot provide the representation requested in Accept headers.'
    ],
    commonPitfall: {
      mistake: 'Forgetting to set the Vary: Accept-Encoding header when serving compressed responses, causing caching proxies to serve Gzip to non-supporting clients.',
      fix: 'Always set Vary: Accept, Accept-Encoding on content-negotiated endpoints.'
    }
  }
];
