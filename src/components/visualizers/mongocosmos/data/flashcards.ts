export interface MongoFlashcard {
  id: string;
  category: 'Storage & BSON' | 'WiredTiger Internals' | 'Indexing & Querying' | 'Aggregation & Modeling' | 'Replication & Sharding';
  question: string;
  answer: string;
  code?: string;
  tip: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export const MONGO_FLASHCARDS: MongoFlashcard[] = [
  {
    id: 'mf-1',
    category: 'Storage & BSON',
    difficulty: 'Junior',
    question: 'Why does MongoDB use BSON instead of plain text JSON for storage and network transfer?',
    answer: 'BSON adds critical data types not present in JSON (Date, ObjectId, Binary, Decimal128) and prefixes every element with length headers and type tags. This allows the WiredTiger engine and network drivers to jump over subdocuments in O(1) time without parsing the entire payload.',
    code: `// Check byte size of BSON vs JSON representation:
Object.bsonsize({ date: new Date(), id: new ObjectId() });`,
    tip: 'Length prefixes enable O(1) field skipping without scanning raw strings.'
  },
  {
    id: 'mf-2',
    category: 'Storage & BSON',
    difficulty: 'Junior',
    question: 'What is the maximum BSON document size limit in MongoDB, and what is the engineering rationale for it?',
    answer: 'The limit is strictly 16MB (16,777,216 bytes). It prevents single documents from monopolizing WiredTiger cache pages, protects network buffers during replication oplog transmission, and forces developers to adopt proper relational referencing or bucketing patterns.',
    code: `// Fails if document exceeds 16MB:
// WriteError: BSONObj size is over maximum 16777216`,
    tip: 'For files or binary assets larger than 16MB, always use GridFS.'
  },
  {
    id: 'mf-3',
    category: 'Indexing & Querying',
    difficulty: 'Senior',
    question: 'What is the ESR (Equality, Sort, Range) rule in MongoDB compound indexing?',
    answer: 'The ESR rule dictates optimal compound index field ordering: Equality fields first (exact matches), Sort fields second (satisfying ordering without in-memory SORT), and Range fields last ($gt, $lt, $in). Placing Range before Sort destroys index-assisted sorting.',
    code: `// Optimal ESR index:
db.orders.createIndex({ status: 1, created_at: -1, total: 1 });
// Query matching ESR:
db.orders.find({ status: "completed", total: { $gt: 100 } }).sort({ created_at: -1 });`,
    tip: 'Violating ESR by putting Range before Sort triggers an in-memory 100MB blocking sort.'
  },
  {
    id: 'mf-4',
    category: 'Indexing & Querying',
    difficulty: 'Mid',
    question: 'Why does MongoDB prohibit compound indexes spanning two parallel array fields?',
    answer: 'Indexing two arrays in a single compound index would create a Cartesian product of index entries (N x M). If both arrays contained 100 elements, a single document would generate 10,000 B-Tree entries, destroying write throughput and exhausting RAM.',
    code: `// ❌ Throws: cannot index parallel arrays [tags] [categories]
db.products.createIndex({ tags: 1, categories: 1 });`,
    tip: 'At most ONE array field is permitted within any compound multikey index.'
  },
  {
    id: 'mf-5',
    category: 'WiredTiger Internals',
    difficulty: 'Senior',
    question: 'What is the difference between Clean and Dirty pages in the WiredTiger cache?',
    answer: 'Clean pages in memory match their exact persisted state on disk and can be discarded instantly under memory pressure. Dirty pages have been modified by inserts/updates/deletes and must be written and fsynced to disk blocks before being evicted.',
    code: `// Check dirty cache in serverStatus:
db.serverStatus().wiredTiger.cache["tracked dirty bytes in the cache"];`,
    tip: 'If dirty cache exceeds 20%, client threads are forced to write to disk, spiking write latency.'
  },
  {
    id: 'mf-6',
    category: 'WiredTiger Internals',
    difficulty: 'Senior',
    question: 'How do WiredTiger checkpoints work and how often do they execute by default?',
    answer: 'Checkpoints occur every 60 seconds (or 2GB of journal data), writing a crash-consistent copy-on-write snapshot of all collection and index B-Tree pages to disk. Upon recovery, WiredTiger rolls back to the last checkpoint and replays the write-ahead journal.',
    code: `// Trigger manual checkpoint:
db.fsyncLock();
db.fsyncUnlock();`,
    tip: 'Copy-on-write prevents database corruption if power cuts during an active checkpoint.'
  },
  {
    id: 'mf-7',
    category: 'Replication & Sharding',
    difficulty: 'Senior',
    question: 'What is the risk of issuing writes with { w: 1 } instead of { w: "majority" } in a replica set?',
    answer: 'With { w: 1 }, the primary confirms success as soon as memory is updated. If the primary crashes before replicating the write, a secondary is elected and the un-replicated write is permanently lost from the active cluster and dumped into a .rollback BSON file.',
    code: `// Safe write:
db.orders.insertOne({ id: 1 }, { writeConcern: { w: "majority", wtimeout: 5000 } });`,
    tip: 'Always set w: "majority" with wtimeout for zero rollback guarantee.'
  },
  {
    id: 'mf-8',
    category: 'Replication & Sharding',
    difficulty: 'Staff',
    question: 'How does Causal Consistency prevent "Read-Your-Own-Writes" staleness on lagging secondaries?',
    answer: 'Client sessions track Lamport logical clocks (operationTime). When reading from a secondary, the driver passes afterClusterTime: operationTime. The secondary delays executing the query until its local oplog has caught up to that exact timestamp.',
    code: `const s = db.getMongo().startSession({ causalConsistency: true });
s.getDatabase("db").coll.find().readPref("secondary");`,
    tip: 'Causal consistency eliminates the phantom disappearing data bug on secondary reads.'
  },
  {
    id: 'mf-9',
    category: 'Indexing & Querying',
    difficulty: 'Senior',
    question: 'What is a Covered Query in MongoDB and how do you verify it in executionStats?',
    answer: 'A Covered Query satisfies both the filter and projection entirely from the B-Tree index, never reading document payloads from disk/cache. It requires all filtered/projected fields in the index, with _id: 0 suppressed. Verified by totalDocsExamined: 0 in explain().',
    code: `// Covered query syntax:
db.users.find({ username: "alice" }, { _id: 0, username: 1 });`,
    tip: 'Covered queries yield maximum throughput because the FETCH stage is completely bypassed.'
  },
  {
    id: 'mf-10',
    category: 'Aggregation & Modeling',
    difficulty: 'Mid',
    question: 'What is the difference between $addToSet and $push in a $group stage?',
    answer: '$push appends every encountered value to an array, preserving duplicates and insertion order. $addToSet treats the array as a mathematical set, checking for existence and only inserting unique values.',
    code: `db.orders.aggregate([
  { $group: { _id: "$user_id", uniqueItems: { $addToSet: "$product" } } }
]);`,
    tip: 'Use $addToSet for deduplicated lists; use $push for audit trails.'
  },
  {
    id: 'mf-11',
    category: 'Aggregation & Modeling',
    difficulty: 'Senior',
    question: 'What happens when an aggregation pipeline stage exceeds the 100MB RAM limit?',
    answer: 'Blocking stages ($group, unindexed $sort) abort with error code 16819. To permit the query to complete by writing temporary spillover files to the storageEngine directory, the client must pass { allowDiskUse: true }.',
    code: `db.logs.aggregate([...], { allowDiskUse: true });`,
    tip: 'In user-facing APIs, create an index rather than masking slow sorts with allowDiskUse.'
  },
  {
    id: 'mf-12',
    category: 'Replication & Sharding',
    difficulty: 'Staff',
    question: 'Why is sharding on a monotonically increasing key (e.g. timestamp or auto-increment ID) an anti-pattern?',
    answer: 'Monotonically increasing keys always append to the rightmost max chunk (+inf). Consequently, 100% of all incoming write operations route to the single shard holding that chunk, creating a severe write bottleneck while other shards sit idle.',
    code: `// Fix with Hashed Sharding:
sh.shardCollection("events", { event_id: "hashed" });`,
    tip: 'Use Hashed Sharding to distribute monotonic keys evenly across all shards.'
  },
  {
    id: 'mf-13',
    category: 'WiredTiger Internals',
    difficulty: 'Staff',
    question: 'What is the WiredTiger Lookaside Table (LAS) and when is it used?',
    answer: 'WiredTigerLAS.wt is an on-disk spill file. When cache eviction is desperate for memory, but dirty pages contain uncommitted row versions required by active older transactions, WiredTiger writes those historical versions to LAS rather than failing with OOM.',
    code: `db.serverStatus().wiredTiger["lookaside table"];`,
    tip: 'High LAS activity indicates long-running queries are pinning snapshots during heavy writes.'
  },
  {
    id: 'mf-14',
    category: 'Indexing & Querying',
    difficulty: 'Mid',
    question: 'How does a Partial Index differ from a Sparse Index?',
    answer: 'A Sparse index only filters on field existence ({ field: { $exists: true } }). A Partial Index supports expressive filter predicates ($gt, $type, regex, compound conditions), offering 90%+ RAM savings by indexing only targeted subsets.',
    code: `db.users.createIndex({ email: 1 }, { partialFilterExpression: { status: "active" } });`,
    tip: 'Partial indexes supersede sparse indexes in modern MongoDB architectures.'
  },
  {
    id: 'mf-15',
    category: 'Storage & BSON',
    difficulty: 'Mid',
    question: 'What are the 3 components of a 12-byte MongoDB ObjectId?',
    answer: '1. A 4-byte Unix timestamp in seconds (little-endian), 2. A 5-byte random value unique to the machine and process, and 3. A 3-byte incrementing counter initialized randomly.',
    code: `const id = new ObjectId();
console.log(id.getTimestamp()); // Extracts 4-byte timestamp`,
    tip: 'The leading timestamp clusters inserts chronologically, minimizing B-Tree page splits.'
  },
  {
    id: 'mf-16',
    category: 'Aggregation & Modeling',
    difficulty: 'Senior',
    question: 'What is the difference between $merge and $out in an aggregation pipeline?',
    answer: '$out atomically replaces the entire target collection, dropping pre-existing custom indexes. $merge updates target collections incrementally, matching on a unique key (on) to upsert, update, or merge in-place while preserving indexes.',
    code: `{ $merge: { into: "monthly_summary", on: "_id", whenMatched: "replace" } }`,
    tip: 'Use $merge to build incremental materialized views without rewriting collections.'
  },
  {
    id: 'mf-17',
    category: 'WiredTiger Internals',
    difficulty: 'Senior',
    question: 'What happens when WiredTiger concurrent read or write tickets drop to zero?',
    answer: 'WiredTiger uses 128 read and 128 write tickets for admission control. When tickets reach 0, new queries queue at the networking layer, causing connection pool exhaustion. It is almost always caused by unindexed slow queries hogging tickets.',
    code: `db.serverStatus().wiredTiger.concurrentTransactions;`,
    tip: 'Never increase ticket limits on CPU-bound clusters; kill the unindexed queries.'
  },
  {
    id: 'mf-18',
    category: 'Replication & Sharding',
    difficulty: 'Staff',
    question: 'What is a Jumbo Chunk in MongoDB sharding and why is it dangerous?',
    answer: 'A Jumbo Chunk exceeds max chunk size (64MB) and cannot be split because all documents share the exact same shard key value. The balancer cannot migrate jumbo chunks, causing permanent storage and write imbalance.',
    code: `sh.status(); // Look for chunks marked "jumbo"`,
    tip: 'Always ensure your shard key has high cardinality to prevent jumbo chunks.'
  },
  {
    id: 'mf-19',
    category: 'Indexing & Querying',
    difficulty: 'Senior',
    question: 'Why does $text search require a text index and what are its limitations?',
    answer: 'Text indexes tokenize strings, stem word roots, and compute textScore relevance. A collection can have at most ONE text index. It cannot perform arbitrary regex infix searches or fuzzy typo tolerance (which requires Atlas Search).',
    code: `db.articles.createIndex({ body: "text" });
db.articles.find({ $text: { $search: "database" } }, { score: { $meta: "textScore" } });`,
    tip: 'Sort by { score: { $meta: "textScore" } } to return results by relevance.'
  },
  {
    id: 'mf-20',
    category: 'Storage & BSON',
    difficulty: 'Junior',
    question: 'Why should financial monetary values be stored as Decimal128 rather than Double?',
    answer: 'Standard BSON Doubles use IEEE 754 binary floating-point representation, which causes rounding discrepancies (e.g. 0.1 + 0.2 = 0.30000000000000004). Decimal128 uses base-10 decimal floating point with 34 digits of exact precision.',
    code: `db.accounts.insertOne({ balance: NumberDecimal("199.99") });`,
    tip: 'Always pass strings to NumberDecimal("...") to avoid JS client float corruption.'
  },
  {
    id: 'mf-21',
    category: 'Aggregation & Modeling',
    difficulty: 'Senior',
    question: 'What is the performance hazard of early $unwind in an aggregation pipeline?',
    answer: '$unwind multiplies document counts by the length of the array. If 100,000 documents have arrays of 50 items, early $unwind expands the pipeline to 5,000,000 documents in memory, causing cache thrashing. Always filter with $match before $unwind.',
    code: `// Good practice:
[ { $match: { status: "active" } }, { $unwind: "$items" } ]`,
    tip: 'Filter before unwinding to minimize memory multiplication.'
  },
  {
    id: 'mf-22',
    category: 'Replication & Sharding',
    difficulty: 'Senior',
    question: 'How do Config Servers participate in chunk routing inside a sharded cluster?',
    answer: 'Config Servers run as a dedicated 3-node replica set storing chunk range boundaries and shard mappings. Stateless mongos routers cache this metadata in memory to direct client queries straight to holding shards without broadcasting.',
    code: `sh.status();`,
    tip: 'mongos routes queries using cached metadata from config servers.'
  },
  {
    id: 'mf-23',
    category: 'WiredTiger Internals',
    difficulty: 'Senior',
    question: 'Does WiredTiger Snappy disk compression reduce the working set RAM footprint?',
    answer: 'No. WiredTiger compresses data blocks only when writing to persistent disk. When pages are read into the in-memory cache, they are decompressed into raw BSON tuples. Thus, working set RAM is determined by uncompressed document and key sizes.',
    code: `db.collection.stats().size; // uncompressed RAM size
db.collection.stats().storageSize; // compressed disk size`,
    tip: 'Verbose field names consume full uncompressed RAM in the cache.'
  },
  {
    id: 'mf-24',
    category: 'Indexing & Querying',
    difficulty: 'Junior',
    question: 'Does sort direction (1 vs -1) matter on a single-field index?',
    answer: 'No. Single-field indexes can be traversed bidirectionally with identical efficiency because WiredTiger B-Tree leaf pages have prev and next pointers. Directionality only matters for compound indexes with multiple fields.',
    code: `db.users.createIndex({ age: 1 }); // Supports both sort({ age: 1 }) and sort({ age: -1 })`,
    tip: 'Never create duplicate { col: 1 } and { col: -1 } single-field indexes.'
  },
  {
    id: 'mf-25',
    category: 'Aggregation & Modeling',
    difficulty: 'Mid',
    question: 'When should you use $set / $addFields instead of $project?',
    answer: 'Use $set / $addFields when appending new computed fields or updating existing ones while keeping all other fields intact. Use $project when you need an explicit whitelist or want to suppress fields (like _id) to prune payload size.',
    code: `db.orders.aggregate([ { $set: { tax: { $multiply: ["$subtotal", 0.08] } } } ]);`,
    tip: '$set avoids having to re-list 50 existing fields to add just one.'
  },
  {
    id: 'mf-26',
    category: 'Storage & BSON',
    difficulty: 'Mid',
    question: 'What is a Capped Collection and what is its primary operational restriction?',
    answer: 'A Capped Collection is a circular fixed-size FIFO buffer that automatically overwrites the oldest documents when full. Restriction: Documents cannot be manually deleted, updates must not increase document byte size, and capped collections cannot be sharded.',
    code: `db.createCollection("logs", { capped: true, size: 10485760 });`,
    tip: 'The MongoDB replication Oplog is implemented as a capped collection.'
  },
  {
    id: 'mf-27',
    category: 'Replication & Sharding',
    difficulty: 'Senior',
    question: 'What is the difference between Read Concern "majority" and "linearizable"?',
    answer: '"majority" reads from in-memory WiredTiger snapshots representing majority-committed state (cannot be rolled back). "linearizable" adds a real-time quorum check: the primary contacts a majority of nodes before answering to prove it was not deposed by a network split.',
    code: `db.locks.find().readConcern("linearizable");`,
    tip: 'Use linearizable to prevent stale reads from partitioned zombie primaries.'
  },
  {
    id: 'mf-28',
    category: 'Indexing & Querying',
    difficulty: 'Senior',
    question: 'What is a Hidden Index and what problem does it solve in production?',
    answer: 'A hidden index is invisible to the query planner but remains fully maintained during writes. It enables safe, zero-risk index deprecation: hide the index, observe if queries regress for 72 hours, and if they do, unhide it in 1ms without rebuilding.',
    code: `db.orders.hideIndex("sku_1");
db.orders.unhideIndex("sku_1");`,
    tip: 'Always hide an index before dropping it on production clusters.'
  },
  {
    id: 'mf-29',
    category: 'Aggregation & Modeling',
    difficulty: 'Staff',
    question: 'How do you design a schema for time-series sensor data to prevent the massive array anti-pattern?',
    answer: 'Use the Bucket Pattern: group fixed quantities of sensor readings (e.g. 500 readings or 1 hour) into distinct documents using an incrementing count check: { $push: { readings: ... }, $inc: { count: 1 } }, with upsert: true.',
    code: `db.sensors.updateOne(
  { device: "dev1", date: "2026-03-01", count: { $lt: 500 } },
  { $push: { readings: { ts: new Date(), v: 22.4 } }, $inc: { count: 1 } },
  { upsert: true }
);`,
    tip: 'The bucket pattern avoids millions of tiny docs and prevents unbounded array growth.'
  },
  {
    id: 'mf-30',
    category: 'WiredTiger Internals',
    difficulty: 'Senior',
    question: 'How does WiredTiger handle write conflicts between concurrent transactions?',
    answer: 'WiredTiger uses optimistic concurrency control for row modifications. If two transactions attempt to update the same document concurrently, the second transaction detects a WriteConflictException and automatically retries internally or aborts.',
    code: `db.serverStatus().wiredTiger.transaction["write conflicts"];`,
    tip: 'High write conflicts indicate multiple threads updating the same hot-spot document.'
  },
  {
    id: 'mf-31',
    category: 'Storage & BSON',
    difficulty: 'Mid',
    question: 'What are the trade-offs of the 1:1 Embedding pattern vs Referencing?',
    answer: 'Embedding guarantees single-read access, atomic updates, and zero joins, but duplicates data if shared. Referencing avoids duplication and 16MB document size limits, but requires $lookup joins or multiple application queries.',
    code: `// Embed for 1:few; reference for 1:unbounded.`,
    tip: 'Model for query access patterns rather than relational third normal form.'
  },
  {
    id: 'mf-32',
    category: 'Indexing & Querying',
    difficulty: 'Mid',
    question: 'What coordinate order is required for GeoJSON points in a 2dsphere index?',
    answer: 'GeoJSON strictly requires [Longitude, Latitude] order (X then Y). Inverting them to [Latitude, Longitude] places coordinates in the wrong hemisphere or causes out-of-bounds index exceptions.',
    code: `location: { type: "Point", coordinates: [ -73.9857, 40.7484 ] } // Longitude, Latitude`,
    tip: 'Longitude is -180 to 180; Latitude is -90 to 90.'
  },
  {
    id: 'mf-33',
    category: 'Replication & Sharding',
    difficulty: 'Senior',
    question: 'What is Scatter-Gather routing in a sharded cluster and why should it be minimized?',
    answer: 'Scatter-gather occurs when a query omits the shard key. The mongos router must broadcast the query to every shard in the cluster, wait for all shards to answer, and merge results. This limits cluster throughput to the slowest shard.',
    code: `// Targeted (fast): db.orders.find({ tenant_id: 1 })
// Scatter-gather (slow): db.orders.find({ email: "user@test.com" })`,
    tip: 'Always include the shard key in high-frequency operational queries.'
  },
  {
    id: 'mf-34',
    category: 'Aggregation & Modeling',
    difficulty: 'Senior',
    question: 'How does $facet calculate multiple analytical facets in a single query?',
    answer: '$facet accepts an object where each key defines an independent aggregation sub-pipeline. The incoming filtered document stream is processed in parallel by each sub-pipeline in memory, outputting a single document containing all result arrays.',
    code: `db.products.aggregate([
  { $facet: { "brands": [{ $group: { _id: "$brand" } }], "avgPrice": [{ $group: { _id: null, a: { $avg: "$price" } } }] } }
]);`,
    tip: 'Combined facet output must remain strictly under the 16MB BSON limit.'
  },
  {
    id: 'mf-35',
    category: 'WiredTiger Internals',
    difficulty: 'Staff',
    question: 'What is the role of Write Tickets in WiredTiger admission control?',
    answer: 'Write tickets (default 128) throttle concurrent storage engine execution to prevent CPU thrashing from thread context switching. If tickets are exhausted, new writes queue. Increasing tickets when CPU is saturated worsens latency.',
    code: `db.serverStatus().wiredTiger.concurrentTransactions.write;`,
    tip: 'Ticket exhaustion is almost always caused by slow unindexed queries, not traffic volume.'
  },
  {
    id: 'mf-36',
    category: 'Storage & BSON',
    difficulty: 'Junior',
    question: 'What happens if a field name is 50 characters long in a collection with 100M documents?',
    answer: 'Because BSON is self-describing, field names repeat in every single document. 50 characters x 100M documents = 5 GB of raw uncompressed RAM consumed in the WiredTiger cache just to store that field name.',
    code: `Object.bsonsize({ very_long_verbose_field_name: 1 });`,
    tip: 'Keep field names concise on high-velocity collections with hundreds of millions of docs.'
  },
  {
    id: 'mf-37',
    category: 'Indexing & Querying',
    difficulty: 'Senior',
    question: 'What is a Wildcard Index ($**) and when is it superior to compound indexes?',
    answer: 'A Wildcard Index ({ "$**": 1 } or { "attributes.$**": 1 }) automatically indexes all dynamic scalar paths inside unpredictable or polymorphic JSON subdocuments, eliminating constant index migrations in multi-tenant SaaS applications.',
    code: `db.products.createIndex({ "attributes.$**": 1 });`,
    tip: 'Use wildcard indexes when attribute keys are user-defined or constantly changing.'
  },
  {
    id: 'mf-38',
    category: 'Replication & Sharding',
    difficulty: 'Mid',
    question: 'Why should a replica set always have an odd number of voting members?',
    answer: 'To prevent split-brain election ties. Electing a primary requires a strict majority (>50%). An even number of nodes (e.g. 4) risks a 2-2 tie during network splits, leaving the entire cluster without a writable primary.',
    code: `rs.status().members.length; // 3, 5, or 7`,
    tip: 'Always deploy 3 or 5 voting members.'
  },
  {
    id: 'mf-39',
    category: 'Aggregation & Modeling',
    difficulty: 'Mid',
    question: 'How do $bucket and $bucketAuto differ in data categorization?',
    answer: '$bucket requires user-defined boundary intervals (e.g. [0, 50, 100]). $bucketAuto only takes the desired number of buckets (e.g. 4) and dynamically calculates boundaries to distribute documents into equal-frequency quantiles.',
    code: `db.orders.aggregate([ { $bucketAuto: { groupBy: "$total", buckets: 4 } } ]);`,
    tip: '$bucket is half-open: [lower, upper).'
  },
  {
    id: 'mf-40',
    category: 'WiredTiger Internals',
    difficulty: 'Senior',
    question: 'How does WiredTiger Prefix Compression reduce index size in RAM?',
    answer: 'In an ordered B-Tree index, consecutive keys frequently share prefixes (e.g. "Smith, Alice", "Smith, Bob"). Prefix compression stores the common prefix once per page block, storing only suffix deltas for adjacent entries.',
    code: `db.users.stats().indexSizes;`,
    tip: 'Prefix compression is enabled automatically on all B-Tree indexes.'
  },
  {
    id: 'mf-41',
    category: 'Storage & BSON',
    difficulty: 'Mid',
    question: 'What is the purpose of GridFS and how does it organize binary data?',
    answer: 'GridFS stores files exceeding 16MB by dividing them into standardized 255KB chunks across two collections: fs.files (metadata, length, filename) and fs.chunks (binary blocks indexed by { files_id: 1, n: 1 }).',
    code: `mongofiles -d media put large_video.mp4`,
    tip: 'GridFS supports range requests for video streaming.'
  },
  {
    id: 'mf-42',
    category: 'Indexing & Querying',
    difficulty: 'Senior',
    question: 'In explain(), what does it indicate when totalKeysExamined is 10,000 but nReturned is 10?',
    answer: 'It indicates severe index inefficiency (selectivity ratio 1000:1). The query planner is scanning 10,000 index keys to find only 10 matching documents. The compound index is missing filter predicates or suffers from poor leading-key selectivity.',
    code: `db.orders.find({ category: "Hardware", total: 10 }).explain("executionStats");`,
    tip: 'Optimal queries maintain totalKeysExamined === nReturned.'
  },
  {
    id: 'mf-43',
    category: 'Replication & Sharding',
    difficulty: 'Staff',
    question: 'What is the default transaction lifetime limit in MongoDB and why does it exist?',
    answer: 'The limit is 60 seconds (transactionLifetimeLimitSeconds). It prevents uncommitted transactions from holding locks and pinning historical MVCC update chains in WiredTiger cache, which would cause cache dirty page bloat and trigger LAS spilling.',
    code: `db.adminCommand({ setParameter: 1, transactionLifetimeLimitSeconds: 120 });`,
    tip: 'Keep transactions short to prevent cache exhaustion.'
  },
  {
    id: 'mf-44',
    category: 'Aggregation & Modeling',
    difficulty: 'Senior',
    question: 'What index is mandatory on the target collection when using $lookup to prevent quadratic execution?',
    answer: 'An index on the foreignField of the target collection is mandatory. Without it, MongoDB performs a full collection scan (COLLSCAN) on the foreign collection for every single document in the outer pipeline (O(N x M)).',
    code: `db.orders.createIndex({ customer_id: 1 }); // Essential for $lookup from customers`,
    tip: 'Unindexed $lookup is one of the most common causes of database lock stalls.'
  },
  {
    id: 'mf-45',
    category: 'WiredTiger Internals',
    difficulty: 'Staff',
    question: 'What is a "fuzzy checkpoint" in WiredTiger crash consistency?',
    answer: 'WiredTiger does not stop concurrent writes during checkpoints. It uses a fuzzy checkpoint: dirty pages are written to new disk blocks using copy-on-write while transactions continue. Once all pages are fsynced, the root metadata pointer is swapped atomically.',
    code: `db.serverStatus().wiredTiger.transaction["transaction checkpoint most recent time (msecs)"];`,
    tip: 'Fuzzy checkpoints allow 100% read/write availability during the 60s snapshot flush.'
  },
  {
    id: 'mf-46',
    category: 'Storage & BSON',
    difficulty: 'Mid',
    question: 'What is the difference between validationAction: "error" and "warn" in JSON Schema validation?',
    answer: '"error" rejects any write violating the schema validator, returning an error to the driver. "warn" allows the invalid write to succeed, but records a validation warning entry in the server mongod.log.',
    code: `db.runCommand({ collMod: "users", validator: { ... }, validationAction: "warn" });`,
    tip: 'Use validationAction: "warn" when rolling out new validation schemas to audit violations.'
  },
  {
    id: 'mf-47',
    category: 'Indexing & Querying',
    difficulty: 'Mid',
    question: 'How do TTL indexes handle documents where the indexed timestamp field is null or not a Date?',
    answer: 'The TTLMonitor thread skips them entirely. Documents where the field is not a BSON Date (e.g. integer, string, or missing) will never be deleted by the TTL monitor.',
    code: `db.sessions.createIndex({ created_at: 1 }, { expireAfterSeconds: 86400 });`,
    tip: 'TTL index fields must strictly store BSON UTC Dates (new Date() or ISODate()).'
  },
  {
    id: 'mf-48',
    category: 'Replication & Sharding',
    difficulty: 'Senior',
    question: 'What is the difference between Read Preference "secondary" and "secondaryPreferred"?',
    answer: '"secondary" strictly requires a secondary; if all secondaries are down or unreachable, queries fail with an error. "secondaryPreferred" queries a secondary if available, but falls back to reading the Primary if all secondaries are down.',
    code: `db.collection.find().readPref("secondaryPreferred");`,
    tip: 'secondaryPreferred provides higher availability during failovers.'
  },
  {
    id: 'mf-49',
    category: 'Aggregation & Modeling',
    difficulty: 'Mid',
    question: 'What does preserveNullAndEmptyArrays: true do in an $unwind stage?',
    answer: 'By default, $unwind drops documents if the array is empty ([]), null, or missing. Setting preserveNullAndEmptyArrays: true keeps those documents in the pipeline, outputting the document with a null value for that field.',
    code: `{ $unwind: { path: "$items", preserveNullAndEmptyArrays: true } }`,
    tip: 'Always set preserveNullAndEmptyArrays: true when modeling optional child arrays.'
  },
  {
    id: 'mf-50',
    category: 'Replication & Sharding',
    difficulty: 'Staff',
    question: 'How does MongoDB execute a Two-Phase Commit (2PC) during a distributed transaction across shards?',
    answer: 'The router assigns one shard as Coordinator. Phase 1 (Prepare): Coordinator command all participant shards to acquire locks, write preparation WAL records, and vote PREPARED. Phase 2 (Commit): Once all participants vote PREPARED, Coordinator issues COMMIT to all shards atomically.',
    code: `session.commitTransaction();`,
    tip: 'Distributed transactions across shards use Two-Phase Commit coordinated by mongos.'
  }
];
