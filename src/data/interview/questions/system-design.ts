import type { InterviewQuestion } from '../types';

export const systemDesignQuestions: InterviewQuestion[] = [
  {
    slug: 'design-url-shortener',
    category: 'system-design',
    topic: 'Scalability',
    title: 'Design a URL shortener at scale',
    difficulty: 'intermediate',
    frequency: 'very-often',
    round: 'system-design',
    type: 'design',
    tags: ['url-shortener', 'scalability', 'caching', 'key-value-store', 'id-generation'],
    oneLiner: 'A read-dominated system whose entire design funnels into one decision: how to generate tiny, unique, unguessable keys.',
    whyAsked:
      'Interviewers want to see structured estimation before design: pinning requirements, deriving a 100:1 read:write ratio, and letting those numbers pick the architecture. The shortener also forces a real decision — ID generation strategy and 301 versus 302 — where every answer has a visible consequence for scale and analytics.',
    mentalModel:
      'URL shortening is a write-once, read-forever lookup: a counter or Snowflake ID encoded in base62 produces the key, a key-value store is the source of truth, and caches at the edge absorb the 100:1 read traffic. The redirect status code is a product decision: 301 maximizes cacheability, 302 keeps every click visible to analytics.',
    steps: [
      {
        title: 'Requirements and back-of-envelope math',
        body: `Start by pinning requirements: shorten a long URL into a small one, redirect with minimal latency, and optionally support custom aliases, expiry, and click analytics. Then do the math out loud. Suppose 100 million new links per day; that is about 1,160 writes per second. Because a link is clicked roughly 100 times for every one created, reads land near 116,000 per second, a 100:1 read-to-write ratio. Seven base62 characters give 62^7, about 3.5 trillion keys, so a workload at this scale lasts decades. The estimate drives every later decision: the system is read-dominated, so caches, replicas, and CDN edges matter far more than write throughput, and the storage footprint stays trivial once you store only the mapping and a little metadata. Watch the animation as the request walks from the client through the stateless API tier while the read:write math sets the design priorities.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'client', label: 'Client' },
            { id: 'api', label: 'API Service' },
            { id: 'estimate', label: 'Envelope Math', sublabel: '100:1 read:write' },
            { id: 'store', label: 'KV Store' },
            { id: 'cache', label: 'Cache' },
          ],
          phases: [
            { id: 'p1', caption: 'The client pastes a long URL; the API tier is stateless and scales horizontally.', packets: [{ from: 'client', to: 'api' }], activeNodeIds: ['client'] },
            { id: 'p2', caption: 'Envelope math: 100M new links per day is about 1,160 writes per second.', packets: [{ from: 'api', to: 'estimate' }], activeNodeIds: ['estimate'] },
            { id: 'p3', caption: 'Each link is clicked roughly 100 times, so reads reach about 116K per second.', doneNodeIds: ['client'], activeNodeIds: ['estimate'] },
            { id: 'p4', caption: 'Read dominance pushes the design toward a KV store, caches, and replicas.', packets: [{ from: 'estimate', to: 'store' }], doneNodeIds: ['api', 'estimate'], activeNodeIds: ['store'] },
            { id: 'p5', caption: 'Cache and CDN absorb read traffic; writes stay cheap and storage stays tiny.', packets: [{ from: 'store', to: 'cache' }], doneNodeIds: ['client', 'api', 'estimate', 'store'], activeNodeIds: ['cache'] },
          ],
        },
      },
      {
        title: 'Generate unique base62 keys',
        body: `Generating the key is the only genuinely hard part. Three families exist. A global counter encoded in base62 is simple, collision-free, and predictable, but sequential keys are guessable and one counter is a bottleneck — allocate disjoint counter ranges to app servers to scale it horizontally. Hashing the long URL and taking the first seven base62 characters is idempotent, so the same URL can return the same short link, but collisions and hot-URL skew need handling with a conditional put and retry. Snowflake-style IDs combine a timestamp, a machine id, and a per-machine sequence to produce unique keys across nodes without coordination; encode them in base62 afterwards. Most production designs pick counter ranges or Snowflake and reserve hashing for deduplication. Whatever the generator, uniqueness must be enforced at write time by a conditional put, never assumed. Watch the animation as the counter is consumed, encoded, and committed exactly once.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'client', label: 'Client' },
            { id: 'api', label: 'API Service' },
            { id: 'idgen', label: 'ID Generator', sublabel: 'base62' },
            { id: 'store', label: 'KV Store' },
          ],
          phases: [
            { id: 'p1', caption: 'A write request arrives at the API tier with a long URL.', packets: [{ from: 'client', to: 'api' }], activeNodeIds: ['client'] },
            { id: 'p2', caption: 'The ID generator claims the next counter range or a Snowflake ID.', packets: [{ from: 'api', to: 'idgen' }], activeNodeIds: ['idgen'] },
            { id: 'p3', caption: 'Base62-encode the integer into six or seven URL-safe characters.', activeNodeIds: ['idgen'] },
            { id: 'p4', caption: 'A conditional put stores key to URL and rejects any duplicate.', packets: [{ from: 'idgen', to: 'store' }], doneNodeIds: ['idgen'], activeNodeIds: ['store'] },
            { id: 'p5', caption: 'The short link returns to the client; the mapping is durable.', doneNodeIds: ['api', 'idgen', 'store'], activeNodeIds: ['client'] },
          ],
        },
      },
      {
        title: '301 versus 302 redirects',
        body: `Redirect semantics decide both caching and analytics. A 301 Moved Permanently tells the browser to cache the redirect, so the second click never reaches your servers — superb for scale and latency, terrible for counting clicks because the origin is bypassed. A 302 Found or 307 Temporary Redirect is temporary, so browsers must ask again every time: every click hits your edge and API, exactly what click analytics and per-link counters need, at the cost of extra traffic. Most link shorteners choose 302 and reclaim the cost with an aggressive edge cache. If analytics do not matter, 301 plus a long Cache-Control turns the browser itself into your CDN. Watch the animation: with 301 the browser cache answers alone and no origin sees the click; with 302 the request returns to the origin and an analytics counter increments on every hop. Pick the status code from the product requirement, not by habit.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'client', label: 'Client' },
            { id: 'api', label: 'API Service' },
            { id: 'redirect', label: 'Redirect' },
            { id: 'browsercache', label: 'Browser Cache' },
            { id: 'analytics', label: 'Analytics' },
          ],
          phases: [
            { id: 'p1', caption: 'A click requests /abc123 and the API must choose a status code.', packets: [{ from: 'client', to: 'api' }], activeNodeIds: ['client'] },
            { id: 'p2', caption: 'Answer 301 Moved Permanently and the browser caches the redirect.', packets: [{ from: 'api', to: 'browsercache', label: '301' }], activeNodeIds: ['api', 'browsercache'] },
            { id: 'p3', caption: 'The next click never leaves the device — great for scale, invisible to analytics.', doneNodeIds: ['api'], activeNodeIds: ['browsercache'] },
            { id: 'p4', caption: 'Switch to 302 Found: every click returns to the API.', packets: [{ from: 'api', to: 'redirect', label: '302' }], activeNodeIds: ['redirect'] },
            { id: 'p5', caption: 'Each hop increments the click counter, trading bandwidth for visibility.', packets: [{ from: 'redirect', to: 'analytics' }], doneNodeIds: ['redirect', 'browsercache'], activeNodeIds: ['analytics'] },
            { id: 'p6', caption: 'Choose 302 or 307 when clicks must be counted; 301 when they must not.', doneNodeIds: ['client', 'api', 'redirect', 'browsercache', 'analytics'] },
          ],
        },
      },
      {
        title: 'Write path end to end',
        body: `Now walk the write path end to end. The client POSTs the long URL to /shorten. The API service normalizes it — adding a missing scheme, rejecting javascript: and data: URLs, optionally stripping tracking parameters — then checks the custom alias, per-key rate limits, and abuse rules. It asks the ID generator for the next key, and the generator returns a base62 string from a pre-allocated counter range or a Snowflake ID. The service writes key to long URL plus metadata such as owner, creation time, and expiry into the KV store using a conditional put, so a race can never overwrite an existing mapping. Only after the store acknowledges does the API return 201 Created with the short link. The cache is deliberately left cold: it fills on first read, avoiding pollution from links that may never be clicked. The write path stays small — no joins, no fan-out, one durable put — which keeps a 100M-per-day workload affordable.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'client', label: 'Client' },
            { id: 'api', label: 'API Service' },
            { id: 'idgen', label: 'ID Generator', sublabel: 'base62' },
            { id: 'store', label: 'KV Store' },
            { id: 'cache', label: 'Cache' },
            { id: 'redirect', label: 'Redirect' },
          ],
          phases: [
            { id: 'p1', caption: 'The client POSTs a long URL to /shorten.', packets: [{ from: 'client', to: 'api' }], activeNodeIds: ['client'] },
            { id: 'p2', caption: 'The API normalizes the URL and enforces alias and rate-limit checks.', doneNodeIds: ['client'], activeNodeIds: ['api'] },
            { id: 'p3', caption: 'The API service asks the ID generator for the next base62 key.', packets: [{ from: 'api', to: 'idgen' }], activeNodeIds: ['idgen'] },
            { id: 'p4', caption: 'A conditional put writes key to URL and cannot overwrite.', packets: [{ from: 'idgen', to: 'store', label: 'put abc12X' }], doneNodeIds: ['idgen'], activeNodeIds: ['store'] },
            { id: 'p5', caption: 'The store acknowledges the durable write.', doneNodeIds: ['store'], activeNodeIds: ['api'] },
            { id: 'p6', caption: '201 Created returns the short link; the cache stays cold until first read.', packets: [{ from: 'api', to: 'client', label: '201 Created' }], doneNodeIds: ['api', 'idgen', 'store', 'client'], activeNodeIds: ['cache'] },
          ],
        },
      },
      {
        title: 'Read path through cache',
        body: `Reads dominate, so the read path decides the latency users feel. A click first hits the CDN or edge cache keyed by the short code; a hit returns a 302 immediately, with no origin traffic and sub-millisecond latency. On a miss the request reaches the API service, which checks a shared in-process or Redis cache before the KV store. Only a second miss reaches the store, and the value is written back into the cache with a TTL and LRU eviction so hot links stay resident. Caches in front of a KV store routinely absorb 95 percent or more of read traffic; the store then handles only cold keys and the long tail. Watch the animation trace the hit branch and the miss branch side by side: on a hit the store is never touched, and on a miss the backfill makes the next click cheap. Expired links should be cached negatively for a short TTL so attackers cannot hammer the store with dead keys.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'client', label: 'Client' },
            { id: 'cdn', label: 'CDN / Edge Cache' },
            { id: 'api', label: 'API Service' },
            { id: 'cache', label: 'Cache' },
            { id: 'store', label: 'KV Store' },
            { id: 'redirect', label: 'Redirect' },
          ],
          phases: [
            { id: 'p1', caption: 'A click hits the nearest edge; the short code is the cache key.', packets: [{ from: 'client', to: 'cdn', label: 'GET /abc123' }], activeNodeIds: ['client'] },
            { id: 'p2', caption: 'Edge hit: the CDN already knows the mapping.', packets: [{ from: 'cdn', to: 'redirect', label: 'hit' }], activeNodeIds: ['cdn'] },
            { id: 'p3', caption: '302 redirects instantly without touching the origin.', packets: [{ from: 'redirect', to: 'client', label: '302 long URL' }], doneNodeIds: ['cdn', 'redirect'], activeNodeIds: ['client'] },
            { id: 'p4', caption: 'On a miss the edge forwards to the API service.', packets: [{ from: 'cdn', to: 'api', label: 'miss' }], activeNodeIds: ['api'] },
            { id: 'p5', caption: 'The API checks the shared cache before the store.', packets: [{ from: 'api', to: 'cache', label: 'lookup' }], doneNodeIds: ['api'], activeNodeIds: ['cache'] },
            { id: 'p6', caption: 'A cache miss reads the KV store and comes back with the URL.', packets: [{ from: 'cache', to: 'store', label: 'miss' }], doneNodeIds: ['cache'], activeNodeIds: ['store'] },
            { id: 'p7', caption: 'Backfill completes with a TTL; hot keys stay cached and the store rests.', packets: [{ from: 'store', to: 'cache', label: 'backfill' }], doneNodeIds: ['client', 'cdn', 'api', 'store'], activeNodeIds: ['cache'] },
          ],
        },
      },
    ],
    edgeCases: [
      'Hash collisions in a hash-based generator silently overwrite a mapping: conditional-put the candidate key and retry with a salted input on conflict.',
      'Sequential base62 keys are guessable: shuffle the encoding alphabet, mix in a random salt, or use Snowflake IDs when enumeration is a risk.',
      '301 responses bypass analytics entirely: use 302 or 307 when clicks must be counted, and reserve 301 for immutable links.',
      'Cache stampede on a viral link: add jittered TTLs and single-flight request coalescing so one miss cannot flood the KV store.',
      'Custom aliases and reserved words collide with generated keys: keep aliases in the same keyspace and reject reserved paths such as api, admin, and favicon.',
    ],
    followUps: [
      { q: 'How do you scale the ID generator across regions?', a: 'Use Snowflake-style IDs with region and datacenter bits, or hand each generator a disjoint counter range so no two nodes can ever produce the same value.' },
      { q: 'Why not store the mapping in a relational database?', a: 'A KV store gives O(1) lookups and simpler horizontal sharding for a workload with no relational queries; a relational database can work but pays for features this design never uses.' },
      { q: 'How do you count clicks without slowing redirects?', a: 'Emit the click asynchronously to a queue or log and aggregate offline; the redirect only waits for the cache lookup.' },
      { q: 'What about link abuse and spam?', a: 'Rate-limit per API key and IP, scan destinations against malware blocklists, and keep a takedown path with expiring links.' },
    ],
    relatedEngine: { label: 'Explore the System Design visualizer', href: '/fullstack/systemdesignviz' },
  },
  {
    slug: 'consistent-hashing-virtual-nodes',
    category: 'system-design',
    topic: 'Scalability',
    title: 'Explain consistent hashing and virtual nodes',
    difficulty: 'advanced',
    frequency: 'very-often',
    round: 'system-design',
    type: 'concept',
    tags: ['consistent-hashing', 'sharding', 'virtual-nodes', 'scalability'],
    oneLiner: 'Modulo hashing reshuffles nearly every key when the node count changes; a consistent-hash ring with virtual nodes moves only the minimum.',
    whyAsked:
      'This question separates candidates who memorized "add virtual nodes" from those who can do the distribution math: why modulo hashing remaps 1 minus 1/n of keys, why the ring remaps only about K/n, and how vnodes turn a few arbitrary arcs into a smooth distribution. The follow-ups about failures and rebalancing test whether the model survives contact with operations.',
    mentalModel:
      'Map servers and keys onto the same circular hash space, then assign each key to the first server clockwise. When membership changes, only the arcs that changed hands move — about K/n keys instead of K times (1 minus 1/n) for modulo. Virtual nodes multiply each server\'s presence on the ring so small clusters average out.',
    steps: [
      {
        title: 'Place keys on the ring',
        body: `Consistent hashing places both nodes and keys on a circular hash space, usually 0 to 2^32. Each server is hashed to a position on the ring, and each key is assigned to the first node clockwise from the key's own hash. No central directory is needed: any participant can compute ownership from the ring and the same hash function. The catch is variance. Three physical nodes land at arbitrary points, so the arcs between them are wildly uneven — one node can own 52 percent of the keyspace while another owns 17 percent. Small clusters are the worst case because there are too few sample points for the distribution to average out. Watch the animation as server names and keys are projected onto the ring and each key walks clockwise to its owner. That imbalance is exactly what virtual nodes fix later; first let the simple ring expose the problem.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'client', label: 'Client' },
            { id: 'ring', label: 'Hash Ring', sublabel: '0 to 2^32' },
            { id: 'nodeA', label: 'Node A', sublabel: 'arc 52%' },
            { id: 'nodeB', label: 'Node B', sublabel: 'arc 31%' },
            { id: 'nodeC', label: 'Node C', sublabel: 'arc 17%' },
          ],
          phases: [
            { id: 'p1', caption: 'Hash each server name to a point on the 0 to 2^32 ring.', packets: [{ from: 'client', to: 'ring' }], activeNodeIds: ['client'] },
            { id: 'p2', caption: 'Hash a key and walk clockwise from its position.', packets: [{ from: 'ring', to: 'nodeA' }], activeNodeIds: ['ring'] },
            { id: 'p3', caption: 'Node A is the first node clockwise, so it owns that key.', doneNodeIds: ['client', 'ring'], activeNodeIds: ['nodeA'] },
            { id: 'p4', caption: 'More keys land on their arcs; A gets a wide arc and C a narrow one.', packets: [{ from: 'nodeA', to: 'nodeB', label: 'next key' }], activeNodeIds: ['nodeB'] },
            { id: 'p5', caption: 'Three nodes, uneven arcs: 52 percent, 31 percent, 17 percent.', doneNodeIds: ['client', 'ring'], activeNodeIds: ['nodeA', 'nodeB', 'nodeC'] },
          ],
        },
      },
      {
        title: 'Adding a node remaps keys',
        body: `Now add a fourth node and count what moves. With naive modulo hashing, key k lives at hash(k) mod N. Changing N from 3 to 4 changes the modulus for every key, so a key survives only if hash(k) mod 3 equals hash(k) mod 4 — on average just one in N of them. Roughly 1 minus 1/N, here 75 percent, of all keys are remapped, and almost every cache entry becomes a miss or every partition is rewritten at once. The ring behaves differently. Adding node D only affects keys whose position lies between D's predecessor and D, because only those keys find a new first-node-clockwise. That is D's arc, on average 1/N of the keyspace. Watch the animation contrast the two: the modulo panel drains almost all keys, while the ring moves a single arc. The captions show the remapped fraction — 75 percent versus 25 percent — which is the difference between a full migration and a bounded one.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'ring', label: 'Hash Ring' },
            { id: 'modulo', label: 'Modulo N', sublabel: 'hash % 4' },
            { id: 'nodeA', label: 'Node A' },
            { id: 'nodeB', label: 'Node B' },
            { id: 'nodeC', label: 'Node C' },
            { id: 'nodeD', label: 'Node D', sublabel: 'new' },
          ],
          phases: [
            { id: 'p1', caption: 'Node D hashes onto the ring between C and A.', packets: [{ from: 'ring', to: 'nodeD' }], activeNodeIds: ['ring'] },
            { id: 'p2', caption: 'Modulo hashing now places keys at hash(key) mod 4, so 75 percent change owner.', activeNodeIds: ['modulo'] },
            { id: 'p3', caption: 'On the ring only the arc between C and D changes hands.', packets: [{ from: 'nodeC', to: 'nodeD', label: 'arc transfer' }], doneNodeIds: ['nodeC'], activeNodeIds: ['nodeD'] },
            { id: 'p4', caption: 'Keys outside that arc keep their owner: 25 percent remapped, not 75.', doneNodeIds: ['ring', 'modulo'], activeNodeIds: ['nodeA', 'nodeB'] },
            { id: 'p5', caption: 'Same cluster change, one quarter of the churn.', doneNodeIds: ['nodeA', 'nodeB', 'nodeC'], activeNodeIds: ['nodeD'] },
          ],
        },
      },
      {
        title: 'Redistribute only the new arc',
        body: `The ring tells you which keys move but not how to move them safely. Take the arc between C and D: those keys currently resolve to the next node clockwise after D, which is A. A scans its store for keys in that range and streams them to D, so the transfer is bounded by one arc of data instead of the whole dataset. During the move the system has a choice: dual-write to both A and D and read from A until the backfill completes, or accept a short read-only window. When D has caught up and the backfill is verified, the routing table flips and D serves the arc; A deletes its stale copies lazily, and the extra writes stop. Watch the animation as exactly one arc of keys streams to the new node while every other arc stays put. Movement proportional to the membership change, not to the dataset size, is the entire point of consistent hashing.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'ring', label: 'Hash Ring' },
            { id: 'client', label: 'Client' },
            { id: 'nodeA', label: 'Node A', sublabel: 'old owner' },
            { id: 'nodeB', label: 'Node B' },
            { id: 'nodeC', label: 'Node C' },
            { id: 'nodeD', label: 'Node D', sublabel: 'new owner' },
          ],
          phases: [
            { id: 'p1', caption: 'After D joins, keys in the arc between C and D resolve to D.', activeNodeIds: ['ring'] },
            { id: 'p2', caption: 'A scans its store for exactly those keys and streams them to D.', packets: [{ from: 'nodeA', to: 'nodeD', label: 'backfill' }], activeNodeIds: ['nodeA', 'nodeD'] },
            { id: 'p3', caption: 'Dual writes keep both copies fresh during the backfill.', packets: [{ from: 'client', to: 'nodeA', label: 'write' }, { from: 'client', to: 'nodeD', label: 'write' }], activeNodeIds: ['client'] },
            { id: 'p4', caption: 'Every key outside the arc stays put; movement matches the change.', doneNodeIds: ['client'], activeNodeIds: ['nodeB', 'nodeC'] },
            { id: 'p5', caption: 'Cutover: the ring updates, D serves the arc, A drops stale copies.', doneNodeIds: ['nodeA', 'nodeB', 'nodeC'], activeNodeIds: ['ring', 'nodeD'] },
          ],
        },
      },
      {
        title: 'Failure walks keys clockwise',
        body: `When a node dies, the ring does not stall: the keys it owned simply fall to the next node clockwise, because ownership is recomputed locally on every client. That is the availability win over a central directory. The failure mode is a hotspot: the successor now serves its own arc plus the dead node's arc, and without replicas it takes double the traffic at the worst possible moment. The standard mitigation is replication — store each key on the next R nodes clockwise, typically three — plus load-aware rerouting while the cluster repairs. With replication in place, reads for the dead node fail over to the next replica immediately and the redistribution becomes background repair rather than an emergency. Watch the animation as Node B dies, its arc walks to C, the load doubles briefly, and the replicas on A and C absorb reads; the background repair then rebuilds the missing copies and the doubled load fades.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'ring', label: 'Hash Ring' },
            { id: 'client', label: 'Client' },
            { id: 'nodeA', label: 'Node A', sublabel: 'replica' },
            { id: 'nodeB', label: 'Node B', sublabel: 'down' },
            { id: 'nodeC', label: 'Node C', sublabel: 'successor' },
          ],
          phases: [
            { id: 'p1', caption: 'Node B stops answering health checks and is declared dead.', errorNodeIds: ['nodeB'], activeNodeIds: ['ring'] },
            { id: 'p2', caption: 'Clients recompute the ring locally: B keys walk clockwise to C.', packets: [{ from: 'nodeB', to: 'nodeC', label: 'keys' }], errorNodeIds: ['nodeB'], activeNodeIds: ['client', 'nodeC'] },
            { id: 'p3', caption: 'C serves its own arc plus the dead arc: double load until repair.', errorNodeIds: ['nodeB'], activeNodeIds: ['nodeC'] },
            { id: 'p4', caption: 'With replication factor 3, A and C already hold copies of B keys.', packets: [{ from: 'nodeC', to: 'nodeA', label: 'replica' }], errorNodeIds: ['nodeB'], activeNodeIds: ['nodeA'] },
            { id: 'p5', caption: 'Background repair rebuilds the lost replicas and the load normalizes.', doneNodeIds: ['client', 'nodeA', 'nodeC', 'ring'], activeNodeIds: ['nodeC'] },
          ],
        },
      },
      {
        title: 'Virtual nodes smooth the ring',
        body: `Virtual nodes are the fix for both hotspots and churn. Instead of one point per server, each physical node is hashed to 100 to 200 points, its virtual nodes, spread around the ring. A key still walks clockwise to the first point, but now the small arcs average out: the node that would have owned a 52 percent super-arc owns many small arcs that sum to roughly 1/N of the keyspace. With 150 vnodes per node, the standard deviation of load shrinks to roughly 1 over the square root of 150 — a few percent — so a three-node cluster lands near 33/33/33. Vnodes also soften joins and failures: adding one server inserts 150 small arcs instead of one giant one, so transferred keys spread across many nodes in small pieces, and a dead node's load is absorbed by many successors. Watch the final animation as the bold arcs dissolve into hundreds of tiny arcs converging on 36/33/31.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'ring', label: 'Hash Ring', sublabel: 'vnodes x150' },
            { id: 'nodeA', label: 'Node A', sublabel: '36%' },
            { id: 'nodeB', label: 'Node B', sublabel: '33%' },
            { id: 'nodeC', label: 'Node C', sublabel: '31%' },
          ],
          phases: [
            { id: 'p1', caption: 'Each physical node is hashed to 150 virtual points on the ring.', activeNodeIds: ['ring'] },
            { id: 'p2', caption: 'A key walks to the first virtual point, not the first server.', packets: [{ from: 'ring', to: 'nodeA', label: 'vnode hit' }], activeNodeIds: ['nodeA'] },
            { id: 'p3', caption: 'The old super-arc fractures into many small arcs across all nodes.', packets: [{ from: 'nodeA', to: 'nodeB', label: 'small arcs' }], activeNodeIds: ['nodeB'] },
            { id: 'p4', caption: 'Adding or losing a server moves many small arcs, not one giant one.', doneNodeIds: ['ring'], activeNodeIds: ['nodeC'] },
            { id: 'p5', caption: 'Load converges: 36%, 33%, 31% — imbalance within a few percent.', doneNodeIds: ['ring'], activeNodeIds: ['nodeA', 'nodeB', 'nodeC'] },
          ],
        },
      },
    ],
    edgeCases: [
      'Too few virtual nodes leave visible imbalance: use 100-200 vnodes per physical node and review real key counts, not just ring theory.',
      'Poor vnode hashing collides or clumps points: use a strong hash such as 128-bit MurmurHash or xxHash and deduplicate positions.',
      'Hot keys defeat any hashing scheme because one key cannot be split: cache them, shard them with a random suffix, or replicate them separately.',
      'Rebalancing without replication risks data loss when a node dies mid-transfer: keep R copies on the next clockwise nodes and repair asynchronously.',
      'Clients with stale ring views briefly route to the wrong node: version the ring through gossip or a config service and retry lookups on miss.',
    ],
    followUps: [
      { q: 'Why does adding a node to modulo hashing move most keys?', a: 'Every key is placed by hash(key) mod N, and changing N changes the remainder for nearly every key, so only about 1/N keep their owner — roughly 75 percent move when N goes from 3 to 4.' },
      { q: 'How many virtual nodes are enough?', a: '100 to 200 per physical node is the usual range; beyond that the marginal smoothing is small while the routing table grows, so more vnodes buy little.' },
      { q: 'What happens to a dead node\'s keys?', a: 'They fall clockwise to the next node. With replication factor R, reads fail over to a replica instantly and a background process rebuilds the lost copies.' },
      { q: 'Can consistent hashing guarantee even distribution?', a: 'No. With enough vnodes it bounds imbalance to a few percent in expectation, but hot keys and heterogeneous nodes still need load-aware scheduling.' },
    ],
    relatedEngine: { label: 'Explore the System Design visualizer', href: '/fullstack/systemdesignviz' },
  },
  {
    slug: 'rate-limiter-design',
    category: 'system-design',
    topic: 'Traffic',
    title: 'Design a distributed rate limiter',
    difficulty: 'intermediate',
    frequency: 'very-often',
    round: 'system-design',
    type: 'design',
    tags: ['rate-limiting', 'token-bucket', 'redis', 'traffic-control'],
    oneLiner: 'A rate limiter is a distributed race: pick an algorithm, make one shared counter atomic, and give clients a clean 429 contract.',
    whyAsked:
      'Rate limiting looks like a simple counter until it becomes distributed. Interviewers probe the algorithmic trade-offs — fixed versus sliding windows, token versus leaky buckets — and then the correctness trap: two servers reading the same token before either writes. Candidates who reach for an atomic shared operation, and who design a clean 429 contract, stand out from those who only sketch an in-memory counter.',
    mentalModel:
      'At its core a limiter answers one atomic question: does this key have budget left? The token bucket is the usual choice because it allows bursts up to capacity while enforcing the refill rate on average. In a distributed system the bucket lives in a shared store, and the read-refill-decrement happens in one atomic step so concurrent servers cannot double-spend.',
    steps: [
      {
        title: 'Compare four rate limiters',
        body: `Four standard algorithms fit different goals. Fixed window counts requests per interval: trivial and memory-light, but bursts at a window boundary can pass twice the limit because the counter resets. Sliding window counter interpolates the previous window count, smoothing boundaries at almost no extra memory, while a full sliding-window log is exact but stores every timestamp. Token bucket holds up to C tokens and refills at R tokens per second; each request costs one token, so steady traffic is limited to R while short bursts up to C are allowed — the best fit for public APIs. Leaky bucket is the mirror image: requests enter a queue and drain at a constant rate, which smooths output but adds queueing latency. Watch the animation compare their shapes: the fixed window boundary spike, the smoothed sliding edge, the bucket burst then cap, and the leaky bucket steady drip. Choose based on whether you are protecting a backend or shaping traffic.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'request', label: 'Request' },
            { id: 'fixedwindow', label: 'Fixed Window', sublabel: 'count / interval' },
            { id: 'slidingwindow', label: 'Sliding Window', sublabel: 'blended count' },
            { id: 'tokenbucket', label: 'Token Bucket', sublabel: 'C tokens, refill R' },
            { id: 'leakybucket', label: 'Leaky Bucket', sublabel: 'drain at fixed rate' },
            { id: 'backend', label: 'Backend' },
          ],
          phases: [
            { id: 'p1', caption: 'A request arrives and needs a limiting policy.', activeNodeIds: ['request'] },
            { id: 'p2', caption: 'Fixed window counts per minute but can double at the boundary.', packets: [{ from: 'request', to: 'fixedwindow' }], activeNodeIds: ['fixedwindow'] },
            { id: 'p3', caption: 'Sliding window blends the previous interval, smoothing the edge.', packets: [{ from: 'fixedwindow', to: 'slidingwindow' }], doneNodeIds: ['fixedwindow'], activeNodeIds: ['slidingwindow'] },
            { id: 'p4', caption: 'Token bucket allows a burst up to capacity, then refills steadily.', packets: [{ from: 'slidingwindow', to: 'tokenbucket' }], doneNodeIds: ['slidingwindow'], activeNodeIds: ['tokenbucket'] },
            { id: 'p5', caption: 'Leaky bucket queues and drains at a constant rate, adding latency.', packets: [{ from: 'tokenbucket', to: 'leakybucket' }], doneNodeIds: ['tokenbucket'], activeNodeIds: ['leakybucket'] },
            { id: 'p6', caption: 'Protect the backend with token bucket; shape output with leaky bucket.', doneNodeIds: ['leakybucket'], activeNodeIds: ['backend'] },
          ],
        },
      },
      {
        title: 'Token bucket allows a request',
        body: `Follow one allowed request. It arrives at the edge and is keyed by identity — API key for partners, user id for logged-in traffic, IP as a fallback. The edge asks the rate limiter for that key, and the limiter loads the bucket state: current tokens and last refill timestamp. Tokens regenerate at a fixed rate, so the limiter computes how many accumulated since the last check, caps the total at capacity, and checks the request cost. If at least one token is available, the limiter deducts it and returns allow, and the edge forwards the request to the backend. The backend never sees the limiter on the allowed path; the check is out-of-band and adds sub-millisecond overhead. Watch the animation: one token leaves the bucket, the request flows through, and the response carries limit headers so well-behaved clients can self-throttle before they are ever rejected.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'request', label: 'Request' },
            { id: 'edge', label: 'Edge' },
            { id: 'limiter', label: 'Rate Limiter', sublabel: 'Redis' },
            { id: 'bucket', label: 'Token Bucket', sublabel: 'C tokens, refill R' },
            { id: 'backend', label: 'Backend' },
          ],
          phases: [
            { id: 'p1', caption: 'A request arrives at the edge and is keyed by API key or user id.', packets: [{ from: 'request', to: 'edge' }], activeNodeIds: ['request'] },
            { id: 'p2', caption: 'The edge asks the limiter for the bucket state of that key.', packets: [{ from: 'edge', to: 'limiter' }], activeNodeIds: ['edge'] },
            { id: 'p3', caption: 'Tokens accrued since the last check are added, capped at capacity.', packets: [{ from: 'limiter', to: 'bucket' }], activeNodeIds: ['bucket'] },
            { id: 'p4', caption: 'One token is consumed and the limiter returns allow.', packets: [{ from: 'bucket', to: 'limiter', label: 'token spent' }], doneNodeIds: ['bucket'], activeNodeIds: ['limiter'] },
            { id: 'p5', caption: 'The backend handles the request; headers report the remaining quota.', packets: [{ from: 'limiter', to: 'backend', label: 'allow' }], doneNodeIds: ['request', 'edge', 'limiter', 'bucket'], activeNodeIds: ['backend'] },
          ],
        },
      },
      {
        title: 'Bursts drain the bucket',
        body: `Token bucket limits the average rate but intentionally allows bursts. If the bucket capacity is 100 and the refill is 10 requests per second, a client that has been idle accumulates up to 100 tokens; when it fires, the first 100 requests pass instantly and the bucket hits empty. From then on the client is limited to the 10-per-second refill, so a sustained overload cannot last. This matches real traffic: a mobile app waking up and syncing should not be throttled to the same rate as its long-run average. Watch the animation as the bucket drains in a burst to exactly zero, then sees each refill token consumed by the next request. Capacity is the maximum burst; refill rate is the sustained throughput. Tune C to the largest burst you can absorb behind the limiter and R to what the backend can actually serve per key, and remember that many keys burst at once even when each individual bucket looks fine.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'request', label: 'Request' },
            { id: 'edge', label: 'Edge' },
            { id: 'limiter', label: 'Rate Limiter', sublabel: 'Redis' },
            { id: 'bucket', label: 'Token Bucket', sublabel: 'C = 100, R = 10/s' },
            { id: 'backend', label: 'Backend' },
          ],
          phases: [
            { id: 'p1', caption: 'After idle time the bucket is full again: 100 tokens.', activeNodeIds: ['bucket'] },
            { id: 'p2', caption: 'A burst arrives and every request consumes one token.', packets: [{ from: 'request', to: 'limiter', label: 'burst' }], activeNodeIds: ['request', 'limiter'] },
            { id: 'p3', caption: 'The bucket drains to zero; capacity is the largest allowed burst.', packets: [{ from: 'limiter', to: 'bucket' }], activeNodeIds: ['bucket'] },
            { id: 'p4', caption: 'Refill adds 10 tokens per second; each new request spends one.', packets: [{ from: 'bucket', to: 'backend', label: '10/s' }], activeNodeIds: ['backend'] },
            { id: 'p5', caption: 'Sustained traffic is capped at the refill rate; bursts cannot last.', doneNodeIds: ['request', 'edge', 'bucket', 'backend'], activeNodeIds: ['limiter'] },
          ],
        },
      },
      {
        title: 'Atomic check across servers',
        body: `One server can keep buckets in memory, but ten servers each allowing the full limit multiply the real limit by ten. The state must be shared, and the check-and-decrement must be atomic: between a GET and a SET, another request can read the same token count and both proceed — a classic race that silently doubles the allowed rate. Redis solves this with a single-threaded execution model plus atomic operations. The standard pattern is a small Lua script: read tokens and the last refill time, compute regenerated tokens, and if at least one is available, write back the decremented count and return allow, all in one atomic step. Set the key to expire after a few refill periods so idle buckets do not leak memory. Watch the animation as two simultaneous requests serialize inside Redis: the first decrements, and the second sees the new value and is correctly rejected when the bucket runs dry.`,
        code: {
          language: 'lua',
          source: `-- Atomic refill + check + decrement (Redis)
local key = KEYS[1]
local rate = tonumber(ARGV[1])      -- tokens per second
local capacity = tonumber(ARGV[2])  -- max burst
local now = tonumber(ARGV[3])
local cost = tonumber(ARGV[4] or '1')

local tokens = tonumber(redis.call('HGET', key, 'tokens') or capacity)
local ts = tonumber(redis.call('HGET', key, 'ts') or now)
tokens = math.min(capacity, tokens + (now - ts) * rate)

if tokens >= cost then
  redis.call('HSET', key, 'tokens', tokens - cost, 'ts', now)
  redis.call('EXPIRE', key, math.ceil(capacity / rate) * 4)
  return 1  -- allow
end
return 0    -- deny`,
        },
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'request', label: 'Request' },
            { id: 'edge', label: 'Edge' },
            { id: 'limiter', label: 'Rate Limiter', sublabel: 'Redis' },
            { id: 'bucket', label: 'Token Bucket' },
            { id: 'backend', label: 'Backend' },
          ],
          phases: [
            { id: 'p1', caption: 'Two app servers receive requests for the same key at the same moment.', packets: [{ from: 'request', to: 'edge', label: 'req 1' }, { from: 'request', to: 'edge', label: 'req 2' }], activeNodeIds: ['request'] },
            { id: 'p2', caption: 'A naive GET then SET would let both read the same token count.', errorNodeIds: ['limiter'], activeNodeIds: ['limiter'] },
            { id: 'p3', caption: 'Redis executes the Lua script atomically: refill, check, decrement.', packets: [{ from: 'edge', to: 'limiter', label: 'EVAL' }], activeNodeIds: ['limiter'] },
            { id: 'p4', caption: 'The first request takes the token; the second sees zero left.', packets: [{ from: 'limiter', to: 'bucket', label: 'decrement' }], activeNodeIds: ['bucket'] },
            { id: 'p5', caption: 'One allow, one deny — the distributed race is closed.', doneNodeIds: ['request', 'edge', 'limiter', 'bucket'], activeNodeIds: ['backend'] },
          ],
        },
      },
      {
        title: 'Deny with 429 headers',
        body: `When the limiter says no, the response itself is part of the design. Return HTTP 429 Too Many Requests, not a generic 500 and not a silent drop, and include machine-readable headers: RateLimit-Limit for the quota, RateLimit-Remaining for tokens left, RateLimit-Reset for seconds until refill, and Retry-After so well-behaved clients can back off precisely. Do not leak implementation details; a clear contract lets SDKs implement exponential backoff with jitter and avoids a thundering herd when a window resets. Key granularity matters too: per API key protects the platform, per user protects fairness, and per IP catches anonymous abuse but risks punishing everyone behind one NAT address. Watch the animation: the bucket is empty, the limiter returns deny, the edge short-circuits with 429 and headers, and the backend never sees the request. Cheap rejection at the edge is the entire point of a limiter.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'request', label: 'Request' },
            { id: 'edge', label: 'Edge' },
            { id: 'limiter', label: 'Rate Limiter', sublabel: 'Redis' },
            { id: 'bucket', label: 'Token Bucket', sublabel: 'empty' },
            { id: 'backend', label: 'Backend' },
            { id: 'reject', label: '429', sublabel: 'Too Many Requests' },
          ],
          phases: [
            { id: 'p1', caption: 'The bucket is empty; the next request finds zero tokens.', activeNodeIds: ['bucket'] },
            { id: 'p2', caption: 'The limiter returns deny before any backend work happens.', packets: [{ from: 'limiter', to: 'edge', label: 'deny' }], doneNodeIds: ['bucket'], activeNodeIds: ['limiter'] },
            { id: 'p3', caption: 'The edge short-circuits and answers 429 Too Many Requests.', packets: [{ from: 'edge', to: 'reject', label: '429' }], activeNodeIds: ['reject'] },
            { id: 'p4', caption: 'Headers carry the contract: remaining tokens, reset time, Retry-After.', packets: [{ from: 'reject', to: 'request', label: 'headers' }], activeNodeIds: ['request'] },
            { id: 'p5', caption: 'The backend never sees denied traffic: rejection is cheap at the edge.', doneNodeIds: ['request', 'edge', 'limiter', 'reject'], activeNodeIds: ['backend'] },
          ],
        },
      },
    ],
    edgeCases: [
      'Distributed races double the effective limit: make check-and-decrement atomic with a Redis Lua script or a single atomic operation, never a GET followed by a SET.',
      'Fixed windows allow twice the limit at boundaries: use a sliding window counter or a token bucket that enforces a sustained refill rate.',
      'A limiter outage must not take down the API: fail open by default or fail closed on security-sensitive routes, and fall back to a local in-memory limiter meanwhile.',
      'Per-IP limiting punishes users behind a shared NAT: prefer API keys or user ids when available and treat IP as a fallback dimension only.',
      'Clients retrying immediately after 429 create a thundering herd: return Retry-After and require jittered exponential backoff.',
    ],
    followUps: [
      { q: 'Why is the token bucket better than a fixed window for public APIs?', a: 'It bounds the sustained rate at the refill rate while still allowing short bursts up to capacity, and it has no boundary artifact that can pass double the limit.' },
      { q: 'How do you avoid a Redis race between GET and SET?', a: 'Run the read-refill-decrement logic inside a single Lua script so Redis executes it atomically on one thread.' },
      { q: 'What should happen if Redis is unreachable?', a: 'Decide the policy explicitly: fail open to protect availability or fail closed for fraud-sensitive routes, and fall back to a local limiter in the meantime.' },
      { q: 'How do you limit per user and per IP at the same time?', a: 'Keep multiple buckets per request (user, API key, IP) and reject if any one denies; each bucket enforces one dimension of fairness or protection.' },
    ],
    relatedEngine: { label: 'Explore the System Design visualizer', href: '/fullstack/systemdesignviz' },
  },
];
