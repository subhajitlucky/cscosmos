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
    oneLiner: 'A read-dominated system whose entire design funnels into one decision: how to generate tiny, unique keys — random ones are unguessable, while counter and Snowflake IDs stay unpredictable only if the sequence state stays secret.',
    whyAsked:
      'Interviewers want to see structured estimation before design: pinning requirements, deriving a 100:1 read:write ratio, and letting those numbers pick the architecture. The shortener also forces a real decision — ID generation strategy and 301 versus 302 — where every answer has a visible consequence for scale and analytics.',
    mentalModel:
      'URL shortening is a write-once, read-forever lookup: a key generator — a secret counter, a Snowflake, or random bytes encoded in base62 — produces the key, a key-value store is the source of truth, and caches at the edge absorb the 100:1 read traffic. Random keys are unguessable; counter and Snowflake keys are unpredictable only while the sequence state stays secret, and sequential values leak volume and ordering. The redirect status code is a product decision: 301 maximizes cacheability, 302 keeps every click visible to analytics.',
    steps: [
      {
        title: 'Requirements and back-of-envelope math',
        body: `Start by pinning requirements: shorten a long URL into a small one, redirect with minimal latency, and optionally support custom aliases, expiry, and click analytics. Then do the math out loud. Suppose 100 million new links per day; that is about 1,160 writes per second. Because a link is clicked roughly 100 times for every one created, reads land near 116,000 per second, a 100:1 read-to-write ratio. Seven base62 characters give 62^7, about 3.5 trillion keys, so a workload at this scale lasts decades. The estimate drives every later decision: the system is read-dominated, so caches, replicas, and CDN edges matter far more than write throughput, and the storage footprint stays trivial once you store only the mapping and a little metadata. Watch the animation as the request walks from the client through the stateless API tier while the read:write math sets the design priorities.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'board', icon: '📋', label: 'Math board' },
          ],
          frames: [
            { id: 'f1', caption: 'Paste a giant link → want a tiny one. 🔗', shout: { text: 'LONG → TINY', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'link', icon: '🔗', label: 'very long URL', at: 'you', effect: 'pop' }] },
            { id: 'f2', caption: 'Imagine 100 million NEW links every day. 📝', shout: { text: '100M / DAY', tone: 'info' }, cast: [{ id: 'board', state: 'working' }], tokens: [{ id: 'write', icon: '📝', label: '~1,160/sec', at: 'board', effect: 'pop' }] },
            { id: 'f3', caption: 'And each link gets clicked 100 times — reads flood in! 📖', shout: { text: '100× MORE READS', tone: 'info' }, cast: [{ id: 'board', state: 'working' }], tokens: [{ id: 'reads', icon: '📖', label: '~116k/sec', at: 'board', effect: 'pop' }] },
            { id: 'f4', caption: 'So the plan follows: reads must be fast, writes are easy. ⚡' , shout: { text: 'OPTIMIZE READS', tone: 'good' }, mood: 'good', cast: [{ id: 'you', state: 'happy' }], tokens: [{ id: 'fast', icon: '⚡', label: 'caches!', at: 'board', effect: 'pop' }] },
            { id: 'f5', caption: '7 tiny symbols = 3.5 trillion addresses. Room for decades! 🎫', shout: { text: '7 SYMBOLS = TRILLIONS', tone: 'good' }, mood: 'good', cast: [{ id: 'board', state: 'done' }], tokens: [{ id: 'space', icon: '🎫', label: 'base62', at: 'board', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Generate unique base62 keys',
        body: `Generating the key is the only genuinely hard part. Three families exist. A global counter encoded in base62 is simple, collision-free, and predictable, but sequential keys are guessable and one counter is a bottleneck — allocate disjoint counter ranges to app servers to scale it horizontally. Hashing the long URL and taking the first seven base62 characters is idempotent, so the same URL can return the same short link, but collisions and hot-URL skew need handling with a conditional put and retry. Snowflake-style IDs combine a timestamp, a machine id, and a per-machine sequence to produce unique keys across nodes without coordination; a raw 64-bit Snowflake takes 11 base62 characters, so short codes either encode a truncated slice (for example the low 41 timestamp-ish bits, which fits in seven) or accept the longer key. Most production designs pick counter ranges or Snowflake and reserve hashing for deduplication. Whatever the generator, uniqueness must be enforced at write time by a conditional put, never assumed. Watch the animation as the counter is consumed, encoded, and committed exactly once.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'machine', icon: '🎰', label: 'Ticket machine' },
            { id: 'vault', icon: '🗄️', label: 'Vault' },
            { id: 'clerk', icon: '🧑‍💼', label: 'Clerk' },
          ],
          frames: [
            { id: 'f1', caption: 'Every link needs its own tiny unique ticket. 🎫', shout: { text: 'MAKE A TICKET', tone: 'info' }, cast: [{ id: 'clerk', state: 'working' }], tokens: [{ id: 'need', icon: '🎫', label: 'one per link', at: 'clerk', effect: 'pop' }] },
            { id: 'f2', caption: 'Recipe A: count 1, 2, 3… then scramble the alphabet. 🔢', shout: { text: 'COUNT & SCRAMBLE', tone: 'info' }, cast: [{ id: 'machine', state: 'working' }], tokens: [{ id: 'count', icon: '🔢', label: 'next number', at: 'machine', effect: 'pop' }] },
            { id: 'f3', caption: 'Recipe B: time + machine + tiny counter = a snowflake. ❄️', shout: { text: 'SNOWFLAKE ❄️', tone: 'info' }, cast: [{ id: 'machine', state: 'working' }], tokens: [{ id: 'flakes', icon: '❄️', label: 'never the same', at: 'machine', effect: 'pop' }] },
            { id: 'f4', caption: 'Recipe C: mash the link into symbols — careful, twins happen! 🔨', shout: { text: 'TWINS? COLLISION!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'clerk', state: 'crashed' }], tokens: [{ id: 'collide', icon: '💥', label: 'same address!', at: 'machine', effect: 'burst' }] },
            { id: 'f5', caption: 'Whatever the recipe: check the slot and write — never overwrite. ✅', shout: { text: 'ALWAYS CHECK ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'vault', state: 'done' }], tokens: [{ id: 'safe', icon: '✅', label: 'no twin steals', at: 'vault', effect: 'pop' }] },
          ],
        },
      },
      {
        title: '301 versus 302 redirects',
        body: `Redirect semantics decide both caching and analytics. A 301 Moved Permanently tells the browser to cache the redirect, so the second click never reaches your servers — superb for scale and latency, terrible for counting clicks because the origin is bypassed. A 302 Found or 307 Temporary Redirect is temporary, so browsers must ask again every time: every click hits your edge and API, exactly what click analytics and per-link counters need, at the cost of extra traffic. Most link shorteners choose 302 and reclaim the cost with an aggressive edge cache. If analytics do not matter, 301 plus a long Cache-Control turns the browser itself into your CDN. Watch the animation: with 301 the browser cache answers alone and no origin sees the click; with 302 the request returns to the origin and an analytics counter increments on every hop. Pick the status code from the product requirement, not by habit.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'home', icon: '🏠', label: 'Browser memory' },
            { id: 'desk', icon: '🧑‍💼', label: 'Your desk' },
            { id: 'counter', icon: '📊', label: 'Click counter' },
          ],
          frames: [
            { id: 'f1', caption: 'Which sign hangs on the door? “Moved forever” or “moved today”? 🪧', shout: { text: 'CHOOSE THE SIGN', tone: 'info' }, cast: [{ id: 'desk', state: 'working' }], tokens: [{ id: 'sign', icon: '🪧', label: '301 or 302?', at: 'desk', effect: 'pop' }] },
            { id: 'f2', caption: '301: the browser memorizes the shortcut — forever. 🏠', shout: { text: '301 = REMEMBERED', tone: 'info' }, cast: [{ id: 'home', state: 'done' }], tokens: [{ id: 'memorize', icon: '🧠', label: 'no more asking', at: 'home', effect: 'pop' }] },
            { id: 'f3', caption: 'Super fast — but you never SEE the clicks. 🙈', shout: { text: 'CLICKS INVISIBLE!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'counter', state: 'crashed' }], tokens: [{ id: 'blind', icon: '🙈', label: 'counter silent', at: 'counter', effect: 'pop' }] },
            { id: 'f4', caption: '302: “ask me every time” — you see every click. 📊', shout: { text: '302 = I SEE ALL', tone: 'good' }, mood: 'good', cast: [{ id: 'desk', state: 'working' }], tokens: [{ id: 'visible', icon: '👀', label: 'every hop', at: 'counter', effect: 'pop' }] },
            { id: 'f5', caption: 'Most shorteners pick 302 on purpose — by design. ✅', shout: { text: '302 BY DESIGN ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'counter', state: 'done' }], tokens: [{ id: 'choice', icon: '✅', label: 'product choice', at: 'desk', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Write path end to end',
        body: `Now walk the write path end to end. The client POSTs the long URL to /shorten. The API service normalizes it — adding a missing scheme, rejecting javascript: and data: URLs, optionally stripping tracking parameters — then checks the custom alias, per-key rate limits, and abuse rules. It asks the ID generator for the next key, and the generator returns a base62 string from a pre-allocated counter range or a Snowflake ID. The service writes key to long URL plus metadata such as owner, creation time, and expiry into the KV store using a conditional put, so a race can never overwrite an existing mapping. Only after the store acknowledges does the API return 201 Created with the short link. The cache is deliberately left cold: it fills on first read, avoiding pollution from links that may never be clicked. The write path stays small — no joins, no fan-out, one durable put — which keeps a 100M-per-day workload affordable.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'desk', icon: '🧑‍💼', label: 'Desk' },
            { id: 'machine', icon: '🎰', label: 'Key maker' },
            { id: 'vault', icon: '🗄️', label: 'Vault' },
          ],
          frames: [
            { id: 'f1', caption: 'You hand over a long link. 📨', shout: { text: 'DROP OFF THE LINK', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'hand', icon: '📨', label: 'long URL', from: 'you', to: 'desk' }] },
            { id: 'f2', caption: 'The desk tidies it: fixes the scheme, refuses sneaky links. 🧹', shout: { text: 'TIDY & CHECK', tone: 'info' }, cast: [{ id: 'desk', state: 'working' }], tokens: [{ id: 'clean', icon: '🧹', label: 'normalize', at: 'desk', effect: 'pop' }] },
            { id: 'f3', caption: 'The key maker prints a fresh tiny ticket. 🎫', shout: { text: 'FRESH TICKET', tone: 'info' }, cast: [{ id: 'machine', state: 'working' }], tokens: [{ id: 'ticket', icon: '🎫', label: 'abc12X', from: 'machine', to: 'vault' }] },
            { id: 'f4', caption: 'It is filed in the vault — only if the slot is EMPTY. 🗄️', shout: { text: 'NO OVERWRITES!', tone: 'info' }, cast: [{ id: 'vault', state: 'done' }], tokens: [{ id: 'filed', icon: '📥', label: 'locked in', at: 'vault', effect: 'pop' }] },
            { id: 'f5', caption: 'Receipt = your tiny link. Storeroom stays empty till first click. 🧾', shout: { text: 'HERE IS YOUR LINK ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'you', state: 'happy' }], tokens: [{ id: 'receipt', icon: '🧾', label: 'done!', from: 'desk', to: 'you' }] },
          ],
        },
      },
      {
        title: 'Read path through cache',
        body: `Reads dominate, so the read path decides the latency users feel. A click first hits the CDN or edge cache keyed by the short code; a hit returns a 302 immediately, with no origin traffic and sub-millisecond latency. On a miss the request reaches the API service, which checks a shared in-process or Redis cache before the KV store. Only a second miss reaches the store, and the value is written back into the cache with a TTL and LRU eviction so hot links stay resident. Caches in front of a KV store routinely absorb 95 percent or more of read traffic; the store then handles only cold keys and the long tail. Watch the animation trace the hit branch and the miss branch side by side: on a hit the store is never touched, and on a miss the backfill makes the next click cheap. Expired links should be cached negatively for a short TTL so attackers cannot hammer the store with dead keys.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'Clicker' },
            { id: 'kiosk', icon: '🏪', label: 'Nearby kiosk' },
            { id: 'office', icon: '🏢', label: 'Back office' },
            { id: 'vault', icon: '🗄️', label: 'Central vault' },
          ],
          frames: [
            { id: 'f1', caption: 'Click! Check the nearest kiosk FIRST. 🏪', shout: { text: 'NEAREST KIOSK', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'ask', icon: '🎫', label: 'abc123?', from: 'you', to: 'kiosk' }] },
            { id: 'f2', caption: 'On the kiosk shelf? Instant answer, vault untouched! ⚡', shout: { text: 'HIT = INSTANT ⚡', tone: 'good' }, mood: 'good', cast: [{ id: 'kiosk', state: 'done' }], tokens: [{ id: 'fast', icon: '⚡', label: 'no walking!', from: 'kiosk', to: 'you' }] },
            { id: 'f3', caption: 'Not there? The back office checks its own shelf. 🏢', shout: { text: 'OFFICE SHELF', tone: 'info' }, cast: [{ id: 'office', state: 'working' }], tokens: [{ id: 'next', icon: '🔍', label: 'looking…', from: 'kiosk', to: 'office' }] },
            { id: 'f4', caption: 'Still no? Open the central vault — the last resort. 🗄️', shout: { text: 'VAULT IS LAST', tone: 'info' }, cast: [{ id: 'vault', state: 'working' }], tokens: [{ id: 'deep', icon: '🗄️', label: 'found it!', from: 'office', to: 'vault' }] },
            { id: 'f5', caption: 'Copy it onto the shelves so the NEXT click is fast. ✅', shout: { text: 'RESTOCK ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'kiosk', state: 'happy' }], tokens: [{ id: 'restock', icon: '📦', label: 'cached w/ TTL', from: 'vault', to: 'kiosk' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Hash collisions in a hash-based generator silently overwrite a mapping: conditional-put the candidate key and retry with a salted input on conflict.',
      'Sequential base62 keys are guessable: shuffle the encoding alphabet, mix in a random salt, or add entropy — a plain Snowflake is time-ordered and unpredictable only while its sequence state stays secret.',
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
          kind: 'story',
          cast: [
            { id: 'table', icon: '🕐', label: 'Round table' },
            { id: 'chairs', icon: '🪑', label: 'Chairs (servers)' },
            { id: 'toys', icon: '🧸', label: 'Toys (keys)' },
          ],
          frames: [
            { id: 'f1', caption: 'Place the chairs around a big round table. 🕐', shout: { text: 'ROUND TABLE!', tone: 'info' }, cast: [{ id: 'chairs', state: 'working' }], tokens: [{ id: 'seats', icon: '🪑', label: 'A, B, C', at: 'table', effect: 'pop' }] },
            { id: 'f2', caption: 'Each toy walks clockwise to the FIRST chair after it. 🧸', shout: { text: 'FIRST CHAIR WINS', tone: 'info' }, cast: [{ id: 'toys', state: 'working' }], tokens: [{ id: 'walk', icon: '➡️', label: 'clockwise', at: 'toys', effect: 'pop' }] },
            { id: 'f3', caption: 'Chair A ends up buried — chair C barely gets any toys! 😱', shout: { text: 'LOPSIDED PILES!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'chairs', state: 'crashed' }], tokens: [{ id: 'pile', icon: '🧸', label: 'A: 52%', at: 'chairs', effect: 'pop' }] },
            { id: 'f4', caption: 'A: 52%, B: 31%, C: only 17%. 📊', shout: { text: '52% vs 17%!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'table', state: 'crashed' }], tokens: [{ id: 'stats', icon: '📊', label: 'uneven!', at: 'table', effect: 'pop' }] },
            { id: 'f5', caption: 'With few chairs, the round table is unfair. ⚖️', shout: { text: 'TOO UNEVEN', tone: 'bad' }, mood: 'bad', cast: [{ id: 'toys', state: 'crashed' }], tokens: [{ id: 'unfair', icon: '⚖️', label: 'need a fix', at: 'toys', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Adding a node remaps keys',
        body: `Now add a fourth node and count what moves. With naive modulo hashing, key k lives at hash(k) mod N. Changing N from 3 to 4 changes the modulus for every key, so a key survives only if hash(k) mod 3 equals hash(k) mod 4 — on average only one in N+1 of them survives. Moving from N to N+1 nodes remaps N/(N+1) of the keys — equivalently 1 − 1/N′, where N′ is the new node count; here that is 75 percent — and almost every cache entry becomes a miss or every partition is rewritten at once. The ring behaves differently. Adding node D only affects keys whose position lies between D's predecessor and D, because only those keys find a new first-node-clockwise. That is D's arc, on average 1/(N+1) of the keyspace — one quarter, here. Watch the animation contrast the two: the modulo panel drains almost all keys, while the ring moves a single arc. The captions show the remapped fraction — 75 percent versus 25 percent — which is the difference between a full migration and a bounded one.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'table', icon: '🕐', label: 'Round table' },
            { id: 'chairs', icon: '🪑', label: 'Chairs A B C' },
            { id: 'newchair', icon: '💺', label: 'New chair D' },
          ],
          frames: [
            { id: 'f1', caption: 'A fourth chair arrives at the table. 💺', shout: { text: 'NEW CHAIR D!', tone: 'info' }, cast: [{ id: 'newchair', state: 'working' }], tokens: [{ id: 'join', icon: '💺', label: 'welcome!', at: 'table', effect: 'pop' }] },
            { id: 'f2', caption: 'Old rule “divide by chairs”: nearly EVERY toy jumps! 📦', shout: { text: 'MODULO: 75% MOVE!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'chairs', state: 'crashed' }], tokens: [{ id: 'chaos', icon: '🌪️', label: 'total chaos', at: 'chairs', effect: 'pop' }] },
            { id: 'f3', caption: 'Round-table rule: only toys between C and D move. 🧸', shout: { text: 'RING: 25% MOVE', tone: 'good' }, mood: 'good', cast: [{ id: 'newchair', state: 'done' }], tokens: [{ id: 'arc', icon: '↔️', label: 'one arc only', at: 'table', effect: 'pop' }] },
            { id: 'f4', caption: 'One arc changes hands; all other toys stay seated. ✔️', shout: { text: 'THE REST STAY PUT', tone: 'good' }, mood: 'good', cast: [{ id: 'chairs', state: 'done' }], tokens: [{ id: 'stay', icon: '🧸', label: 'settled', at: 'chairs', effect: 'pop' }] },
            { id: 'f5', caption: '25% vs 75% — a huge difference for one new chair. 🎉', shout: { text: 'MUCH LESS CHURN ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'table', state: 'happy' }], tokens: [{ id: 'win', icon: '🎉', label: 'smooth join', at: 'table', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Redistribute only the new arc',
        body: `The ring tells you which keys move but not how to move them safely. Take the arc between C and D: those keys currently resolve to the next node clockwise after D, which is A. A scans its store for keys in that range and streams them to D, so the transfer is bounded by one arc of data instead of the whole dataset. During the move the system has a choice: dual-write to both A and D and read from A until the backfill completes, or accept a short read-only window. When D has caught up and the backfill is verified, the routing table flips and D serves the arc; A deletes its stale copies lazily, and the extra writes stop. Watch the animation as exactly one arc of keys streams to the new node while every other arc stays put. Movement proportional to the membership change, not to the dataset size, is the entire point of consistent hashing.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'old', icon: '🧑‍💼', label: 'Old chair' },
            { id: 'new', icon: '💺', label: 'New chair D' },
            { id: 'mover', icon: '📦', label: 'Movers' },
          ],
          frames: [
            { id: 'f1', caption: 'Only the toys in the moved arc need to travel. 🧸', shout: { text: 'ONLY THE ARC MOVES', tone: 'info' }, cast: [{ id: 'mover', state: 'working' }], tokens: [{ id: 'pack', icon: '📦', label: 'just these!', at: 'mover', effect: 'pop' }] },
            { id: 'f2', caption: 'The movers pack EXACTLY those toys — nothing else. 📦', shout: { text: 'PACK THE ARC', tone: 'info' }, cast: [{ id: 'mover', state: 'working' }], tokens: [{ id: 'boxes', icon: '📦', label: 'one arc', from: 'old', to: 'new' }] },
            { id: 'f3', caption: 'The new chair gets them; everyone else keeps playing. 🎉', shout: { text: 'EVERYONE ELSE PLAYS ON', tone: 'good' }, mood: 'good', cast: [{ id: 'new', state: 'done' }], tokens: [{ id: 'deliver', icon: '🎉', label: 'moved in', at: 'new', effect: 'pop' }] },
            { id: 'f4', caption: 'During the move, copies live in both places — safe. 🪞', shout: { text: 'SAFE DOUBLE COPIES', tone: 'info' }, cast: [{ id: 'old', state: 'working' }], tokens: [{ id: 'mirror', icon: '🪞', label: 'both hands', at: 'mover', effect: 'pop' }] },
            { id: 'f5', caption: 'Move only what changed — not the whole house. ✅', shout: { text: 'MINIMUM MOVES ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'mover', state: 'happy' }], tokens: [{ id: 'done', icon: '✅', label: 'arc served', at: 'new', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Failure walks keys clockwise',
        body: `When a node dies, the ring does not stall: the keys it owned simply fall to the next node clockwise, because ownership is recomputed locally on every client. That is the availability win over a central directory. The failure mode is a hotspot: the successor now serves its own arc plus the dead node's arc, and without replicas it takes double the traffic at the worst possible moment. The standard mitigation is replication — store each key on the next R nodes clockwise, typically three — plus load-aware rerouting while the cluster repairs. With replication in place, reads for the dead node fail over to the next replica immediately and the redistribution becomes background repair rather than an emergency. Watch the animation as Node B dies, its arc walks to C, the load doubles briefly, and the replicas on A and C absorb reads; the background repair then rebuilds the missing copies and the doubled load fades.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'chairB', icon: '🪑', label: 'Chair B' },
            { id: 'chairC', icon: '💺', label: 'Next chair C' },
            { id: 'helper', icon: '🔨', label: 'Helpers' },
          ],
          frames: [
            { id: 'f1', caption: 'Chair B topples over — it stops answering! 🤕', shout: { text: 'B IS DOWN!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'chairB', state: 'crashed', face: '😵' }], tokens: [{ id: 'boom', icon: '💥', at: 'chairB', effect: 'burst' }] },
            { id: 'f2', caption: 'B’s toys slide to the NEXT chair clockwise: C. ➡️', shout: { text: 'SLIDE CLOCKWISE', tone: 'info' }, cast: [{ id: 'chairC', state: 'working' }], tokens: [{ id: 'slide', icon: '🧸', label: 'careful…', from: 'chairB', to: 'chairC' }] },
            { id: 'f3', caption: 'Chair C is now doubly loaded — heavy! 🥵', shout: { text: 'DOUBLE LOAD!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'chairC', state: 'crashed' }], tokens: [{ id: 'heavy', icon: '🏋️', label: '2 piles', at: 'chairC', effect: 'pop' }] },
            { id: 'f4', caption: 'Good thing every toy has backup copies elsewhere! 🪞🪞', shout: { text: 'BACKUPS EXIST ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'helper', state: 'working' }], tokens: [{ id: 'copies', icon: '🪞', label: '×3 copies', at: 'helper', effect: 'pop' }] },
            { id: 'f5', caption: 'Helpers quietly rebuild the lost copies in the background. 🔨', shout: { text: 'REPAIR IN QUIET', tone: 'info' }, cast: [{ id: 'helper', state: 'done' }], tokens: [{ id: 'fix', icon: '✅', label: 'normal again', at: 'chairC', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Virtual nodes smooth the ring',
        body: `Virtual nodes are the fix for both hotspots and churn. Instead of one point per server, each physical node is hashed to 100 to 200 points, its virtual nodes, spread around the ring. A key still walks clockwise to the first point, but now the small arcs average out: the node that would have owned a 52 percent super-arc owns many small arcs that sum to roughly 1/N of the keyspace. With 150 vnodes per node, the relative standard deviation of load shrinks to roughly 1/√150 ≈ 8.2 percent — across a three-node cluster that is an absolute spread of about 2.7 percentage points — so it lands near 33/33/33. Vnodes also soften joins and failures: adding one server inserts 150 small arcs instead of one giant one, so transferred keys spread across many nodes in small pieces, and a dead node's load is absorbed by many successors. Watch the final animation as the bold arcs dissolve into hundreds of tiny arcs converging on 36/33/31.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'chairs', icon: '🪑', label: 'Three chairs' },
            { id: 'seats', icon: '✨', label: 'Tiny seats' },
            { id: 'toys', icon: '🧸', label: 'Toys' },
          ],
          frames: [
            { id: 'f1', caption: 'One chair each? Too lumpy. Give every chair MANY tiny seats! ✨', shout: { text: 'MANY TINY SEATS', tone: 'info' }, cast: [{ id: 'seats', state: 'working' }], tokens: [{ id: 'sparkle', icon: '✨', label: '150 per chair', at: 'seats', effect: 'burst' }] },
            { id: 'f2', caption: 'Toys scatter across the little seats — evenly! 🧸', shout: { text: 'EVEN SPREAD', tone: 'good' }, mood: 'good', cast: [{ id: 'toys', state: 'done' }], tokens: [{ id: 'spread', icon: '🌊', label: 'smooth', at: 'toys', effect: 'pop' }] },
            { id: 'f3', caption: 'Now the piles match: A 36%, B 33%, C 31%. ⚖️', shout: { text: '36 / 33 / 31 ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'chairs', state: 'happy' }], tokens: [{ id: 'balance', icon: '⚖️', label: 'balanced!', at: 'chairs', effect: 'pop' }] },
            { id: 'f4', caption: 'A chair joins or falls? Only small piles move. 🧩', shout: { text: 'SMALL MOVES NOW', tone: 'good' }, mood: 'good', cast: [{ id: 'seats', state: 'working' }], tokens: [{ id: 'small', icon: '🧩', label: 'bite-sized', at: 'seats', effect: 'pop' }] },
            { id: 'f5', caption: 'Smooth like a lazy river. 🌊', shout: { text: 'SMOOTH & FAIR ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'toys', state: 'happy' }], tokens: [{ id: 'river', icon: '🌊', label: 'no lumps', at: 'toys', effect: 'pop' }] },
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
      { q: 'Why does adding a node to modulo hashing move most keys?', a: 'Every key is placed by hash(key) mod N, and changing the node count to N+1 changes the remainder for nearly every key, so only about 1/(N+1) keep their owner — equivalently, 1 − 1/N′ where N′ is the new node count; roughly 75 percent move when N goes from 3 to 4.' },
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
          kind: 'story',
          cast: [
            { id: 'crowd', icon: '👥', label: 'Requests' },
            { id: 'window', icon: '🪟', label: 'Count window' },
            { id: 'jar', icon: '🍪', label: 'Cookie jar' },
            { id: 'funnel', icon: '⏳', label: 'Slow funnel' },
          ],
          frames: [
            { id: 'f1', caption: 'Four different gates, one job: keep the crowd steady. 👥', shout: { text: 'FOUR GATES', tone: 'info' }, cast: [{ id: 'crowd', state: 'working' }], tokens: [{ id: 'arrive', icon: '👥', label: 'steady flow', at: 'crowd', effect: 'pop' }] },
            { id: 'f2', caption: 'Count window: counts per minute — sneaks DOUBLE at the edge! 🪟', shout: { text: 'WINDOW: 2× SPIKE!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'window', state: 'crashed' }], tokens: [{ id: 'spike', icon: '📈', label: 'burst at reset', at: 'window', effect: 'pop' }] },
            { id: 'f3', caption: 'Sliding window: looks at now + before — smoother. 📏', shout: { text: 'SLIDING: SMOOTHER', tone: 'good' }, mood: 'good', cast: [{ id: 'window', state: 'done' }], tokens: [{ id: 'smooth', icon: '📏', label: 'gentle', at: 'window', effect: 'pop' }] },
            { id: 'f4', caption: 'Cookie jar: burst up to the jar’s size, then steady refill. 🍪', shout: { text: 'JAR = BURSTS + REFILL', tone: 'good' }, mood: 'good', cast: [{ id: 'jar', state: 'working' }], tokens: [{ id: 'cookies', icon: '🍪', label: 'take one!', at: 'jar', effect: 'pop' }] },
            { id: 'f5', caption: 'Slow funnel: drip at constant speed — but visitors wait. ⏳', shout: { text: 'FUNNEL: STEADY DRIP', tone: 'info' }, cast: [{ id: 'funnel', state: 'working' }], tokens: [{ id: 'drip', icon: '💧', label: 'one by one', at: 'funnel', effect: 'float' }] },
          ],
        },
      },
      {
        title: 'Token bucket allows a request',
        body: `Follow one allowed request. It arrives at the edge and is keyed by identity — API key for partners, user id for logged-in traffic, IP as a fallback. The edge asks the rate limiter for that key, and the limiter loads the bucket state: current tokens and last refill timestamp. Tokens regenerate at a fixed rate, so the limiter computes how many accumulated since the last check, caps the total at capacity, and checks the request cost. If at least one token is available, the limiter deducts it and returns allow, and the edge forwards the request to the backend. The backend never sees the limiter on the allowed path; the check is out-of-band and adds sub-millisecond overhead. Watch the animation: one token leaves the bucket, the request flows through, and the response carries limit headers so well-behaved clients can self-throttle before they are ever rejected.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'visitor', icon: '👤', label: 'Visitor' },
            { id: 'jar', icon: '🍪', label: 'Your cookie jar' },
            { id: 'door', icon: '🚪', label: 'Gate' },
            { id: 'kitchen', icon: '🏪', label: 'Kitchen' },
          ],
          frames: [
            { id: 'f1', caption: 'Every visitor gets their own cookie jar. 🍪', shout: { text: 'ONE JAR EACH', tone: 'info' }, cast: [{ id: 'jar', state: 'working' }], tokens: [{ id: 'jar', icon: '🍪', label: 'just for you', at: 'jar', effect: 'pop' }] },
            { id: 'f2', caption: 'The jar refills slowly: 10 cookies per second. ⏱️', shout: { text: 'STEADY REFILL', tone: 'info' }, cast: [{ id: 'jar', state: 'working' }], tokens: [{ id: 'clock', icon: '⏱️', label: '+10/sec', at: 'jar', effect: 'pop' }] },
            { id: 'f3', caption: 'A request arrives → it costs exactly ONE cookie. 🍪', shout: { text: 'COST: 1 COOKIE', tone: 'info' }, cast: [{ id: 'visitor', state: 'working' }], tokens: [{ id: 'take', icon: '🍪', label: '−1', from: 'jar', to: 'kitchen' }] },
            { id: 'f4', caption: 'Cookie available? The gate OPENS. ✅', shout: { text: 'ALLOWED ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'door', state: 'done' }], tokens: [{ id: 'open', icon: '✅', label: 'come in!', at: 'door', effect: 'pop' }] },
            { id: 'f5', caption: 'And the reply says how many cookies remain. 📋', shout: { text: 'QUOTA REPORTED', tone: 'good' }, mood: 'good', cast: [{ id: 'kitchen', state: 'happy' }], tokens: [{ id: 'report', icon: '📋', label: 'left: 42', at: 'visitor', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Bursts drain the bucket',
        body: `Token bucket limits the average rate but intentionally allows bursts. If the bucket capacity is 100 and the refill is 10 requests per second, a client that has been idle accumulates up to 100 tokens; when it fires, the first 100 requests pass instantly and the bucket hits empty. From then on the client is limited to the 10-per-second refill, so a sustained overload cannot last. This matches real traffic: a mobile app waking up and syncing should not be throttled to the same rate as its long-run average. Watch the animation as the bucket drains in a burst to exactly zero, then sees each refill token consumed by the next request. Capacity is the maximum burst; refill rate is the sustained throughput. Tune C to the largest burst you can absorb behind the limiter and R to what the backend can actually serve per key, and remember that many keys burst at once even when each individual bucket looks fine.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'jar', icon: '🍪', label: 'The jar (100 max)' },
            { id: 'crowd', icon: '👥', label: 'A burst of clicks' },
            { id: 'clock', icon: '⏱️', label: 'Refill clock' },
          ],
          frames: [
            { id: 'f1', caption: 'After a rest, the jar is full to the brim: 100 cookies! 🍪🍪', shout: { text: 'JAR IS FULL', tone: 'info' }, cast: [{ id: 'jar', state: 'done' }], tokens: [{ id: 'full', icon: '🍪', label: '×100', at: 'jar', effect: 'pop' }] },
            { id: 'f2', caption: 'Burst! Every click takes one cookie — fast. 💥', shout: { text: 'BURST!', tone: 'info' }, cast: [{ id: 'crowd', state: 'working' }], tokens: [{ id: 'grab', icon: '🤚', label: '×100 clicks', from: 'crowd', to: 'jar' }] },
            { id: 'f3', caption: 'Jar empty — the burst is over. 🫙', shout: { text: 'JAR EMPTY', tone: 'info' }, cast: [{ id: 'jar', state: 'idle' }], tokens: [{ id: 'empty', icon: '🫙', label: '0 left', at: 'jar', effect: 'pop' }] },
            { id: 'f4', caption: 'From now on: only 10 cookies per second. ⏱️🍪', shout: { text: 'SUSTAINED: 10/S', tone: 'info' }, cast: [{ id: 'clock', state: 'working' }], tokens: [{ id: 'drip', icon: '⏱️', label: '+10 each sec', at: 'clock', effect: 'float' }] },
            { id: 'f5', caption: 'Short bursts OK, endless floods never. ⚖️', shout: { text: 'BURSTS OK, FLOODS NO ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'jar', state: 'happy' }], tokens: [{ id: 'rule', icon: '⚖️', label: 'the balance', at: 'jar', effect: 'pop' }] },
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
          kind: 'story',
          cast: [
            { id: 'visitors', icon: '🧑‍🤝‍🧑', label: 'Two visitors' },
            { id: 'clerk', icon: '👮', label: 'One clerk' },
            { id: 'jar', icon: '🍪', label: 'Last cookie!' },
          ],
          frames: [
            { id: 'f1', caption: 'Ten desks with ten jars? The total quietly multiplies! 😱', shout: { text: 'TEN DESKS = 10×?!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'jar', state: 'crashed' }], tokens: [{ id: 'multiply', icon: '✖️', label: 'too many!', at: 'jar', effect: 'pop' }] },
            { id: 'f2', caption: 'Two visitors grab the LAST cookie at the same instant. 🏃', shout: { text: 'RACE!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'visitors', state: 'working' }], tokens: [{ id: 'reach', icon: '🤚', label: 'mine!', at: 'visitors', effect: 'pop' }] },
            { id: 'f3', caption: 'Rule: ONE careful clerk handles the jar, one at a time. 👮', shout: { text: 'ONE CLERK = ATOMIC', tone: 'good' }, mood: 'good', cast: [{ id: 'clerk', state: 'working' }], tokens: [{ id: 'rule', icon: '📜', label: 'one move', at: 'clerk', effect: 'pop' }] },
            { id: 'f4', caption: 'Check + hand over happen in ONE single move. 🤝', shout: { text: 'ONE SINGLE MOVE', tone: 'good' }, mood: 'good', cast: [{ id: 'jar', state: 'working' }], tokens: [{ id: 'single', icon: '🤝', label: 'atomic', at: 'clerk', effect: 'pop' }] },
            { id: 'f5', caption: 'First gets it; second sees an empty jar. No double-spend! ✅', shout: { text: 'NO DOUBLE-SPEND ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'visitors', state: 'done' }], tokens: [{ id: 'settled', icon: '✅', label: 'fair', at: 'jar', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Deny with 429 headers',
        body: `When the limiter says no, the response itself is part of the design. Return HTTP 429 Too Many Requests, not a generic 500 and not a silent drop, and include machine-readable headers: RateLimit-Limit for the quota, RateLimit-Remaining for tokens left, RateLimit-Reset for seconds until refill, and Retry-After so well-behaved clients can back off precisely. Do not leak implementation details; a clear contract lets SDKs implement exponential backoff with jitter and avoids a thundering herd when a window resets. Key granularity matters too: per API key protects the platform, per user protects fairness, and per IP catches anonymous abuse but risks punishing everyone behind one NAT address. Watch the animation: the bucket is empty, the limiter returns deny, the edge short-circuits with 429 and headers, and the backend never sees the request. Cheap rejection at the edge is the entire point of a limiter.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'visitor', icon: '👤', label: 'Visitor' },
            { id: 'gate', icon: '🚪', label: 'The gate' },
            { id: 'kitchen', icon: '🏪', label: 'Kitchen (server)' },
          ],
          frames: [
            { id: 'f1', caption: 'Jar empty → polite answer: “Not yet!” 4️⃣2️⃣9️⃣', shout: { text: '429: NOT YET', tone: 'info' }, cast: [{ id: 'gate', state: 'locked' }], tokens: [{ id: 'polite', icon: '🛑', label: 'slow down', at: 'gate', effect: 'pop' }] },
            { id: 'f2', caption: 'Include the details: “0 left, refill in 6 seconds.” 📋', shout: { text: 'CLEAR HEADERS', tone: 'info' }, cast: [{ id: 'visitor', state: 'working' }], tokens: [{ id: 'headers', icon: '📋', label: 'left: 0 · reset: 6s', at: 'visitor', effect: 'pop' }] },
            { id: 'f3', caption: 'And a note: “come back at THIS time” (Retry-After). ⏰', shout: { text: 'COME BACK AT…', tone: 'info' }, cast: [{ id: 'gate', state: 'working' }], tokens: [{ id: 'retry', icon: '⏰', label: 'Retry-After', at: 'gate', effect: 'pop' }] },
            { id: 'f4', caption: 'No sneaking past the gate to the kitchen! 🚪🔒', shout: { text: 'BACKEND PROTECTED', tone: 'good' }, mood: 'good', cast: [{ id: 'kitchen', state: 'happy' }], tokens: [{ id: 'safe', icon: '🛡️', label: 'no flood', at: 'kitchen', effect: 'pop' }] },
            { id: 'f5', caption: 'Cheap rejection at the gate protects the whole house. 🏠🛡️', shout: { text: 'CHEAP & KIND ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'visitor', state: 'done' }], tokens: [{ id: 'win', icon: '✅', label: 'everyone happy', at: 'gate', effect: 'pop' }] },
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
